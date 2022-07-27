import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';

import { MessageDialogComponent } from '../../shared/message-dialog/message-dialog.component';
import { MedicalAction, RadiationTherapy, TherapeuticRegimen, Treatment } from 'src/app/models/medical-action';
import { MedicalActionDetailDialogComponent } from './medical-action-detail/medical-action-detail-dialog/medical-action-detail-dialog.component';
import { Disease } from 'src/app/models/disease';
import { Procedure } from 'src/app/models/base';
import { DataPresentMatTableDataSource } from '../../shared/DataPresentMatTableDataSource';

@Component({
    selector: 'app-medical-action',
    templateUrl: './medical-action.component.html',
    styleUrls: ['./medical-action.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed, void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class MedicalActionComponent implements AfterViewInit, OnInit {
    // search params
    itemName = "Medical Action";

    @ViewChild('medicalActionPaginator', { static: true }) medicalActionPaginator: MatPaginator;
    // @ViewChild(MatSort, { static: true }) sort: MatSort;

    //Table items
    displayedColumns = ['icon', 'action', 'id', 'target', 'intent', 'remove'];

    medicalActionDataSource = new DataPresentMatTableDataSource<MedicalAction>();
    medicalActionCount: number;

    // MatPaginator Inputs
    pageLength = 0;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 50, 100];

    //searchparams
    currSearchParams: any = {}

    expandedElement: MedicalAction | null;
    @Input()
    medicalActions: MedicalAction[];
    @Input()
    diseases: Disease[];

    @Output() onMedicalActionChanged = new EventEmitter<MedicalAction[]>();

    dialogRef: any;
    spinnerDialogRef: any;

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {
        if (this.medicalActions === undefined) {
            this.medicalActions = [];
        }
        this.medicalActionDataSource.data = this.medicalActions;
        this.onMedicalActionChanged.emit(this.medicalActions);

    }

    ngAfterViewInit() {

    }

    /**
     * Add a new medical action with default values or no values
     */
    addMedicalAction(medicalAction?: MedicalAction) {
        if (medicalAction === undefined) {
            // Add through a dialog to choose from type of Actions
            const medicalActionDetailData = { 'title': 'Edit medical action' };
            medicalActionDetailData['diseases'] = this.diseases;
            medicalActionDetailData['displayCancelButton'] = true;
            const dialogRef = this.dialog.open(MedicalActionDetailDialogComponent, {
                width: '1000px',
                data: medicalActionDetailData
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    let updatedMedicalAction = result.medical_action;
                    console.log('medical_action:');
                    console.log(updatedMedicalAction);
                    if (updatedMedicalAction) {
                        // update medical action
                        let medicalAction = updatedMedicalAction;
                        this.medicalActions.push(medicalAction);
                        this.medicalActionDataSource.data = this.medicalActions;
                        // emit change
                        this.onMedicalActionChanged.emit(this.medicalActions);
                    }
                }
            });
            return dialogRef;
        } else {
            this.medicalActions.push(medicalAction);
        }
        this.medicalActionDataSource.data = this.medicalActions;
        this.onMedicalActionChanged.emit(this.medicalActions);

        // TODO push changes to api
    }

    /**
     * Removes the chosen element, if ok is pressed on the popup window.
     * @param element 
     * @returns 
     */
    deleteMedicalAction(element: MedicalAction) {
        const msgData = { 'title': 'Delete Medical Action' };
        msgData['description'] = `Delete the Medical Action with the ID "${this.getId(element)}" ?`;
        msgData['displayCancelButton'] = true;
        const dialogRef = this.dialog.open(MessageDialogComponent, {
            width: '400px',
            data: msgData
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'ok') {
                this.removeFromDatasource(element);
            }
        });
        return dialogRef;
    }

    removeFromDatasource(medicalAction: MedicalAction) {
        this.medicalActions.forEach((element, index) => {
            if (element == medicalAction) {
                this.medicalActions.splice(index, 1);
            }
        });
        this.medicalActionDataSource.data = this.medicalActions;
        this.onMedicalActionChanged.emit(this.medicalActions);

    }

    // private clearSort() {
    //     this.sort.sort({ id: '', start: 'asc', disableClear: false });
    // }

    getActionName(medicalAction: MedicalAction) {
        let action = medicalAction.action;
        if (action instanceof Procedure) {
            return Procedure.actionName;
        } else if (action instanceof Treatment) {
            return Treatment.actionName;
        } else if (action instanceof RadiationTherapy) {
            return RadiationTherapy.actionName;
        } else if (action instanceof TherapeuticRegimen) {
            return TherapeuticRegimen.actionName;
        }
        return '';    
    }
    /**
     * Retrieve the correct MedicalAction id
     * @param medicalAction 
     * @returns id
     */
    getId(medicalAction: MedicalAction) {
        let action = medicalAction.action;
        if (action instanceof Procedure) {
            return action.code?.id;
        } else if (action instanceof Treatment) {
            return action.agent?.id;
        } else if (action instanceof RadiationTherapy) {
            return action.modality?.id;
        } else if (action instanceof TherapeuticRegimen) {
            return action.identifier?.id;
        }
        return '';
    }

    getTarget(medicalAction: MedicalAction) {
        let target = '';
        if (medicalAction && medicalAction.treatmentTarget) {
            target = `${medicalAction.treatmentTarget?.label} [${medicalAction.treatmentTarget?.id}]`;
        }
        return target;
    }

    getIntent(medicalAction: MedicalAction) {
        let intent = '';
        if (medicalAction && medicalAction.treatmentIntent) {
            intent = `${medicalAction.treatmentIntent?.label} [${medicalAction.treatmentIntent?.id}]`;
        }
        return intent;
    }

    /**
     * Get Procedure, Treatment, RadiationTherapy or TherapeuticRegimen icon
     * @param medicalAction 
     * @returns icon name
     */
    getIcon(medicalAction: MedicalAction) {
        if (medicalAction) {
            if (medicalAction.action.toString() === 'Procedure') {
                return 'medical_information';
            } else if (medicalAction.action.toString() === 'Treatment') {
                return 'vaccines';
            } else if (medicalAction.action.toString() === 'Radiation therapy') {
                return 'radiology';
            } else if (medicalAction.action.toString() === 'Therapeutic regimen') {
                return 'medication';
            }
            return '';
        }
    }

    doPageChange(pageEvent: any) {

        // if (this.currSearchParams) {
        //     this.currSearchParams.offset = pageEvent.pageIndex * pageEvent.pageSize;
        //     this.currSearchParams.max = pageEvent.pageSize;
        //     this._getPhenotypicFeatures(this.currSearchParams);
        // }
    }

    expandCollapse(element: any) {
        this.expandedElement = this.expandedElement === element ? null : element

    }

}

