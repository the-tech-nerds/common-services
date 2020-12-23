import { Response } from 'express';
import { Injectable } from '@nestjs/common';

interface ResponseModel {
  message: string[] | string;
  status: string;
  code: number;
  data: any;
}

@Injectable()
export class ApiResponseService {
  response(
    message: string[] | string,
    status: string,
    code: number,
    data: any[] | any,
    res: Response,
  ): Response<ResponseModel> {
    return res.status(200).json({
      message,
      status,
      code,
      data,
    });
  }

  successResponse(
    message: string[] | string,
    data: any,
    res: Response,
  ): Response<ResponseModel> {
    return res.status(200).json({
      message,
      status: 'success',
      code: 200,
      data,
    });
  }

  notFoundError(message: string[], res: Response): Response<ResponseModel> {
    return res.status(404).json({
      message,
      status: 'Not Found',
      code: 404,
      data: null,
    });
  }

  badRequestError(
    message: string[] | string,
    res: Response,
  ): Response<ResponseModel> {
    return res.status(400).json({
      message,
      status: 'Bad request',
      code: 400,
      data: null,
    });
  }

  unAuthorizedError(
    message: string[] | string,
    res: Response,
  ): Response<ResponseModel> {
    return res.status(401).json({
      message,
      status: 'Unauthorized',
      code: 401,
      data: null,
    });
  }

  forbiddenError(
    message: string[] | string,
    res: Response,
  ): Response<ResponseModel> {
    return res.status(403).json({
      message,
      status: 'Forbidden',
      code: 403,
      data: null,
    });
  }

  internalServerError(
    message: string[] | string,
    res: Response,
  ): Response<ResponseModel> {
    return res.status(500).json({
      message,
      status: 'failure',
      code: 500,
      data: null,
    });
  }
}
