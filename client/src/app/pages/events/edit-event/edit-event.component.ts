import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud.service';
import { Event } from '../../../models/event';
import { environment } from 'environments/environment';
import notify from 'devextreme/ui/notify';
import { DxFileUploaderComponent, DxMultiViewComponent } from 'devextreme-angular';
import { Patient } from '../../../models/patient';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: [ './edit-event.component.css' ]
})
export class EditEventComponent implements OnInit, OnDestroy {
  event: Event;
  private sub: any;
  mainUrl: string = environment.restApi;
  url: string = environment.restApi;
  attachments: any[];
  patients: any[];

  @ViewChild('fileUploader') fileUploader: DxFileUploaderComponent;
  @ViewChild('multiview') multiview: DxMultiViewComponent;

  constructor(private crud: CrudService, private route: ActivatedRoute) {
    this.event = new Event();
    const itemsPerPage = environment.itemsPerPage;

    // Get patient's list from the Doctor
    this.crud.listEntity('patients?skip=0&take=10')
      .then(res => this.patients = res.docs);
  }

  deleteImage(event): void {
    this.crud.deleteEntity(`events/${this.event._id}/attachment/${event.itemData._id}/delete`);
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.crud.getEntityById('events', params[ 'id' ])
        .then(res => {
          this.event = res;
          this.refresh();
        });

      // Set attachments post method for uploading files
      this.url = `${this.url}/events/attachments/${params[ 'id' ]}`;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  refresh() {
    // Get attachments related to event
    this.crud.listEntity(`events/${this.event._id}/attachments`)
      .then(res => this.attachments = res);
  }

  onFormSubmit(e) {
    // Create a patient event
    this.crud.updateEntity(`events/${this.event._id}/update`, this.event)
      .then((res) => {
        notify('Event was updated satisfactory.', 'success', 1000);
      });

    e.preventDefault();
  }
}
