const apiKey = process.env.ANON_EMAIL_SVC_API_KEY;

function send(email) {
	const url = 'https://anon-email-svc-gw-eu-west-1-test.memb.ft.com/send';

	fetch(url, {
		headers: {
			'Content-type': 'application/json',
			'x-api-key': apiKey
		},
		body: JSON.stringify({email: email})
	});

}

export default {
	send: send
};
