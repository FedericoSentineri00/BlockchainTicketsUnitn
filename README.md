# BlockchainTicketsUnitn
The project is a DApp for ticket management. You can find more information in the report published in the repository [here](https://github.com/FedericoSentineri00/BlockchainTicketsUnitn/blob/main/TicketBlockchain.pdf).


The current online ticket purchasing system faces several issues based on user feedback, with
concerns surrounding security, transparency, and ease of use. Our proposal aims to address these
challenges by incorporating blockchain technology and tokenizing tickets to enhance the existing
service.

## Setup
To test the project it is necessary to install ganache and set up a network with the following mnemonic
```
begin spot slogan action adapt hurdle online canyon material account legend manual
```
To set the work environment you need to execute the command 
```
npm install 	
```
Then you can perform network tests with the following steps
```
cd truffle
truffle test --network development
```
Where 34 tests with positive results on smart contracts will be shown

To deploy the network and be able to interact with it via the front end, execute the following command, always in truffle 
```
truffle migrate --reset --network development
```
then move to the ticketwo folder
```
cd ..
cd ticketTwo
```
and run the command 
```
ng serve 
```
This start the front end at http://localhost:4200/
