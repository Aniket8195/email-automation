import dotenv from 'dotenv';

dotenv.config();

export const {
  DATABASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  OUTLOOK_CLIENT_ID,
  OUTLOOK_CLIENT_SECRET,
  OUTLOOK_TENANT_ID,
  BING_API_KEY,
} = process.env;
