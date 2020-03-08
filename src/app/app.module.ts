import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FaceCardComponent } from './face-card/face-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FaceQuizComponent } from './face-quiz/face-quiz.component';
import { MatProgressSpinnerModule } from '@angular/material';
import JSZip from 'jszip';
import { ZIP_SERVICE } from './services/zip.service';


@NgModule({
  declarations: [
    AppComponent,
    FaceCardComponent,
    FaceQuizComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MatCardModule, MatRadioModule, HttpClientModule, ReactiveFormsModule,
    MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule
  ],
  providers: [{provide: ZIP_SERVICE, useValue: new JSZip()}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
