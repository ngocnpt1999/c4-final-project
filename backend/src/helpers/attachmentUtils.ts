import { S3 } from 'aws-sdk';

// const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new S3({ signatureVersion: 'v4' });

const bucketName = process.env.ATTACHMENT_S3_BUCKET;

const exp: number = Number.parseInt(process.env.SIGNED_URL_EXPIRATION);

export function getImage(todoId: string): string {
    const url = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: exp
    });
    return url;
}

export function uploadImage(todoId: string): string {
    const url = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: exp
    });
    return url;
}