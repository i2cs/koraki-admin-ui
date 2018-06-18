import { TestBed, inject } from '@angular/core/testing';

import { MemoryDataHolderServiceService } from './memory-data-holder-service.service';

describe('MemoryDataHolderServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemoryDataHolderServiceService]
    });
  });

  it('should be created', inject([MemoryDataHolderServiceService], (service: MemoryDataHolderServiceService) => {
    expect(service).toBeTruthy();
  }));
});
