// contract.service.ts
import { Injectable } from '@angular/core';
import { Contract, ethers } from 'ethers';

// Replace these with your contract's ABI and address
const contractABI = [
    "function set(uint256 x)",
    "function get() view returns (uint256)"
];
const contractAddress = "0xd0e68700152b35f255ae59c710f81d5e17da5e48";

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private provider: ethers.BrowserProvider;
  private signer: Promise<ethers.JsonRpcSigner> | undefined;
  private contract: ethers.Contract;

  constructor() {
    // Initialize ethers provider and contract
    this.provider = new ethers.BrowserProvider((window as any).ethereum);
    this.contract = new ethers.Contract(contractAddress, contractABI, this.provider);
  }

  async connect() {
    // Request account access from MetaMask
    await this.provider.send("eth_requestAccounts", []);
    this.signer = this.provider.getSigner();
    this.contract = this.contract.connect(await this.signer) as Contract;
  }

  async setData(value: number): Promise<void> {
    const tx = await this.contract['set'](value);
    await tx.wait(); // Wait for the transaction to be mined
  }

  async getData(): Promise<number> {
    const value = await this.contract['get']();
    return(value)
  }
}
