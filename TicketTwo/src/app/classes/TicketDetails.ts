export enum TicketStatus {
    Available,
    Owned,
    Validated,
    Expired
}

export class TicketDetails {
    id: number;
    eventId: number;
    sectorId: number;
    groupId: number;
    originalPrice: number;
    status: TicketStatus;
    seat: string;
    hashName: string;

    constructor(id: number, eventId: number, sectorId: number, groupId: number, originalPrice: number, status: TicketStatus, seat: string, hashName: string) {
        this.id = id;
        this.eventId = eventId;
        this.sectorId = sectorId;
        this.groupId = groupId;
        this.originalPrice = originalPrice;
        this.status = status;
        this.seat = seat;
        this.hashName = hashName;
    }
}