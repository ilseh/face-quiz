import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { FaceszipService } from './faceszip.service';
import { QuizHelper } from './quiz-helper';
import { Observable } from 'rxjs';

export class QuizItem {
  public numberOfGuesses = 0;

  constructor(public name: string, public alternatives: string[], public imageLocation$: Observable<string>) {
  }

}

@Injectable({
  providedIn: 'root'
})
export class QuizstateService {

  constructor(private service: FaceszipService) {
  }

  public async newQuizItems() {
    const allNames: string[] = await this.service.getNames().toPromise();
    const names = _.cloneDeep(allNames);
    const items: QuizItem[] = [];

    while (items.length < allNames.length) {
      const itemName = QuizHelper.popRandom(names);
      items.push(new QuizItem(itemName, QuizHelper.getNamesToChooseFrom(itemName, allNames),
                this.service.getImageLocation(itemName)));
    }
    return items;
  }


}
