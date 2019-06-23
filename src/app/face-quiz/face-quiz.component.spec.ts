import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceQuizComponent } from './face-quiz.component';

xdescribe('FaceQuizComponent', () => {
  let component: FaceQuizComponent;
  let fixture: ComponentFixture<FaceQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
