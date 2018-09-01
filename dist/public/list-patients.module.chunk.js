webpackJsonp(["list-patients.module"],{

/***/ "./src/app/pages/patients/list-patients/list-patients.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/patients/list-patients/list-patients.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"main-content\">\n  <div class=\"container-fluid\">\n    <div class=\"row\">\n      <div class=\"col-md-12\">\n        <dx-data-grid id=\"gridContainer\"\n                      [showColumnLines]=\"false\"\n                      [showRowLines]=\"true\"\n                      [remoteOperations]=\"true\"\n                      [rowAlternationEnabled]=\"true\"\n                      [dataSource]=\"dataSource\">\n          <dxo-search-panel\n            [visible]=\"true\"\n            [width]=\"240\"\n            placeholder=\"Search...\">\n          </dxo-search-panel>\n          <dxo-pager\n            [showInfo]=\"true\"\n            infoText=\"Page {0} of {1} | ({2} items)\"\n            [showNavigationButtons]=\"true\">\n          </dxo-pager>\n\n          <dxi-column dataField=\"firstName\" caption=\"First Name\"></dxi-column>\n          <dxi-column dataField=\"lastName\" caption=\"Last Name\"></dxi-column>\n          <dxi-column dataField=\"phone\" caption=\"Residential Phone\"></dxi-column>\n          <dxi-column dataField=\"mobile\" caption=\"Mobile Phone\"></dxi-column>\n          <dxi-column caption=\"\" cellTemplate=\"patientDetails\"></dxi-column>\n\n          <div *dxTemplate=\"let d of 'patientDetails'\">\n            <a routerLink=\"/patients/{{ d.data._id }}/detail\"><i class=\"fas fa-info-circle\"></i> Details</a>\n          </div>\n\n          <dxo-remote-operations\n            [sorting]=\"true\"\n            [filtering]=\"true\"\n            [paging]=\"true\">\n          </dxo-remote-operations>\n          <dxo-paging [pageSize]=\"itemsPerPage\"></dxo-paging>\n        </dx-data-grid>\n\n        <br>\n        <dx-button\n          text=\"Create New\"\n          type=\"normal\"\n          icon=\"fas fa-plus\"\n          routerLink=\"/patients/create\"\n          [useSubmitBehavior]=\"false\">\n        </dx-button>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/pages/patients/list-patients/list-patients.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPatientsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_devextreme_data_custom_store__ = __webpack_require__("./node_modules/devextreme/data/custom_store.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_devextreme_data_custom_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_devextreme_data_custom_store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_devextreme_angular__ = __webpack_require__("./node_modules/devextreme-angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_devextreme_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_devextreme_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_crud_service__ = __webpack_require__("./src/app/services/crud.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ListPatientsComponent = /** @class */ (function () {
    function ListPatientsComponent(crud) {
        this.crud = crud;
        this.dataSource = {};
        this.itemsPerPage = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].itemsPerPage;
        var itemsPerPage = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].itemsPerPage;
        this.dataSource.store = new __WEBPACK_IMPORTED_MODULE_1_devextreme_data_custom_store___default.a({
            load: function (loadOptions) {
                var params = '?';
                params += 'skip=' + loadOptions.skip || 0;
                params += '&take=' + itemsPerPage || loadOptions.take;
                if (loadOptions.sort) {
                    params += '&orderby=' + loadOptions.sort[0].selector;
                    if (loadOptions.sort[0].desc) {
                        params += '&sorttype=desc';
                    }
                    if (loadOptions.sort[0].asc) {
                        params += '&sorttype=asc';
                    }
                }
                if (loadOptions.filter) {
                    params += '&criteria=' + loadOptions.filter[0][2];
                }
                return crud.listEntity("patients" + params)
                    .then(function (data) {
                    return {
                        data: data.docs,
                        totalCount: data.total
                    };
                })
                    .catch(function (error) {
                    console.log(error);
                });
            }
        });
    }
    ListPatientsComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_3_devextreme_angular__["DxDataGridComponent"]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3_devextreme_angular__["DxDataGridComponent"])
    ], ListPatientsComponent.prototype, "dataGrid", void 0);
    ListPatientsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-list-patients',
            template: __webpack_require__("./src/app/pages/patients/list-patients/list-patients.component.html"),
            styles: [__webpack_require__("./src/app/pages/patients/list-patients/list-patients.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__services_crud_service__["a" /* CrudService */]])
    ], ListPatientsComponent);
    return ListPatientsComponent;
}());



/***/ }),

/***/ "./src/app/pages/patients/list-patients/list-patients.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ListPatientsModule", function() { return ListPatientsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__ = __webpack_require__("./node_modules/devextreme-angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_devextreme_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_devextreme_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__list_patients_component__ = __webpack_require__("./src/app/pages/patients/list-patients/list-patients.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [{
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_5__list_patients_component__["a" /* ListPatientsComponent */]
    }];
var ListPatientsModule = /** @class */ (function () {
    function ListPatientsModule() {
    }
    ListPatientsModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxFormModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxListModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxTextAreaModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxCheckBoxModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxSelectBoxModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxButtonModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxTemplateModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxFileUploaderModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxMultiViewModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxDateBoxModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxNumberBoxModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxTextAreaModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxDataGridModule"],
                __WEBPACK_IMPORTED_MODULE_3__angular_router__["b" /* RouterModule */].forChild(routes)
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_5__list_patients_component__["a" /* ListPatientsComponent */]]
        })
    ], ListPatientsModule);
    return ListPatientsModule;
}());



/***/ })

});
//# sourceMappingURL=list-patients.module.chunk.js.map