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
    this.nextItem();
  }

  nextItem() {
    if (!this.items || this.items.length === 0) {
      this.items = this.quizState.newQuizItems();
    }
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
      // Face was guessed in previous cycle, button is pressed to go to next face.
      this.clearValuesForNextItem();
      this.nextItem();
    } else {
      this.currentItem.numberOfGuesses++;
      this.setGuessedStatus();
    }
  }

  clearValuesForNextItem() {
    this.result = '';
    this.form.controls.name.setValue('');
  }

  setGuessedStatus() {
    if (this.form.controls.name.value === this.currentItem.name) {
      this.result = RESULT_OK;
    } else {
      this.result = RESULT_NOK;
    }
  }

  isGuessed() {
    return this.result === RESULT_OK;
  }

  get buttonText() {
    let text = 'Controleren';
    if (this.isGuessed()) {
      text = 'OK - volgende';
    } else {
      if (this.currentItem.numberOfGuesses === 1) {
        text = 'NOK - probeer nog eens';
      } else if (this.currentItem.numberOfGuesses > 1) {
        text = ':-(';
      }
    }
    return text;
  }

}
