import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { FaceszipService } from './faceszip.service';
import { ZipService } from '../../lib/zip/zip.service';
import { JSZipObject } from 'jszip';
import { of } from 'rxjs';

describe('FacezipService', () => {
  let spectator: SpectatorService<FaceszipService>;
  let service: FaceszipService;
  let zipServiceMock: SpyObject<ZipService>;

  const zipObjects = [
    {
      name: 'file1.txt'
    },
    {
      name: 'file2.txt'
    },
  ];

  const createService = createServiceFactory({
    service: FaceszipService,
    mocks: [ZipService]
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    zipServiceMock = spectator.get(ZipService);
  });

  describe('getNames', () => {
    it('should get names', () => {
      zipServiceMock.getEntries.and.returnValue(of(zipObjects));
      const names$ = service.getNames();
      names$.subscribe(names => expect(names)
        .toEqual(['file1.txt', 'file2.txt']));
    });
  });
});
