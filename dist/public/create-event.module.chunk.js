webpackJsonp(["create-event.module"],{

/***/ "./src/app/pages/events/create-event/create-event.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/events/create-event/create-event.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"main-content\">\r\n  <div class=\"container-fluid\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <div id=\"form-container\">\r\n          <form #form (submit)=\"onFormSubmit($event)\">\r\n            <dx-form id=\"form\"\r\n                     [showColonAfterLabel]=\"true\"\r\n                     [showValidationSummary]=\"true\"\r\n                     [formData]=\"event\"\r\n                     validationGroup=\"eventData\">\r\n\r\n              <div *dxTemplate=\"let data of 'item'\">\r\n                {{data.firstName}} {{data.lastName}}\r\n              </div>\r\n\r\n              <dxi-item itemType=\"tabbed\" [tabPanelOptions]=\"{ deferRendering: false }\">\r\n\r\n                <dxi-tab title=\"General Information\">\r\n                  <dxi-item itemType=\"group\" caption=\"General Information\">\r\n                    <dxi-item dataField=\"patientId\" editorType=\"dxSelectBox\"\r\n                              [editorOptions]=\"{ items: patients, displayExpr: 'firstName', valueExpr: '_id', searchEnabled: true, itemTemplate: 'item' }\" [label]=\"{text: 'Patient'}\">\r\n                      <dxi-validation-rule\r\n                        type=\"required\"\r\n                        message=\"Patient is required\">\r\n                      </dxi-validation-rule>\r\n                    </dxi-item>\r\n                    <dxi-item dataField=\"cause\" editorType=\"dxTextArea\" [editorOptions]=\"{ height: 140 }\">\r\n                      <dxi-validation-rule\r\n                        type=\"required\"\r\n                        message=\"Cause is required\">\r\n                      </dxi-validation-rule>\r\n                    </dxi-item>\r\n                    <dxi-item dataField=\"resolution\" editorType=\"dxTextArea\" [editorOptions]=\"{ height: 140 }\"></dxi-item>\r\n                  </dxi-item>\r\n                </dxi-tab>\r\n              </dxi-item>\r\n\r\n            </dx-form>\r\n            <br>\r\n            <dx-button\r\n              text=\"Save\"\r\n              icon=\"fas fa-save\"\r\n              type=\"success\"\r\n              validationGroup=\"eventData\"\r\n              [useSubmitBehavior]=\"true\">\r\n            </dx-button>\r\n\r\n            <dx-button\r\n              text=\"Back\"\r\n              type=\"normal\"\r\n              icon=\"fas fa-arrow-left\"\r\n              routerLink=\"/events\"\r\n              [useSubmitBehavior]=\"false\">\r\n            </dx-button>\r\n          </form>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/pages/events/create-event/create-event.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateEventComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_event__ = __webpack_require__("./src/app/models/event.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_crud_service__ = __webpack_require__("./src/app/services/crud.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_devextreme_ui_notify__ = __webpack_require__("./node_modules/devextreme/ui/notify.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_devextreme_ui_notify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_devextreme_ui_notify__);
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





var CreateEventComponent = /** @class */ (function () {
    function CreateEventComponent(crud) {
        var _this = this;
        this.crud = crud;
        this.event = new __WEBPACK_IMPORTED_MODULE_1__models_event__["a" /* Event */]();
        // Get patient's list from the Doctor
        this.crud.listEntity('patients?skip=0&take=10')
            .then(function (res) { return _this.patients = res.docs; });
    }
    CreateEventComponent.prototype.ngOnInit = function () { };
    CreateEventComponent.prototype.onFormSubmit = function (e) {
        // Create a patient event
        this.crud.createEntity('events/create', this.event)
            .then(function (res) {
            __WEBPACK_IMPORTED_MODULE_3_devextreme_ui_notify___default()('Event was added satisfactory.', 'success', 1000);
        });
        e.preventDefault();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('form'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__angular_forms__["NgForm"])
    ], CreateEventComponent.prototype, "form", void 0);
    CreateEventComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-create-event',
            template: __webpack_require__("./src/app/pages/events/create-event/create-event.component.html"),
            styles: [__webpack_require__("./src/app/pages/events/create-event/create-event.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__services_crud_service__["a" /* CrudService */]])
    ], CreateEventComponent);
    return CreateEventComponent;
}());



/***/ }),

/***/ "./src/app/pages/events/create-event/create-event.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateEventModule", function() { return CreateEventModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__ = __webpack_require__("./node_modules/devextreme-angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_devextreme_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_devextreme_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__create_event_component__ = __webpack_require__("./src/app/pages/events/create-event/create-event.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [{
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_5__create_event_component__["a" /* CreateEventComponent */]
    }];
var CreateEventModule = /** @class */ (function () {
    function CreateEventModule() {
    }
    CreateEventModule = __decorate([
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
                __WEBPACK_IMPORTED_MODULE_3__angular_router__["b" /* RouterModule */].forChild(routes)
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_5__create_event_component__["a" /* CreateEventComponent */]]
        })
    ], CreateEventModule);
    return CreateEventModule;
}());



/***/ })

});
//# sourceMappingURL=create-event.module.chunk.js.map