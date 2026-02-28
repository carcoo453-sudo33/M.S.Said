import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationCategoryList } from './education-category-list';

describe('EducationCategoryList', () => {
  let component: EducationCategoryList;
  let fixture: ComponentFixture<EducationCategoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationCategoryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationCategoryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
