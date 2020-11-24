export interface AuthorizationCode {
    code: string,
}

export interface Token {
    access_token: {
        value: string,
        client_id: string,
        user_id: string,
        id: string,
    };
}

export interface GenericResponse<T> {
    code: number,
    message: Array<string>,
    data: T,
}