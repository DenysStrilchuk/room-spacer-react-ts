export interface IUser {
    uid: string;
    name?: string;
    email: string | null;
    position?: string;
    rooms?: string;
    picture?: string;
    createdAt?: Date;
    updatedAt?: Date;
}