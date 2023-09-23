// const { OAuth2Client } = require("google-auth-library")
// const oAuth2Client = require('OAuth2Client')
// const { fstat } = require("fs");
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const {googleapis} = require('googleapis');


const CLIENT_ID = '1056023497671-0b8ce0o3nplt5patrscnuf48ivo05mu4.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
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
        fs.writeFileSync('tokens.json', JSON.stringify(tokenResponse.tokens));
        res.json({message:'Authentication Successful!', valid:1});
    }catch(error){
        console.error('Authentication Error:', error);
        res.status(500).json({message:'Authentication failed',valid:0});
    }
};

const listEmails = async (req, res) => {
    try{
        const gmail = googleapis.gmail({version: 'v1', auth: oAuth2Client});
        const response = await gmail.users.message.list({
            userId: 'me'
        });
        const emails = response.data.messages;
        res.json(emails);
    } catch(error) {
        console.error('Error listing emails:', error);
        res.status(500).send('Error listing emails');
    }
};

exports.redirectToAuth = redirectToAuth;
exports.handleCallback = handleCallback;
exports.listEmails = listEmails;