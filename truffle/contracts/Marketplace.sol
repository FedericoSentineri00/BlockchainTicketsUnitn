// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ticket_NFT.sol"; // Import del contratto Ticket_NFT

contract Marketplace {

    enum TicketStatus { Available, Owned, Validated, Expired }

    struct Listing {
        uint256 ticketId;
        address seller;
        uint256 price;
        TicketStatus status;
        address ticketContract; // ho aggiunto il ticketcontract alla struttura
    }

    mapping(uint256 => Listing) public listings;
    uint256 public listingCount;
    // Ticket_NFT public ticketContract; non serve più nel costruttore

    
    constructor() {} //diventato vuoto

    
    function sellTicket(address _ticketContract, uint256 ticketId) external {
        
        (
        ,
        ,
        ,
        ,
        uint originalPrice,
        Ticket_NFT.TicketStatus status,
        ,
        ) = Ticket_NFT(_ticketContract).getTicket(ticketId);

        require(Ticket_NFT(_ticketContract).balanceOf(msg.sender, ticketId) > 0, "You do not own this ticket"); // non è tuo
        require(status == Ticket_NFT.TicketStatus.Owned, "Ticket must be owned to list"); //già in vendita

        listingCount++;
        listings[listingCount] = Listing({
            ticketId: ticketId,
            seller: msg.sender,
            price: originalPrice,
            status: TicketStatus.Available,
            ticketContract: _ticketContract
        });

        // aggiorna stato del biglietto
        Ticket_NFT(_ticketContract).updateTicketStatus(ticketId, Ticket_NFT.TicketStatus.Available);
    }

    event Debug(string message, uint256 value);
    event Debug2(string message, address addr);
    event Debug3(string message,uint256 excessAmount);
    
    function buyTicket(uint256 listingId, string memory name, string memory surname) external payable {
        emit Debug("Start buyTicket function", listingId); //

        Listing storage listing = listings[listingId];
        emit Debug("Listing Status", uint256(listing.status)); //

        require(listing.status == TicketStatus.Available, "Not on sale");
        emit Debug("Ticket is available for sale", listingId);//

        require(msg.value >= listing.price, "Insufficient payment");
        emit Debug("Sufficient payment", msg.value); //
        
        //devo controllare anche listing che sia available?
        (
        , 
        , 
        , 
        , 
        , 
        Ticket_NFT.TicketStatus status,
        , 
        ) = Ticket_NFT(listing.ticketContract).getTicket(listing.ticketId);
        require(status == Ticket_NFT.TicketStatus.Available, "Ticket is no longer for sale");
        emit Debug("Ticket status before transfer", uint256(status)); //


        uint256 sellerBalance = Ticket_NFT(listing.ticketContract).balanceOf(listing.seller, listing.ticketId);
        emit Debug("Seller's ticket balance", sellerBalance);
        require(sellerBalance > 0, "Seller does not own the ticket");


        // manda soldi a proprietario biglietto
        require(msg.value >= listing.price, "Insufficient payment");
        (bool success, ) = listing.seller.call{value: msg.value}("");
        require(success, "Payment failed");
        emit Debug("Payment sent to seller", msg.value); //
        
        //check del transfer
        emit Debug("Transferring ticket", listing.ticketId);
        emit Debug2("From seller", listing.seller);
        emit Debug2("To buyer", msg.sender);

        
        // trasferisce con safetransfer
        Ticket_NFT(listing.ticketContract).safeTransferFrom(listing.seller, msg.sender, listing.ticketId, 1, "");
        emit Debug("Ticket transferred", listing.ticketId); //
        
        Ticket_NFT(listing.ticketContract).setOwnerName(listing.ticketId, name, surname);
        emit Debug("Owner changed", listing.ticketId);
        
        // segna come non in vendita sia nella lista che nel biglietto
        Ticket_NFT(listing.ticketContract).updateTicketStatus(listing.ticketId, Ticket_NFT.TicketStatus.Owned);
        listing.status = TicketStatus.Owned;
        emit Debug("Status updated", listing.ticketId);
        
    

        uint256 excessAmount = msg.value - listing.price;
        emit Debug("Msg value", msg.value);
        emit Debug("Listing price", listing.price);
        emit Debug("Refunding excess amount", excessAmount);
        
        
        
    }

    // Rimuovere un ticket dalla vendita
    function removeFromSell(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.status == TicketStatus.Available, "Ticket is not available for sale");
        require(listing.seller == msg.sender, "Only the seller can remove the listing");

        //aggiorna biglietto stato sia in listing che nel ticket
        Ticket_NFT(listing.ticketContract).updateTicketStatus(listing.ticketId, Ticket_NFT.TicketStatus.Owned);
        listing.status = TicketStatus.Owned;
    }



    function findListingByTicketId(uint256 ticketId) external view returns (uint256) {
    for (uint256 i = 1; i <= listingCount; i++) {
        if (listings[i].ticketId == ticketId) {
            return i; 
        }
    }
    revert("Ticket not found for the given ticketId"); 
}
}
