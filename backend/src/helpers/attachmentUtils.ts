import * as AWS from 'aws-sdk'
import { S3 } from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new S3({ signatureVersion: 'v4' });

const bucketName = process.env.S3_BUCKET_NAME;

export function getImage(todoId: string): string {
    const url = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: 60 * 60
    });
    return url;
}

export function uploadImage(todoId: string): string {
    const url = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: 60 * 60
    });
    return url;
}