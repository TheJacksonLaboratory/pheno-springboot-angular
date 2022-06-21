import { Component } from '@angular/core';

@Component({
  selector: 'app-age-control',
  templateUrl: './age-control.component.html',
  styleUrls: ['./age-control.component.scss']
})

export class AgeControlComponent {
  selectedAgeType: string;
  ageTypes: string[] = ['Age', 'Age Range', 'Gestational Age', 'Ontology Class'];
  days: string[] = ['0', '1', '2', '3', '4', '5', '6'];

  // TODO - fetch from backend
  ontologies: string[] = ['Adult onset', 'Pediatric onset', 'Antenatal onset', 'Neonatal onset', 'Puerpural onset', 'Congenital onset'];
}