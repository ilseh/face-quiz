import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuizService } from '../services/quiz.service';
import { QuizItem, QuizstateService } from '../services/quizstate.service';

const RESULT_OK = 'OK';
const RESULT_NOK = 'NOK';

@Component({
  selector: 'app-face-card',
  templateUrl: './face-card.component.html',
  styleUrls: ['./face-card.component.scss']
})
export class FaceCardComponent implements OnInit {
  public form = new FormGroup({ name: new FormControl() });
  private items: QuizItem[];
  public result: string;
  public currentItem: QuizItem;

  constructor(private quizService: QuizService, private quizState: QuizstateService) {
  }

  ngOnInit() {
    this.items = this.quizState.newQuizItems;
    this.nextItem();
  }

  nextItem() {
    this.currentItem = this.items.pop();
  }

  get imageLocation() {
    return this.quizService.getImageLocation(this.currentItem.name);
  }

  get names(): string[] {
    return this.currentItem.alternatives;
  }

  makePretty(name: string) {
    return this.quizService.makePrettyName(name);
  }

  processItem() {
    if (this.isGuessed()) {
      this.result = '';
      this.quizState.currentQuizItem.numberOfGuesses = this.currentItem.numberOfGuesses;
      this.form.controls.name.setValue('')
      this.nextItem();
    } else {
      this.currentItem.numberOfGuesses++;
      if (this.form.controls.name.value === this.currentItem.name) {
        this.result = RESULT_OK;
      } else {
        this.result = RESULT_NOK;
      }
    }
  }

  isGuessed() {
    return this.result === RESULT_OK;
  }
}
