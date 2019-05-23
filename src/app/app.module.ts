import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FaceCardComponent } from './face-card/face-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInput,
  MatInputModule,
  MatRadioModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FaceQuizComponent } from './face-quiz/face-quiz.component';

@NgModule({
  declarations: [
    AppComponent,
    FaceCardComponent,
    FaceQuizComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MatCardModule, MatRadioModule, HttpClientModule, ReactiveFormsModule,
    MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
