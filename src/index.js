import post from './routes/post';
import unsubscribe from './routes/subscribe';
import express from '@financial-times/n-express';
import {urlencoded} from 'body-parser';
import path from 'path';

const app = express({
	withHandlebars: true
});

// allow this subapp to use its own templates
app.set('views', path.resolve(__dirname, '../views'));

app.post('/', urlencoded(), post);
app.get('/unsubscribe/:user', unsubscribe);

export default app;
