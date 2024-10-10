// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketMarketplace {
    
    address public owner; // contract creator=administrator
    uint public ticketCount = 0; //ticket counter

    
    struct Ticket {
        uint id;
        string eventName;
        uint eventDate;
        uint price;
        address payable owner;
        bool isForSale;
    }

    mapping(uint => Ticket) public tickets; // map ticket with id
    mapping(address => bool) public organizers; // map organizers with id

    event TicketCreated(
        uint id,
        string eventName,
        uint eventDate,
        uint price,
        address payable owner
    );

    event TicketBought(
        uint id,
        string eventName,
        uint eventDate,
        uint price,
        address payable oldOwner,
        address payable newOwner
    );

    event TicketForSale(
        uint id,
        uint price,
        bool isForSale
    );

    event OrganizerAdded(address organizer);
    event OrganizerRemoved(address organizer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can do this");
        _;
    }

    modifier onlyOrganizer() {
        require(organizers[msg.sender] == true, "Only the organizer can do this");
        _;
    }

    constructor() {
        owner = msg.sender; 
    }

    // add organizer
    function addOrganizer(address _organizer) public onlyOwner {
        organizers[_organizer] = true;
        emit OrganizerAdded(_organizer);
    }

    // remove organizer
    function removeOrganizer(address _organizer) public onlyOwner {
        organizers[_organizer] = false;
        emit OrganizerRemoved(_organizer);
    }

    // create tickets
    function createTicket(string memory _eventName, uint _eventDate, uint _price) public onlyOrganizer {
        ticketCount++;
        tickets[ticketCount] = Ticket(ticketCount, _eventName, _eventDate, _price, payable(msg.sender), false);
        emit TicketCreated(ticketCount, _eventName, _eventDate, _price, payable(msg.sender));
    }

    // buy ticket
    function buyTicket(uint _id) public payable {
        Ticket memory _ticket = tickets[_id];
        require(_ticket.isForSale, "Not for sale");
        require(msg.value >= _ticket.price, "Not enough money");

        address payable _seller = _ticket.owner;
        _ticket.owner = payable(msg.sender); // new owner
        _ticket.isForSale = false; 
        tickets[_id] = _ticket;

        _seller.transfer(msg.value); 

        emit TicketBought(_id, _ticket.eventName, _ticket.eventDate, _ticket.price, _seller, payable(msg.sender));
    }

    // sell ticket
    function sellTicket(uint _id, uint _price) public {
        Ticket storage _ticket = tickets[_id];
        require(msg.sender == _ticket.owner, "Only the owner can do this");
        _ticket.isForSale = true;
        _ticket.price = _price;

        emit TicketForSale(_id, _price, true);
    }

    // remove ticket
    function removeFromSale(uint _id) public {
        Ticket storage _ticket = tickets[_id];
        require(msg.sender == _ticket.owner, "Only the owner can do this");
        _ticket.isForSale = false;

        emit TicketForSale(_id, _ticket.price, false);
    }

    // see ticket
    function getTicketDetails(uint _id) public view returns (uint, string memory, uint, uint, address, bool) {
        Ticket memory _ticket = tickets[_id];
        return (_ticket.id, _ticket.eventName, _ticket.eventDate, _ticket.price, _ticket.owner, _ticket.isForSale);
    }
}