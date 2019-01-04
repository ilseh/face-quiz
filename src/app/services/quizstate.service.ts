import { Injectable } from '@angular/core';
import { QuizService } from './quiz.service';
import * as _ from 'lodash';

export class QuizItem {
  public guess = '';
  public numberOfGuesses = 0;

  constructor(public name: string, public alternatives: string[]) {
  }

}

@Injectable({
  providedIn: 'root'
})
export class QuizstateService {

  constructor(private service: QuizService) {
  }

  public newQuizItems() {
    const names = _.cloneDeep(this.service.getNames());
    const items: QuizItem[] = [];

    while (items.length < this.service.getNames().length) {
      const itemName = this.service.popRandom(names);
      items.push(new QuizItem(itemName, this.service.getNamesToChooseFrom(itemName)));
    }
    return items;
  }


}
