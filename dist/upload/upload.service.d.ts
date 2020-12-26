import { S3 } from 'aws-sdk';
export declare class UploadService {
    upload(file: any, bucketName?: string): Promise<void>;
    uploadS3(file: any, bucket: any, name: any): Promise<unknown>;
    getS3(): S3;
}
