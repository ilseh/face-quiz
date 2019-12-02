import { Injectable } from '@angular/core';
import { ZipDataProgress, ZipService } from '../../lib/zip/zip.service';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { JSZipObject } from 'jszip';

const IMG_EXTENSIONS = ['png', 'jpeg', 'jpg', 'gif'];

@Injectable({
  providedIn: 'root'
})
export class FaceszipService {
  private zipFile: Blob;

  public setZipFile(file: Blob) {
    this.zipFile = file;
  }

  constructor(private zipService: ZipService) {
  }

  public getZipEntries(): Observable<Array<JSZipObject>> {
    return this.zipService.getEntries(this.zipFile);
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

    let type = 'plain/text';
    if (this.isImage(extension)) {
      type = 'image/' + extension;
    }
    return type;
  }

  public getImageFromZip(zipEntry: JSZipObject): Observable<string> {
    const task: ZipDataProgress = this.zipService.getData(zipEntry);
    return task.data.pipe(switchMap((data: BlobPart) => {
      if (data) {
        const blob = new Blob([data], { type: this.getFileType(zipEntry.name) });
        return this.getImageSrc(blob);
      }
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
