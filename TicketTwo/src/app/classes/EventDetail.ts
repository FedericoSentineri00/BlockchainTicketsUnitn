import { SecotrDetails } from "./SectorDetails";
import { TicketDetails } from "./TicketDetails";

export class EventDetails {
    id : number;
    name : string;
    time : Date;
    sectorCount : number;
    totAvailableSeats: number;
    address: string;

    constructor(id : number, name : string, time : Date, sectorCount : number, totAvailableSeats: number, address: string) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.sectorCount = sectorCount;
        this.totAvailableSeats = totAvailableSeats;
        this.address= address
    }
}

export class CompleteEventDetails {
    id : number;
    name : string;
    time : Date;
    sector : SecotrDetails;
    ticket : TicketDetails;

    constructor(id: number, name: string, time : Date, sector : SecotrDetails, ticket : TicketDetails) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.sector = sector;
        this.ticket = ticket;
    }
}