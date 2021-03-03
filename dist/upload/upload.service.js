"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const save_file_service_1 = require("./save-file.service");
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
let UploadService = class UploadService {
    constructor(saveFileService) {
        this.saveFileService = saveFileService;
    }
    async upload(file, fileName = null, folder, type, bucketName = 'khan-fresh-corner', acl = 'public-read') {
        const extension = file.originalname.split('.');
        const newFileName = !fileName
            ? uuid_1.v4()
            : `${fileName}.${extension[extension.length - 1]}`;
        return this.uploadS3(file.buffer, bucketName, folder, type, newFileName, acl);
    }
    async uploadS3(file, bucket, folder, type, name, acl) {
        const s3 = await this.getS3();
        const params = {
            Bucket: bucket,
            Key: `${folder}/${name}`,
            Body: file,
            ACL: acl,
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, async (err, data) => {
                if (err) {
                    reject(err.message);
                }
                const res = await this.saveFileService.execute({
                    url: data.Location,
                    type: type,
                });
                resolve(res);
            });
        });
    }
    getS3() {
        return new aws_sdk_1.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
};
UploadService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [save_file_service_1.SaveFileService])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map