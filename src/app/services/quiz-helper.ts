import * as _ from 'lodash';

export const QUIZ_NUMBER_OF_ALTERNATIVES = 2;
export class QuizHelper {

  public static shake(items: string[]): string[] {
    const copyOfItems = _.cloneDeep(items);
    const shaken = [];

    while (shaken.length < items.length) {
      shaken.push(QuizHelper.popRandom(copyOfItems));
    }
    return shaken;
  }

  /**
   * Removes random item from items.
   * @param items to remove random item from - note that items is mutated
   * @return random item
   */
  public static popRandom<T>(items: T[]): T {
    const randomIndex = QuizHelper.getRandomIndex(items.length);
    return items.splice(randomIndex, 1)[0];
  }

  public static getRandomIndex(numberOfItems) {
    return Math.floor(Math.random() * numberOfItems);
  }

  /**
   * Name of face is determined on basis of imagename. Parse it to decent format.
   * @param jpgName name of image
   */
  public static makePrettyName(jpgName: string) {
    return jpgName.replace(/_/g, ' ').replace(/\..*/, '');
  }

  /**
   * From all the possible names (of all faces in quiz), get random alternatives (number of alternative is
   * determined by QUIZ_NUMBER_OF_ALTERNATIVES) and the current (correct) name and randomize their order.
   * @param nameOfCurrentFace name of face that will be displayed (the correct answer)
   * @return QUIZ_NUMBER_OF_ALTERNATIVES + 1 names to be displayed to user to pick the correct name of the current face
   */
  public static getNamesToChooseFrom(nameOfCurrentFace: string, allNames: string[]): string[] {
    const allNamesButCurrentFace = _.cloneDeep(allNames).filter(name => name !== nameOfCurrentFace);
    const alternatives: string[] = [];
    // From all possible names, pick random name and remove that name from the possible names so
    // we can do not get duplicates.
    while (alternatives.length < QUIZ_NUMBER_OF_ALTERNATIVES) {
      alternatives.push(QuizHelper.popRandom(allNamesButCurrentFace));
    }
    // Add the correct name to the list of alternatives and shake to make the order random.
    alternatives.push(nameOfCurrentFace);
    return QuizHelper.shake(alternatives);
  }
}
