import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  //CLASSE UTILIZZATA PER LA CONNESSIONE A METAMASK

  private provider: ethers.BrowserProvider;
  private signer: Promise<ethers.JsonRpcSigner> | undefined;


  constructor() { 
    this.provider = new ethers.BrowserProvider((window as any).ethereum);
    
    (window as any).ethereum.on('accountsChanged', async (accounts: string[]) => {
      console.log('Account changed:', accounts[0]); // Log the new account
      await this.connect(); // Reconnect to the new account
    });
  }

  async connect() {
    // Request account access from MetaMask
    await this.provider.send("eth_requestAccounts", []);
    this.signer =  this.provider.getSigner();
    //this.contract = this.contract.connect(await this.signer) as Contract;
  }

  async getSignerAddress(): Promise<string> {
		if (!this.signer) {
		  throw new Error('Signer is not connected.'); // Gestisci l'errore
		}
		return (await this.signer).getAddress(); // Ottieni l'indirizzo del firmatario
	}



}
