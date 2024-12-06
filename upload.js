const createReadStream = require('fs').createReadStream;
const path = require('path');
const process = require('process');
const {google} = require('googleapis');

const pkey = require('./key.json');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function authorize() {
    const jwtClient = new google.auth.JWT(
        pkey.client_email,
        null,
        pkey.private_key,
        SCOPES
    )

    await jwtClient.authorize();

    return jwtClient;
}

async function uploadFile(authClient) {

    const drive = google.drive({ version: 'v3', auth: authClient });

    const file = await drive.files.create({
        media: {
            body: createReadStream('test.txt')
        },
        fields: 'id, name',
        requestBody: {
            name: path.basename('test.txt'),
            parents: ["1207d9YqpwMjyNPfzASkQyLvLTWWhN1lx"] //Drive Folder ID
        }
    });

    console.log(file.data.id);
}

authorize().then(uploadFile).catch(console.error);

