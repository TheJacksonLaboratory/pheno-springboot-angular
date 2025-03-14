import { Utils } from '../component/shared/utils';
import { parse, serialize } from 'tinyduration';


/**
 * Class to convert to list or list of phenopacket model objects.
 * the Phenopacket model objects that can have more than one instance should
 * extend this class.
 */
export class Convert {

    public static convert(obj: any): any {
        if (Array.isArray(obj)) {
            const array = [];
            for (const item of obj) {
                const it = this.create(item);
                if (it) {
                    it.key = Utils.getBiggestKey(array) + 1;
                    array.push(it);
                }
            }
            return array;
        } else {
            return this.create(obj);
        }
    }

    /**
     * To be overriden
     * @param obj
     */
    static create(obj: any): any {
        return new Error('this function needs to be overriden');
    }
}

export class OntologyClass extends Convert {
    // used for tnm finding or node key. Not part of the phenopacket schema
    termUrl?: string;
    key?: string;
    id = '';
    label = '';

    constructor(id?: string, label?: string, key?: string, termUrl?: string) {
        super();
        this.id = id;
        this.label = label;
        this.key = key;
        this.termUrl = termUrl;
    }

    static create(obj: any): OntologyClass {
        const ontologyClass = new OntologyClass();
        if (obj['id']) {
            ontologyClass.id = obj['id'];
            ontologyClass.termUrl = Utils.getUrlForId(obj['id']);
        } else {
            throw new Error(`'id' is missing from 'ontologyClass'.`);
        }
        if (obj['label']) {
            ontologyClass.label = obj['label'];
        } else {
            throw new Error(`'label' is missing from 'ontologyClass'.`);
        }
        return ontologyClass;
    }

    toString() {
        if (this.label && this.id) {
            return `[${this.id}] ${this.label}`;
        }
        return '';

    }
    toLowerCase() {
        return this.toString().toLowerCase();
    }

    /** Cloning of object */
    clone(): OntologyClass {
        return new OntologyClass(this.id, this.label, this.key, this.termUrl);
    }

}
export class ExternalReference extends Convert {
    id: string;
    reference: string;
    description: string;

    static create(obj: any): ExternalReference {
        const externalReference = new ExternalReference();
        if (obj['id']) {
            externalReference.id = obj['id'];
        }
        if (obj['reference']) {
            externalReference.reference = obj['reference'];
        }
        if (obj['description']) {
            externalReference.description = obj['description'];
        }
        return externalReference;
    }

    toString() {
        if (this.id && this.reference) {
            return `${this.reference} [${this.id}]`;
        } else if (this.id && this.reference === undefined) {
            return this.id;
        } else if (this.id === undefined && this.reference) {
            return this.reference;
        }
        return '';
    }

    clone(): ExternalReference {
        const externalRefCopy = new ExternalReference();
        externalRefCopy.id = this.id;
        externalRefCopy.reference = this.reference;
        externalRefCopy.description = this.description;
        return externalRefCopy;
    }
}
export class Evidence extends Convert {

    evidenceCode: OntologyClass;
    reference: ExternalReference;

    constructor(evidenceCode?: OntologyClass, reference?: ExternalReference) {
        super();
        this.evidenceCode = evidenceCode;
        this.reference = reference;
    }

    public static create(obj: any): Evidence {
        const evidence = new Evidence();
        if (obj['evidenceCode']) {
            evidence.evidenceCode = OntologyClass.convert(obj['evidenceCode']);
            evidence.evidenceCode.termUrl = Evidence.getEvidenceUrl(evidence.evidenceCode.id);
        } else {
            throw new Error(`Phenopacket file is missing 'evidenceCode' field in 'evidence' object.`);
        }
        if (obj['reference']) {
            evidence.reference = ExternalReference.convert(obj['reference']);
        }
        return evidence;
    }

    public static getEvidenceUrl(id: string) {
        return `http://purl.obolibrary.org/obo/ECO_${id.split(':')[1]}`;
    }

    /** copy of object */
    clone(): Evidence {
        const evidenceCopy = new Evidence();
        if (this.evidenceCode) {
            evidenceCopy.evidenceCode = this.evidenceCode.clone();
        }
        if (this.reference) {
            evidenceCopy.reference = this.reference.clone();
        }
        return evidenceCopy;
    }
}
export class Procedure {

    static actionName = 'Procedure';
    code: OntologyClass;
    bodySite: OntologyClass;
    performed: TimeElement;

    static convert(obj: any): Procedure {
        const procedure = new Procedure();
        if (obj['code']) {
            procedure.code = OntologyClass.convert(obj['code']);
        } else {
            throw new Error(`Phenopacket file is missing 'code' field in 'procedure' object.`);
        }
        if (obj['bodySite']) {
            procedure.bodySite = OntologyClass.convert(obj['bodySite']);
        }
        if (obj['performed']) {
            procedure.performed = TimeElement.convert(obj['performed']);
        }

        return procedure;
    }

