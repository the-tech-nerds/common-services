import { Response } from 'express';
interface ResponseModel {
    message: string[] | string;
    status: string;
    code: number;
    data: any;
}
export declare class ApiResponseService {
    response(message: string[] | string, status: string, code: number, data: any[] | any, res: Response): Response<ResponseModel>;
    successResponse(message: string[] | string, data: any, res: Response): Response<ResponseModel>;
    notFoundError(message: string[], res: Response): Response<ResponseModel>;
    badRequestError(message: string[] | string, res: Response): Response<ResponseModel>;
    unAuthorizedError(message: string[] | string, res: Response): Response<ResponseModel>;
    forbiddenError(message: string[] | string, res: Response): Response<ResponseModel>;
    internalServerError(message: string[] | string, res: Response): Response<ResponseModel>;
}
export {};
