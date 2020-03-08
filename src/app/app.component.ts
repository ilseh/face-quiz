import { Component } from '@angular/core';
import { ZipService } from './services/zip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'face-quiz';

  constructor(private facesZipService: ZipService) {
  }

  get zipFile(): Blob {
    return this.facesZipService.getZipFile();
  }

  fileChanged(event) {
    const zipFile = event.target.files[0];
    this.facesZipService.setZipFile(zipFile);
  }
}
