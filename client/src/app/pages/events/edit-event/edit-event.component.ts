import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud.service';
import { Event } from '../../../models/event';
import { environment } from 'environments/environment';
import notify from 'devextreme/ui/notify';
import { DxFileUploaderComponent } from 'devextreme-angular';
import { Patient } from '../../../models/patient';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: [ './edit-event.component.css' ]
})
export class EditEventComponent implements OnInit, OnDestroy {

  event: Event;
  private sub: any;
  url: string = environment.restApi;
  patients: Patient[];
  @ViewChild('fileUploader') fileUploader: DxFileUploaderComponent;

  constructor(private crud: CrudService, private route: ActivatedRoute) {
    this.event = new Event();

    // Get patient's list from the Doctor
    this.crud.listEntity('patients')
      .then(res => this.patients = <Patient[]>res);
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.crud.getEntityById('events', params[ 'id' ])
        .then(res => this.event = res);

      this.url = `${this.url}/events/attachments/${params[ 'id' ]}`;
      // this.fileUploader.uploadUrl = this.url;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onFormSubmit(e) {
    // Create a patient event
    this.crud.createEntity(`events/${this.event._id}/update`, this.event)
      .then((res) => {
        notify('Event was updated satisfactory.', 'success', 1000);
      });

    e.preventDefault();
  }
}
