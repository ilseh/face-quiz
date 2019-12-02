// This is added globally by the zip.js library
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import JSZip, { JSZipObject } from 'jszip';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';

declare const zip: any;

export interface ZipDataProgress {
  progress: Subject<number>;
  data: Subject<BlobPart>;
}

@Injectable()
export class ZipService {
  private ziptest = new JSZip();

  constructor() {
    // zip.workerScriptsPath = 'scripts/';

  }

  getEntries(file): Observable<Array<ZipEntryInterface>> {
    return new Observable(subscriber => {
      const reader = new zip.BlobReader(file);
      zip.createReader(reader, zipReader => {
        zipReader.getEntries(entries => {
          subscriber.next(entries);
          subscriber.complete();
        });
      }, message => {
        subscriber.error({ message });
      });
    });
  }

  getEntries(fileName): Observable<Array<JSZipObject>> {
    return fromPromise(this.ziptest.loadAsync(fileName)).pipe(map((jsZip: JSZip) => {
      const files: Array<JSZipObject> = [];

      // tslint:disable-next-line:forin
      for (fileName in jsZip.files) {
        files.push(jsZip.files[fileName]);
      }
      return files;
    }));
  }

  getData(entry: JSZipObject): ZipDataProgress {
    const progress$ = new Subject<number>();
    const data$ = new Subject<BlobPart>();
    entry.async('blob', function updateCallback(metadata) {
      console.log('progression: ' + metadata.percent.toFixed(2) + ' %');
      progress$.next((metadata.percent));
    }).then(function (blob) {
      console.log('data received');
      data$.next(blob);
    });
    return { progress: progress$, data: data$ };
  }
}
