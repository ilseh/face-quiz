import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { ZipService } from './zip.service';
import JSZip from 'jszip';

describe('ZipService', () => {
  let spectator: SpectatorService<ZipService>;
  let service: ZipService;
  let zipServiceMock: SpyObject<JSZip>;

  const zipObjects = [
    {
      name: 'file1.txt'
    },
    {
      name: 'file2.txt'
    },
  ];

  const createService = createServiceFactory({
    service: ZipService,
    mocks: [JSZip]
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    zipServiceMock = spectator.get(JSZip);
  });

  it('should be initialize', () => {
    expect(service).toBeTruthy();
  });

});
