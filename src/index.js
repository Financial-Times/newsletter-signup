import post from './routes/post';
import unsubscribe from './routes/unsubscribe';
import express from 'express';
import handlebars from '@financial-times/n-handlebars';
import {urlencoded} from 'body-parser';
import path from 'path';

const app = express();
handlebars(app, {
	// using the module directory instead of cwd
	// allows this subapp to use its own templates
	directory: path.resolve(__dirname, '..'),
});

app.post('/', urlencoded(), post);
app.get('/unsubscribe/:user', unsubscribe);

export default app;
