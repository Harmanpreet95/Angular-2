import { TestBed, inject } from '@angular/core/testing';

import { MerchantLinkService } from './merchant-link.service';

describe('MerchantLinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MerchantLinkService]
    });
  });

  it('should be created', inject([MerchantLinkService], (service: MerchantLinkService) => {
    expect(service).toBeTruthy();
  }));
});
