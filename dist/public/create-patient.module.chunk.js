webpackJsonp(["create-patient.module"],{

/***/ "./src/app/pages/patients/create-patient/create-patient.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/patients/create-patient/create-patient.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"main-content\">\n  <div class=\"container-fluid\">\n    <div class=\"row\">\n      <div class=\"col-md-12\">\n        <div id=\"form-container\">\n          <form #form (submit)=\"onFormSubmit($event)\">\n            <dx-form id=\"form\"\n                     [showColonAfterLabel]=\"true\"\n                     [showValidationSummary]=\"true\"\n                     [formData]=\"patient\"\n                     validationGroup=\"patientData\">\n\n              <dxi-item itemType=\"tabbed\" [tabPanelOptions]=\"{ deferRendering: false }\">\n\n                <dxi-tab title=\"General Information\" [colCount]=\"2\">\n                  <dxi-item itemType=\"group\" caption=\"Personal Data\">\n                    <!--First Name-->\n                    <dxi-item dataField=\"firstName\">\n                      <dxi-validation-rule\n                        type=\"required\"\n                        message=\"First Name is required\">\n                      </dxi-validation-rule>\n                    </dxi-item>\n                    <!--Last Name-->\n                    <dxi-item dataField=\"lastName\">\n                      <dxi-validation-rule\n                        type=\"required\"\n                        message=\"Last Name is required\">\n                      </dxi-validation-rule>\n                    </dxi-item>\n                    <!--Residential Phone-->\n                    <dxi-item dataField=\"phone\" [label]=\"{ text: 'Residential Phone' }\" [editorOptions]=\"{ mask: '+1 (000) 000-0000'}\">\n                      <dxi-validation-rule\n                        type=\"required\"\n                        message=\"Residential Phone is required\">\n                      </dxi-validation-rule>\n                    </dxi-item>\n                    <!--Mobile Phone-->\n                    <dxi-item dataField=\"mobile\" [label]=\"{ text: 'Mobile Phone' }\" [editorOptions]=\"{ mask: '+1 (000) 000-0000'}\">\n                      <dxi-validation-rule\n                        type=\"required\"\n                        message=\"Mobile Phone is required\">\n                      </dxi-validation-rule>\n                    </dxi-item>\n                  </dxi-item>\n                  <dxi-item itemType=\"group\" caption=\"Body Data\" [colSpan]=\"1\">\n                    <!--Height-->\n                    <dxi-item dataField=\"bodyPerson.height\" editorType=\"dxNumberBox\" [editorOptions]=\"{ format: '#0.## ft' }\" [label]=\"{ text: 'Height' }\">\n                    </dxi-item>\n                    <!--Weight-->\n                    <dxi-item dataField=\"bodyPerson.weight\" editorType=\"dxNumberBox\" [editorOptions]=\"{ format: '#0.## kg' }\" [label]=\"{ text: 'Weight' }\">\n                    </dxi-item>\n                    <!--Color-->\n                    <dxi-item dataField=\"bodyPerson.color\" [label]=\"{text: 'Color'}\"\n                              [editorOptions]=\"{ dataSource: colors, displayExpr: 'description', valueExpr: 'id' }\"\n                              editorType=\"dxSelectBox\">\n                    </dxi-item>\n                  </dxi-item>\n                </dxi-tab>\n\n              </dxi-item>\n\n            </dx-form>\n            <br>\n            <dx-button\n              text=\"Save\"\n              icon=\"fas fa-save\"\n              type=\"success\"\n              validationGroup=\"patientData\"\n              [useSubmitBehavior]=\"true\">\n            </dx-button>\n\n            <dx-button\n              text=\"Back\"\n              type=\"normal\"\n              icon=\"fas fa-arrow-left\"\n              routerLink=\"/patients\"\n              [useSubmitBehavior]=\"false\">\n            </dx-button>\n          </form>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/pages/patients/create-patient/create-patient.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreatePatientComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_patient__ = __webpack_require__("./src/app/models/patient.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_devextreme_ui_notify__ = __webpack_require__("./node_modules/devextreme/ui/notify.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_devextreme_ui_notify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_devextreme_ui_notify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_crud_service__ = __webpack_require__("./src/app/services/crud.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CreatePatientComponent = /** @class */ (function () {
    function CreatePatientComponent(crud) {
        this.crud = crud;
        this.colors = [
            { id: 'WHITE', description: 'White' },
            { id: 'BLACK', description: 'Black' },
            { id: 'ASIAN', description: 'Asian' }
        ];
        this.patient = new __WEBPACK_IMPORTED_MODULE_1__models_patient__["a" /* Patient */]();
    }
    CreatePatientComponent.prototype.ngOnInit = function () { };
    CreatePatientComponent.prototype.onFormSubmit = function (e) {
        // Create a patient event
        this.crud.createEntity('patients/create', this.patient)
            .then(function (res) {
            __WEBPACK_IMPORTED_MODULE_2_devextreme_ui_notify___default()(res.message, 'success', 1000);
        });
        e.preventDefault();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('form'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__angular_forms__["NgForm"])
    ], CreatePatientComponent.prototype, "form", void 0);
    CreatePatientComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-create-patient',
            template: __webpack_require__("./src/app/pages/patients/create-patient/create-patient.component.html"),
            styles: [__webpack_require__("./src/app/pages/patients/create-patient/create-patient.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__services_crud_service__["a" /* CrudService */]])
    ], CreatePatientComponent);
    return CreatePatientComponent;
}());



/***/ }),

/***/ "./src/app/pages/patients/create-patient/create-patient.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreatePatientModule", function() { return CreatePatientModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__ = __webpack_require__("./node_modules/devextreme-angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_devextreme_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_devextreme_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__create_patient_component__ = __webpack_require__("./src/app/pages/patients/create-patient/create-patient.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [{
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_5__create_patient_component__["a" /* CreatePatientComponent */]
    }];
var CreatePatientModule = /** @class */ (function () {
    function CreatePatientModule() {
    }
    CreatePatientModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxFormModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxTextAreaModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxCheckBoxModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxSelectBoxModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxButtonModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxTemplateModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxFileUploaderModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxNumberBoxModule"],
                __WEBPACK_IMPORTED_MODULE_3__angular_router__["b" /* RouterModule */].forChild(routes)
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_5__create_patient_component__["a" /* CreatePatientComponent */]]
        })
    ], CreatePatientModule);
    return CreatePatientModule;
}());



/***/ })

});
//# sourceMappingURL=create-patient.module.chunk.js.map