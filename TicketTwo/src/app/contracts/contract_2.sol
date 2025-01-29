// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0; 
 
contract TicketReselling { 
 
    struct Event { 
        uint id; 
        string name; 
        uint Time; 
        address organizer; 
        mapping(uint => Sector) sectors; 
        uint sectorCount; 
    } 
 
    struct Sector { 
        uint id; 
        string name; 
        uint totalSeats; 
        uint availableSeats; 
    } 
 
    enum TicketStatus { Available, Owned, Validated, Expired } 
 
    struct Ticket { 
        string id; 
        uint eventId; 
        uint sectorId; 
        uint groupId;
        address owner; 
        TicketStatus status; 
        uint originalPrice; 
    } 
 
 
    address public platformOwner; 
    uint public eventCount; 
    uint public ticketCount; 
    uint public fee=500000000; 
    uint public ticketIdLength = 4;
    uint groupCount;
    mapping(address => bool) public organizers; 
    mapping(uint => Event) public events; 
    mapping(string => Ticket) public tickets; 
    mapping(uint => string[]) public groups;
 
    modifier onlyOrganizer() { 
        require(organizers[msg.sender], "You are not an organizer."); 
        _; 
    } 
 
    modifier onlyPlatformOwner() { 
        require(msg.sender == platformOwner, "You are not the platform owner."); 
        _; 
    } 
 
    constructor() { 
        platformOwner = msg.sender; 
        organizers[msg.sender]=true; 
    } 

    function createGroup(string memory ticketId) external {
        require(tickets[ticketId].owner == msg.sender, "Non sei il proprietario del ticket");
        require(tickets[ticketId].groupId == 0, "Il ticket e' gia' associato a un gruppo");

        uint groupId = ++groupCount;
        tickets[ticketId].groupId = groupId;
        groups[groupId].push(ticketId);
    }


    function addParticipant(uint groupId, string memory ticketId) external {
        require(groups[groupId].length > 0, "The group does not exist");

        // Verify that the caller is a member of the group
        bool isGroupMember = false;
        for (uint i = 0; i < groups[groupId].length; i++) {
            if (tickets[groups[groupId][i]].owner == msg.sender) {
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
    function removeParticipant(uint groupId, string memory ticketId) external {
        require(groups[groupId].length > 0, "Il gruppo non esiste");
        require(tickets[ticketId].owner == msg.sender, "Non sei il proprietario del ticket");
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
 
 
    function createOrganizer(address _organizer) external onlyPlatformOwner { 
        organizers[_organizer] = true; 
    } 
 
    function removeOrganizer(address _organizer) external onlyPlatformOwner { 
        organizers[_organizer] = false; 
    } 
 
 
    function createEvent(string memory _name, uint _Time) external onlyOrganizer{ 
 
        eventCount++; 
        Event storage newEvent = events[eventCount]; 
        newEvent.id = eventCount; 
        newEvent.name = _name; 
        newEvent.Time = _Time; 
        newEvent.organizer = msg.sender; 
        newEvent.sectorCount=0; 
    } 
 
   
    function createSector(uint _eventId, string memory _name, uint _totalSeats)external onlyOrganizer{ 
 
        require(events[_eventId].organizer==msg.sender, "Non the organizer of the event"); 
        Event storage _event=events[_eventId]; 
        _event.sectorCount++; 
        Sector storage newSector=_event.sectors[_event.sectorCount]; 
        newSector.id=_event.sectorCount; 
        newSector.name=_name; 
        newSector.totalSeats=_totalSeats; 
        newSector.availableSeats=_totalSeats; 
 
    } 
 
    function createTicket(uint _eventId, uint _sectorId, uint _originalPrice)external onlyOrganizer{ 
 
        require(events[_eventId].organizer==msg.sender, "Non the organizer of the event"); 
        Sector storage sector=events[_eventId].sectors[_sectorId]; 
        require(sector.availableSeats>0, "No seats"); 
 
        ticketCount++; 
        string memory ticketId = generateTicketId(_eventId, ticketCount);
        Ticket storage newTicket = tickets[ticketId]; 
        newTicket.id = ticketId; 
        newTicket.eventId = _eventId; 
        newTicket.sectorId = _sectorId; 
        newTicket.owner = msg.sender;
        newTicket.status = TicketStatus.Available; 
        newTicket.originalPrice = _originalPrice * 1000000000000000000; //convertion to ether (Possiamo vedere come modificare questo valore per renderlo più comodo a noi)
 
        sector.availableSeats--; 
 
    } 
 
 
    function getEventDetails(uint _eventId) external view returns (uint id, string memory name, uint Time, address organizer, uint sectorCount) { 
        Event storage _event = events[_eventId]; 
        return ( 
            _event.id, 
            _event.name, 
            _event.Time, 
            _event.organizer, 
            _event.sectorCount 
        ); 
    } 
 
    function getSectorDetails(uint _eventId, uint _sectorId) external view returns (uint id,string memory name, uint totalSeats, uint availableSeats) { 
 
        Event storage _event = events[_eventId]; 
        Sector storage _sector = _event.sectors[_sectorId]; 
        return ( 
            _sector.id, 
            _sector.name, 
            _sector.totalSeats, 
            _sector.availableSeats 
        ); 
    } 
 
    function getTicketDetails(string memory _ticketId) external view returns (string memory id,uint eventId,uint sectorId,address owner,TicketStatus status,uint originalPrice, uint groupId) { 
 
        Ticket storage _ticket = tickets[_ticketId]; 
        return ( 
            _ticket.id, 
            _ticket.eventId, 
            _ticket.sectorId, 
            _ticket.owner, 
            _ticket.status, 
            _ticket.originalPrice,
            _ticket.groupId
        ); 
    } 
 
 
 
    function buyTicket(string memory _ticketId) external payable  { 

        Ticket storage _ticket = tickets[_ticketId]; 
        require(_ticket.status == TicketStatus.Available, "Ticket is not for sale"); 
        require(_ticket.owner != msg.sender, "You can't buy a ticket that you own"); 
        require(msg.sender.balance >= msg.value, "Insufficient balance");
        require(msg.value >= _ticket.originalPrice + fee, "Insufficient payment"); 
        
 
        payable(_ticket.owner).transfer(_ticket.originalPrice); 
        payable(platformOwner).transfer(fee); 
 
        _ticket.owner=msg.sender; 
        _ticket.status=TicketStatus.Owned; 
    } 
 
    function sellTicket(string memory _ticketId) external { 
        Ticket storage _ticket = tickets[_ticketId]; 
        require(_ticket.owner==msg.sender, "Non the owner of the event"); 
        require(_ticket.status==TicketStatus.Owned, "Non onwed"); 
 
        _ticket.status = TicketStatus.Available;
    } 


    function generateTicketId(uint256 eventId, uint256 ticketNumber) internal view returns (string memory) {
        if (eventId == 0) {
            return "0x0";
        }

        //Convert the event id and ticket count into the hexadecimal countervalue
        bytes memory hexEventId = toHexBytes(eventId);
        bytes memory hexTicketId = toHexBytes(ticketNumber);

        bytes memory hexString = abi.encodePacked(hexTicketId);
        uint length = hexString.length;
        if (length < ticketIdLength) {
            bytes memory paddedHex = new bytes(ticketIdLength - length + hexString.length);

            for (uint256 i = 0; i < ticketIdLength - length; i++) {
                paddedHex[i] = bytes1(uint8(48)); // ASCII '0'
            }

            for (uint256 i = 0; i < length; i++) {
                paddedHex[ticketIdLength - length + i] = bytes(hexString)[i];
            }

            hexString = paddedHex;
        }

        bytes memory concatenated = abi.encodePacked(hexEventId, hexString);
        return string(abi.encodePacked("0x", concatenated));
    }

    function toHexBytes(uint256 value) internal pure returns (bytes memory) {
        if (value == 0) {
            return "0";
        }
        bytes memory buffer;
        while (value != 0) {
            uint8 remainder = uint8(value % 16);
            value /= 16;
            buffer = abi.encodePacked(
                remainder < 10
                    ? bytes1(remainder + 48) // ASCII '0' = 48
                    : bytes1(remainder + 87), // ASCII 'a' = 97, a-f start at 87 offset from 10
                buffer
            );
        }
        
        return buffer;
    }

}