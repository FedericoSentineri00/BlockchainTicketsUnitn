// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./Ticket_NFT.sol";


contract Marketplace{
    
    enum TicketStatus { Available, Owned, Validated, Expired } 

    struct Listing{
        uint256 ticketId;
        address seller;
        uint256 price;  
        TicketStatus status;
    }

    mapping(uint256 => Listing) public listings;
    Ticket_NFT public ticketContract;
    uint256 public listingCount;

    constructor(address _ticketContract) {
        ticketContract=Ticket_NFT(_ticketContract);
    }


    function sellTicket(uint256 ticketId) external {
        
        //prende ticket specifico in base ad id
        (
        ,
        ,
        ,
        ,
        uint originalPrice,
        Ticket_NFT.TicketStatus status,
        ,
          
        ) = ticketContract.getTicket(ticketId);



        require(ticketContract.balanceOf(msg.sender, ticketId) > 0, "You do not own this ticket"); // non è tuo
        require(status == Ticket_NFT.TicketStatus.Owned, "Cannot sale or already on sale"); //già in vendita

        listingCount++;
        listings[listingCount] = Listing({
            ticketId: ticketId,
            seller: msg.sender,
            price: originalPrice,
            status: TicketStatus.Available
        });

        // aggiorna stato del biglietto
        ticketContract.updateTicketStatus(ticketId, Ticket_NFT.TicketStatus.Available); 
    }

    
    function buyTicket(uint256 listingId) external payable {
        Listing storage listing = listings[listingId];
        require(listing.status == TicketStatus.Available, "Not on sale");
        require(msg.value >= listing.price, "Insufficient payment");

        //devo controllare anche listing che sia available?
        (
        , 
        , 
        , 
        , 
        , 
        Ticket_NFT.TicketStatus status,
        , 
        ) = ticketContract.getTicket(listing.ticketId);

        require(status == Ticket_NFT.TicketStatus.Available, "Ticket is no longer for sale");

        // manda soldi a proprietario biglietto
        require(msg.value >= listing.price, "Insufficient payment");
        (bool success, ) = listing.seller.call{value: msg.value}("");
        require(success, "Payment failed");

        // trasferisce con safetransfer
        ticketContract.safeTransferFrom(listing.seller, msg.sender, listing.ticketId, 1, "");

        // // segna come non in vendita sia nella lista che nel biglietto
        ticketContract.updateTicketStatus(listing.ticketId, Ticket_NFT.TicketStatus.Owned);
        listing.status = TicketStatus.Owned;

        //rimanda indietro soldi in eccesso
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);  
        }

    }
    
    
    function removeFromSell(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.status == TicketStatus.Available, "Ticket not on sale");
        require(listing.seller == msg.sender, "Only the seller can cancel this sale");

        //aggiorna biglietto stato sia in listing che nel ticket
        ticketContract.updateTicketStatus(listing.ticketId, Ticket_NFT.TicketStatus.Owned);
        listing.status = TicketStatus.Owned;

        
    }
    

} 