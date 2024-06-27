import express from 'express';
import { Worker, Queue } from 'bullmq';
import { google } from 'googleapis';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BING_API_KEY } from './config';
import axios from 'axios';
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");


const genAI = new GoogleGenerativeAI(BING_API_KEY);

interface User {
  email: string;
  accessToken: string;
  refreshToken: string;
}

interface Email {
  id: string;
}

interface JobData {
  user: User;
  email: Email;
}

const connection = {
  host: 'localhost',
  port: 6379,
};

const myQueue = new Queue<JobData>('my-queue', { connection });

const worker = new Worker<JobData>('my-queue', async job => {
  const { user, email } = job.data;

  console.log(`Processing email ${email.id} for user ${user.email}`);
  let emailDetails;
  try {
    emailDetails = await getGoogleEmailDetails(user, email.id);

    const { subject, body, sender } = emailDetails;

    console.log(`Extracted body: ${body}`);

    const replyText = await generateReply(body);
    console.log(`Generated reply: ${replyText}`);

    await sendGoogleReply(user, sender || ' ', subject || '', replyText);
  } catch (error: any) {
    console.error(`Error ${email.id} for user ${user.email}: ${error.message}`);
  }
}, { connection });

const getGoogleEmailDetails = async (user: User, emailId: string) => {
  const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  try {
    console.log(`Fetching email details for email ID: ${emailId}`);
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      format: 'full',
    });
    console.log('API Response:', res.data);

    if (!res.data || !res.data.payload) {
      throw new Error('Invalid email payload');
    }
    const headers = res.data.payload.headers || [];
    const subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject';
    const sender = headers.find(header => header.name === 'From')?.value || 'No Sender';
    const body = getBody(res.data.payload);
    return { subject, body, sender };
  } catch (error: any) {
    console.error(`Error getting email details for email ${emailId} for user ${user.email}: ${error.message}`);
    throw error;
  }
};

const getBody = (payload: any): string => {
  let body = '';

  const traverseParts = (parts: any) => {
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

  return body;
};

const generateReply = async (body: string): Promise<string> => {
  const prompt = `Analyze the email content below and determine whether the sender is interested, not interested, or requesting more information about our services. Generate an appropriate response based on this categorization.

Email content: ${body}`;

  try {
    console.log(`Generating reply for body: ${body}`);
  
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      prompt,
      
    ]);

    if (result && result.response && result.response.text) {
      return result.response.text();
    } else {
      throw new Error('Invalid response from generative AI model');
    }
  } catch (error: any) {
    console.error(`Error generating reply: ${error.message}`);
    throw error;
  }
};

const sendGoogleReply = async (user: User, from: string, subject: string, replyText: string) => {
  const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  console.log(`Sending reply from: ${from}`);

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

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(`Reply sent to ${from} for Google user ${user.email}`);
  } catch (error: any) {
    console.error(`Error sending reply to ${from} for Google user ${user.email}: ${error.message}`);
    throw error;
  }
};


console.log('Worker is running...');