    toString() {
        if (this.code) {
            return this.code.toString();
        }
        return '';
    }
}
export class Age {
    iso8601duration: string;

    constructor(val?: string) {
        this.iso8601duration = val;
    }

    public static convert(obj: any): Age {
        const age = new Age();
        if (obj['iso8601duration']) {
            age.iso8601duration = obj['iso8601duration'];
        } else {
            throw new Error(`'iso8601duration' field is missing from 'age'.`);
        }
        return age;
    }

    /**
     *
     * @param years
     * @param months
     * @param days
     * @returns an ISO8601 duration
     */
    public static convertToIso8601(years: number, months: number, days: number): string {
        return serialize({ years: years, months: months, days: days, hours: 0, minutes: 0, seconds: 0 });
    }

    public getYears() {
        if (this.iso8601duration) {
            return parse(this.iso8601duration).years;
        }
    }
    public getMonths() {
        if (this.iso8601duration) {
            return parse(this.iso8601duration).months;
        }
    }
    public getDays() {
        if (this.iso8601duration) {
            return parse(this.iso8601duration).days;
        }
    }
}

export class AgeRange {
    start: Age;
    end: Age;
    constructor(start?: Age, end?: Age) {
        this.start = start;
        this.end = end;
    }

    public static convert(obj: any): AgeRange {
        const ageRange = new AgeRange();
        if (obj['start']) {
            ageRange.start = Age.convert(obj['start']);
        }  else {
            throw new Error(`'start' field is missing from 'ageRange'.`);
        }
        if (obj['end']) {
            ageRange.end = Age.convert(obj['end']);
        } else {
            throw new Error(`'end' field is missing from 'ageRange'.`);
        }
        return ageRange;
    }
}

export class TimeInterval {
    start: string;
    end: string;
    constructor(start?: string, end?: string) {
        this.start = start;
        this.end = end;
    }

    public static convert(obj: any): TimeInterval {
        const interval = new TimeInterval();
        if (obj['start']) {
            interval.start = obj['start'];
        } else {
            throw new Error(`'start' field is missing from 'timeInterval'.`);
        }
        if (obj['end']) {
            interval.end = obj['end'];
        } else {
            throw new Error(`'end' field is missing from 'timeInterval'.`);
        }
        return interval;
    }

    toString() {
        if (this.start && this.end) {
            return `${this.start} - ${this.end}`;
        }
        return '';
    }
}

export class GestationalAge {
    weeks: number;
    days: number;
    constructor(weeks?: number, days?: number) {
        this.weeks = weeks;
        this.days = days;
    }

    public static convert(obj: any): GestationalAge {
        const gestationalAge = new GestationalAge();
        if (obj['weeks'] !== undefined) {
            gestationalAge.weeks = obj['weeks'];
        } else {
            throw new Error(`'weeks' field is missing from 'gestationalAge'.`);
        }
        if (obj['days'] !== undefined) {
            gestationalAge.days = obj['days'];
        }
        return gestationalAge;
    }
}
export class TimeElement extends Convert {

    age: Age;
    ageRange: AgeRange;
    gestationalAge: GestationalAge;
    ontologyClass: OntologyClass;
    timestamp: string;
    interval: TimeInterval;
    /**
     *
     * @param element can be instance of GestationalAge, Age, AgeRange, string or TimeInterval
     */
    constructor(element?: any) {
        super();
        if (element instanceof Age) {
            this.age = element;
        } else if (element instanceof AgeRange) {
            this.ageRange = element;
        } else if (element instanceof GestationalAge) {
            this.gestationalAge = element;
        } else if (element instanceof OntologyClass) {
            this.ontologyClass = element;
        } else if (typeof element === 'string') {
            this.timestamp = element;
        } else if (element instanceof TimeInterval) {
            this.interval = element;
        }
    }

    static create(obj: any): TimeElement {
        const timeElement = new TimeElement();
        if (obj['age']) {
            timeElement.age = Age.convert(obj['age']);
        } else if (obj['ageRange']) {
            timeElement.ageRange = AgeRange.convert(obj['ageRange']);
        } else if (obj['gestationalAge']) {
            timeElement.gestationalAge = GestationalAge.convert(obj['gestationalAge']);
        } else if (obj['ontologyClass']) {
            timeElement.ontologyClass = OntologyClass.convert(obj['ontologyClass']);
            timeElement.ontologyClass.termUrl = `https://hpo.jax.org/app/browse/term/${timeElement.ontologyClass.id}`;
        } else if (obj['timestamp']) {
            timeElement.timestamp = obj['timestamp'];
        } else if (obj['interval']) {
            timeElement.interval = TimeInterval.convert(obj['interval']);
        }
        return timeElement;
    }

