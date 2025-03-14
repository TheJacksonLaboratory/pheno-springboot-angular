import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

import { Phenopacket } from 'src/app/models/phenopacket';
import { Profile, ProfileSelection } from 'src/app/models/profile';
import { PhenopacketStepperService } from 'src/app/services/phenopacket-stepper.service';
import { DownloadService } from '../../services/download-service';
import { PhenopacketService } from '../../services/phenopacket.service';
import {
  ValidationResultsDialogComponent
} from '../shared/validation-results-dialog/validation-results-dialog.component';

@Component({
  selector: 'app-pheno-creator',
  templateUrl: './pheno-creator.component.html',
  styleUrls: ['./pheno-creator.component.scss'],
  providers: [MessageService]
})
export class PhenoCreatorComponent implements OnInit, OnDestroy {

  phenopacket: Phenopacket;

  // primeng stepper
  steps: MenuItem[];
  profileSelected: ProfileSelection;
  rareProfileSelected = true;
  subscription: Subscription;
  // TODO better manage indexes to we could have more than 2 profiles
  activeIndexRare = 0;
  activeIndexAll = 0;
  user: User;
  isPrivateInfoWarnSelected: boolean;

  constructor(private router: Router, private messageService: MessageService, private dialogService: DialogService,
              private downloadService: DownloadService, private authService: AuthService,
              public phenopacketStepperService: PhenopacketStepperService, private phenopacketService: PhenopacketService) {
  }

  ngOnInit() {
    this.phenopacketStepperService.getProfileSelection().subscribe(profile => {
      this.profileSelected = profile;
      if (this.profileSelected === ProfileSelection.RARE_DISEASE) {
        this.rareProfileSelected = true;
        this.steps = Profile.profileSelectionOptions.find(element => element.value === ProfileSelection.RARE_DISEASE).steps;
      } else {
        this.rareProfileSelected = false;
        this.steps = Profile.profileSelectionOptions.find(element => element.value === ProfileSelection.ALL_AVAILABLE).steps;
      }
    });
    this.steps = Profile.profileSelectionOptions.find(element => element.value === ProfileSelection.RARE_DISEASE).steps;
    this.subscription = this.phenopacketStepperService.validated$.subscribe((phenopacket) => {
      this.messageService.add({
        severity: 'success', summary: 'Phenopacket created',
        detail: 'The phenopacket with the ID ' + phenopacket.subject.id + ' has been successfully validated.'
      });
    });
    this.phenopacketStepperService.getIsPrivateInfoWarnSelected().subscribe(isPrivateInfoWarnSelected => {
      this.isPrivateInfoWarnSelected = isPrivateInfoWarnSelected;
    });
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onActiveIndexChange(event: number) {
    if (this.rareProfileSelected) {
      this.activeIndexRare = event;
    } else {
      this.activeIndexAll = event;
    }
  }

  updateProfile(rareDiseaseProfileSelected: boolean) {
    this.rareProfileSelected = rareDiseaseProfileSelected;
    this.activeIndexRare = 0;
    this.activeIndexAll = 0;
    if (this.rareProfileSelected) {
      this.phenopacketStepperService.setProfileSelection(ProfileSelection.RARE_DISEASE);
      this.steps = Profile.profileSelectionOptions.find(element => element.value === ProfileSelection.RARE_DISEASE).steps;
    } else {
      this.phenopacketStepperService.setProfileSelection(ProfileSelection.ALL_AVAILABLE);
      this.steps = Profile.profileSelectionOptions.find(element => element.value === ProfileSelection.ALL_AVAILABLE).steps;
    }
    this.router.navigate([`creator/${Profile.profileSelectionOptions[0].steps[0].routerLink}`]);
  }

  nextPage() {
    if (this.rareProfileSelected) {
      this.activeIndexRare++;
      this.router.navigate([`creator/${Profile.profileSelectionOptions[0].steps[this.activeIndexRare].routerLink}`]);
    } else {
      this.activeIndexAll++;
      this.router.navigate([`creator/${Profile.profileSelectionOptions[1].steps[this.activeIndexAll].routerLink}`]);

    }
  }

  prevPage() {
    if (this.rareProfileSelected) {
      this.activeIndexRare--;
      this.router.navigate([`creator/${Profile.profileSelectionOptions[0].steps[this.activeIndexRare].routerLink}`]);
    } else {
      this.activeIndexAll--;
      this.router.navigate([`creator/${Profile.profileSelectionOptions[1].steps[this.activeIndexAll].routerLink}`]);
    }
  }

  complete() {
    const phenopacket = this.phenopacketStepperService.phenopacket;
    this.phenopacketStepperService.validatePhenopacket(this.getPhenopacketJSON(phenopacket)).subscribe(validationResults => {
      if (validationResults.validationResults.length === 0 && this.isPrivateInfoWarnSelected) {
        this.phenopacketService.addPhenopacket(phenopacket, this.user);
        this.router.navigate(['phenopackets']);
        this.phenopacketStepperService.phenopacket = undefined;
        this.phenopacketStepperService.setPrivateInfoWarnSelected(false);
      } else {
        this.dialogService.open(ValidationResultsDialogComponent, {
          header: 'Validation results',
          width: '50%',
          contentStyle: {overflow: 'auto'},
          baseZIndex: 10000,
          resizable: true,
          data: {
            validationResults: validationResults,
            phenopacket: phenopacket
          }});
      }
    });
  }

  /**
   *
   * @param phenopacket
   * @returns a phenopacket as String
   */
  getPhenopacketJSON(phenopacket: Phenopacket): string {
    return this.downloadService.saveAsJson(phenopacket, false);
  }

}
