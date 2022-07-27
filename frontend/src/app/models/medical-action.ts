import { Convert, ExternalReference, OntologyClass, Procedure, TimeElement, TimeInterval } from "./base";
import { Quantity } from "./measurement";


export class MedicalAction extends Convert {
    // can be Procedure, Treatment, RadiationTherapy or TherapeuticRegimen
    action: any;
    treatmentTarget: OntologyClass;
    treatmentIntent: OntologyClass;
    responseToTreatment: OntologyClass;
    adverseEvents: OntologyClass[];
    treatmentTerminationReason: OntologyClass;

    static create(obj: any): MedicalAction {
        const medicalAction = new MedicalAction();
        // action
        if (obj['procedure']) {
            medicalAction.action = Procedure.convert(obj['procedure']);
        } else if (obj['treatment']) {
            medicalAction.action = Treatment.convert(obj['treatment']);
        } else if (obj['radiationTherapy']) {
            medicalAction.action = RadiationTherapy.convert(obj['radiationTherapy']);
        } else if (obj['therapeuticRegimen']) {
            medicalAction.action = TherapeuticRegimen.convert(obj['therapeuticRegimen']);
        }
        if (obj['treatmentTarget']) {
            medicalAction.treatmentTarget = OntologyClass.convert(obj['treatmentTarget']);
        }
        if (obj['treatmentIntent']) {
            medicalAction.treatmentIntent = OntologyClass.convert(obj['treatmentIntent']);
        }
        if (obj['adverseEvents']) {
            medicalAction.adverseEvents = OntologyClass.convert(obj['adverseEvents']);
        }
        if (obj['treatmentTerminationReason']) {
            medicalAction.treatmentTerminationReason = OntologyClass.convert(obj['treatmentTerminationReason']);
        }
        return medicalAction;
    }
}

export class Treatment {
    static actionName = 'Treatment';
    agent: OntologyClass;
    routeOfAdministration: OntologyClass;
    doseIntervals: DoseInterval[];
    drugType: DrugType;
    cumulativeDose: Quantity;

    toString() {
        return "Treatment";
    }

    static convert(obj: any): Treatment {
        const treatment = new Treatment();
        if (obj['agent']) {
            treatment.agent = OntologyClass.convert(obj['agent']);
        }
        if (obj['routeOfAdministration']) {
            treatment.routeOfAdministration = OntologyClass.convert(obj['routeOfAdministration']);
        }
        if (obj['doseIntervals']) {
            treatment.doseIntervals = DoseInterval.convert(obj['doseIntervals']);
        }
        if (obj['drugType']) {
            treatment.drugType = obj['drugType'];
        }
        if (obj['cumulativeDose']) {
            treatment.cumulativeDose = Quantity.convert(obj['cumulativeDose']);
        }
        
        return treatment;
    } 
}
export class DoseInterval extends Convert {
    quantity: Quantity;
    scheduleFrequency: OntologyClass;
    interval: TimeInterval;

    static create(obj: any): DoseInterval {
        const doseInterval = new DoseInterval();
        if (obj['quantity']) {
            doseInterval.quantity = Quantity.convert(obj['quantity']);
        }
        if (obj['scheduleFrequency']) {
            doseInterval.scheduleFrequency = OntologyClass.convert(obj['scheduleFrequency']);
        }
        if (obj['interval']) {
            doseInterval.interval = TimeInterval.convert(obj['interval']);
        }
        return doseInterval;
    }
}
export enum DrugType {
    UNKNOWN_DRUG_TYPE = "Unknown",
    PRESCRIPTION = "Prescription",
    EHR_MEDICATION_LIST = "EHR medication list",
    ADMINISTRATION_RELATED_TO_PROCEDURE = "Administration related to procedure"
}
export class RadiationTherapy {
   static actionName = 'Radiation therapy';
    modality: OntologyClass;
    bodySite: OntologyClass;
    dosage: number;
    fractions: number;

    toString() {
        return "Radiation therapy";
    }

    static convert(obj: any): RadiationTherapy {
        const radiationTherapy = new RadiationTherapy();
        if (obj['modality']) {
            radiationTherapy.modality = OntologyClass.convert(obj['modality']);
        }
        if (obj['bodySite']) {
            radiationTherapy.bodySite = OntologyClass.convert(obj['bodySite']);
        }
        if (obj['dosage']) {
            radiationTherapy.dosage = obj['dosage'];
        }
        if (obj['fractions']) {
            radiationTherapy.fractions = obj['fractions'];
        }
        return radiationTherapy;
    }
}

export enum RegimenStatus {
    UNKNOWN_STATUS = "Unknown",
    STARTED = "Started",
    COMPLETED = "Completed",
    DISCONTINUED = "Discontinued"
}
export class TherapeuticRegimen {
    static actionName = 'Therapeutic regimen';
    identifier: OntologyClass | ExternalReference;
    startTime: TimeElement;
    endTime: TimeElement;
    status: RegimenStatus;

    toString() {
        return "Therapeutic regimen";
    }

    static convert(obj: any): TherapeuticRegimen {
        const therapeuticRegimen = new TherapeuticRegimen();
        let identifier = obj['identifier'];
        if (identifier['label']) {
            therapeuticRegimen.identifier = OntologyClass.convert(identifier);
        } else {
            therapeuticRegimen.identifier = ExternalReference.convert(identifier);
        }
        if (obj['startTime']) {
            therapeuticRegimen.startTime = TimeElement.convert(obj['startTime']);
        }
        if (obj['endTime']) {
            therapeuticRegimen.endTime = TimeElement.convert(obj['endTime']);
        }
        if (obj['status']) {
            therapeuticRegimen.status = obj['status'];
        }
        return therapeuticRegimen;
    }
}