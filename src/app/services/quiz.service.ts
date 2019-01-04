import { Injectable } from '@angular/core';
// import {readdir}  from 'fs';
// import * as path from 'path';
// import { readFile } from 'fs';
import Config from '../../assets/input/input.json';
import * as _ from 'lodash';

export const QUIZ_INPUT_DIR = 'assets/input/';
export const QUIZ_NUMBER_OF_ALTERNATIVES = 2;

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor() { }

  /**
   * Get all names of faces in this quiz.
   */
  public getNames(): string[] {
    return Config.input;
  }

  /**
   * From all the possible names (of all faces in quiz), get random alternatives (number of alternative is
   * determined by QUIZ_NUMBER_OF_ALTERNATIVES) and the current (correct) name and randomize their order.
   * @param nameOfCurrentFace name of face that will be displayed (the correct answer)
   * @return QUIZ_NUMBER_OF_ALTERNATIVES + 1 names to be displayed to user to pick the correct name of the current face
   */
  public getNamesToChooseFrom(nameOfCurrentFace: string): string[] {
    const allNamesButCurrentFace = _.cloneDeep(this.getNames()).filter(name => name !== nameOfCurrentFace);
    const alternatives: string[] = [];
    // From all possible names, pick random names and remove that name form the possible names so
    // we can do not get duplicates.
    while (alternatives.length < QUIZ_NUMBER_OF_ALTERNATIVES) {
      alternatives.push(this.popRandom(allNamesButCurrentFace));
    }
    // Add the correct name to the list of alternatives and shake to make the order random.
    alternatives.push(nameOfCurrentFace);
    return this.shake(alternatives);
  }

  private shake(items: string[]): string[] {
    const copyOfItems = _.cloneDeep(items);
    const shaken = [];

    while (shaken.length < items.length) {
      shaken.push(this.popRandom(copyOfItems));
    }
    return shaken;
  }

  /**
   * Removes random item from items.
   * @param items to remove random item from - note that items is updated
   * @return random item
   */
  public popRandom(items: string[]): string {
    const randomIndex = this.getRandomIndex(items.length);
    return items.splice(randomIndex, 1)[0];
  }

  private getRandomIndex(numberOfItems) {
    return Math.floor(Math.random() * numberOfItems);
  }

  /**
   * Get url of image.
   * @param name of current face
   */
  public getImageLocation(name: string): string {
    return QUIZ_INPUT_DIR + name;
  }

  /**
   * Name of face is determined on basis of imagename. Parse it to decent format.
   * @param jpgName name of image
   */
  public makePrettyName(jpgName: string) {
    return jpgName.replace(/_/g, ' ').replace(/\..*/, '');
  }
}
