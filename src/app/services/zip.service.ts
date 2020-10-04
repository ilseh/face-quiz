import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import JSZip, { JSZipObject } from 'jszip';
import { fromPromise } from 'rxjs/internal-compatibility';

const IMG_EXTENSIONS = ['png', 'jpeg', 'jpg', 'gif'];
const TYPE_PLAIN_TEXT = 'plain/text';
const TYPE_OF_IMAGE = 'image/';

export const ZIP_SERVICE = new InjectionToken<JSZip>('ZIP_SERVICE');

export interface ZipDataProgress {
  progress: Subject<number>;
  data: Subject<BlobPart>;
}

@Injectable({
  providedIn: 'root'
})
/**
 * Service for handling zipfile. Fetches the entries and can extract file from zip.
 */
export class ZipService {
  private zipFile: Blob;

  constructor(@Inject(ZIP_SERVICE) private jsZip: JSZip) {
  }

  public setZipFile(file: Blob) {
    this.zipFile = file;
  }

  public getZipFile(): Blob {
    return this.zipFile;
  }

  public getZipEntries(): Observable<Array<JSZipObject>> {
    return fromPromise(this.jsZip.loadAsync(this.zipFile)).pipe(map((jsZip: JSZip) => {
      const files: Array<JSZipObject> = [];

      // tslint:disable-next-line:forin
      for (const fileName in jsZip.files) {
        files.push(jsZip.files[fileName]);
      }
      return files;
    }));
  }

  private isImage(extension: string) {
    return IMG_EXTENSIONS.includes(extension.toLowerCase());
  }

  private getExtension(filename: string) {
    const match = filename.match(/.+?\.(.*)/);
    return match.length === 2 ? match[1].toLowerCase() : '';
  }

  private getFileType(filename: string): string {
    const extension = this.getExtension(filename);

    let type = TYPE_PLAIN_TEXT;
    if (this.isImage(extension)) {
      type = TYPE_OF_IMAGE + extension;
    }
    return type;
  }

  /**
   * Returns a function to be used to extract file content from zip on basis of entry in zip.
   * @param entry in the zip file
   */
  getFileDataFn(entry: JSZipObject): () => ZipDataProgress {
    return (): ZipDataProgress => {
      const progress$ = new Subject<number>();
      const data$ = new Subject<BlobPart>();
      entry.async('blob', (metadata) => {
        console.log('progression: ' + metadata.percent.toFixed(2) + ' %');
        progress$.next(metadata.percent);
      }).then((blob) => {
        console.log('data received');
        data$.next(blob);
      });
      return { progress: progress$, data: data$ };
    };
  }

  public getImageLocationFromZipData(task: ZipDataProgress, filename: string): Observable<string> {
    return task.data.pipe(switchMap((data: BlobPart) => {
      if (data) {
        const blob = new Blob([data], { type: this.getFileType(filename) });
        return this.getImageSrc(blob);
      }
    }));
  }

  private getImageSrc(file: Blob): Observable<string> {
    const reader = new FileReader();
    const src = new Subject<string>();

    reader.addEventListener('load', () => {
      src.next(reader.result as string);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
    return src.asObservable();
  }

}
