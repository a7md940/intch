import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpErrorViewerComponent } from './http-error-viewer.component';

describe('HttpErrorViewerComponent', () => {
  let component: HttpErrorViewerComponent;
  let fixture: ComponentFixture<HttpErrorViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpErrorViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpErrorViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
