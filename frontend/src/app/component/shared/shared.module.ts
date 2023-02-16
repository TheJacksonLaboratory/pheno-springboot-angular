import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { PrimeModule } from './prime.module';
import { SpinnerDialogComponent } from './spinner-dialog/spinner-dialog.component';
import { SearchFilterComponent } from './time-element/search-filter/search-filter.component';
import { TimeElementComponent } from './time-element/time-element.component';
import { AgeComponent } from './time-element/age/age.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { OntologyClassComponent } from './ontology-class/ontology-class.component';
import { TreeSelectComponent } from './ontology-class/tree-select/tree-select.component';
import { TreeSearchComponent } from './ontology-class/tree-search/tree-search.component';
import { DiseaseEditComponent } from './edit/disease-edit/disease-edit.component';
import { PhenotypicFeatureEditComponent } from './edit/phenotypic-feature-edit/phenotypic-feature-edit.component';
import { IndividualEditComponent } from './edit/individual-edit/individual-edit.component';
import { AgeRangeComponent } from './time-element/age-range/age-range.component';
import { GestationalAgeComponent } from './time-element/gestational-age/gestational-age.component';
import { OntologyTimeComponent } from './time-element/ontology-time/ontology-time.component';
import { VariantValidatorComponent } from './edit/interpretation-edit/variant-validator/variant-validator.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeModule,
    MaterialModule,
  ],
  declarations: [
    MessageDialogComponent,
    SpinnerDialogComponent,
    TimeElementComponent,
    SearchFilterComponent,
    AgeComponent,
    AgeRangeComponent,
    GestationalAgeComponent,
    OntologyTimeComponent,
    SearchBoxComponent,
    TreeSelectComponent,
    OntologyClassComponent,
    TreeSearchComponent,
    DiseaseEditComponent,
    PhenotypicFeatureEditComponent,
    IndividualEditComponent,
    VariantValidatorComponent
  ],
  exports: [
    MessageDialogComponent,
    SpinnerDialogComponent,
    TimeElementComponent,
    SearchFilterComponent,
    AgeComponent,
    AgeRangeComponent,
    GestationalAgeComponent,
    OntologyTimeComponent,
    SearchBoxComponent,
    TreeSelectComponent,
    OntologyClassComponent,
    TreeSearchComponent,
    DiseaseEditComponent,
    PhenotypicFeatureEditComponent,
    IndividualEditComponent,
    VariantValidatorComponent,
    PrimeModule,
    MaterialModule
  ]
})
export class SharedModule { }
