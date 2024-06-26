import express from 'express';
import { Worker, Queue } from 'bullmq';
import { google } from 'googleapis';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET, OUTLOOK_TENANT_ID, BING_API_KEY } from './config';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ClientSecretCredential } from '@azure/identity';
import axios from 'axios';

const connection = {
  host: 'localhost',
  port: 6379,
};
const myQueue = new Queue('my-queue', { connection });

const worker = new Worker('my-queue', async job => {
  const { user, email } = job.data;

  console.log(`Processing email ${email.id} for user ${user.email}`);
  let emailDetails: any;
  try {
   
      emailDetails = await getGoogleEmailDetails(user, email.id);
    

    const { subject, body, from } = emailDetails;

    
    console.log(`Generating reply for email body: ${body}`);
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${BING_API_KEY}`, {
      contents: [
        {
          parts: [
            { text: body }
          ]
        }
      ]
    });

    console.log(`API response: ${JSON.stringify(response.data)}`);
    const replyText = response.data.contents[0].parts[0].text;
    console.log(`Generated reply: ${replyText}`);

   
    if (user.provider === 'google') {
      await sendGoogleReply(user, from, subject, replyText);
    } else if (user.provider === 'outlook') {
      await sendOutlookReply(user, from, subject, replyText);
    }
  } catch (error: any) {
    console.error(`Error processing email ${email.id} for user ${user.email}: ${error.message}`);
  }
}, { connection });

const getGoogleEmailDetails = async (user: any, emailId: string) => {
  const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: emailId,
    format: 'minimal', 
  });

  console.log(`Google API response for user ${user.email}: ${JSON.stringify(res.data)}`);

  const headers = res.data.payload?.headers || [];
  const subject = headers.find(header => header.name === 'Subject')?.value;
  const from = headers.find(header => header.name === 'From')?.value;
  const body = getBody(res.data.payload);

  return { subject, body, from };
};

const getBody = (payload: any): string => {
  let body = '';

  const traverseParts = (parts: any[]) => {
    for (const part of parts) {
      if (part.parts) {
        traverseParts(part.parts);
      } else if (part.mimeType === 'text/plain' && part.body.data) {
        body += Buffer.from(part.body.data, 'base64').toString('utf8');
      } else if (part.mimeType === 'text/html' && part.body.data) {
        body += Buffer.from(part.body.data, 'base64').toString('utf8'); 
      }
    }
  };

  if (payload.parts) {
    traverseParts(payload.parts);
  } else if (payload.body && payload.body.data) {
    body = Buffer.from(payload.body.data, 'base64').toString('utf8');
  }

  console.log(`Extracted body: ${body}`);
  return body;
};

const getOutlookEmailDetails = async (user: any, emailId: string) => {
  const credential = new ClientSecretCredential(
    OUTLOOK_TENANT_ID || '',
    OUTLOOK_CLIENT_ID || '',
    OUTLOOK_CLIENT_SECRET || ''
  );

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  });

  const client = Client.initWithMiddleware({
    authProvider,
  });

  const res = await client.api(`/me/messages/${emailId}`).get();

  const subject = res.subject;
  const body = res.body.content;
  const from = res.from.emailAddress.address;

  return { subject, body, from };
};

const sendGoogleReply = async (user: any, from: string, subject: string, replyText: string) => {
  const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const raw = [
    `From: ${user.email}`,
    `To: ${from}`,
    `Subject: Re: ${subject}`,
    '',
    replyText,
  ].join('\n');

  const encodedMessage = Buffer.from(raw)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log(`Reply sent to ${from} for Google user ${user.email}`);
};

const sendOutlookReply = async (user: any, from: string, subject: string, replyText: string) => {
  const credential = new ClientSecretCredential(
    OUTLOOK_TENANT_ID || '',
    OUTLOOK_CLIENT_ID || '',
    OUTLOOK_CLIENT_SECRET || ''
  );

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  });

  const client = Client.initWithMiddleware({
    authProvider,
  });

  await client.api('/me/sendMail').post({
    message: {
      subject: `Re: ${subject}`,
      body: {
        contentType: 'Text',
        content: replyText,
      },
      toRecipients: [
        {
          emailAddress: {
            address: from,
          },
        },
      ],
    },
    saveToSentItems: 'true',
  });

  console.log(`Reply sent to ${from} for Outlook user ${user.email}`);
};

console.log('Worker is running...');
