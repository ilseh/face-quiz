import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuizstateService } from '../services/quizstate.service';
import { QuizHelper } from '../services/quiz-helper';
import { Observable, of } from 'rxjs';

const RESULT_OK = 'OK';
const RESULT_NOK = 'NOK';

@Component({
  selector: 'app-face-card',
  templateUrl: './face-card.component.html',
  styleUrls: ['./face-card.component.scss']
})
export class FaceCardComponent implements OnInit {
  public form = new FormGroup({ name: new FormControl() });
  public result: string;
  isReady$: Observable<boolean>;

  constructor(private quizState: QuizstateService) {
  }

  async ngOnInit() {
    await this.quizState.setCurrentItem();
    this.isReady$ = of(true);
  }

  get imageSource$(): Observable<string> {
    return this.quizState.imageLocation$();
  }

  get names(): string[] {
    return this.quizState.currentItem.alternatives;
  }

  makePretty(name: string) {
    return QuizHelper.makePrettyName(name);
  }

  processItem() {
    if (this.isGuessed()) {
      // Face was guessed in previous cycle, button is pressed to go to next face.
      this.clearValuesForNextItem();
      this.quizState.setCurrentItem();
    } else {
      this.quizState.currentItem.numberOfGuesses++;
      this.determineGuessedStatus();
    }
  }

  clearValuesForNextItem() {
    this.result = '';
    this.form.controls.name.setValue('');
  }

  determineGuessedStatus() {
    if (this.form.controls.name.value === this.quizState.currentItem.name) {
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
      if (this.quizState.currentItem.numberOfGuesses === 1) {
        text = 'NOK - probeer nog eens';
      } else if (this.quizState.currentItem.numberOfGuesses > 1) {
        text = ':-(';
      }
    }
    return text;
  }

}
