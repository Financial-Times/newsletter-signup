import fetch from 'node-fetch';
import url from 'url';

const hostname = process.env.ANON_EMAIL_SVC_HOST || 'anon-email-svc-gw-eu-west-1-prod.memb.ft.com',

export function call(pathname, opts) {
	const endpoint = url.format({
		hostname,
		protocol: 'https',
		pathname,
	});

	return fetch(endpoint, opts);
};

export function send(email) {
	return call('/send', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'x-api-key': process.env.ANON_EMAIL_SVC_API_KEY
		},
		body: JSON.stringify({email: email})
	});
};
