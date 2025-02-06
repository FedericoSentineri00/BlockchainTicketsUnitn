import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { ConnectionService } from '../Connection/connection.service';


const contract_marketplace_ABI = [{}];
const contract_marketplace_Address = '0xf6B98a1Afaefb59D2b3027FDcA45aF0eF0372718';


@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private contract: ethers.Contract;


  constructor(private connection: ConnectionService) {
      this.contract = new ethers.Contract(contract_marketplace_Address, contract_marketplace_ABI, connection.getProvider() );
  }


  getContractAddress(): string {
    return contract_marketplace_Address; // Return the contract address
    }
}
