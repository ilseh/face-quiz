import { Injectable } from '@angular/core';
import { ZipService, ZipDataProgress } from './zip.service';
import { QuizHelper } from './quiz.helper';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { JSZipObject } from 'jszip';

export class QuizItem {
  public numberOfGuesses = 0;

  constructor(public name: string, public alternatives: string[], public imageFn$: () => ZipDataProgress) {
  }

}

@Injectable({
  providedIn: 'root'
})
/**
 * State of the Quiz. Initializes set of quizitems and set a current quizitem for the app.
 */
export class QuizstateService {
  private items: QuizItem[];
  public currentItem: QuizItem;

  constructor(private service: ZipService) {
  }

  public newQuizItems(): Observable<QuizItem[]> {
    // Get all entries from zip file. Should be pictures where filename contains name of the person.
    return this.service.getZipEntries().pipe(take(1), map((zipObjects: Array<JSZipObject>) => {

      const zipObjectsCopy = [...zipObjects];
      const allNames: string[] = zipObjects.map(zipObject => zipObject.name);

      // Shuffle the zipObjects and convert them to QuizItems.
      const items: QuizItem[] = QuizHelper.shake(zipObjectsCopy).map(zipObject =>
        new QuizItem(zipObject.name, QuizHelper.getNamesToChooseFrom(zipObject.name, allNames),
          this.service.getFileDataFn(zipObject)));

      return items;
    }));
  }

  async setCurrentItem(): Promise<void> {
    if (!this.items || this.items.length === 0) {
      this.items = await this.newQuizItems().toPromise();
    }
    this.currentItem = this.items.pop();
  }

  public imageLocation$(): Observable<string> {
    return this.service.getImageLocationFromZipData(this.currentItem.imageFn$(), this.currentItem.name);
  }

}
