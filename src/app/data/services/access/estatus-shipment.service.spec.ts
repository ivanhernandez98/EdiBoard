import { TestBed } from '@angular/core/testing';

import { EstatusShipmentService } from './estatus-shipment.service';

describe('EstatusShipmentService', () => {
  let service: EstatusShipmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstatusShipmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
