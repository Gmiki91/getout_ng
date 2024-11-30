export type Notification={
    eventId:string;
updateInfo:string;
updateStamp:string;
read:boolean;
}
export default interface User{
    id:string;
    name:string;
    avatarUrl:string;
    notifications:Notification[];
}