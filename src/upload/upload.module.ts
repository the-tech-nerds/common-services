import { Global, Module } from '@nestjs/common';
import { SaveFileService } from './save-file.service';
import { UploadService } from './upload.service';

@Global()
@Module({
  providers: [UploadService, SaveFileService],
  exports: [UploadService, SaveFileService],
})
export class UploadModule {}
