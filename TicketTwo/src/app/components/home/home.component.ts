import { Component, input } from '@angular/core';
import { ContractService} from '../../services/baseContract/contract.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  value = 0;

  constructor (private contractService: ContractService) {
    this.connect()
  }

  async connect() {
    await this.contractService.connect();
    console.log('Connected to MetaMask');  }

  public save() : void {
    
    const inputText = document.getElementById("input") as HTMLInputElement

    this.value = parseInt(inputText.value)
    if(this.value != null) {
      this.setValue()
    }
  }

  public retrive() : void {
    this.getValue()
  }

  async setValue() {
    if (this.value !== null) {
      await this.contractService.setData(this.value);
      console.log('Value set to', this.value);
    }
  }

  async getValue() {
    this.value = await this.contractService.getData();
    console.log(this.value);
    (document.getElementById("output") as HTMLTitleElement).innerText = String(this.value) 
  }
}


