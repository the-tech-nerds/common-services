import { S3 } from 'aws-sdk';
export declare class UploadService {
    upload(file: any, bucketName?: string, acl?: string): Promise<unknown>;
    uploadS3(file: any, bucket: any, name: any, acl: any): Promise<unknown>;
    getS3(): S3;
}
