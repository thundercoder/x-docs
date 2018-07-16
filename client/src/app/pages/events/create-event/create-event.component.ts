import { Component, OnInit, ViewChild } from '@angular/core';
import { Event } from '../../../models/event';
import { CrudService } from '../../../services/crud.service';
import { Patient } from '../../../models/patient';
import notify from 'devextreme/ui/notify';
import { NgForm } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  event: Event;
  patients: Patient[];

  constructor(private crud: CrudService) {
    this.event = new Event();

    // Get patient's list from the Doctor
    this.crud.listEntity('patients?skip=0&take=10')
      .then(res => this.patients = res.docs);
  }

  ngOnInit() { }

  onFormSubmit (e) {
    // Create a patient event
    this.crud.createEntity('events/create', this.event)
      .then((res) => {
        notify('Event was added satisfactory.', 'success', 1000);
      });

    e.preventDefault();
  }
}
