import { Injectable } from '@angular/core';
import { FaceszipService } from './faceszip.service';
import { QuizHelper } from './quiz-helper';
import { Observable, of } from 'rxjs';

export class QuizItem {
  public numberOfGuesses = 0;

  constructor(public name: string, public alternatives: string[], public imageLocation$: Observable<string>) {
  }

}

@Injectable({
  providedIn: 'root'
})
export class QuizstateService {
  private items: QuizItem[];
  public currentItem: QuizItem;

  constructor(private service: FaceszipService) {
  }

  public async newQuizItems() {
    const allNames: string[] = await this.service.getNames().toPromise();
    const names = [...allNames];
    const items: QuizItem[] = [];

    while (items.length < allNames.length) {
      const itemName = QuizHelper.popRandom(names);
      items.push(new QuizItem(itemName, QuizHelper.getNamesToChooseFrom(itemName, allNames),
                this.service.getImageLocation(itemName)));
    }
    return items;
  }

  async setCurrentItem() {
    if (!this.items || this.items.length === 0) {
      this.items = await this.newQuizItems();
    }
    this.currentItem = this.items.pop();
  }

  public imageLocation$(): Observable<string> {
    return this.currentItem.imageLocation$;
  }

}
