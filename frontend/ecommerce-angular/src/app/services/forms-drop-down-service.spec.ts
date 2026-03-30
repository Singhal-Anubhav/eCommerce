import { TestBed } from '@angular/core/testing';

import { FormsDropDownService } from './forms-drop-down-service';

describe('FormsDropDownService', () => {
  let service: FormsDropDownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsDropDownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
