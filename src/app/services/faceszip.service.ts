import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ZipEntryInterface } from '../../lib/zip/zip-entry.interface';
import { ZipService } from '../../lib/zip/zip.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { QuizServiceInterface } from './quiz.service.interface';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { reduce, switchMap } from 'rxjs/operators';

const IMG_EXTENSIONS = ['png', 'jpeg', 'jpg', 'gif'];

@Injectable({
  providedIn: 'root'
})
export class FaceszipService implements QuizServiceInterface, OnDestroy {
  private zipFile: Blob;

  public setZipFile(file: Blob) {
    this.zipFile = file;
  }

  constructor(private zipService: ZipService) {
  }

  public getNames(): Observable<Array<string>> {
    const names = new Array<string>();
    return this.zipService.getEntries(this.zipFile).pipe(
      reduce<Array<ZipEntryInterface>, Array<string>>((fileNames: Array<string>, zipEntries: Array<ZipEntryInterface>) => {
        const matchedFilenames: Array<string> = zipEntries.map(zipEntry => zipEntry.filename);
        fileNames.push(... matchedFilenames);
        return fileNames;
        // console.log('>>>>>>>>zip length: ', zipEntries.length);
        // zip.map((zipEntry: ZipEntryInterface) => {
        //   names.push( zipEntry.filename);
        // });
      }, []));
  }

  ////////////////////////////////
  private isImage(extension: string) {
    return IMG_EXTENSIONS.includes(extension.toLowerCase());
  }

  private getExtension(filename: string) {
    const match = filename.match(/.+?\.(.*)/);
    console.log('>>>>>.match ', match);
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
    return this.zipService.getEntries(this.zipFile).pipe(
      // I'm only interested in the zipentry that has specified name.
      reduce<Array<ZipEntryInterface>>((matchedEntries, entries) => {
        matchedEntries.push(...entries.filter(entry => entry.filename === name));
        return matchedEntries;
      }, []),
    switchMap((filteredEntriest: ZipEntryInterface[]) => this.getImageFromZip(filteredEntriest[0])));
  }

  private getImageFromZip(zipEntry: ZipEntryInterface): Observable<string> {
    this.getFileType(zipEntry.filename);
    console.log('>>>>>zipfile: ', zipEntry);
    const task = this.zipService.getData(zipEntry);
    console.log('task>>>>>>>>>>>>>', task);
    return task.data.pipe(switchMap(data => {
      console.log('>>>>>>>>>>.data: ', data);
      // reader.readAsText(data);
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

  private previewFile(file: Blob) {
    const preview = document.querySelector('img');
    const reader = new FileReader();

    reader.addEventListener('load', function () {
      preview.src = reader.result as string;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  ngOnDestroy(): void {
  }
}
