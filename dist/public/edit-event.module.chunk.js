webpackJsonp(["edit-event.module"],{

/***/ "./src/app/pages/events/edit-event/edit-event.component.css":
/***/ (function(module, exports) {

module.exports = "::ng-deep .list-container {\r\n  min-height: 440px;\r\n  height: auto;\r\n  top: 0;\r\n  bottom: 0;\r\n}\r\n::ng-deep .product {\r\n  height: 65px;\r\n}\r\n::ng-deep .product > img {\r\n  height: 100%;\r\n  width: 95px;\r\n  float: left;\r\n}\r\n::ng-deep .product > div {\r\n  padding-left: 10px;\r\n  vertical-align: top;\r\n  line-height: 65px;\r\n  font-size: 15px;\r\n  float: left;\r\n}\r\n::ng-deep .product > div.price {\r\n  float: right;\r\n  font-size: 18px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/pages/events/edit-event/edit-event.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"main-content\">\r\n  <div class=\"container-fluid\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <div *ngIf=\"event\" id=\"form-container\">\r\n          <form #form (submit)=\"onFormSubmit($event)\">\r\n            <dx-form id=\"form\"\r\n                     [showColonAfterLabel]=\"true\"\r\n                     [showValidationSummary]=\"true\"\r\n                     [formData]=\"event\"\r\n                     validationGroup=\"eventData\">\r\n\r\n              <div *dxTemplate=\"let data of 'item'\">\r\n                {{data.firstName}} {{data.lastName}}\r\n              </div>\r\n\r\n              <dxi-item itemType=\"tabbed\" [tabPanelOptions]=\"{ deferRendering: false, swipeEnabled: false }\">\r\n                <!-- General Information -->\r\n                <dxi-tab title=\"General Information\">\r\n                  <dxi-item dataField=\"patientId\" editorType=\"dxSelectBox\"\r\n                            [editorOptions]=\"{ dataSource: patients, displayExpr: 'firstName', valueExpr: '_id', searchEnabled: true, itemTemplate: 'item' }\"\r\n                            [label]=\"{text: 'Patient'}\">\r\n                    <dxi-validation-rule\r\n                      type=\"required\"\r\n                      message=\"Patient is required\">\r\n                    </dxi-validation-rule>\r\n                  </dxi-item>\r\n                  <dxi-item dataField=\"cause\" editorType=\"dxTextArea\" [editorOptions]=\"{ height: 140 }\">\r\n                    <dxi-validation-rule\r\n                      type=\"required\"\r\n                      message=\"Cause is required\">\r\n                    </dxi-validation-rule>\r\n                  </dxi-item>\r\n                  <dxi-item dataField=\"resolution\" editorType=\"dxTextArea\"\r\n                            [editorOptions]=\"{ height: 140 }\"></dxi-item>\r\n                </dxi-tab>\r\n\r\n                <!-- Attachments -->\r\n                <dxi-tab title=\"Attachments\">\r\n                  <dx-file-uploader\r\n                    #fileUploader\r\n                    [(uploadUrl)]=\"url\"\r\n                    [multiple]=\"true\"\r\n                    accept=\"image/*\"\r\n                    name=\"attachments\"\r\n                    uploadMode=\"instantly\"\r\n                    (onUploaded)=\"refresh()\"\r\n                  ></dx-file-uploader>\r\n\r\n                  <div *ngIf=\"attachments\" class=\"list-container\">\r\n                    <dx-list [items]=\"attachments\" height=\"100%\" [allowItemDeleting]=\"true\" itemDeleteMode=\"static\" (onItemDeleted)=\"deleteImage($event)\">\r\n                      <div *dxTemplate=\"let item of 'item'\">\r\n                        <div class=\"product\">\r\n                          <img src=\"{{ mainUrl }}/events/attachments/{{ item._id }}/download\"/>\r\n                          <div class=\"name\">{{ item.name }}</div>\r\n                          <div class=\"price\">\r\n                            <a download=\"custom-filename.jpg\" href=\"{{ mainUrl }}/events/attachments/{{ item._id }}/download\" title=\"Download\">\r\n                              <i class=\"fas fa-download\"></i> Download\r\n                            </a>\r\n                          </div>\r\n                        </div>\r\n                      </div>\r\n                    </dx-list>\r\n                  </div>\r\n\r\n                </dxi-tab>\r\n\r\n                <!-- Background Questions -->\r\n                <dxi-tab title=\"Background Questions\">\r\n                  <div>\r\n                    <div class=\"list-container\">\r\n                      <dx-list [dataSource]=\"event.backgroundQuestions\" height=\"100%\"\r\n                               [searchExpr]=\"'question'\"\r\n                               searchMode=\"contains\"\r\n                               [searchEnabled]=\"true\">\r\n                        <div *dxTemplate=\"let q of 'item'; let i = index\">\r\n                          <h5>{{ q.question }}</h5>\r\n                          <!--Question Type YES_NO-->\r\n                          <div *ngIf=\"q.type == 'YES_NO'\">\r\n                            <dx-select-box [items]=\"['YES', 'NO']\" [(ngModel)]=\"q.answer\"\r\n                                           [ngModelOptions]=\"{ standalone: true }\"\r\n                                           name=\"yesNoAnswer\">\r\n                            </dx-select-box>\r\n                            <div *ngIf=\"q.answer == 'YES'\">\r\n                              <span>Comentario</span>\r\n                              <dx-text-area name=\"commentAnswer\">\r\n                              </dx-text-area>\r\n                            </div>\r\n                          </div>\r\n                          <!--Question Type YES_NO-->\r\n                          <div *ngIf=\"q.type == 'DATE'\">\r\n                            <dx-date-box [(ngModel)]=\"q.answer\"\r\n                                         [ngModelOptions]=\"{ standalone: true }\" type=\"date\"\r\n                                         name=\"dateAnswer\">\r\n                            </dx-date-box>\r\n                          </div>\r\n                          <!--Question Type NUMBER-->\r\n                          <div *ngIf=\"q.type == 'NUMBER'\">\r\n                            <dx-number-box\r\n                              name=\"numberAnswer\"\r\n                              [(ngModel)]=\"q.answer\"\r\n                              [ngModelOptions]=\"{ standalone: true }\"\r\n                              [showSpinButtons]=\"true\"\r\n                              [showClearButton]=\"true\"\r\n                            ></dx-number-box>\r\n                          </div>\r\n                          <!--Question Type OPEN-->\r\n                          <div *ngIf=\"q.type == 'OPEN'\">\r\n                            <dx-text-area\r\n                              name=\"openAnswer\"\r\n                              [(ngModel)]=\"q.answer\"\r\n                              [ngModelOptions]=\"{ standalone: true }\"\r\n                              [height]=\"90\">\r\n                            </dx-text-area>\r\n                          </div>\r\n                        </div>\r\n                      </dx-list>\r\n                    </div>\r\n                  </div>\r\n                </dxi-tab>\r\n              </dxi-item>\r\n\r\n            </dx-form>\r\n            <br/>\r\n            <dx-button\r\n              text=\"Save\"\r\n              icon=\"fas fa-save\"\r\n              type=\"success\"\r\n              validationGroup=\"eventData\"\r\n              [useSubmitBehavior]=\"true\">\r\n            </dx-button>\r\n\r\n            <dx-button\r\n              text=\"Back\"\r\n              type=\"normal\"\r\n              icon=\"fas fa-arrow-left\"\r\n              routerLink=\"/events\"\r\n              [useSubmitBehavior]=\"false\">\r\n            </dx-button>\r\n          </form>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/pages/events/edit-event/edit-event.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditEventComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_crud_service__ = __webpack_require__("./src/app/services/crud.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_event__ = __webpack_require__("./src/app/models/event.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_environments_environment__ = __webpack_require__("./src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_devextreme_ui_notify__ = __webpack_require__("./node_modules/devextreme/ui/notify.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_devextreme_ui_notify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_devextreme_ui_notify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_devextreme_angular__ = __webpack_require__("./node_modules/devextreme-angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_devextreme_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_devextreme_angular__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var EditEventComponent = /** @class */ (function () {
    function EditEventComponent(crud, route) {
        var _this = this;
        this.crud = crud;
        this.route = route;
        this.mainUrl = __WEBPACK_IMPORTED_MODULE_4_environments_environment__["a" /* environment */].restApi;
        this.url = __WEBPACK_IMPORTED_MODULE_4_environments_environment__["a" /* environment */].restApi;
        this.event = new __WEBPACK_IMPORTED_MODULE_3__models_event__["a" /* Event */]();
        var itemsPerPage = __WEBPACK_IMPORTED_MODULE_4_environments_environment__["a" /* environment */].itemsPerPage;
        // Get patient's list from the Doctor
        this.crud.listEntity('patients?skip=0&take=10')
            .then(function (res) { return _this.patients = res.docs; });
    }
    EditEventComponent.prototype.deleteImage = function (event) {
        this.crud.deleteEntity("events/" + this.event._id + "/attachment/" + event.itemData._id + "/delete");
    };
    EditEventComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.crud.getEntityById('events', params['id'])
                .then(function (res) {
                _this.event = res;
                _this.refresh();
            });
            // Set attachments post method for uploading files
            _this.url = _this.url + "/events/attachments/" + params['id'];
        });
    };
    EditEventComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    EditEventComponent.prototype.refresh = function () {
        var _this = this;
        // Get attachments related to event
        this.crud.listEntity("events/" + this.event._id + "/attachments")
            .then(function (res) { return _this.attachments = res; });
    };
    EditEventComponent.prototype.onFormSubmit = function (e) {
        // Create a patient event
        this.crud.updateEntity("events/" + this.event._id + "/update", this.event)
            .then(function (res) {
            __WEBPACK_IMPORTED_MODULE_5_devextreme_ui_notify___default()('Event was updated satisfactory.', 'success', 1000);
        });
        e.preventDefault();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('fileUploader'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6_devextreme_angular__["DxFileUploaderComponent"])
    ], EditEventComponent.prototype, "fileUploader", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('multiview'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6_devextreme_angular__["DxMultiViewComponent"])
    ], EditEventComponent.prototype, "multiview", void 0);
    EditEventComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-edit-event',
            template: __webpack_require__("./src/app/pages/events/edit-event/edit-event.component.html"),
            styles: [__webpack_require__("./src/app/pages/events/edit-event/edit-event.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__services_crud_service__["a" /* CrudService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]])
    ], EditEventComponent);
    return EditEventComponent;
}());



/***/ }),

/***/ "./src/app/pages/events/edit-event/edit-event.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditEventModule", function() { return EditEventModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__ = __webpack_require__("./node_modules/devextreme-angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_devextreme_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_devextreme_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__edit_event_component__ = __webpack_require__("./src/app/pages/events/edit-event/edit-event.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [{
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_5__edit_event_component__["a" /* EditEventComponent */]
    }];
var EditEventModule = /** @class */ (function () {
    function EditEventModule() {
    }
    EditEventModule = __decorate([
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
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxListModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxDropDownBoxModule"],
                __WEBPACK_IMPORTED_MODULE_3__angular_router__["b" /* RouterModule */].forChild(routes)
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_5__edit_event_component__["a" /* EditEventComponent */]]
        })
    ], EditEventModule);
    return EditEventModule;
}());



/***/ })

});
//# sourceMappingURL=edit-event.module.chunk.js.map