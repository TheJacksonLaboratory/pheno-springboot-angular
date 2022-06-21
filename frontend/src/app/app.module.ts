import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { routing } from './app.routing';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';

import { DashboardComponent } from './component/dashboard/dashboard.component';
import { SelectableOntologyTreeComponent } from './component/ontology-tree/selectable/selectable-ontology-tree.component';
import { SimpleOntologyTreeComponent } from './component/ontology-tree/simple/simple-ontology-tree.component';
import { AppComponent } from './app.component';
import { ComponentsModule } from './component/components.module';
import { CohortListComponent } from './component/cohort-list/cohort-list.component';
import { FamilyListComponent } from './component/family-list/family-list.component';
import { fakeBackendProvider } from './helpers/fake-backend';
import { PhenopacketModule } from './component/phenopacket/phenopacket.module';
import { PhenopacketComponent } from './component/phenopacket/phenopacket.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    routing,
    ComponentsModule,
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSortModule,
    MatTreeModule,
    MatTabsModule,
    BrowserModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    PhenopacketModule

  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    SimpleOntologyTreeComponent,
    SelectableOntologyTreeComponent,
    CohortListComponent,
    FamilyListComponent,
    // PhenopacketComponent,
  ],

  exports: [RouterModule],
  providers: [{ provide: MatDialogRef, useValue: {} },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // provider used to create a fake backend
    fakeBackendProvider

  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
