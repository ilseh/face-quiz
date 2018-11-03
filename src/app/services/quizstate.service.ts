import { Injectable } from '@angular/core';
import { QuizService } from './quiz.service';
import * as _ from 'lodash';

export class QuizItem {
  public name = '';
  public alternatives: string[] = [];
  public guess = '';
  public numberOfGuesses = 0;

  constructor(name: string) {
    this.name = name;
  }

}

const NUMBER_OF_ITEMS = 3;
export const QUIZ_NUMBER_OF_ALTERNATIVES = 2;

@Injectable({
  providedIn: 'root'
})
export class QuizstateService {

  public quizItems: QuizItem[] = [];

  constructor(private service: QuizService) { }

  public initiliaze() {
    const items = _.cloneDeep(this.service.getNames());

    for (let i = 0; i < NUMBER_OF_ITEMS; i++) {
      const item = new QuizItem(this.popRandom(items));
      const alternatives = _.cloneDeep(this.service.getNames()).filter(name => name !== item.name);
      for (let j = 0; j < QUIZ_NUMBER_OF_ALTERNATIVES; j++) {
        item.alternatives.push(this.popRandom(alternatives));
      }
      item.alternatives.push(item.name);
      item.alternatives = this.shake(item.alternatives);
      this.quizItems.push(item);
    }
  }

  get newQuizItems() {
    this.initiliaze();
    return this.quizItems;
  }

  popRandom(items: string[]): string {
    const randomIndex = Math.floor(this.getRandomIndex(items));
    const randowmItem = items[randomIndex];
    items.splice(randomIndex, 1);
    return randowmItem;
  }

  getRandomIndex(items: any[]) {
    return Math.floor(Math.random() * items.length);
  }

  get currentQuizItem(): QuizItem {
    return this.quizItems.filter(item => item.guess === '')[0];
  }

  public shake(items: string[]) {
    const copyOfItems = _.cloneDeep(items);
    const shaken = [];

    while (shaken.length < items.length) {
      shaken.push(this.popRandom(copyOfItems));
    }
    return shaken;
  }
}
