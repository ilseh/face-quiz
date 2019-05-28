// This is added globally by the zip.js library
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ZipEntryInterface } from './zip-entry.interface';
import { ZipTaskInterface } from './zip-task.interface';
import { ZipTaskProgressInterface } from './zip-task-progress.interface';

declare const zip: any;

@Injectable()
export class ZipService {

  constructor() {
    zip.workerScriptsPath = 'scripts/';
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

  getData(entry: ZipEntryInterface): ZipTaskInterface {
    const progress = new Subject<ZipTaskProgressInterface>();
    const data = new Observable<Blob>(subscriber => {
      const writer = new zip.BlobWriter();

      // Using `as any` because we don't want to expose this
      // method in the interface
      (entry as any).getData(writer, blob => {
        subscriber.next(blob);
        subscriber.complete();
        progress.next(null);
      }, (current, total) => {
        progress.next({ active: true, current, total });
      });
    });
    return { progress, data };
  }
}
