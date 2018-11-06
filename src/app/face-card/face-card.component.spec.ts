import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceCardComponent } from './face-card.component';
import { MatButtonModule, MatCardModule, MatDialogModule, MatRadioModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FaceCardComponent', () => {
  let component: FaceCardComponent;
  let fixture: ComponentFixture<FaceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FaceCardComponent
      ],
      imports: [
        BrowserModule, BrowserAnimationsModule, MatCardModule, MatRadioModule, ReactiveFormsModule,
        MatDialogModule, MatButtonModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
