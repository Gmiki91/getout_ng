export type Event={
    id:number,
    title:string,
    location:string,
    time:number,
    joined:number;
    min?:number;
    max?:number;
}

export type NewEventData={
    title:string,
    location:string,
    time:number,
    min?:number;
    max?:number;
}