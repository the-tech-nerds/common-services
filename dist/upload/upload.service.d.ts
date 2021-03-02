import { SaveFileService } from './save-file.service';
import { S3 } from 'aws-sdk';
export declare class UploadService {
    private saveFileService;
    constructor(saveFileService: SaveFileService);
    upload(file: any, fileName: any, folder: any, type: any, bucketName?: string, acl?: string): Promise<unknown>;
    uploadS3(file: any, bucket: any, folder: any, type: any, name: any, acl: any): Promise<unknown>;
    getS3(): S3;
}
