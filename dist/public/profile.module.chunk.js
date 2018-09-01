webpackJsonp(["profile.module"],{

/***/ "./src/app/models/question.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Question; });
var Question = /** @class */ (function () {
    function Question() {
    }
    return Question;
}());



/***/ }),

/***/ "./src/app/models/user.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return User; });
var Profile = /** @class */ (function () {
    function Profile() {
    }
    return Profile;
}());
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());



/***/ }),

/***/ "./src/app/pages/profile/profile.component.css":
/***/ (function(module, exports) {

module.exports = "::ng-deep .form-avatar {\r\n  height: 200px;\r\n  width: 200px;\r\n  border: 1px solid #d2d3d5;\r\n  border-radius: 50%;\r\n  background-size: contain;\r\n  background-image: url('http://localhost:3000/api/account/get/picture');\r\n  background-repeat: no-repeat;\r\n  background-position: center;\r\n}\r\n"

/***/ }),

/***/ "./src/app/pages/profile/profile.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"main-content\">\n  <div class=\"container-fluid\">\n    <div class=\"row\">\n      <div class=\"col-md-12\">\n        <div id=\"form-container\">\n          <form *ngIf=\"(user && specialists)\" #form (submit)=\"onFormSubmit($event)\">\n            <dx-form id=\"form\"\n                     [showColonAfterLabel]=\"true\"\n                     [showValidationSummary]=\"true\"\n                     [formData]=\"user\"\n                     validationGroup=\"userData\">\n\n              <dxi-item itemType=\"tabbed\" [tabPanelOptions]=\"{ deferRendering: false }\">\n                <!--Profile Information-->\n                <dxi-tab title=\"General Information\" [colCount]=\"4\">\n                  <!--Profile Info-->\n                  <dxi-item itemType=\"group\" caption=\"Personal Data\" [colSpan]=\"2\">\n                    <!--Email-->\n                    <dxi-item dataField=\"email\" [label]=\"{text: 'User / Email'}\" editorType=\"dxTextBox\">\n                      <dxi-validation-rule\n                        type=\"required\"\n                        message=\"Email is required\">\n                      </dxi-validation-rule>\n                    </dxi-item>\n                    <!--First Name-->\n                    <dxi-item dataField=\"profile.firstName\" [label]=\"{text: 'First Name'}\" editorType=\"dxTextBox\">\n                      <dxi-validation-rule\n                        type=\"required\"\n                        message=\"First Name is required\">\n                      </dxi-validation-rule>\n                    </dxi-item>\n                    <!--Last Name-->\n                    <dxi-item dataField=\"profile.lastName\" [label]=\"{text: 'Last Name'}\" editorType=\"dxTextBox\">\n                      <dxi-validation-rule\n                        type=\"required\"\n                        message=\"Last Name is required\">\n                      </dxi-validation-rule>\n                    </dxi-item>\n                    <!--Specialist-->\n                    <dxi-item dataField=\"specialist\" [label]=\"{text: 'Specialist'}\"\n                              [editorOptions]=\"{ dataSource: specialists, displayExpr: 'description', valueExpr: 'code' }\"\n                              editorType=\"dxSelectBox\">\n                    </dxi-item>\n                    <!--Birth Date-->\n                    <dxi-item dataField=\"profile.birthDate\" editorType=\"dxDateBox\"></dxi-item>\n                    <!--Gender-->\n                    <dxi-item dataField=\"profile.gender\" [label]=\"{text: 'Gender'}\"\n                              [editorOptions]=\"{ dataSource: genders, displayExpr: 'description', valueExpr: 'id' }\"\n                              editorType=\"dxSelectBox\">\n                    </dxi-item>\n                    <!--Office Phone-->\n                    <dxi-item dataField=\"profile.phone\" [label]=\"{text: 'Office Phone'}\" [editorOptions]=\"{ mask: '+1 (000) 000-0000'}\"></dxi-item>\n                    <!--Mobile Phone-->\n                    <dxi-item dataField=\"profile.mobile\" [label]=\"{text: 'Mobile Phone'}\" [editorOptions]=\"{ mask: '+1 (000) 000-0000'}\"></dxi-item>\n                    <!--Website-->\n                    <dxi-item dataField=\"profile.website\" [label]=\"{text: 'Website'}\" editorType=\"dxTextBox\">\n                    </dxi-item>\n                    <!--Address-->\n                    <dxi-item dataField=\"profile.address\" [label]=\"{text: 'Address', height: '140px'}\" editorType=\"dxTextArea\">\n                    </dxi-item>\n\n                  </dxi-item>\n                  <!--Photo-->\n                  <dxi-item itemType=\"group\" caption=\"Photo\" [colSpan]=\"2\">\n                    <dxi-item [colSpan]=\"1\">\n                      <div class=\"form-avatar\">\n                      </div>\n                    </dxi-item>\n                    <dxi-item [colSpan]=\"1\">\n                      <dx-file-uploader\n                        #fileUploader\n                        uploadUrl=\"http://localhost:3000/api/account/upload/picture\"\n                        [multiple]=\"true\"\n                        accept=\"image/*\"\n                        name=\"attachments\"\n                        (onUploaded)=\"refresh()\"\n                        uploadMode=\"instantly\"\n                      ></dx-file-uploader>\n                    </dxi-item>\n                  </dxi-item>\n                </dxi-tab>\n                <!-- Background Questions -->\n                <dxi-tab title=\"Background Questions\">\n                  <div *ngIf=\"user.questions.length > 0\">\n                    <div class=\"list-container\">\n                      <dx-list [items]=\"user.questions\" height=\"100%\" [allowItemDeleting]=\"true\" [allowItemReordering]=\"true\">\n                        <div *dxTemplate=\"let q of 'item'; let i = index\">\n                          <div>\n                            <!--Question Literal-->\n                            <a (click)=\"updateQuestion(q, i)\">{{ i + 1 }}. {{ q.question }}</a>\n                            <!--Question Type-->\n                            <p>{{ q.type }}</p>\n                          </div>\n                        </div>\n                      </dx-list>\n                    </div>\n                  </div>\n                  <dx-button\n                    style=\"float: right; margin-bottom: 10px\"\n                    text=\"Create New\"\n                    icon=\"fas fa-plus\"\n                    type=\"normal\"\n                    (onClick)=\"createNew()\"\n                    [useSubmitBehavior]=\"false\">\n                  </dx-button>\n                </dxi-tab>\n              </dxi-item>\n            </dx-form>\n\n            <br>\n            <dx-button\n              text=\"Save\"\n              icon=\"fas fa-save\"\n              type=\"success\"\n              validationGroup=\"userData\"\n              [useSubmitBehavior]=\"true\">\n            </dx-button>\n          </form>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<dx-popup\n  class=\"popup\"\n  [showTitle]=\"true\"\n  title=\"Question Managment\"\n  [dragEnabled]=\"false\"\n  [closeOnOutsideClick]=\"true\"\n  [(visible)]=\"popupVisible\">\n  <div *dxTemplate=\"let data of 'content'\">\n    <p>\n      Question:\n    </p>\n    <dx-text-area [(ngModel)]=\"currentQuestion.question\"></dx-text-area>\n    <br>\n    <p>\n      Type:\n    </p>\n    <dx-select-box [(ngModel)]=\"currentQuestion.type\" [dataSource]=\"types\" displayExpr=\"description\" [value]=\"types[0].id\" valueExpr=\"id\"></dx-select-box>\n\n    <br>\n    <dx-button\n      text=\"Save\"\n      icon=\"fas fa-save\"\n      type=\"success\"\n      (onClick)=\"saveQuestion()\"\n      [useSubmitBehavior]=\"false\">\n    </dx-button>\n  </div>\n</dx-popup>\n"

