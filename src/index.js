import post from './routes/post';
import unsubscribe from './routes/unsubscribe';
import express from 'express';
import {urlencoded} from 'body-parser';
import path from 'path';

const app = express();

app.post('/', urlencoded({extended: false}), post);
app.get('/unsubscribe/:user', unsubscribe);

export default app;
