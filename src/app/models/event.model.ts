export type Event={
    id:string,
    title:string,
    location:string,
    time:string,
    joined:string[];
    min:number;
    max?:number;
    info:string;
}

export type NewEventData={
    title:string,
    location:string,
    time:string,
    min:number;
    max?:number;
    info?:string;
    ownerId?:string
}