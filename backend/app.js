const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const {googleapis} = require('googleapis');
const fs = require('fs');
const Handler = require('./mail-controllers')

const app = express();

app.get('/auth',Handler.redirectToAuth);
app.get('/auth/callback', Handler.handleCallback);

app.get('/list-emails', Handler.listEmails);

app.listen(5000);