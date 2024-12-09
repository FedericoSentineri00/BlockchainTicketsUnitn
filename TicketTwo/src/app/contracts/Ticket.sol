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
        string[] seats; // Array che contiene i posti disponibili nel settore

    }
 
    enum TicketStatus { Available, Owned, Validated, Expired } 

    struct Ticket{ 
        uint id; 
        uint eventId; 
        uint sectorId; 
        uint groupId;
        address owner; 
        TicketStatus status; 
        uint originalPrice;
        string seat; // Nuovo campo per il posto assegnato
    }
 
    address public platformOwner; 
    uint public eventCount; 
    uint public ticketCount; 
    uint public fee=500000000;
    uint groupCount;
    mapping(address => bool) public organizers; 
    mapping(uint => Event) public events; 
    mapping(uint => Ticket) public tickets;
    mapping(uint => uint[]) public groups;
    
 
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

            // Crea un evento statico
        createEvent("Concerto Rock", block.timestamp + 7 days);

        // Crea tre settori statici per l'evento
        createSector(1, "Parterre", 100,10);
        createSector(1, "Tribuna", 50,5);
        createSector(1, "VIP", 20,10);
        createTicket(1, 1, 1);
        createTicket(1, 1, 1);
        createTicket(1, 1, 1);
    } 
 
    // Crea un gruppo associato a un ticket
    function createGroup(uint ticketId) external {
        require(tickets[ticketId].owner == msg.sender, "Non sei il proprietario del ticket");
        require(tickets[ticketId].groupId == 0, "Il ticket e' gia' associato a un gruppo");

        uint groupId = ++groupCount;
        tickets[ticketId].groupId = groupId;
        groups[groupId].push(ticketId);
    }
 
    // Adds a participant to the group
    function addParticipant(uint groupId, uint ticketId) external {
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
    function removeParticipant(uint groupId, uint ticketId) external {
        require(groups[groupId].length > 0, "Il gruppo non esiste");
        require(tickets[ticketId].owner == msg.sender, "Non sei il proprietario del ticket");
        require(tickets[ticketId].groupId == groupId, "Il ticket non appartiene a questo gruppo");

        tickets[ticketId].groupId = 0;

        // Rimuove il ticket dal gruppo
        uint index;
        bool found = false;
        for (uint i = 0; i < groups[groupId].length; i++) {
            if (groups[groupId][i] == ticketId) {
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
 
 
    function createEvent(string memory _name, uint _Time) internal onlyOrganizer{ 
 
        eventCount++; 
        Event storage newEvent = events[eventCount]; 
        newEvent.id = eventCount; 
        newEvent.name = _name; 
        newEvent.Time = _Time; 
        newEvent.organizer = msg.sender; 
        newEvent.sectorCount=0;
    }

    function createSector(uint _eventId, string memory _name, uint _totalSeats, uint _seat_x_lines) internal onlyOrganizer { 
        require(events[_eventId].organizer == msg.sender, "Non sei l'organizzatore dell'evento"); 
        Event storage _event = events[_eventId]; 
        _event.sectorCount++; 
        Sector storage newSector = _event.sectors[_event.sectorCount]; 
        newSector.id = _event.sectorCount; 
        newSector.name = _name; 
        newSector.totalSeats = _totalSeats; 
        newSector.availableSeats = _totalSeats; 
        string[26] memory lettersSeats = [
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", 
            "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
        ];
        // Generiamo i posti per il settore
        /*
        uint rows = _totalSeats / _seat_x_lines; // Assumiamo 10 posti per fila
        for (uint i = 1; i <= rows; i++) {
            for (uint j = 1; j <= _seat_x_lines; j++) {
                
                string memory seat = string(abi.encodePacked(uintToString(i), lettersSeats[j - 1])); 
                newSector.seats.push(seat);
            }
        }*/
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

    }

    function uintToString(uint v) internal pure returns (string memory) {
        if (v == 0) {
            return "0";
        }
        uint temp = v;
        uint digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (v != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint(v % 10)));
            v /= 10;
        }
        return string(buffer);
    }
 
    function createTicket(uint _eventId, uint _sectorId, uint _originalPrice)internal onlyOrganizer{ 
 
        require(events[_eventId].organizer==msg.sender, "Non the organizer of the event"); 
        Sector storage sector=events[_eventId].sectors[_sectorId]; 
        require(sector.availableSeats>0, "No seats"); 
 
        ticketCount++; 
        Ticket storage newTicket = tickets[ticketCount]; 
        newTicket.id = ticketCount; 
        newTicket.eventId = _eventId; 
        newTicket.sectorId = _sectorId; 
        newTicket.owner = msg.sender;
        newTicket.status = TicketStatus.Available;
        newTicket.groupId = 0; 
        newTicket.originalPrice = _originalPrice * 1000000000000000000; //convertion to ether (Possiamo vedere come modificare questo valore per renderlo più comodo a noi)

        sector.availableSeats--; 
 
    } 
 
 
    function getEvent(uint _eventId) external view returns (uint id, string memory name, uint Time, address organizer, uint sectorCount) { 
        Event storage _event = events[_eventId]; 
        return ( 
            _event.id, 
            _event.name, 
            _event.Time, 
            _event.organizer, 
            _event.sectorCount
        ); 
    } 

    function getEventWithSectors(uint _eventId) 
    external 
    view 
    returns (
        uint id, 
        string memory name, 
        uint Time, 
        address organizer, 
        uint sectorCount, 
        Sector[] memory sectors
    ) 
    {
        Event storage _event = events[_eventId];

        // Creiamo un array temporaneo per contenere i settori dell'evento
        Sector[] memory _sectors = new Sector[](_event.sectorCount);

        for (uint i = 1; i <= _event.sectorCount; i++) {
            Sector storage _sector = _event.sectors[i];
            _sectors[i - 1] = _sector;
        }

        return (
            _event.id,
            _event.name,
            _event.Time,
            _event.organizer,
            _event.sectorCount,
            _sectors
        );
    }

    function getSector(uint _eventId, uint _sectorId) external view returns (
        uint id, 
        string memory name, 
        uint totalSeats, 
        uint availableSeats, 
        string memory seatLayout
    ) {
        Event storage _event = events[_eventId];
        Sector storage _sector = _event.sectors[_sectorId];

        string memory layout = "";

        // Itera su tutti i posti nel settore
        for (uint i = 0; i < _sector.seats.length; i++) {
            string memory seat = _sector.seats[i]; // Ottiene il posto

            // Aggiunge il posto al layout con uno spazio tra i posti
            if (bytes(layout).length > 0) {
                layout = string(abi.encodePacked(layout, " ", seat));
            } else {
                layout = seat; // Il primo posto non ha spazio precedente
            }
        }

        return (
            _sector.id,
            _sector.name,
            _sector.totalSeats,
            _sector.availableSeats,
            layout
        );
    }
 
    function getTicket(uint _ticketId) external view returns (uint id,uint eventId,uint sectorId,address owner,TicketStatus status,uint groypId,string memory seat,uint originalPrice) { 
 
        Ticket storage _ticket = tickets[_ticketId]; 
        return ( 
            _ticket.id, 
            _ticket.eventId, 
            _ticket.sectorId, 
            _ticket.owner, 
            _ticket.status, 
            _ticket.groupId,
            _ticket.seat,
            _ticket.originalPrice 
        );
    } 

    function buyTicket(uint _ticketId) external payable  { 

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
 
    function sellTicket(uint _ticketId) external { 
        Ticket storage _ticket = tickets[_ticketId]; 
        require(_ticket.owner==msg.sender, "Non the owner of the event"); 
        require(_ticket.status==TicketStatus.Owned, "Non onwed"); 
 
        _ticket.status = TicketStatus.Available;
    }   
        
    function assignSeats(uint _eventId, uint _sectorId) external onlyOrganizer {
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
}