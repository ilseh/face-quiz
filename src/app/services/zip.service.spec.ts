import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { ZIP_SERVICE, ZipService } from './zip.service';
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
    providers: [{provide: ZIP_SERVICE, useValue: mockProvider(JSZip)}]
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    zipServiceMock = spectator.get(ZIP_SERVICE);
  });

  it('should be initialize', () => {
    expect(service).toBeTruthy();
  });

});
