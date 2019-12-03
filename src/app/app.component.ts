import { Component } from '@angular/core';
import { FaceszipService } from './services/faceszip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'face-quiz';

  zipFile: Blob;

  constructor(private facesZipService: FaceszipService) {
  }

  fileChanged(event) {
    const zipFile = event.target.files[0];
    this.zipFile = zipFile;
    this.facesZipService.setZipFile(zipFile);
  }
}
