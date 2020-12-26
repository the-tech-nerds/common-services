import { S3 } from 'aws-sdk';

export class UploadService {
  async upload(file, bucketName = 'kfc-user-profile') {
    const { originalname } = file;
    await this.uploadS3(file.buffer, bucketName, originalname);
  }

  async uploadS3(file, bucket, name) {
    const s3 = await this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
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
