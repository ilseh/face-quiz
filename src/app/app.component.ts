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
  testImage = '';

  zipFile: Blob;

  inputZipControl = new FormControl('');
  inputZip: string;

  constructor(private facesZipService: FaceszipService, private test: FaceszipService) {

  }


  fileChanged(event) {
    const test = event.target.files[0];
    this.zipFile = test;
    this.facesZipService.setZipFile(test);

    this.facesZipService.getImageLocation('Fernando_Alonso.jpg')
      .subscribe(imageLocation => this.testImage = imageLocation);

  }
}
