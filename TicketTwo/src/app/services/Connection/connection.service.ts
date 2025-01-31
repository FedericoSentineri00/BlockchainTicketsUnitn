import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  //CLASSE UTILIZZATA PER LA CONNESSIONE A METAMASK

  provider: ethers.BrowserProvider;
  private signer: Promise<ethers.JsonRpcSigner> | undefined;

  constructor() { 
    this.provider = new ethers.BrowserProvider((window as any).ethereum);
  }

  async connect() {
    // Request account access from MetaMask
    await this.provider.send("eth_requestAccounts", []);
    this.signer =  this.provider.getSigner();
  }

  getProvider() {
    return this.provider;
  }
}
