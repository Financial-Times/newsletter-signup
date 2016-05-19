import post from './routes/post';
import unsubscribe from './routes/unsubscribe';
import express from 'express';
import {urlencoded} from 'body-parser';
import path from 'path';
import * as anonEmailLists from './api/anon-email-lists';
import * as anonEmailSvc from './api/anon-email-svc';

const app = express();

app.post('/', urlencoded({extended: false}), post);
app.get('/unsubscribe/:user', unsubscribe);

export default app;
export {anonEmailLists, anonEmailSvc};
