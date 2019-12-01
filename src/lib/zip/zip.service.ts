// This is added globally by the zip.js library
import { Injectable } from '@angular/core';
import { from, Observable, of, Subject } from 'rxjs';
import { ZipEntryInterface } from './zip-entry.interface';
import { ZipTaskInterface } from './zip-task.interface';
import { ZipTaskProgressInterface } from './zip-task-progress.interface';

import JSZip, { JSZipObject } from 'jszip';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';

declare const zip: any;

@Injectable()
export class ZipService {
  private ziptest = new JSZip();

  constructor() {
    // zip.workerScriptsPath = 'scripts/';

  }

  getEntries(fileName): Observable<Array<JSZipObject>> {
    // return new Observable(subscriber => {
    //   const reader = new zip.BlobReader(file);
    //   zip.createReader(reader, zipReader => {
    //     zipReader.getEntries(entries => {
    //       subscriber.next(entries);
    //       subscriber.complete();
    //     });
    //   }, message => {
    //     subscriber.error({ message });
    //   });
    // });
    return fromPromise(this.ziptest.loadAsync(fileName)).pipe(map((jsZip: JSZip) => {
      const files: Array<JSZipObject> = [];

      // tslint:disable-next-line:forin
      for (fileName in jsZip.files) {
        files.push(jsZip.files[fileName]);
      }
      return files;
    }));
    // const files: Array<JSZipObject> = [];
    //
    // // tslint:disable-next-line:forin
    // for (fileName in zipFile.files) {
    //   files.push(zipFile.files[fileName]);
    // }
    // console.log('>>>filesNames: ', files);
    // return new Promise(() => files);
  }

  getData(entry: JSZipObject): {progress, data} {
    const progress$ = new Subject();
    const data$ = new Subject<BlobPart>();
    entry.async('blob', function updateCallback(metadata) {
      console.log('progression: ' + metadata.percent.toFixed(2) + ' %');
      if (metadata.percent < 100) {
        progress$.next((metadata.percent));
      } else {
        progress$.next(null);
        data$.next(null);
      }
    }).then(function (blob) {
      data$.next(blob);
    });
    return {progress: progress$, data: data$};
    // const progress = new Subject<ZipTaskProgressInterface>();
    // const data = new Observable<Blob>(subscriber => {
    //   const writer = new zip.BlobWriter();
    //
    //   // Using `as any` because we don't want to expose this
    //   // method in the interface
    //   (entry as any).getData(writer, blob => {
    //     subscriber.next(blob);
    //     subscriber.complete();
    //     progress.next(null);
    //   }, (current, total) => {
    //     progress.next({ active: true, current, total });
    //   });
    // });
    // return { progress, data };
  }
}
