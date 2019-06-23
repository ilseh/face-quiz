import { Observable } from 'rxjs';

export interface QuizServiceInterface {
  /**
   * Get all names of faces in this quiz.
   */
  getNames(): Observable<string[]>;


  /**
   * Get url of image.
   * @param name of current face
   */
  getImageLocation(name: string): Observable<string>;

}
