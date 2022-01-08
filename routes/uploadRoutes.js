const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { uuid } = require('uuidv4');

const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const config = {
  region: 'eu-central-1',
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
}

const params = {
  Bucket: 'my-blog-post',
  ContentType: 'jpeg',
};

const client = new S3Client(config);

module.exports = app => {
  app.get('/api/upload', requireLogin, async (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;
    const command = new PutObjectCommand({ ...params, Key: key });
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    res.send({ url, key });
  });
};
