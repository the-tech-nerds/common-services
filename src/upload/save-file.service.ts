import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { FileStorage } from './model/file-storage.model';

@Injectable()
export class SaveFileService {
  async execute(model: FileStorage): Promise<any> {
    const connection = getManager();
    const { url = '', type = '' } = model;
    const sql = `insert into file_storage (url,type) values('${url}', '${type}')`;
    const file = await connection.query(sql);
    return file;
  }
}
