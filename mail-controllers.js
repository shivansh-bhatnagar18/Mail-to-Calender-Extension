// const { OAuth2Client } = require("google-auth-library")
// const oAuth2Client = require('OAuth2Client')
// const { fs } = require("fs");
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const {google} = require('googleapis')


const CLIENT_ID = '<CLIENT-ID>';
const CLIENT_SECRET = '<CLIENT SECRET>';
const REDIRECT_URL = 'http://localhost:5000/auth/callback';

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];


const redirectToAuth = (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    res.redirect(authUrl);
};

const handleCallback = async (req, res) => {
    const {code} = req.query;
    try{
        const tokenResponse = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokenResponse.tokens);

        const gmail = google.gmail({version: 'v1', auth: oAuth2Client});

        const responseMessage = await gmail.users.messages.list({
            userId: 'me',
        });
        const emails = responseMessage.data.messages;

        let LIST_MAILS = [];
        for (let i = 0; i<10; i++){
            const messageId = emails[i].id;
            const message_full = await getMessageBody(gmail, messageId);

            if(message_full){
            LIST_MAILS.push({"id":i, "message":message_full});
            }
        }
        //     const response_2 = await gmail.users.messages.get({
        //         userId: 'me',
        //         id: messageId
        //     });
        //     const mail = response_2.data.snippet;
        //     LIST_MAILS.push({"id":i, "body":mail});
        //     // for (const elements of mail){
        //     //     if(elements.name === "Subject")
        //     //     LIST_MAILS.push({"id":i,"title":elements});
        //     // }
            
        // }
        res.send(LIST_MAILS);

        // fs.writeFileSync('../tokens.json', JSON.stringify(tokenResponse.tokens));
        // fs.writeFileSync('../front/src/tokens.json',{"code":JSON.stringify(code)})

    }catch(error){
        console.error('Authentication Error:', error);
        res.status(500).json({message:'Authentication failed'});
    }
};

const getMessageBody = async (gmail, messageId) => {
    try{
    const response = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
    });
    const message = response.data;
    const messageBody = message.payload.parts[0].body.data;

    const decodedMessageBody = Buffer.from(messageBody, 'base64').toString('utf-8');
    console.log(decodedMessageBody);
    return decodedMessageBody;
    }
   catch (error) {
    console.error('Error fetching message body:', error);
  }
}

exports.redirectToAuth = redirectToAuth;
exports.handleCallback = handleCallback;
// exports.listEmails = listEmails;