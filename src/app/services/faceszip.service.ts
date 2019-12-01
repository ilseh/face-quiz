import { Injectable } from '@angular/core';
import { ZipService } from '../../lib/zip/zip.service';
import { QuizServiceInterface } from './quiz.service.interface';
import { Observable, Subject } from 'rxjs';
import { reduce, switchMap } from 'rxjs/operators';
import { JSZipObject } from 'jszip';

const IMG_EXTENSIONS = ['png', 'jpeg', 'jpg', 'gif'];

@Injectable({
  providedIn: 'root'
})
export class FaceszipService implements QuizServiceInterface {
  private zipFile: Blob;

  public setZipFile(file: Blob) {
    this.zipFile = file;
  }

  constructor(private zipService: ZipService) {
  }

  private getZipEntries(): Observable<Array<JSZipObject>> {
    return this.zipService.getEntries(this.zipFile);
  }

  public getNames(): Observable<Array<string>> {
    return this.getZipEntries().pipe(
      reduce<Array<JSZipObject>, Array<string>>((fileNames: Array<string>, zipEntries: Array<JSZipObject>) => {
        fileNames.push(...zipEntries.map(zipEntry => zipEntry.name));
        return fileNames;
      }, []));
  }

  private isImage(extension: string) {
    return IMG_EXTENSIONS.includes(extension.toLowerCase());
  }

  private getExtension(filename: string) {
    const match = filename.match(/.+?\.(.*)/);
    return match.length === 2 ? match[1].toLowerCase() : '';
  }

  private getFileType(filename: string) {
    const extension = this.getExtension(filename);

    let type = 'plain/text';
    if (this.isImage(extension)) {
      type = 'image/' + extension;
    }
    return type;
  }

  public getImageLocation(name: string): Observable<string> {
    return this.getZipEntries().pipe(
      reduce((matchedEntries, entries) => {
        matchedEntries.push(...entries.filter(entry => this.isEntryName(entry, name)));
        return matchedEntries;
      }, []),
      switchMap((filteredEntries) => {
        // I expect from the reduce filter to have only one hit.
        if (filteredEntries.length !== 1) {
          console.warn('Didn\'t find 1 match for filename', name, `had ${filteredEntries.length} matches.`);
        }
        return this.getImageFromZip(filteredEntries[0]);
      }));
  }

  private isEntryName(entry: JSZipObject, filename: string) {
    return entry.name === filename;
  }

  private getImageFromZip(zipEntry: JSZipObject): Observable<string> {
    this.getFileType(zipEntry.name);
    const task = this.zipService.getData(zipEntry);
    return task.data.pipe(switchMap((data: BlobPart) => {
      const blob = new Blob([data], { type: this.getFileType(zipEntry.name) });
      return this.getImageSrc(blob);
    }));
  }

  private getImageSrc(file: Blob): Observable<string> {
    const reader = new FileReader();
    const src = new Subject<string>();

    reader.addEventListener('load', function () {
      src.next(reader.result as string);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
    return src.asObservable();
  }

}
