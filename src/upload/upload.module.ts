import { Global, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { UploadService } from './upload.service';

@Global()
@Module({
  providers: [UploadService, FileService],
  exports: [UploadService, FileService],
})
export class UploadModule {}
