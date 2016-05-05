import fetch from 'node-fetch';

export default {
	send(email) {
		const url = 'https://anon-email-svc-gw-eu-west-1-prod.memb.ft.com/send';
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
