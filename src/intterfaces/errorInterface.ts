export interface IErrorResponse {
    message?: string;
    errors?: { [key: string]: string };
    code?: string;
    statusCode?: number;
}