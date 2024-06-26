import express, { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { PublicClientApplication } from '@azure/msal-node';
import { PrismaClient } from '@prisma/client';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET } from './config';
import { google } from 'googleapis';

const router = express.Router();
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

router.get('/auth/google', (req: Request, res: Response) => {
  const authUrl = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.labels',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.insert',
    'https://www.googleapis.com/auth/gmail.settings.basic',
    'https://www.googleapis.com/auth/gmail.settings.sharing',
    'https://www.googleapis.com/auth/gmail.metadata',
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
    'https://www.googleapis.com/auth/gmail.addons.current.message.action',
    'https://www.googleapis.com/auth/gmail.addons.current.message.metadata'
       
    ],
    redirect_uri: 'http://localhost:3000/auth/google/callback',
  });
  res.redirect(authUrl);
});

router.get('/auth/google/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send('Missing code parameter');
  }
  const redirectUri = 'http://localhost:3000/auth/google/callback';
  try {
    const { tokens } = await googleClient.getToken({
      code: code,
      redirect_uri: redirectUri,
      client_id: GOOGLE_CLIENT_ID,
      
    });

    googleClient.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: googleClient, version: 'v2' });
    const userInfo = await oauth2.userinfo.get();

    await prisma.user.create({
      data: {
        email: userInfo.data.email ?? '',
        provider: 'google',
        accessToken: tokens.access_token as string,
        refreshToken: tokens.refresh_token ?? '',
      },
    });

    res.send('Google OAuth successful!');
  } catch (error) {
    console.error('Error during OAuth callback', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
