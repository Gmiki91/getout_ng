export type Event={
    id:string,
    title:string,
    location:string,
    date:number,
    joined:number;
    min?:number;
    max?:number;
}

export type NewEventData={
    title:string,
    location:string,
    date:number,
    min?:number;
    max?:number;
}