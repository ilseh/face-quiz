import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as JSZip from 'jszip';
import * as fs from 'file-system';
import { ZipService } from '../lib/zip/zip.service';
import { ZipEntryInterface } from '../lib/zip/zip-entry.interface';
// import { saveAs } from 'file-saver/FileSaver';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'face-quiz';

  inputZipControl = new FormControl('');
  inputZip: string;

  constructor(private zipService: ZipService) {

  }

  setZip() {
    this.inputZip = this.inputZipControl.value;

    this.zipService.getEntries(this.inputZip)
      .subscribe(zip => {
        console.log('>>>>>>>>>>>>>>>>.zip: ', zip);
      });
  }

  fileChanged(event) {
    const reader = new FileReader();
    // reader.onload = function() {
    //   alert(reader.result);
    // };

    const file = event.target.files[0];
    this.zipService.getEntries(file)
      .subscribe(zip => {
        console.log('>>>>>>>>>>>>>>>>.zip length: ', zip.length);
        zip.map((zipfile: ZipEntryInterface) => {
          console.log('filename: ', zipfile.filename);
          const task = this.zipService.getData(zipfile);
          console.log('task>>>>>>>>>>>>>', task);
          task.data.subscribe(data => {
            console.log('>>>>>>>>>>.data: ', data);
            reader.readAsText(data);
            // this.saveToFileSystem(zipfile.filename, data, 'image/png');
            const blob = new Blob([data], { type: 'image/png' });
            this.previewFile(blob);
          });
        });
      });
  }


  private saveToFileSystem(filename: string, content: any, type: string) {
    const blob = new Blob([content], { type: type });
    // saveAs(blob, filename);
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      console.log('load result: ', reader.result)
    });
    reader.readAsDataURL(blob);
  }

  private previewFile(file: Blob) {
    const preview = document.querySelector('img');
    const reader  = new FileReader();

    reader.addEventListener('load', function () {
      preview.src = reader.result;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }
}
