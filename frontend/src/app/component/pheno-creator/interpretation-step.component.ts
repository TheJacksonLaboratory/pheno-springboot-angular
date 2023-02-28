import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';

import { Interpretation, ProgressStatus } from 'src/app/models/interpretation';
import { Phenopacket } from 'src/app/models/phenopacket';
import { Profile, ProfileSelection } from 'src/app/models/profile';
import { DiseaseSearchService } from 'src/app/services/disease-search.service';
import { InterpretationService } from 'src/app/services/interpretation.service';
import { PhenopacketService } from 'src/app/services/phenopacket.service';

@Component({
    providers: [ConfirmationService],
    selector: 'app-interpretation-step',
    templateUrl: './interpretation-step.component.html',
    styleUrls: ['./pheno-creator.component.scss']
})
export class InterpretationStepComponent implements OnInit, OnDestroy {

    visible = false;
    phenopacket: Phenopacket;
    id: string;
    interpretation: Interpretation;
    interpretations: Interpretation[] = [];
    submitted = false;
    phenopacketSubscription: Subscription;

    // table contents of phenotypic features
    selectedInterpretation: Interpretation;
    // progress status
    progressStatus: ProgressStatus;
    statuses: ProgressStatus[];
    // diseases
    diseases: any[];
    diseaseSubscription: Subscription;

    profileSelection: ProfileSelection;
    profileSelectionSubscription: Subscription;

    constructor(public searchService: InterpretationService,
        public phenopacketService: PhenopacketService,
        public diseaseService: DiseaseSearchService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router, public dialog: MatDialog,
        private primengConfig: PrimeNGConfig) {
    }


    ngOnInit() {
        this.primengConfig.ripple = true;
        this.phenopacket = this.phenopacketService.phenopacket;
        if (this.phenopacket === undefined) {
            // navigate to first page of creator as phenopacket is not created
            this.router.navigate(['pheno-creator/individual']);
        } else {
            this.interpretations = this.phenopacket.interpretations;
            if (this.interpretations) {
                if (this.interpretations.length > 0) {
                    this.visible = true;
                }
            }
        }

        this.phenopacketSubscription = this.phenopacketService.getPhenopacket().subscribe(phenopacket => {
            this.phenopacket = phenopacket;
            this.interpretations = phenopacket.interpretations;
        });
        // get profile
        this.profileSelectionSubscription = this.phenopacketService.getProfileSelection().subscribe(profile => {
            this.profileSelection = profile;
        });
        // get diseases
        this.diseaseSubscription = this.diseaseService.getAll().subscribe(diseases => {
            this.diseases = diseases;
        });
        // statuses
        this.statuses = this.getStatuses();
    }

    ngOnDestroy(): void {
        if (this.phenopacketSubscription) {
            this.phenopacketSubscription.unsubscribe();
        }
        if (this.profileSelectionSubscription) {
            this.profileSelectionSubscription.unsubscribe();
        }
        if (this.diseaseSubscription) {
            this.diseaseSubscription.unsubscribe();
        }
    }

    /**
     *
     * @param array of item with key parameters
     * @returns Returns the biggest key
     */
    getBiggestKey(array: any[]) {
        let key = 0;
        for (const item of array) {
            if ((item.key) >= key) {
                key = item.key;
            }
        }
        return key;
    }

    /**
     * Adds a new Interpretation.
     **/
    addInterpretation(interpretation?: Interpretation) {
        if (interpretation === undefined) {
            return;
        }
        // set unique key for feature table
        interpretation.key = this.getBiggestKey(this.interpretations) + 1;
        this.interpretations.push(interpretation);
        // we copy the array after each update so the ngChange method is triggered on the child component
        this.interpretations = this.interpretations.slice();
        setTimeout(() => this.visible = true, 0);

        this.phenopacket.interpretations = this.interpretations;
        this.submitted = true;
        // make table visible
        this.visible = true;
    }

    deleteInterpretation(interpretation: Interpretation) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete \'' + interpretation.id + '\'?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.interpretations = this.interpretations.filter(val => val.key !== interpretation.key);
                this.selectedInterpretation = null;
                this.phenopacket.interpretations = this.interpretations;
                if (this.interpretations.length === 0) {
                    this.visible = false;
                }
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Interpretation Deleted', life: 3000 });
            },
            reject: () => {
                this.confirmationService.close();
            }
        });
    }

    updateInterpretation(interpretation) {
        if (this.interpretations === undefined) {
            this.interpretations = [];
        }
        this.interpretations.push(interpretation);
    }

    updateProgressStatus(event) {
        if (this.interpretation === undefined) {
            this.interpretation = new Interpretation();
        }
        this.interpretation.progressStatus = event.value;
    }

    getStatuses() {
        // tslint:disable-next-line:radix
        return Object.values(ProgressStatus).filter(x => !(parseInt(x) >= 0));
    }
    /**
     * Called when a row is selected in the left side table
     * @param event
     */
    onRowSelect(event) {
        this.selectedInterpretation = event.data;
    }

    nextPage() {
        this.phenopacketService.phenopacket.interpretations = this.interpretations;
        // check profile and navigate to the corresponding step
        for (const profile of Profile.profileSelectionOptions) {
            if (this.profileSelection === ProfileSelection.ALL_AVAILABLE && profile.value === ProfileSelection.ALL_AVAILABLE) {
                this.router.navigate([`pheno-creator/${profile.path}/medical-actions`]);
                return;
            } else if (this.profileSelection === ProfileSelection.RARE_DISEASE && profile.value === ProfileSelection.RARE_DISEASE) {
                this.router.navigate([`pheno-creator/${profile.path}/validate`]);
                return;
            }
            // Possible other profiles to come
        }
    }
    prevPage() {
        // check profile and navigate to the corresponding step
        for (const profile of Profile.profileSelectionOptions) {
            if (this.profileSelection === ProfileSelection.ALL_AVAILABLE && profile.value === ProfileSelection.ALL_AVAILABLE) {
                this.router.navigate([`pheno-creator/${profile.path}/diseases`]);
                return;
            } else if (this.profileSelection === ProfileSelection.RARE_DISEASE && profile.value === ProfileSelection.RARE_DISEASE) {
                this.router.navigate([`pheno-creator/${profile.path}/diseases`]);
                return;
            }
            // Possible other profiles to come
        }
    }
}
