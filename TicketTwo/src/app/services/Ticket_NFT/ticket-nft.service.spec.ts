import { TestBed } from '@angular/core/testing';
import { TicketNFTService } from './ticket-nft.service';


describe('TicketNFTService', () => {
  let service: TicketNFTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketNFTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
