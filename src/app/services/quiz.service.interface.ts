export interface QuizServiceInterface {
  /**
   * Get all names of faces in this quiz.
   */
  getNames(): string[];

  /**
   * From all the possible names (of all faces in quiz), get random alternatives (number of alternative is
   * determined by QUIZ_NUMBER_OF_ALTERNATIVES) and the current (correct) name and randomize their order.
   * @param nameOfCurrentFace name of face that will be displayed (the correct answer)
   * @return QUIZ_NUMBER_OF_ALTERNATIVES + 1 names to be displayed to user to pick the correct name of the current face
   */
  getNamesToChooseFrom(nameOfCurrentFace: string): string[];

  shake(items: string[]): string[];

  /**
   * Removes random item from items.
   * @param items to remove random item from - note that items is updated
   * @return random item
   */
  popRandom(items: string[]): string;

  getRandomIndex(numberOfItems): number;

  /**
   * Get url of image.
   * @param name of current face
   */
  getImageLocation(name: string): string;

  /**
   * Name of face is determined on basis of imagename. Parse it to decent format.
   * @param jpgName name of image
   */
  makePrettyName(jpgName: string): string;
}
