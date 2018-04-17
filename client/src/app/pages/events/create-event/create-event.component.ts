import { Component, OnInit } from '@angular/core';
import { Event } from '../../../models/event';
import { CrudService } from '../../../services/crud.service';
import { Patient } from '../../../models/patient';
declare var $: any;

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  event: Event;
  patients: Patient[];
  routes: string;

  constructor(private crud: CrudService) {
    this.event = new Event();
    this.crud.listEntity('patients')
      .then(res => this.patients = <Patient[]>res);
  }

  ngOnInit() { }

  onFormSubmit (e) {
    this.crud.createEntity('events/create', this.event)
      .then(() => {
        $.notify({
          icon: 'fas fa-check',
          message: '<b>Event</b> was added satisfactory.'
        }, {
          type: 'success',
          timer: 500,
          placement: {
            from: 'top',
            align: 'center'
          }
        });
      });

    e.preventDefault();
  }

}
