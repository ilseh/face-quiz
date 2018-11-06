import { Injectable } from '@angular/core';
// import {readdir}  from 'fs';
// import * as path from 'path';
// import { readFile } from 'fs';
import Config from '../../assets/input/input.json';

export const QUIZ_INPUT_DIR = 'assets/input/';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor() { }

  public getNames(): string[] {
    return Config.input;
  }

  public getImageLocation(name: string): string {
    return QUIZ_INPUT_DIR + name;
  }

  public makePrettyName(jpgName: string) {
    return jpgName.replace(/_/g, ' ').replace(/\..*/, '');
  }
}
