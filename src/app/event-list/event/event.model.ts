export type Event={
    id:number,
    title:string,
    location:string,
    time:string,
    joined:number;
    min?:number;
    max?:number;
}

export type NewEventData={
    title:string,
    location:string,
    time:string,
    min?:number;
    max?:number;
}