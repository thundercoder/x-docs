import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { CrudService } from '../../../services/crud.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: [ './list-events.component.css' ]
})
export class ListEventsComponent implements OnInit {
  dataSource: any = {};
  itemsPerPage = environment.itemsPerPage;

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  constructor(private crud: CrudService) {
    const itemsPerPage = environment.itemsPerPage;

    this.dataSource.store = new CustomStore({
      load: (loadOptions: any) => {

        let params = '?';

        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + itemsPerPage || loadOptions.take ;

        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[ 0 ].selector;
          if (loadOptions.sort[ 0 ].desc) {
            params += '&sorttype=desc';
          }
          if (loadOptions.sort[ 0 ].asc) {
            params += '&sorttype=asc';
          }
        }

        if (loadOptions.filter) {
          params += '&criteria=' + loadOptions.filter[ 0 ][ 2 ];
        }

        return crud.listEntity(`events/list` + params)
          .then((data: any) => {
            return {
              data: data.docs,
              totalCount: data.total
            };
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  }

  ngOnInit() {
  }

}
