import express from 'express';
import { Worker, Queue } from 'bullmq';
import { google } from 'googleapis';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BING_API_KEY } from './config';
import { User,Schedule,Template } from "./interfaces";


const connection = {
    host: 'localhost',
    port: 6379,
  };
interface JobData {
    schedule: Schedule;
    user: User;
    template: Template;
}
  const scheduleQueue = new Queue<JobData>('schedule-queue', { connection });

    const worker = new Worker<JobData>('schedule-queue', async job => {
        const { schedule,user,template } = job.data;
    
        console.log(`Processing schedule ${schedule.id}`);
        try {
        await sendScheduledEmail(schedule,user,template);
        } catch (error: any) {
        console.error(`Error processing schedule ${schedule.id}: ${error.message}`);
        }
    }, { connection });

    const sendScheduledEmail = async (schedule: Schedule,user: User,template: Template) => {
        try {
          const auth = await getAuthClient(user);
          const gmail = google.gmail({ version: 'v1', auth });
        console.log(`Sending email for schedule ${schedule.id}`);
        const raw = [
          `From: ${user.email}`,
          `To: ${schedule.recipient}`,
          `Subject: Re: ${schedule.subject}`,
          '',
          template.body+schedule.body,
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
        console.log(`Email sent for schedule ${schedule.id}`);
        } catch (error:any) {
          console.error(`Error sending email for schedule ${schedule.id}: ${error.message}`);
        }
    };
    const getAuthClient = async (user: User) => {
      const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
      oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken,
      });
      return oauth2Client;
    };
    console.log('Worker started');