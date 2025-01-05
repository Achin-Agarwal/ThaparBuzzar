import { google } from 'googleapis';
import config from '../config/config.js';
const GOOGLE_CLIENT_ID = config.web.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = config.web.GOOGLE_CLIENT_SECRET;

export const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage'
);