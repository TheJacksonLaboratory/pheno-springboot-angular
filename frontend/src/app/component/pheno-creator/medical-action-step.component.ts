import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MedicalAction } from 'src/app/models/medical-action';
import { PhenopacketService } from 'src/app/services/phenopacket.service';
import { ProfileSelection, ProfileSelectionComponent } from './profile-selection/profile-selection.component';

@Component({
    selector: 'app-medical-action-step',
    templateUrl: './medical-action-step.component.html',
    styleUrls: ['./pheno-creator.component.scss']
})
export class MedicalActionStepComponent implements OnInit, OnDestroy {

    medicalActions: MedicalAction[];

    profileSelectionSubscription: Subscription;
    profileSelection: ProfileSelection;

    constructor(public phenopacketService: PhenopacketService, private router: Router) {

    }

    ngOnInit() {
        this.phenopacketService.getPhenopacket().subscribe(phenopacket => {
            this.medicalActions = phenopacket.medicalActions;
        });
        this.profileSelectionSubscription = this.phenopacketService.getProfileSelection().subscribe(profile => {
            this.profileSelection = profile;
        });
    }

    ngOnDestroy() {
        if (this.profileSelectionSubscription) {
            this.profileSelectionSubscription.unsubscribe();
        }
    }

    nextPage() {
        this.phenopacketService.phenopacket.medicalActions = this.medicalActions;
        // check profile and navigate to the corresponding step
        for (const profile of ProfileSelectionComponent.profileSelectionOptions) {
            if (this.profileSelection === ProfileSelection.ALL_AVAILABLE && profile.value === ProfileSelection.ALL_AVAILABLE) {
                this.router.navigate([`pheno-creator/${profile.path}/files`]);
                return;
            } else if (this.profileSelection === ProfileSelection.OTHER && profile.value === ProfileSelection.OTHER) {
                this.router.navigate([`pheno-creator/${profile.path}/files`]);
                return;
            }
            // Possible other profiles to come
        }
    }
    prevPage() {
        // check profile and navigate to the corresponding step
        for (const profile of ProfileSelectionComponent.profileSelectionOptions) {
            if (this.profileSelection === ProfileSelection.ALL_AVAILABLE && profile.value === ProfileSelection.ALL_AVAILABLE) {
                this.router.navigate([`pheno-creator/${profile.path}/diseases`]);
                return;
            } else if (this.profileSelection === ProfileSelection.OTHER && profile.value === ProfileSelection.OTHER) {
                this.router.navigate([`pheno-creator/${profile.path}/diseases`]);
                return;
            }
            // Possible other profiles to come
        }
    }
}
