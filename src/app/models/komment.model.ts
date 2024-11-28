export type Komment={
    id:string;
    text:string;
    timestamp:string;
    userName:string;
    userAvatarUrl:string;
}
export type NewKommentData={
    text:string;
    timestamp:string;
    userId:string;
    eventId:string
}