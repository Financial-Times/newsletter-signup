import fetch from 'node-fetch';
import url from 'url';

export default {
	send(email) {
		const endpoint = url.format({
			hostname: process.env.ANON_EMAIL_SVC_HOST || 'anon-email-svc-gw-eu-west-1-prod.memb.ft.com',
			protocol: 'https',
			pathname: '/send',
		});

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'x-api-key': process.env.ANON_EMAIL_SVC_API_KEY
			},
			body: JSON.stringify({email: email})
		});
	}
};
