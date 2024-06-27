# Email Automation Project

This project is a scalable email automation system using TypeScript, PostgreSQL, BullMQ for task scheduling, and Prisma for database management. The system automates reading and responding to emails based on their content.

## Features
- OAuth integration with Gmail and Outlook.
- Automated email processing using BullMQ.

## Requirements
- Node.js
- Docker
- Redis
- PostgreSQL
- Prisma
- BullMQ
- Run Docker Cntainers for redis and PostgreSQL

### Environment Variables
Create a `.env` file in the root of the `main` and `worker` directories with the following variables:
- DATABASE_URL=postgresql://<user>:<password>@localhost:5432/email-db
- GOOGLE_CLIENT_ID=<your-google-client-id>
- GOOGLE_CLIENT_SECRET=<your-google-client-secret>
- OUTLOOK_CLIENT_ID=<your-outlook-client-id>
- OUTLOOK_CLIENT_SECRET=<your-outlook-client-secret>
- OUTLOOK_TENANT_ID=<your-outlook-tenant-id>
- BING_API_KEY=<your-bing-api-key>
- GEMINI_API_KEY=<your-gemini-api-key>

