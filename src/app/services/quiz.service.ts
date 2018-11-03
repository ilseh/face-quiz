import { Injectable } from '@angular/core';
// import {readdir}  from 'fs';
// import * as path from 'path';
// import { readFile } from 'fs';
import { HttpClient } from '@angular/common/http';
import Config from '../../assets/input/input.json';

export const QUIZ_INPUT_DIR = 'assets/input/';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private httpClient: HttpClient) { }

  public getNames(): string[] {
    console.log('>>>>>>>>>>>>>>>>', Config.input, Config.input.length);

    return Config.input;

  }

  public getImageLocation(name: string): string {
    return QUIZ_INPUT_DIR + name;
  }
}
