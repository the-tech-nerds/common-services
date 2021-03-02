import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { FileStorage } from './model/file-storage.model';

@Injectable()
export class SaveFileService {
  async execute(model: FileStorage): Promise<any> {
    const connection = getManager();
    const sql = `insert into file_storage (url,type) values('${model.url}', '${model.type}')`;
    const file = await connection.query(sql);
    return file;
  }
}
