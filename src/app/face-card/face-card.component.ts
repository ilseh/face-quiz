import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuizstateService } from '../services/quizstate.service';
import { QuizHelper } from '../services/quiz-helper';
import { Observable, of, Subject, timer } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

const RESULT_OK = 'OK';
const RESULT_NOK = 'NOK';
const TIME_TO_PROCEED = 3;

@Component({
  selector: 'app-face-card',
  templateUrl: './face-card.component.html',
  styleUrls: ['./face-card.component.scss']
})
export class FaceCardComponent implements OnInit {
  public form = new FormGroup({ name: new FormControl() });
  public result: string;
  isReady$: Observable<boolean>;
  private timeLeft = 0;
  private stopTimer = new Subject();

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
      this.goNext();
    } else {
      this.quizState.currentItem.numberOfGuesses++;
      this.determineGuessedStatus();
      if (this.isGuessed()) {
        this.setTimer();
      }
    }
  }

  private goNext() {
    this.stopAndReableTimer();
    this.clearValuesForNextItem();
    this.quizState.setCurrentItem();
  }

  stopAndReableTimer() {
    this.stopTimer.next(true);
    this.stopTimer.next(false);
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
      text = 'OK - volgende ' + this.timeLeft;
    } else {
      if (this.quizState.currentItem.numberOfGuesses === 1) {
        text = 'NOK - probeer nog eens';
      } else if (this.quizState.currentItem.numberOfGuesses > 1) {
        text = ':-(';
      }
    }
    return text;
  }

  setTimer() {
    timer(0, 1000).pipe(takeUntil(this.stopTimer)).subscribe(value => {
        this.timeLeft = TIME_TO_PROCEED - value;
        if (this.timeLeft < 1) {
          this.goNext();
        }
    });
  }
}
