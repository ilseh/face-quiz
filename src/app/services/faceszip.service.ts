import { Injectable } from '@angular/core';
import { ZipEntryInterface } from '../../lib/zip/zip-entry.interface';
import { ZipService } from '../../lib/zip/zip.service';
import { QuizServiceInterface } from './quiz.service.interface';
import { Observable, Subject } from 'rxjs';
import { reduce, switchMap } from 'rxjs/operators';

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

  private getZipEntries(): Observable<Array<ZipEntryInterface>> {
    return this.zipService.getEntries(this.zipFile);
  }

  public getNames(): Observable<Array<string>> {
    return this.getZipEntries().pipe(
      reduce<Array<ZipEntryInterface>, Array<string>>((fileNames: Array<string>, zipEntries: Array<ZipEntryInterface>) => {
        fileNames.push(...zipEntries.map(zipEntry => zipEntry.filename));
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
      reduce<Array<ZipEntryInterface>>((matchedEntries, entries) => {
        matchedEntries.push(...entries.filter(entry => this.hasEntryFilename(entry, name)));
        return matchedEntries;
      }, []),
      switchMap((filteredEntries: ZipEntryInterface[]) => {
        // I expect from the reduce filter to have only one hit.
        if (filteredEntries.length !== 1) {
          console.warn('Didn\'t find 1 match for filename', name, `had ${filteredEntries.length} matches.`);
        }
        // TODO: Return default image if none found.
        return this.getImageFromZip(filteredEntries[0]);
      }));
  }

  private hasEntryFilename(entry: ZipEntryInterface, filename: string) {
    return entry.filename === filename;
  }

  private getImageFromZip(zipEntry: ZipEntryInterface): Observable<string> {
    this.getFileType(zipEntry.filename);
    const task = this.zipService.getData(zipEntry);
    return task.data.pipe(switchMap(data => {
      const blob = new Blob([data], { type: this.getFileType(zipEntry.filename) });
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
