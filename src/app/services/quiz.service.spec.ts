import { QuizService } from './quiz.service';
import * as _ from 'lodash';
import { QUIZ_NUMBER_OF_ALTERNATIVES, QuizHelper } from './quiz-helper';

xdescribe('QuizService', () => {
  let service: QuizService;
  const CORRECT_NAME = 'test';
  const ALL_NAMES = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'];

  beforeEach(() => {

    service = new QuizService();

    spyOn(service, 'getNames').and.returnValue(ALL_NAMES);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNamesToChooseFrom', () => {

    function expectRandomSetWithCorrectName(result: string[]) {
      expect(result.length).toBe(QUIZ_NUMBER_OF_ALTERNATIVES + 1);
      expect(result).toContain(CORRECT_NAME);

      const distinctArrayValuesFilter = (value: string, index: number, values: string[]) => values.indexOf(value) === index;
      expect(result.length).toBe(result.filter(distinctArrayValuesFilter).length);
    }


    it('should get the name we specify and other random names and contains unique values in random order', () => {

      const result = QuizHelper.getNamesToChooseFrom(CORRECT_NAME, ALL_NAMES);
      expectRandomSetWithCorrectName(result);
    });

    it('should return different random values on multiple calls', () => {
      // If we call 10 times, expect at least 6 different sets. It's random so sets can also be equal.

      const results = [];
      for (let i = 0; i < 10; i++) {
        const result = QuizHelper.getNamesToChooseFrom(CORRECT_NAME, ALL_NAMES);
        expectRandomSetWithCorrectName(result);
        results.push(result);
      }

      const numberOfDuplicateResultSets = getNumberOfDuplicateArrays(results);

      expect(numberOfDuplicateResultSets).toBeLessThan(4);

    });
  });
});


function getNumberOfDuplicateArrays(array: string[][]): number {
  // Ie: [['a', 'b'], ['a', 'b']] will result in numberOfDuplicateResultSets of 2
  let numberOfDuplicateResultSets = 0;
  array.forEach(result => {
    if (array.filter(entry => _.isEqual(entry, result)).length > 1) {
      numberOfDuplicateResultSets++;
    }
  });
  return numberOfDuplicateResultSets;
}

describe('getNumberOfDuplicateArrays test helper', () => {
  it('should return 0 if no sets are equal', () => {
    const test = [['sdfsdf', 'werwer'], ['werwer', 'erer'], ['erer', 'werwer']];
    expect(getNumberOfDuplicateArrays(test)).toBe(0);
  });

  it('should return 0 if no sets are equal but their entries have same values (in different order)', () => {
    const test = [['sdfsdf', 'werwer'], ['werwer', 'sdfsdf'], ['erer', 'werwer']];
    expect(getNumberOfDuplicateArrays(test)).toBe(0);
  });

  it('should return 2 if two sets are equal', () => {
    const test = [['sdfsdf', 'werwer'], ['sdfsdf', 'werwer'], ['erer', 'werwer']];
    expect(getNumberOfDuplicateArrays(test)).toBe(2);
  });

  it('should return 3 if three sets are equal', () => {
    const test = [['sdfsdf', 'werwer'], ['sdfsdf', 'werwer'], ['sdfsdf', 'werwer']];
    expect(getNumberOfDuplicateArrays(test)).toBe(3);
  });

});

