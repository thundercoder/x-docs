import { Component, OnInit, ViewChild } from '@angular/core';
import { Patient } from '../../../models/patient';
import notify from 'devextreme/ui/notify';
import { CrudService } from '../../../services/crud.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css']
})
export class CreatePatientComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  patient: Patient;

  colors: any = [
    { id: 'WHITE', description: 'White' },
    { id: 'BLACK', description: 'Black' },
    { id: 'ASIAN', description: 'Asian' }
  ];

  constructor(private crud: CrudService) {
    this.patient = new Patient();
  }

  ngOnInit() { }

  onFormSubmit (e) {
    // Create a patient event
    this.crud.createEntity('patients/create', this.patient)
      .then((res) => {
        notify(res.message, 'success', 1000);
      });

    e.preventDefault();
  }
}
