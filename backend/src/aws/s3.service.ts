import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucket = 'nestjs-products';

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.AWS_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });
  }

  private isMulterFile(file: unknown): file is MulterFile {
    return (
      typeof file === 'object' &&
      file !== null &&
      'originalname' in file &&
      'buffer' in file &&
      'mimetype' in file
    );
  }

  async uploadFile(file: unknown): Promise<string> {
    if (!this.isMulterFile(file)) {
      throw new Error('Invalid file format');
    }

    const key = `${uuid()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return `http://localhost:4566/${this.bucket}/${key}`;
  }
}
