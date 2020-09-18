import AWS, { S3, Config } from 'aws-sdk';
import {
  GetObjectOutput,
  ObjectList,
  Bucket,
  CreateBucketOutput,
  Delete,
  // DeleteObjectsOutput,
  ObjectIdentifierList,
  ManagedUpload,
} from 'aws-sdk/clients/s3';
import fs from 'fs';
import config from '../config';
import logger from './logger';

class S3Service {
  private AWSConfig: Config;
  private S3Config: S3.Types.ClientConfiguration;
  private readonly S3: S3;
  private Bucket: string;

  constructor() {
    const { accessKeyId, secretAccessKey, region, bucketName } = config.files;
    this.AWSConfig = new AWS.Config({
      accessKeyId,
      secretAccessKey,
      region,
    });
    this.S3Config = {
      apiVersion: '2006-03-01',
      params: {
        Bucket: bucketName,
      },
    };
    this.Bucket = bucketName;
    this.S3 = new AWS.S3({ ...this.S3Config, ...this.AWSConfig });
  }

  async getSignedUrl(objectKey: string): Promise<string> {
    const expiryTime = 60 * 60;
    const fileUrl = await this.S3.getSignedUrlPromise('getObject', {
      Bucket: this.Bucket,
      Key: objectKey,
      Expires: expiryTime,
    });
    return fileUrl;
  }

  async uploadToS3(file): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { mimetype, filename, path } = file;
      const readStream = fs.createReadStream(path);
      readStream.on('error', (err) => {
        resolve([400, err.message]);
      });
      const params: S3.Types.PutObjectRequest = {
        Bucket: this.Bucket,
        Body: readStream,
        Key: filename,
        ContentType: mimetype,
        ACL: 'public-read',
      };
      // const awsResult = await this.S3.putObject(params).promise();
      this.S3.upload(params, (error, data: ManagedUpload.SendData) => {
        readStream.destroy();
        if (error) {
          logger.info('upload-S3-err:', error.message);
          resolve([400, error.message]);
        }
        /**
        {
          ETag: '"xx"',
          Location: 'https://xx.com/xx.jpg',
          key: 'xx.jpg',
          Bucket: 'xx'
        }*/
        resolve([200, data]);
      });
    });
  }

  /**
   * delete single file
   * @param filename
   */
  deleteFile(filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const filesToDelete: Delete = { Objects: [{ Key: filename }] };
      const bucket = this.Bucket;
      this.S3.deleteObjects({ Bucket: bucket, Delete: filesToDelete }, (error, data) => {
        if (error) {
          resolve([400, error.message]);
        } else {
          // { Deleted: [ { Key: 'xx.jpg' } ], Errors: [] }
          // const { Deleted } = data;
          resolve([200, data]);
        }
      });
    });
  }

  /**
   * delete many file
   * files: ["", ""]
   * @param files
   */
  deleteManyFile(files: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      // [{ Key: 'xxx' }, { Key: 'xxx' }];
      const fileList: ObjectIdentifierList = files.map((item) => {
        return { Key: item };
      });
      const filesToDelete: Delete = { Objects: fileList };
      const bucket = this.Bucket;
      this.S3.deleteObjects({ Bucket: bucket, Delete: filesToDelete }, (error, data) => {
        if (error) {
          resolve([400, error.message]);
        } else {
          resolve([200, data]);
        }
      });
    });
  }

  // get list
  getFileLists(): Promise<any> {
    return new Promise<ObjectList>((resolve, reject) => {
      const bucket = this.Bucket;
      // const awsResult = await this.S3.listObjects({ Bucket: bucket }).promise();
      this.S3.listObjects({ Bucket: bucket }, (error, data) => {
        if (error) {
          reject(error.message);
        } else {
          resolve(data.Contents || []);
        }
      });
    });
  }

  // get file info by filename
  getFileInfo(name: string): Promise<any> {
    return new Promise<GetObjectOutput>((resolve, reject) => {
      const bucket = this.Bucket;
      this.S3.getObject({ Bucket: bucket, Key: name }, (error, data) => {
        if (error) {
          reject(error.message);
        } else {
          resolve(data);
        }
      });
    });
  }

  // check file exist
  checkFileExist(name: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.getFileInfo(name)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  // get all buckets
  getBuckets(): Promise<any> {
    return new Promise<Bucket[]>((resolve, reject) => {
      this.S3.listBuckets((error, data) => {
        if (error) {
          reject(error.message);
        } else {
          resolve(data.Buckets || []);
        }
      });
    });
  }

  // check Bucket Exist
  checkBucketExist(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const bucket = this.Bucket;
      this.S3.headBucket({ Bucket: bucket }, (error) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  // create Bucket
  createBucket(bucket: string): Promise<any> {
    return new Promise<CreateBucketOutput>((resolve, reject) => {
      this.S3.createBucket({ Bucket: bucket }, (error, data) => {
        if (error) {
          reject(error.message);
        } else {
          resolve(data);
        }
      });
    });
  }
}

export default new S3Service();
