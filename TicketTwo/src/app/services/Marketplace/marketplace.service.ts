import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { ConnectionService } from '../Connection/connection.service';


const contract_marketplace_ABI = [{}];
const contract_marketplace_Address = '0x80832D85a6537C0fEAa0878249c349189c24a300';


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
