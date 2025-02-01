import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { ConnectionService } from '../Connection/connection.service';


const contract_marketplace_ABI = [{}];
const contract_marketplace_Address = '0x9ADF81F1E7a62E199Ab456E39Be4E9615dE1065a';


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
