import logger from '@financial-times/n-logger';
import { urlencoded } from 'body-parser';
import express from 'express';

import post from './routes/post';
import unsubscribe from './routes/unsubscribe';
import * as anonEmailLists from './api/anon-email-lists';
import * as anonEmailSvc from './api/anon-email-svc';
import subscribe from './libs/subscribe';

const app = express();

app.post('/', urlencoded({extended: false}), post);
app.get('/unsubscribe/:user', unsubscribe);

export default app;
export { anonEmailLists, anonEmailSvc, subscribe };
