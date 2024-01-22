/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MetricosComponent } from './metricos.component';

describe('MetricosComponent', () => {
  let component: MetricosComponent;
  let fixture: ComponentFixture<MetricosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
