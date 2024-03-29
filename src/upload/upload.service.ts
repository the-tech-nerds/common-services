import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { FileService } from './file.service';

@Injectable()
export class UploadService {
  constructor(private fileService: FileService) {}
  async upload(
    file: any,
    fileName: any = undefined,
    folder: string,
    type: string,
    type_id = 0,
    bucketName = 'khan-fresh-corner',
    acl = 'public-read',
  ) {
    const extension = file.originalname.split('.');
    const newFileName = !fileName
      ? `${uuid()}.${extension[extension.length - 1]}`
      : `${fileName}.${extension[extension.length - 1]}`;
    return this.uploadS3(
      file,
      bucketName,
      folder,
      type,
      type_id,
      newFileName,
      acl,
    );
  }

  async uploadS3(file, bucket, folder, type, type_id, name, acl) {
    const s3 = await this.getS3();
    const params = {
      Bucket: bucket,
      Key: `${folder}/${name}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: acl,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, async (err, data) => {
        if (err) {
          reject(err.message);
        }
        const res = await this.fileService.save({
          url: data.Location,
          type: type,
          type_id: type_id,
        });
        resolve({
          id: res.insertId,
          url: data.Location,
          type,
        });
      });
    });
  }
  async deleteFromS3(bucket, folder, type_id, url) {
    const s3 = await this.getS3();
    const index = url.lastIndexOf('/') + 1;
    const filename = url.substr(index);
    const params = {
      Bucket: bucket,
      Key: `${folder}/${filename}`,
    };

    return new Promise((resolve, reject) => {
      s3.deleteObject(params, async (err, data) => {
        if (err) {
          reject(err.message);
        }
        const res = await this.fileService.delete(Number(type_id));
        resolve(res);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
