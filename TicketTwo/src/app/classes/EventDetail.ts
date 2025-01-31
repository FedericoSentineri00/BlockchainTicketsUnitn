export class EventDetails {
    id : number;
    name : string;
    time : Date;
    sectorCount : number;
    totAvailableSeats: number;

    constructor(id : number, name : string, time : Date, sectorCount : number, totAvailableSeats: number) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.sectorCount = sectorCount;
        this.totAvailableSeats = totAvailableSeats;
    }
}