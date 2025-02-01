import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { ConnectionService } from '../Connection/connection.service';

const contract_factory_ABI = [{}];
const contract_factory_Address = '0x9ADF81F1E7a62E199Ab456E39Be4E9615dE1065a';


@Injectable({
  providedIn: 'root'
})
export class FactoryService {

  private contract: ethers.Contract;

  constructor(private connection: ConnectionService) { 

    this.contract = new ethers.Contract(contract_factory_Address, contract_factory_ABI, connection.getProvider() );

  }

  getContractAddress(): string {
    return contract_factory_Address; // Return the contract address
    }


  async getOrganizerNFT(organizerAddress: string): Promise<string> {
    const nftAddress = await this.contract['getOrganizerNFT'](organizerAddress);
    console.log(`NFT Contract Address for ${organizerAddress}:`, nftAddress);
    return nftAddress;
  }
}
