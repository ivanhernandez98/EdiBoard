import { TestBed } from '@angular/core/testing';

import { ApiPosicionViajesServicesService } from './api-posicion-viajes.service';

describe('ApiPosicionViajesServicesService', () => {
  let service: ApiPosicionViajesServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPosicionViajesServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
