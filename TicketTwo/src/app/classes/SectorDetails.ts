export class SecotrDetails {
    id : number = 0;
    name : string = "";
    totalSeats : number = 0;
    availableSeats : number = 0;
    seatsXLines : number = 0;
    ticketIds : number[];
    groupIds : number[];

    constructor(id: number, name: string, totalSeats: number , availableSeats: number, seatXLines : number ,ticketIds: number[], groupIds : number[]) {
        this.id = id;
        this.name = name;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.seatsXLines = seatXLines;
        this.ticketIds = ticketIds;
        this.groupIds = groupIds;
    }

}