    toString() {
        if (this.gestationalAge) {
            let weeksStr = ''; let daysStr = '';
            if (this.gestationalAge.weeks) {
                weeksStr = `${this.gestationalAge.weeks} week(s)`;
            }
            if (this.gestationalAge.days) {
                daysStr = `${this.gestationalAge.days} day(s)`;
            }
            return `${weeksStr} - ${daysStr} `;
        } else if (this.age instanceof Age) {
            return this.age.iso8601duration;
        } else if (this.ontologyClass) {
            return this.ontologyClass.toString();
        } else if (this.ageRange) {
            return `${this.ageRange.start?.iso8601duration} - ${this.ageRange.end?.iso8601duration}`;
        } else if (this.timestamp) {
            return this.timestamp;
        } else if (this.interval) {
            return `${this.interval.start} - ${this.interval.end}`;
        }
    }

    /**
     *
     * @returns Copy the object into a new one
     */
    public clone(): TimeElement {
        if (this.age) {
            return new TimeElement(new Age(this.age.iso8601duration));
        } else if (this.ageRange) {
            return new TimeElement(new AgeRange(this.ageRange.start, this.ageRange.end));
        } else if (this.gestationalAge) {
            return new TimeElement(new GestationalAge(this.gestationalAge.weeks, this.gestationalAge.days));
        } else if (this.ontologyClass) {
            return new TimeElement(new OntologyClass(this.ontologyClass.id, this.ontologyClass.label));
        } else if (this.timestamp) {
            return new TimeElement(this.timestamp);
        } else if (this.interval) {
            return new TimeElement(new TimeInterval(this.interval.start, this.interval.end));
        }
    }

}
export enum TimeElementType {
    AGE = 'Age',
    AGE_RANGE = 'Age range',
    GESTATIONAL_AGE = 'Gestational age',
    ONTOLOGY_CLASS = 'Ontology class',
    TIMESTAMP = 'Timestamp'
}
export enum TimeElementId {
    INDIVIDUAL_TIME_OF_DEATH,
    INDIVIDUAL_ONSET,
    PHENOTYPIC_ONSET,
    PHENOTYPIC_RESOLUTION,
    DISEASE_ONSET,
    DISEASE_RESOLUTION
}
export class File extends Convert {
    key?: number; // not part of the phenopacket model (used only to distinguish between files)
    uri: string;
    individualToFileIdentifiers: any;
    fileAttributes: any;

    constructor(uri?: string) {
        super();
        this.uri = uri;
        // this.fileAttribute.push({'description': description});

    }
    static create(obj: any): File {
        const file = new File();
        if (obj['uri']) {
            file.uri = obj['uri'];
        } else {
            throw new Error(`Phenopacket file is missing 'uri' field in 'file' object.`);
        }
        if (obj['individualToFileIdentifiers']) {
            file.individualToFileIdentifiers = obj['individualToFileIdentifiers'];
        }
        if (obj['fileAttributes']) {
            file.fileAttributes = obj['fileAttributes'];
        }

        return file;
    }
}

export enum DialogMode {
    EDIT,
    ADD
}

export class Attribute {
    // used for idexation in primeng table
    key?: number;
    label: string;
    value: string;

    constructor(label?: string, value?: string) {
        this.label = label;
        this.value = value;
    }

    /**
     * Convert an Attribute obj to a key value obj
     * @param attributes
     * @returns
     */
    public static toKeyValue(attributes: Attribute[]): any {
        const keyValueObj = {};
        if (attributes) {
            for (const attrib of attributes) {
                keyValueObj[attrib.label] = attrib.value;
            }
            return keyValueObj;
        }
    }

    /**
     * Convert a key value obj to an Attribute obj
     * @param keyValueObj
     * @returns
     */
    public static toAttributes(keyValueObj: any): Attribute[] {
        if (keyValueObj) {
            const attributes = [];
            let idx = 0;
            Object.keys(keyValueObj).forEach(key => {
                const attrib = new Attribute(key, keyValueObj[key]);
                attrib.key = idx++;
                attributes.push(attrib);
            });
            return attributes;
        }
    }
}

export class IndividualToFileID {
    // used for idexation in primeng table
    key?: number;
    subjectId: string;
    fileId: string;

    constructor(subjectId: string, fileId: string) {
        this.subjectId = subjectId;
        this.fileId = fileId;
    }

    /**
     * Convert am IndividualToIdentifier obj to a key value obj
     * @param mappings
     * @returns
     */
    public static toKeyValue(mappings: IndividualToFileID[]) {
        const keyValueObj = {};
        if (mappings) {
            for (const mapping of mappings) {
                keyValueObj[mapping.subjectId] = mapping.fileId;
            }
            return keyValueObj;
        }
    }

    /**
     * Convert the keyValueObj to a IndividualToFileId obj
     * @param keyValueObj
     * @returns
     */
    public static toIndividualToFileId(keyValueObj: any): IndividualToFileID[] {
        if (keyValueObj) {
            const individualToFileId = [];
            let idx = 0;
            Object.keys(keyValueObj).forEach(key => {
                const indiv = new IndividualToFileID(key, keyValueObj[key]);
                indiv.key = idx++;
                individualToFileId.push(indiv);
            });
            return individualToFileId;
        }
    }
}
