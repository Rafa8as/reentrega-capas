import dotenv from 'dotenv';

dotenv.config();

export default {
  MONGO_URL: process.env.MONGO_URL,
  MONGO_PASS: process.env.MONGO_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
};