import { Injectable, OnDestroy } from '@angular/core';
import { ZipEntryInterface } from '../../lib/zip/zip-entry.interface';
import { ZipService } from '../../lib/zip/zip.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

const IMG_EXTENSIONS = ['png', 'jpeg', 'jpg', 'gif'];

@Injectable({
  providedIn: 'root'
})
export class FaceszipService implements OnDestroy {


  constructor(private zipService: ZipService) {
  }

  public isImage(extension: string) {
    return IMG_EXTENSIONS.includes(extension.toLowerCase());
  }

  public getExtension(filename: string) {
    const match = filename.match(/.+?\.(.*)/);
    console.log('>>>>>.match ', match);
    return match.length === 2 ? match[1].toLowerCase() : '';
  }

  public getFileType(filename: string) {
    const extension = this.getExtension(filename);

    let type  = 'plain/text';
    if (this.isImage(extension)) {
      type = 'image/' + extension;
    }
    return type;
  }

  public setZipFile(file: Blob) {

    this.zipService.getEntries(file).pipe(untilDestroyed(this))
      .subscribe(zip => {
        console.log('>>>>>>>>zip length: ', zip.length);
        zip.map((zipEntry: ZipEntryInterface) => {
          this.getFileType(zipEntry.filename);
          console.log('>>>>>zipfile: ', zipEntry);
          const task = this.zipService.getData(zipEntry);
          console.log('task>>>>>>>>>>>>>', task);
          task.data.pipe(untilDestroyed(this)).subscribe(data => {
            console.log('>>>>>>>>>>.data: ', data);
            // reader.readAsText(data);
            const blob = new Blob([data], { type: this.getFileType(zipEntry.filename) });
            this.previewFile(blob);
          });
        });
      });

  }

  private previewFile(file: Blob) {
    const preview = document.querySelector('img');
    const reader  = new FileReader();

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
