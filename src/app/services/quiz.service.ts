import { Injectable } from '@angular/core';
// import {readdir}  from 'fs';
// import * as path from 'path';
// import { readFile } from 'fs';
import Config from '../../assets/input/input.json';
import { QuizServiceInterface } from './quiz.service.interface';
import { Observable, of } from 'rxjs';

export const QUIZ_INPUT_DIR = 'assets/input/';


@Injectable({
  providedIn: 'root'
})
export class QuizService implements QuizServiceInterface {

  constructor() { }

  /**
   * Get all names of faces in this quiz.
   */
  getNames(): Observable<string[]> {
    return of(Config.input);
  }


  /**
   * Get url of image.
   * @param name of current face
   */
  getImageLocation(name: string): Observable<string> {
    return of(QUIZ_INPUT_DIR + name);
  }


}
