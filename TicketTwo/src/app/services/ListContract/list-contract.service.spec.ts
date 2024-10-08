import { TestBed } from '@angular/core/testing';

import { ListContractService } from './list-contract.service';

describe('ListContractService', () => {
  let service: ListContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
