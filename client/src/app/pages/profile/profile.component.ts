import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../services/crud.service';
import { ActivatedRoute } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { User } from '../../models/user';
import { Question } from '../../models/question';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  specialists: any;
  popupVisible: boolean = false;
  currentQuestion: any;
  currentIndexQuestion: number = undefined;

  genders: any = [
    { id: 'M', description: 'MALE' },
    { id: 'F', description: 'FEMALE' }
  ];

  types: any = [
    { id: 'YES_NO', description: 'YES/NO' },
    { id: 'OPEN', description: 'DESCRIPTION' },
    { id: 'NUMBER', description: 'NUMERIC' },
    { id: 'DATE', description: 'DATE' }
  ];

  constructor(private crud: CrudService, private route: ActivatedRoute) {
    this.user = new User();

    this.crud.listEntity('specialists')
      .then(res => this.specialists = res);

    // Get patient's list from the Doctor
    this.crud.getEntity('login')
      .then(res => this.user = res);
  }

  ngOnInit() {
  }

  refresh() {
    window.location.reload();
  }

  updateQuestion(item: any, index: number) {
    this.currentIndexQuestion = index;
    this.currentQuestion = item;
    this.popupVisible = true;
  }

  saveQuestion() {
    if (this.currentIndexQuestion == undefined)
      this.user.questions.push(this.currentQuestion);
    else
      this.user.questions[this.currentIndexQuestion] = this.currentQuestion;

    this.currentIndexQuestion = undefined;
    this.popupVisible = false;
  }

  createNew() {
    this.currentQuestion = new Question();
    this.popupVisible = true;
  }

  onFormSubmit(e) {
    // Create a patient event
    this.crud.updateEntity(`account/profile`, this.user)
      .then((res) => {
        notify('User was updated satisfactory.', 'success', 1000);
      });

    e.preventDefault();
  }
}
