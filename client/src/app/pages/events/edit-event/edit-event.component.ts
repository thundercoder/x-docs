import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud.service';
import { Event } from '../../../models/event';
import { environment } from 'environments/environment';
import notify from 'devextreme/ui/notify';
import { DxFileUploaderComponent, DxMultiViewComponent } from 'devextreme-angular';
import { Patient } from '../../../models/patient';

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
  patients: Patient[];
  attachments: any[];
  multiviewBehavior: any;
  @ViewChild('fileUploader') fileUploader: DxFileUploaderComponent;
  @ViewChild('multiview') multiview: DxMultiViewComponent;

  constructor(private crud: CrudService, private route: ActivatedRoute) {
    this.event = new Event();

    // Get patient's list from the Doctor
    this.crud.listEntity('patients')
      .then(res => this.patients = <Patient[]>res);
  }

  back(): void {
    if (this.multiview.selectedItem != 0)
      this.multiview.selectedIndex -= 1;
  }

  next(): void {
    if (this.multiview.selectedItem != (this.multiview.items.length - 1))
      this.multiview.selectedIndex += 1;
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
