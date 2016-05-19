import logger from '@financial-times/n-logger';
import fetch from 'node-fetch';
import url from 'url';

const hostname = process.env.ANON_EMAIL_LIST_HOST || 'anon-email-lists-eu-prod.herokuapp.com';

export function call(pathname, opts) {
	const endpoint = url.format({
		hostname,
		protocol: 'https',
		pathname,
	});

	logger.info(`calling ${endpoint}`);

	return fetch(endpoint, opts);
};

export function subscribe({email, mailingList, deviceId}={}) {
	const opts = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'FT-Api-Key': process.env.ANON_EMAIL_LIST_API_KEY
		},
		body: JSON.stringify({
			'mailingListName': mailingList,
			'deviceId': deviceId,
			'userEmail': email
		})
	};

	logger.info(`anon-email-api subscribing ${email} (${deviceId}) to ${mailingList}`);

	let status;

	return call('/mailingList/subscribe)', opts)
	.then(response => {
		status = response.status;

		logger.info(`anon-email-api response ${status}`);
		if (status === 403) {
			return response.json();
		} else {
			return Promise.resolve({});
		}
	})
	.then(data => {
		logger.info(`anon-email-api response body ${JSON.stringify(data)}`);

		if (status !== 204) {
			return Promise.reject(data);
		}

		return {};
	});
};

export function unsubscribe(user) {
	const opts = {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'FT-Api-key': process.env.ANON_EMAIL_LIST_API_KEY
		}
	};

	logger.info(`anon-email-api unsubscribing ${user} via ${hostname}//user/${user}/unsubscribe`);

	return call(`/user/${user}/unsubscribe`, opts);
};

// https://anon-email-lists-eu-test.herokuapp.com/mailingList/subscribe
