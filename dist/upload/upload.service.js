"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const aws_sdk_1 = require("aws-sdk");
class UploadService {
    async upload(file, fileName, bucketName = 'kfc-user-profile', acl = 'public-read') {
        const extension = file.originalname.split('.');
        const newFileName = fileName + extension[extension.length - 1];
        return this.uploadS3(file.buffer, bucketName, newFileName, acl);
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
        return new aws_sdk_1.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
}
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map