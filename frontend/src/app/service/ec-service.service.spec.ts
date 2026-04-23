import { TestBed } from '@angular/core/testing';

import { EcServiceService } from './ec-service.service';

describe('EcServiceService', () => {
  let service: EcServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
