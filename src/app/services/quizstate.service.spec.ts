import { TestBed } from '@angular/core/testing';

import { QuizstateService } from './quizstate.service';

xdescribe('QuizstateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuizstateService = TestBed.get(QuizstateService);
    expect(service).toBeTruthy();
  });
});
