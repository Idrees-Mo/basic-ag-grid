import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicGrid } from './basic-grid';

describe('BasicGrid', () => {
  let component: BasicGrid;
  let fixture: ComponentFixture<BasicGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
