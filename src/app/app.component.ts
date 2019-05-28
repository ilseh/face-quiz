import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as JSZip from 'jszip';
import * as fs from 'file-system';
import { ZipService } from '../lib/zip/zip.service';

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
    reader.onload = function() {
      alert(reader.result);
    }

    const file = event.target.files[0];
    this.zipService.getEntries(file)
      .subscribe(zip => {
        console.log('>>>>>>>>>>>>>>>>.zip: ', zip);
        zip.map(zipfile => {
          const task = this.zipService.getData(zipfile);
          console.log('task>>>>>>>>>>>>>', task);
          task.data.subscribe(data => {
            console.log('>>>>>>>>>>.data: ', data);
            reader.readAsText(data);
          });
        });
      });
  }

}
