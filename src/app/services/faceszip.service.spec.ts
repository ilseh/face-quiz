import { TestBed } from '@angular/core/testing';

import { FaceszipService } from './faceszip.service';

describe('FaceszipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FaceszipService = TestBed.get(FaceszipService);
    expect(service).toBeTruthy();
  });
});
