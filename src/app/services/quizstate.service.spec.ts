import { QuizstateService } from './quizstate.service';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { ZipService } from './zip.service';
import { of } from 'rxjs';
import { QUIZ_NUMBER_OF_ALTERNATIVES } from './quiz.helper';

describe('QuizstateService', () => {
  let spectator: SpectatorService<QuizstateService>;
  let service: QuizstateService;
  let facezipServiceMock: SpyObject<ZipService>;
  const NAMES = ['image1.png', 'image2.png', 'image3.png', 'image4.png'];

  const createService = createServiceFactory({
    service: QuizstateService,
    mocks: [ZipService]
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    facezipServiceMock = spectator.get(ZipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // describe('newQuizItems', () => {
  //   it('should return quiz items', async () => {
  //     facezipServiceMock.getNames.and.returnValue(of(NAMES));
  //     const result = await service.newQuizItems().toPromise() ;
  //     expect(result.length).toBe(4);
  //     // alternative names + name of the current item
  //     result.forEach(item => expect(item.alternatives.length).toBe(QUIZ_NUMBER_OF_ALTERNATIVES + 1));
  //   });
  // });
});
