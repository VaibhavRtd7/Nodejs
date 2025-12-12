import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exam } from './exam';

describe('Exam', () => {
  let component: Exam;
  let fixture: ComponentFixture<Exam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
