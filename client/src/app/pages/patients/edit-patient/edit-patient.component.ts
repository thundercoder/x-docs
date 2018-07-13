import { Component, OnInit, ViewChild } from '@angular/core';
import { Patient } from '../../../models/patient';
import notify from 'devextreme/ui/notify';
import { environment } from '../../../../environments/environment';
import { CrudService } from '../../../services/crud.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {
  patient: Patient;
  private sub: any;
  url: string = environment.restApi;

  colors: any = [
    { id: 'WHITE', description: 'White' },
    { id: 'BLACK', description: 'Black' },
    { id: 'ASIAN', description: 'Asian' }
  ];

  constructor(private crud: CrudService, private route: ActivatedRoute) {
    this.patient = new Patient();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.crud.getEntityById('patients', params[ 'id' ])
        .then(res => {
          this.patient = res;
        });
    });
  }

  onFormSubmit(e) {
    // Create a patient event
    this.crud.updateEntity(`patients/${this.patient._id}/update`, this.patient)
      .then((res) => {
        notify(res.message, 'success', 1000);
      });

    e.preventDefault();
  }
}
