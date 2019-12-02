import { Injectable } from '@angular/core';
import { FaceszipService } from './faceszip.service';
import { QuizHelper } from './quiz-helper';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { JSZipObject } from 'jszip';

export class QuizItem {
  public numberOfGuesses = 0;
  public imageLocation$: Observable<string>;

  constructor(public name: string, public alternatives: string[], public _jsZipObjet: JSZipObject) {
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

  public newQuizItems(): Observable<QuizItem[]> {
    return this.service.getZipEntries().pipe(take(1), map((zipObjects: Array<JSZipObject>) => {

      const items: QuizItem[] = [];
      const zipObjectsCopy = [...zipObjects];
      const allNames: string[] = zipObjects.map(zipObject => zipObject.name);

      while (items.length < zipObjects.length) {
        // Create quiz items in random order
        const zipObject = QuizHelper.popRandom(zipObjectsCopy);
        items.push(new QuizItem(zipObject.name, QuizHelper.getNamesToChooseFrom(zipObject.name, allNames), zipObject));
      }
      return items;
    }));
  }

  async setCurrentItem() {
    if (!this.items || this.items.length === 0) {
      this.items = await this.newQuizItems().toPromise();
    }
    this.currentItem = this.items.pop();
  }

  public imageLocation$(): Observable<string> {
    return this.service.getImageFromZip(this.currentItem._jsZipObjet);
  }

}
