import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuizService } from '../services/quiz.service';
import { QuizItem, QuizstateService } from '../services/quizstate.service';

@Component({
  selector: 'app-face-card',
  templateUrl: './face-card.component.html',
  styleUrls: ['./face-card.component.scss']
})
export class FaceCardComponent implements OnInit {
  private form = new FormGroup({ name: new FormControl() });
  private items: QuizItem[];

  constructor(private quizService: QuizService, private quizState: QuizstateService) {
  }

  ngOnInit() {
    this.items = this.quizState.newQuizItems;
  }

  get imageLocation() {
    return this.quizService.getImageLocation(this.quizState.currentQuizItem.name);
  }

  getNames(): string[] {
    return this.quizState.currentQuizItem.alternatives;
  }


}
