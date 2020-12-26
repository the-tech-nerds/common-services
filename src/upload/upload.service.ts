import { S3 } from 'aws-sdk';

export class UploadService {
  async upload(file, bucketName = 'kfc-user-profile', acl = 'public-read') {
    const { originalname } = file;
    return this.uploadS3(file.buffer, bucketName, originalname, acl);
  }

  async uploadS3(file, bucket, name, acl) {
    const s3 = await this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: acl,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
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
