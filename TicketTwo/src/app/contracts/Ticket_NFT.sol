// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract Ticket_NFT is AccessControl, ERC1155Supply{
    
    struct Event{ 
        uint id; 
        string name; 
        uint time; 
        mapping(uint => Sector) sectors; 
        uint sectorCount; 
    } 
 
    struct Sector { 
        uint id; 
        string name; 
        uint totalSeats;
        uint availableSeats;  
        string[] seats;
    } 
    
    enum TicketStatus { Available, Owned, Validated, Expired } 
    
    struct Ticket { 
        uint256 id; 
        uint eventId; 
        uint sectorId; 
        uint groupId; 
        uint originalPrice; 
        TicketStatus status; 
        string seat;
        bytes32 hashName;
    }
 
    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    //address public platformOwner; 
    uint public eventCount; 
    uint public ticketCount; 
    //uint public fee=2; 
    uint public ticketIdLength = 4;
    uint groupCount;
    //mapping(address => bool) public organizers; 
    mapping(uint => Event) public events; 
    mapping(uint256 => Ticket) public tickets; 
    mapping(uint => uint[]) public groups;
    string public organization_name;

    constructor(string memory _organization_name, address _organizer) ERC1155("") ERC1155Supply(){
        _grantRole(DEFAULT_ADMIN_ROLE, tx.origin); //quello chedeploya la blockchain per primo (io)
        _grantRole(ORGANIZER_ROLE, _organizer); //quello che chiama il contratto, ovvero sony, universal...
        _grantRole(ADMIN_ROLE, _organizer);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);

        organization_name=_organization_name;
    }


    function addOrganizer(address _organizer)public onlyRole(ADMIN_ROLE){
        _grantRole(ORGANIZER_ROLE, _organizer);
    }

    function removeOrganizer(address _organizer)public onlyRole(ADMIN_ROLE){
        revokeRole(ORGANIZER_ROLE, _organizer);
    }


    //------------------------Gestione biglietti-----------------------------------------------------------

    function createEvent(string memory _name, uint _time) external onlyRole(ORGANIZER_ROLE){ 
 
        eventCount++; 
        Event storage newEvent = events[eventCount]; 
        newEvent.id = eventCount; 
        newEvent.name = _name; 
        newEvent.time = _time; 
        newEvent.sectorCount=0; 
    }

    function createSector(uint _eventId, string memory _name, uint _totalSeats, uint _seat_x_lines) external onlyRole(ORGANIZER_ROLE) {  
        Event storage _event = events[_eventId]; 
        _event.sectorCount++; 
        Sector storage newSector = _event.sectors[_event.sectorCount]; 
        newSector.id = _event.sectorCount; 
        newSector.name = _name; 
        newSector.totalSeats = _totalSeats;
        newSector.availableSeats = _totalSeats; 
        /*
        string[26] memory lettersSeats = [
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", 
            "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
        ];
    
        uint rows = _totalSeats / _seat_x_lines; // Calcoliamo il numero di righe
        for (uint i = 1; i <= rows; i++) {
            for (uint j = 1; j <= _seat_x_lines; j++) {
                // Determina l'indice per la lettera: per righe pari, usa l'ordine inverso
                uint columnIndex = (i % 2 == 0) ? (_seat_x_lines - j + 1) : j;

                // Combina il numero di riga con la lettera appropriata
                string memory seat = string(abi.encodePacked(uintToString(columnIndex), lettersSeats[i-1]));
                newSector.seats.push(seat);
            }
        }
        */
    } 


    function uintToString(uint v) internal pure returns (string memory) {
        
        return "";
    }


    function createTicket(uint _eventId, uint _sectorId, uint _originalPrice)external onlyRole(ORGANIZER_ROLE){ 

        Sector storage sector=events[_eventId].sectors[_sectorId]; 
        require(sector.availableSeats>0, "No seats"); 
 
        ticketCount++; 
        uint256 ticketId = ticketCount;
        //string memory ticketId = generateTicketId(_eventId, ticketCount);
        Ticket storage newTicket = tickets[ticketId]; 
        newTicket.id = ticketId; 
        newTicket.eventId = _eventId; 
        newTicket.sectorId = _sectorId; 
        newTicket.status = TicketStatus.Available; 
        newTicket.originalPrice = _originalPrice;
        newTicket.hashName = generateHash(organization_name, ticketId);
        sector.availableSeats--;

        _mint(msg.sender, ticketCount, 1, "");
 
    } 

    function generateHash(string memory str, uint256 num) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(str, num));
    }

    //------------------------Gestione gruppi-----------------------------------------------------------

    function createGroup(uint256 ticketId) external {
        require(balanceOf(msg.sender, ticketId) > 0, "Not the ticket owner");
        uint groupId = ++groupCount;
        
        tickets[ticketId].groupId = groupId;
        groups[groupId].push(ticketId);
    }

    function addParticipant(uint groupId, uint256 ticketId) external {
        require(groups[groupId].length > 0, "The group does not exist");

        // Verify that the caller is a member of the group
        bool isGroupMember = false;
        for (uint i = 0; i < groups[groupId].length; i++) {
            if (balanceOf(msg.sender, tickets[groups[groupId][i]].id) > 0){
                isGroupMember = true;
                break;
            }
        }
        require(isGroupMember, "You must be a group member to add participants");

        // Verify that the ticket has status Owned
        require(tickets[ticketId].status == TicketStatus.Owned, "The ticket is not 'Owned'");
        require(tickets[ticketId].groupId == 0, "The ticket is already assigned to a group");

        // Verify that the new ticket has the same sector and event as others in the group
        uint groupEventId = tickets[groups[groupId][0]].eventId;
        uint groupSectorId = tickets[groups[groupId][0]].sectorId;
        require(tickets[ticketId].eventId == groupEventId, "The ticket does not match the group's event");
        require(tickets[ticketId].sectorId == groupSectorId, "The ticket does not match the group's sector");

        // Associate the ticket with the group and update the mapping
        tickets[ticketId].groupId = groupId;
        groups[groupId].push(ticketId);
    }

    // Rimuove un partecipante dal gruppo
    function removeParticipant(uint groupId, uint256 ticketId) external {
        require(groups[groupId].length > 0, "Il gruppo non esiste");
        require(balanceOf(msg.sender, ticketId) > 0, "Not the ticket owner");
        require(tickets[ticketId].groupId == groupId, "Il ticket non appartiene a questo gruppo");

        tickets[ticketId].groupId = 0;

        // Rimuove il ticket dal gruppo
        uint index;
        bool found = false;
        for (uint i = 0; i < groups[groupId].length; i++) {
            if (keccak256(abi.encodePacked(groups[groupId][i])) == keccak256(abi.encodePacked(ticketId))) {
                index = i;
                found = true;
                break;
            }
        }
        require(found, "Ticket non trovato nel gruppo");
        groups[groupId][index] = groups[groupId][groups[groupId].length - 1];
        groups[groupId].pop();
    }


    //------------------------Assegnazione posti-----------------------------------------------------------
    function assignSeats(uint _eventId, uint _sectorId) external onlyRole(ORGANIZER_ROLE) {
        Event storage _event = events[_eventId];
        Sector storage _sector = _event.sectors[_sectorId];

        require(_sector.seats.length > 0, "No seats defined in this sector");
        require(_sector.availableSeats > 0, "No available seats in this sector");

        uint assignedCount = 0;

        // Itera su tutti i biglietti per verificare e assegnare i posti
        for (uint i = 1; i <= ticketCount; i++) {
            Ticket storage _ticket = tickets[i];
            //ha un grppuo
            if ( _ticket.eventId == _eventId && _ticket.sectorId == _sectorId && bytes(_ticket.seat).length == 0 && _ticket.status == TicketStatus.Owned && _ticket.groupId != 0 ){
                uint[] storage ticketsInGroup = groups[_ticket.groupId]; // Accedi all'array di ticket del gruppo

                for (uint x = 0; x < ticketsInGroup.length; x++) {
                    _ticket = tickets[ticketsInGroup[x]]; // Ticket associato
                    require(assignedCount < _sector.seats.length, "Not enough seats to assign");

                    // Assegna un posto al biglietto
                    _ticket.seat = _sector.seats[assignedCount];
                    assignedCount++;
                }
            }

            // Verifica che il biglietto sia del giusto evento, settore e senza posto assegnato
            if (
                _ticket.eventId == _eventId &&
                _ticket.sectorId == _sectorId &&
                bytes(_ticket.seat).length == 0 &&
                _ticket.status == TicketStatus.Owned
            ){
                // Verifica che ci siano ancora posti disponibili
                require(assignedCount < _sector.seats.length, "Not enough seats to assign");

                // Assegna un posto al biglietto
                _ticket.seat = _sector.seats[assignedCount];
                assignedCount++;
            }
        }

        // Aggiorna i posti disponibili nel settore
        if (assignedCount > 0) {
            _sector.availableSeats -= assignedCount;
        } else {
            revert("No tickets assigned seats");
        }
    }

    function setOwnerName(uint ticketId, string memory name, string memory surname) external {
        require(balanceOf(msg.sender, ticketId) > 0, "Not the ticket owner");
        Ticket storage ticket = tickets[ticketId];
        ticket.hashName = generateHash(string(abi.encodePacked(name,"-",surname)), ticketId);
    }

    function validateTicket(uint ticketId, string memory name, string memory surname) external onlyRole(ORGANIZER_ROLE){
        Ticket storage ticket = tickets[ticketId];
        require(ticket.status != TicketStatus.Validated, "Ticket already validated");
        require(ticket.status != TicketStatus.Expired, "Ticket expired!");
        bytes32 hashOwner = generateHash(string(abi.encodePacked(name,"-",surname)), ticketId);
        require (ticket.hashName == hashOwner, "Ticket has different owner!");
        ticket.status = TicketStatus.Validated;
    }

    function updateTicketStatus(uint256 ticketId, TicketStatus newStatus) external {

        // take the ticket
        Ticket storage ticket = tickets[ticketId];

        // controlla che sia il proprietario a farlo
        require(
            hasRole(ORGANIZER_ROLE, msg.sender) || balanceOf(msg.sender, ticketId) > 0,
            "Not authorized to update ticket status"
        );

        ticket.status = newStatus;
    }

    //chiama per mettere tutti i ticket di un evento expired
    function expireTickets(uint _eventId) external onlyRole(ORGANIZER_ROLE) {
        Event storage _event = events[_eventId];
        require(_event.time < block.timestamp, "Event has not yet occurred");

        for (uint i = 1; i <= ticketCount; i++) {
            Ticket storage ticket = tickets[i];
            if (ticket.eventId == _eventId && ticket.status != TicketStatus.Expired) {
                ticket.status = TicketStatus.Expired;
            }
        }
    }

    // get an event detail based on the event id 
    function getEvent(uint _eventId) external view returns (
        uint id,
        string memory name,
        uint time,
        uint sectorCount
    ){
        Event storage _event =events[_eventId];
        return (_event.id, _event.name, _event.time, _event.sectorCount);
    }

    // get a sector detail based on the event id and sector id
    function getSector(uint _eventId, uint _sectorId) external view returns (
        uint id,
        string memory name,
        uint totalSeats,
        uint availableSeats
    ) {
        Sector storage sector = events[_eventId].sectors[_sectorId];
        return (sector.id, sector.name, sector.totalSeats, sector.availableSeats);
    }

    // get a ticket detail based on the ticket id
    function getTicket(uint256 ticketId) external view returns (
        uint256 id,
        uint eventId,
        uint sectorId,
        uint groupId,
        uint originalPrice,
        TicketStatus status,
        string memory seat,
        bytes32 hashName){

        Ticket storage ticket = tickets[ticketId];
        return (
            ticket.id,
            ticket.eventId,
            ticket.sectorId,
            ticket.groupId,
            ticket.originalPrice,
            ticket.status,
            ticket.seat,
            ticket.hashName
        );
    }

    // get all the seat in a sector based on the event id and sector id
    function getSeatsInSector(uint _eventId, uint _sectorId) external view returns (string[] memory) {
        return events[_eventId].sectors[_sectorId].seats;
    }

    // get all the ticket of a group based on the group id
    function getGroupTickets(uint groupId) external view returns (uint[] memory) {
        return groups[groupId];
    }

    // check if a ticket is associated to a group
    function isTicketInGroup(uint ticketId) external view returns (bool) {
        return tickets[ticketId].groupId != 0;
    }

    function supportsInterface(bytes4 _interfaceId) public view virtual override(AccessControl, ERC1155) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }

}


