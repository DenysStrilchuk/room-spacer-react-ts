export interface IUser {
    uid: string;
    name?: string;
    email: string | null;
    position?: string;
    rooms?: string;
    picture?: string;
    emailVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
