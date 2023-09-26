const express = require('express');
// const { OAuth2Client } = require('google-auth-library');
// const {googleapis} = require('googleapis');
// const fs = require('fs');
const Handler = require('./mail-controllers')
const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET',
    credentials: true, 
    optionsSuccessStatus: 204,
  };

const app = express();
app.use(cors(corsOptions));

app.get('/auth',Handler.redirectToAuth);
app.get('/auth/callback', Handler.handleCallback);
// app.get('/list-emails', Handler.);

app.listen(5000);