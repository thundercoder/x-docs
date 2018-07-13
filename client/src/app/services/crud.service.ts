import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import notify from 'devextreme/ui/notify';

@Injectable()
export class CrudService {

  apiDocs: string = environment.restApi;
  apiHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    this.apiHeaders = new HttpHeaders();

    this.apiHeaders.append('Content-Type', 'application/json');
  }

  getEntity(endpoint: string): Promise<any> {
    this.http.post(`${this.apiDocs}/login`, {email: 'hectorglara@outlook.com', password: 'abc*123'}, {headers: this.apiHeaders})
      .toPromise()
      .then(res => console.log('fulfill'));

    return this.http.get(`${this.apiDocs}/${endpoint}`, { headers: this.apiHeaders, withCredentials: true })
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(err => CrudService.handleError(err, 'GET'));
  }

  getEntityById(endpoint: string, id: string): Promise<any> {
    this.http.post(`${this.apiDocs}/login`, {email: 'hectorglara@outlook.com', password: 'abc*123'}, {headers: this.apiHeaders})
      .toPromise()
      .then(res => console.log('fulfill'));

    return this.http.get(`${this.apiDocs}/${endpoint}/${id}/${endpoint.substr(0, endpoint.length - 1)}`, { headers: this.apiHeaders, withCredentials: true })
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(err => CrudService.handleError(err, 'GET', id));
  }

  createEntity(endpoint: string, entity: any): Promise<any> {
    this.http.post(`${this.apiDocs}/login`, {email: 'hectorglara@outlook.com', password: 'abc*123'}, {headers: this.apiHeaders})
      .toPromise()
      .then(res => console.log('fulfill'));

    return this.http.post(`${this.apiDocs}/${endpoint}`, entity, { headers: this.apiHeaders, withCredentials: true })
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(err => CrudService.handleError(err, 'POST', entity));
  }

  updateEntity(endpoint: string, entity: any): Promise<any> {
    this.http.post(`${this.apiDocs}/login`, {email: 'hectorglara@outlook.com', password: 'abc*123'}, {headers: this.apiHeaders})
      .toPromise()
      .then(res => console.log('fulfill'));

    return this.http.put(`${this.apiDocs}/${endpoint}`, entity, { headers: this.apiHeaders, withCredentials: true })
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(err => CrudService.handleError(err, 'PUT', entity));
  }

  listEntity(endpoint: string): Promise<any> {
    this.http.post(`${this.apiDocs}/login`, {email: 'hectorglara@outlook.com', password: 'abc*123'}, { headers: this.apiHeaders })
      .toPromise()
      .then(res => console.log('fulfill'));

    return this.http.get(`${this.apiDocs}/${endpoint}`, { headers: this.apiHeaders, withCredentials: true })
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(err => CrudService.handleError(err, 'GET'));
  }

  deleteEntity(endpoint: string): Promise<any> {
    this.http.post(`${this.apiDocs}/login`, {email: 'hectorglara@outlook.com', password: 'abc*123'}, {headers: this.apiHeaders})
      .toPromise()
      .then(res => console.log('fulfill'));

    return this.http.delete(`${this.apiDocs}/${endpoint}`, { headers: this.apiHeaders, withCredentials: true })
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(err => CrudService.handleError(err, 'DELETE'));
  }

  private static handleError(error: any, type: string, request?: any): Promise<any> {
    notify(error.error.message, 'error', 3000);

    console.log(`TYPE: ${type}, REQUEST: ${request}`);

    return Promise.reject(error.error.message || error);
  }

}