/***/ }),

/***/ "./src/app/pages/profile/profile.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_crud_service__ = __webpack_require__("./src/app/services/crud.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_devextreme_ui_notify__ = __webpack_require__("./node_modules/devextreme/ui/notify.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_devextreme_ui_notify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_devextreme_ui_notify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_user__ = __webpack_require__("./src/app/models/user.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_question__ = __webpack_require__("./src/app/models/question.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(crud, route) {
        var _this = this;
        this.crud = crud;
        this.route = route;
        this.popupVisible = false;
        this.currentIndexQuestion = undefined;
        this.genders = [
            { id: 'M', description: 'MALE' },
            { id: 'F', description: 'FEMALE' }
        ];
        this.types = [
            { id: 'YES_NO', description: 'YES/NO' },
            { id: 'OPEN', description: 'DESCRIPTION' },
            { id: 'NUMBER', description: 'NUMERIC' },
            { id: 'DATE', description: 'DATE' }
        ];
        this.user = new __WEBPACK_IMPORTED_MODULE_4__models_user__["a" /* User */]();
        this.crud.listEntity('specialists')
            .then(function (res) { return _this.specialists = res; });
        // Get patient's list from the Doctor
        this.crud.getEntity('login')
            .then(function (res) { return _this.user = res; });
    }
    ProfileComponent.prototype.ngOnInit = function () {
    };
    ProfileComponent.prototype.refresh = function () {
        window.location.reload();
    };
    ProfileComponent.prototype.updateQuestion = function (item, index) {
        this.currentIndexQuestion = index;
        this.currentQuestion = item;
        this.popupVisible = true;
    };
    ProfileComponent.prototype.saveQuestion = function () {
        if (this.currentIndexQuestion == undefined)
            this.user.questions.push(this.currentQuestion);
        else
            this.user.questions[this.currentIndexQuestion] = this.currentQuestion;
        this.currentIndexQuestion = undefined;
        this.popupVisible = false;
    };
    ProfileComponent.prototype.createNew = function () {
        this.currentQuestion = new __WEBPACK_IMPORTED_MODULE_5__models_question__["a" /* Question */]();
        this.popupVisible = true;
    };
    ProfileComponent.prototype.onFormSubmit = function (e) {
        // Create a patient event
        this.crud.updateEntity("account/profile", this.user)
            .then(function (res) {
            __WEBPACK_IMPORTED_MODULE_3_devextreme_ui_notify___default()('User was updated satisfactory.', 'success', 1000);
        });
        e.preventDefault();
    };
    ProfileComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-profile',
            template: __webpack_require__("./src/app/pages/profile/profile.component.html"),
            styles: [__webpack_require__("./src/app/pages/profile/profile.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_crud_service__["a" /* CrudService */], __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* ActivatedRoute */]])
    ], ProfileComponent);
    return ProfileComponent;
}());



/***/ }),

/***/ "./src/app/pages/profile/profile.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileModule", function() { return ProfileModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__ = __webpack_require__("./node_modules/devextreme-angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_devextreme_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_devextreme_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__profile_component__ = __webpack_require__("./src/app/pages/profile/profile.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [{
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_5__profile_component__["a" /* ProfileComponent */]
    }];
var ProfileModule = /** @class */ (function () {
    function ProfileModule() {
    }
    ProfileModule = __decorate([
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
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxListModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxDateBoxModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxNumberBoxModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxPopupModule"],
                __WEBPACK_IMPORTED_MODULE_4_devextreme_angular__["DxTextAreaModule"],
                __WEBPACK_IMPORTED_MODULE_3__angular_router__["b" /* RouterModule */].forChild(routes)
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_5__profile_component__["a" /* ProfileComponent */]]
        })
    ], ProfileModule);
    return ProfileModule;
}());



/***/ })

});
//# sourceMappingURL=profile.module.chunk.js.map