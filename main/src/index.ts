import express from 'express';
import { Queue } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { google } from 'googleapis';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ClientSecretCredential } from '@azure/identity';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET, OUTLOOK_TENANT_ID } from './config';
import authRoutes from './authController';
import userRoutes from './userController';
import cors from 'cors';

const connection = {
  host: 'localhost',
  port: 6379,
};

const app = express();
const prisma = new PrismaClient();
const myQueue = new Queue('my-queue', { connection });
const scheduleQueue = new Queue('schedule-queue', { connection });
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));
app.use(express.json());
app.use(authRoutes);
app.use(userRoutes);

cron.schedule('*/10 * * * * *', async () => {
 // console.log('Checking for new emails...');
  const users = await prisma.user.findMany();
  //console.log(`Found ${users.length} users.`);
  const userPromises = users.map(async (user) => {
    //console.log(`Processing user ${user.email}`);
    try {
      await enqueueEmailProcessing(user.id);
    } catch (error: any) {
      console.error(`Error processing user ${user.email}: ${error.message}`);
    }
  });
  await Promise.all(userPromises);
  //console.log('Done checking for new emails.');
});
cron.schedule('*/10 * * * * *', async () => {
 // console.log('Checking for scheduled emails...');
  const currentDateTime = new Date();
  const schedules = await prisma.schedule.findMany({
    where: {
      sendAt: { lt: currentDateTime },
      status: 1,
    },
  });
  //console.log(`Found ${schedules.length} schedules.`);
  const schedulePromises = schedules.map(async (schedule) => {
    console.log(`Processing schedule ${schedule.id}`);
    try {
      await enqueueScheduledEmail(schedule);
    } catch (error: any) {
      console.error(`Error processing schedule ${schedule.id}: ${error.message}`);
    }
  });
  await Promise.all(schedulePromises);
  //console.log('Done checking for scheduled emails.');

});
export const enqueueScheduledEmail = async (schedule: any) => {
  const user = await prisma.user.findUnique({
    where: { id: schedule.userId },
  });
  if (!user) {
    throw new Error(`User with id ${schedule.userId} not found.`);
  }
  const template = await prisma.template.findUnique({
    where: { id: schedule.templateId },
  });

  //console.log(`Processing schedule ${schedule.id} for user ${user.email}`);
  await scheduleQueue.add('processScheduledEmail', {schedule,user,template });
}

const getGoogleUnreadEmails = async (user: any) => {
  const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const res = await gmail.users.messages.list({
    userId: 'me',
    //q: 'is:unread',
  });

  //console.log(`Google API response for user ${user.email}: ${JSON.stringify(res.data)}`);
  return res.data.messages || [];
};

export const enqueueEmailProcessing = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error(`User with id ${userId} not found.`);
  }

  //console.log(`Processing user ${user.email}`);
  let unreadEmails = [];

 
    //console.log(`Getting unread emails for user ${user.email}`);
    unreadEmails = await getGoogleUnreadEmails(user);
  

  //console.log(`Found ${unreadEmails.length} unread emails for user ${user.email}`);
  //console.log(`Enqueuing emails for processing...`);

  for (const email of unreadEmails) {
    await myQueue.add('processEmail', { user, email });
  }
};

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
