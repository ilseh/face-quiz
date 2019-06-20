import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as JSZip from 'jszip';
import * as fs from 'file-system';
import { ZipService } from '../lib/zip/zip.service';
import { ZipEntryInterface } from '../lib/zip/zip-entry.interface';
// import { saveAs } from 'file-saver/FileSaver';
import { saveAs } from 'file-saver';
import { FaceszipService } from './services/faceszip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'face-quiz';

  inputZipControl = new FormControl('');
  inputZip: string;

  constructor(private facesZipService: FaceszipService, private test: FaceszipService) {

  }


  fileChanged(event) {
    const reader = new FileReader();
    // reader.onload = function() {
    //   alert(reader.result);
    // };

    const file = event.target.files[0];
    this.facesZipService.setZipFile(file);

    this.test.getZipEntriesNames(file).subscribe(
      name => console.log('>>>>>>>>>> entry names test: ', name)
    );

  }
}
