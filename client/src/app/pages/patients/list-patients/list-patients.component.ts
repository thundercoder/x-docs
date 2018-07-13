import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { environment } from '../../../../environments/environment';
import { DxDataGridComponent } from 'devextreme-angular';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.css']
})
export class ListPatientsComponent implements OnInit {
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

        return crud.listEntity(`patients` + params)
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
