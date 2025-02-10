# BlockchainTicketsUnitn

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

## Features

Each event organizer who decides to join the project can receive their role by providing their name and a contact address, so that their personal contract can be created.

Each organization will therefore have its own contract in which it will be able to create unique events, sectors and tickets for them, with related information, such as date, time, price, number of seats available and layout etc.

NFT tickets are created via ERC1155, it is possible to place them and remove them from sale through a special market, initialized through another contract, where other users can buy them at the same price with which they were generated. The organizer can also validate users' tickets upon entry to the event, thus changing the date and setting unused ones to expired, so that they can no longer be resold.

Another important feature is also the group logic: a user can set a group in their ticket, so that when seats are assigned (one day before the event) they are assigned next to those who assigned the same group ID

You can find more information in the report published in the repository [here](https://github.com/FedericoSentineri00/BlockchainTicketsUnitn/blob/main/TicketBlockchain.pdf).

