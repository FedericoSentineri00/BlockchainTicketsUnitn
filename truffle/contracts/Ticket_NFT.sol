// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Ticket_NFT is AccessControl, ERC1155Supply {
    
    struct Event {
        uint256 id;
        string name;
        uint256 time;
        mapping(uint256 => Sector) sectors;
        uint256 sectorCount;
    }

    /*
    struct EventDetails {
        uint64 id;
        string name;
        uint64 time;
        uint64 sectorCount;
        uint64 totAvailableSeats;
    }
    */

    struct Sector {
        uint256 id;
        string name;
        uint256 totalSeats;
        uint256 availableSeats;
        uint256 seats_x_lines;
    }

    enum TicketStatus {
        Available,
        Owned,
        Validated,
        Expired
    }

    struct Ticket {
        uint256 id;
        uint256 eventId;
        uint256 sectorId;
        uint256 groupId;
        uint256 originalPrice;
        TicketStatus status;
        string seat;
        bytes32 hashName;
    }

    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 public eventCount;
    uint256 public ticketCount;
    uint256 public groupCount;

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => uint256[]) public groups;

    string public organization_name;

    constructor(string memory _organization_name, address _organizer)
        ERC1155("")
        ERC1155Supply()
    {
        _grantRole(DEFAULT_ADMIN_ROLE, tx.origin); //quello chedeploya la blockchain per primo (io)
        _grantRole(ORGANIZER_ROLE, _organizer); //quello che chiama il contratto, ovvero sony, universal...
        _grantRole(ADMIN_ROLE, _organizer);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);

        organization_name = _organization_name;
    }

    function addOrganizer(address _organizer) public onlyRole(ADMIN_ROLE) {
        _grantRole(ORGANIZER_ROLE, _organizer);
    }

    function removeOrganizer(address _organizer) public onlyRole(ADMIN_ROLE) {
        revokeRole(ORGANIZER_ROLE, _organizer);
    }

    //------------------------Gestione biglietti-----------------------------------------------------------

    event EventCreated(uint256 indexed eventId, string name, uint256 time);

    function createEvent(string memory _name, uint256 _time)
        external
        onlyRole(ORGANIZER_ROLE)
    {
        eventCount++;
        Event storage newEvent = events[eventCount];
        newEvent.id = eventCount;
        newEvent.name = _name;
        newEvent.time = _time;
        newEvent.sectorCount = 0;

        emit EventCreated(eventCount, _name, _time);
    }

    event SectorCreated(uint256 indexed eventId, uint256 indexed sectorId, string name);

    function createSector(
        uint256 _eventId,
        string memory _name,
        uint256 _totalSeats,
        uint256 _seat_x_lines
    ) external onlyRole(ORGANIZER_ROLE) {
        Event storage _event = events[_eventId];
        require(bytes(_event.name).length > 0);
        _event.sectorCount++;
        Sector storage newSector = _event.sectors[_event.sectorCount];
        newSector.id = _event.sectorCount;
        newSector.name = _name;
        newSector.totalSeats = _totalSeats;
        newSector.availableSeats = _totalSeats;
        newSector.seats_x_lines = _seat_x_lines;
        
        emit SectorCreated(_eventId, newSector.id, _name);
    }

    event TicketCreated(uint256 indexed ticketId, uint256 eventId, uint256 sectorId, uint256 price);
    function createTicket(
        uint256 _eventId,
        uint256 _sectorId,
        uint256 _originalPrice
    ) external onlyRole(ORGANIZER_ROLE) {
        require(_originalPrice > 0, "Price must be greater than 0");
        Sector storage sector = events[_eventId].sectors[_sectorId];
        require(sector.availableSeats > 0, "No seats left");

        ticketCount++;
        uint256 ticketId = ticketCount;
        Ticket storage newTicket = tickets[ticketId];
        newTicket.id = ticketId;
        newTicket.eventId = _eventId;
        newTicket.sectorId = _sectorId;
        newTicket.status = TicketStatus.Available;
        newTicket.originalPrice = _originalPrice;
        newTicket.hashName = generateHash(organization_name, ticketId);
        sector.availableSeats--;

        emit TicketCreated(ticketId, _eventId, _sectorId, _originalPrice);
        _mint(msg.sender, ticketCount, 1, "");
    }

    function generateHash(string memory str, uint256 num) public pure returns (bytes32){
        return keccak256(abi.encodePacked(str, num));
    }

    //------------------------Gestione gruppi-----------------------------------------------------------
    function createGroup(uint256 ticketId) external {
        require(balanceOf(msg.sender, ticketId) > 0, "Not the ticket owner");
        uint256 groupId = ++groupCount;

        tickets[ticketId].groupId = groupId;
        groups[groupId].push(ticketId);
    }

    function addParticipant(uint256 groupId, uint256 ticketId) external {
        require(groups[groupId].length > 0, "The group does not exist");

        // Verify that the caller is a member of the group
        bool isGroupMember = false;
        for (uint256 i = 0; i < groups[groupId].length; i++) {
            if (balanceOf(msg.sender, tickets[groups[groupId][i]].id) > 0) {
                isGroupMember = true;
                break;
            }
        }
        require( isGroupMember, "You must be a group member to add participants");

        // Verify that the ticket has status Owned
        require( tickets[ticketId].status == TicketStatus.Owned, "The ticket is not 'Owned'" );
        require( tickets[ticketId].groupId == 0, "The ticket is already assigned to a group" );

        // Verify that the new ticket has the same sector and event as others in the group
        uint256 groupEventId = tickets[groups[groupId][0]].eventId;
        uint256 groupSectorId = tickets[groups[groupId][0]].sectorId;
        require( tickets[ticketId].eventId == groupEventId, "The ticket does not match the group's event" );
        require( tickets[ticketId].sectorId == groupSectorId, "The ticket does not match the group's sector" );

        // Associate the ticket with the group and update the mapping
        tickets[ticketId].groupId = groupId;
        groups[groupId].push(ticketId);
    }

    // Rimuove un partecipante dal gruppo
    function removeParticipant(uint256 groupId, uint256 ticketId) external {
        require(groups[groupId].length > 0, "Il gruppo non esiste");
        require(balanceOf(msg.sender, ticketId) > 0, "Not the ticket owner");
        require( tickets[ticketId].groupId == groupId, "Il ticket non appartiene a questo gruppo" );

        tickets[ticketId].groupId = 0;

        // Rimuove il ticket dal gruppo
        uint256 index;
        bool found = false;
        for (uint256 i = 0; i < groups[groupId].length; i++) {
            if ( keccak256(abi.encodePacked(groups[groupId][i])) == keccak256(abi.encodePacked(ticketId)) ) {
                index = i;
                found = true;
                break;
            }
        }
        require(found, "Ticket non trovato nel gruppo");
        groups[groupId][index] = groups[groupId][groups[groupId].length - 1];
        groups[groupId].pop();
    }

    function setOwnerName(
        uint256 ticketId,
        string memory name,
        string memory surname
    ) external {
        require(hasRole(ORGANIZER_ROLE, msg.sender) || balanceOf(msg.sender, ticketId) > 0, "Not the ticket owner");
        Ticket storage ticket = tickets[ticketId];
        ticket.hashName = generateHash( string(abi.encodePacked(name, "-", surname)), ticketId );
    }

    function validateTicket(
        uint256 ticketId,
        string memory name,
        string memory surname
    ) external onlyRole(ORGANIZER_ROLE) {
        Ticket storage ticket = tickets[ticketId];
        require( ticket.status != TicketStatus.Validated, "Ticket already validated" );
        require(ticket.status != TicketStatus.Expired, "Ticket expired!");
        bytes32 hashOwner = generateHash( string(abi.encodePacked(name, "-", surname)), ticketId );
        require(ticket.hashName == hashOwner, "Ticket has different owner!");
        ticket.status = TicketStatus.Validated;
    }

    function updateTicketStatus(uint256 ticketId, TicketStatus newStatus) external
    {
        Ticket storage ticket = tickets[ticketId];

        if((newStatus == TicketStatus.Validated || newStatus == TicketStatus.Available) && (ticket.status == TicketStatus.Owned || ticket.status == TicketStatus.Available))
            require(hasRole(ORGANIZER_ROLE, msg.sender) || balanceOf(msg.sender, ticketId) > 0, "Not authorized to update ticket status");
        else 
            require(hasRole(ORGANIZER_ROLE, msg.sender), "Not authorized to update ticket status");

        ticket.status = newStatus;
    }



    //chiama per mettere tutti i ticket di un evento expired
    function expireTickets(uint256 _eventId) external onlyRole(ORGANIZER_ROLE) {
        Event storage _event = events[_eventId];
        require(_event.time < block.timestamp, "Event has not yet occurred");

        for (uint256 i = 1; i <= ticketCount; i++) {
            Ticket storage ticket = tickets[i];
            if (ticket.eventId == _eventId && (ticket.status != TicketStatus.Expired && ticket.status != TicketStatus.Validated)) {
                ticket.status = TicketStatus.Expired;
            }
        }
    }

    // get an event detail based on the event id
    function getEventDetails(uint256 _eventId)
        external
        view
        returns (
            uint256 id,
            string memory name,
            uint256 time,
            uint256 sectorCount,
            uint256 availableSeats
        )
    {
        Event storage _event = events[_eventId];

        uint256 totAvailableSeats = 0;
        for (uint i = 0; i < _event.sectorCount + 1; i++) {
            totAvailableSeats += _event.sectors[i].availableSeats;
        }

        return (_event.id, _event.name, _event.time, _event.sectorCount, totAvailableSeats);
    }


    function getAllEventsDetails() external view returns (
        uint256[] memory ids,
        string[] memory names,
        uint256[] memory times,
        uint256[] memory sectorCounts,
        uint256[] memory availableSeats
        ) {
            ids = new uint256[](eventCount);
            names = new string[](eventCount);
            times = new uint256[](eventCount);
            sectorCounts = new uint256[](eventCount);
            availableSeats = new uint256[](eventCount);

            for (uint256 i = 1; i <= eventCount; i++) {
                Event storage _event = events[i];
                uint256 totAvailableSeats = 0;

                // available seats for every sector
                for (uint256 j = 1; j <= _event.sectorCount; j++) {
                    totAvailableSeats += _event.sectors[j].availableSeats;
                }

                // populate array
                ids[i - 1] = _event.id;
                names[i - 1] = _event.name;
                times[i - 1] = _event.time;
                sectorCounts[i - 1] = _event.sectorCount;
                availableSeats[i - 1] = totAvailableSeats;
            }
        }


    function getTickets(uint _start, uint _end) public view returns (Ticket[] memory) {
        require(_end <= ticketCount, "Invalid end");
        require(_end >= _start, "Invalid parameters");

        Ticket[] memory array = new Ticket[](_end - _start);
        for (uint i = _start; i < _end; i++) {
            array[i - _start] = tickets[i];
        }
        return array;
    }

    // get a sector detail based on the event id and sector id, along with all associated tickets
    function getSector(uint256 _eventId, uint256 _sectorId) external view returns (
            uint256 id,
            string memory name,
            uint256 totalSeats,
            uint256 availableSeats,
            uint256[] memory ticketIds,
            uint256[] memory associatedGroupIds
        )
    {
        // Fetch the sector details
        Sector storage sector = events[_eventId].sectors[_sectorId];

        // Temporary array to hold ticket IDs associated with the sector
        uint256 ticketSector=0;

        for (uint256 i = 0; i < ticketCount; i++) {
            if (
                tickets[i].eventId == _eventId &&
                tickets[i].sectorId == _sectorId
            ) {
                ticketSector++;
            }
        }

        // Allocate memory for ticket IDs
        uint256[] memory associatedTicketIds = new uint256[](ticketCount);
        uint256[] memory groupIds = new uint256[](ticketCount);

        uint256 index = 0;

        for (uint256 i = 0; i < ticketCount; i++) {
            if (
                tickets[i].eventId == _eventId &&
                tickets[i].sectorId == _sectorId
            ) {
                associatedTicketIds[index] = tickets[i].id;
                groupIds[index] = tickets[i].groupId;
                index++;
            }
        }

        return (
            sector.id,
            sector.name,
            sector.totalSeats,
            sector.availableSeats,
            associatedTicketIds,
            groupIds
        );
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

    function assignSeats(uint256[] memory ticket_ids, string[] memory seats) external onlyRole(ORGANIZER_ROLE) {
        require(ticket_ids.length == seats.length, "Mismatched input arrays");

        for (uint256 i = 0; i < ticket_ids.length; i++) {
            Ticket storage ticket = tickets[ticket_ids[i]];
            ticket.seat = seats[i];
        }
    }

    // get all the ticket of a group based on the group id
    function getGroupTickets(uint256 groupId)external view returns (uint256[] memory) { 
        return groups[groupId];
    }

    // check if a ticket is associated to a group
    function isTicketInGroup(uint256 ticketId) external view returns (bool) {
        return tickets[ticketId].groupId != 0;
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        view
        virtual
        override(AccessControl, ERC1155)
        returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }
}
