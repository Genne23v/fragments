const MemoryDB = require('../memory/memory-db');
const s3Client = require('./s3Client');
const { PutObjectCommand, GetObjectCommand, DeleteBucketCommand } = require('@aws-sdk/client-s3');
const logger = require('../../../logger');
const metadata = new MemoryDB();
require('dotenv').config();

const streamToBuffer = (stream) => {
  new Promise((resolve, reject) => {
    let chunks = [];

    stream.on('data', (chunk) => {
      console.log('CHUNK', chunk);
      chunks.push(chunk);
    });
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

function writeFragment(fragment) {
  return metadata.put(fragment.ownerId, fragment.id, fragment);
}

function readFragment(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  const command = new GetObjectCommand(params);

  try {
    logger.debug({ ownerId, id }, 'DATA RETURNED FROM READ FRAGMENT');
    const data = s3Client.send(command);
    logger.debug({ data }, 'DATA RETRIEVED FROM S3');
    return streamToBuffer(data.Body);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ Bucket, Key }, 'Error getting metadata from S3');
    throw new Error('Unable to read fragment metadata');
  }
  // return metadata.get(ownerId, id);
}

async function writeFragmentData(ownerId, id, value) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
    Body: value,
  };

  const command = new PutObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    logger.info({ data }, 'WRITE FRAGMENT DATA');
    console.log(data);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error uploading fragment data to S3');
    throw new Error('Unable to upload fragment data');
  }
}

async function readFragmentData(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  const command = new GetObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    return streamToBuffer(data.Body);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error streaming fragment data from S3');
    throw new Error('Unable to read fragment data');
  }
}

async function listFragments(ownerId, expand = false) {
  const fragments = await metadata.query(ownerId);

  // If we don't get anything back, or are supposed to give expanded fragments, return
  if (expand || !fragments) {
    return fragments;
  }

  // Otherwise, map to only send back the ids
  return fragments.map((fragment) => fragment.id);
}

async function deleteFragment(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}}`,
  };

  const command = new DeleteBucketCommand(params);

  try {
    await s3Client.send(command);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error deleting fragment data in S3');
    throw new Error('Unable to delete fragment data');
  }
}

module.exports.listFragments = listFragments;
module.exports.writeFragment = writeFragment;
module.exports.readFragment = readFragment;
module.exports.writeFragmentData = writeFragmentData;
module.exports.readFragmentData = readFragmentData;
module.exports.deleteFragment = deleteFragment;

const s3 = {
  level: 30,
  time: 1669173063158,
  pid: 7,
  hostname: '5273cbdb2788',
  req: {
    id: 2,
    method: 'POST',
    url: '/v1/fragments',
    query: {},
    params: {},
    headers: {
      host: 'localhost:8080',
      authorization: 'Basic dGVzdDFAdGVzdC5jb206VGVzdDEyMyQ=',
      'user-agent': 'curl/7.84.0',
      accept: '*/*',
      'content-type': 'text/plain',
      'content-length': '4',
    },
    remoteAddress: '::ffff:192.168.80.1',
    remotePort: 63164,
  },
  res: {
    statusCode: 201,
    headers: {
      'content-security-policy':
        "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
      'cross-origin-embedder-policy': 'require-corp',
      'cross-origin-opener-policy': 'same-origin',
      'cross-origin-resource-policy': 'same-origin',
      'x-dns-prefetch-control': 'off',
      'x-frame-options': 'SAMEORIGIN',
      'strict-transport-security': 'max-age=15552000; includeSubDomains',
      'x-download-options': 'noopen',
      'x-content-type-options': 'nosniff',
      'origin-agent-cluster': '?1',
      'x-permitted-cross-domain-policies': 'none',
      'referrer-policy': 'no-referrer',
      'x-xss-protection': '0',
      'access-control-allow-origin': '*',
      location: 'http://localhost:8080/v1/fragments/14ecf4a5-4d4c-454a-bfb0-252c85c0c91f',
      'content-type': 'application/json; charset=utf-8',
      'content-length': '252',
      etag: 'W/"fc-CpmSUxHgVj3jnhnbljKe9BKrO+0"',
      vary: 'Accept-Encoding',
    },
  },
  responseTime: 6,
  msg: 'request completed',
};
