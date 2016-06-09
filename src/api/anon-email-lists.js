import logger from '@financial-times/n-logger';
import fetch from 'node-fetch';
import url from 'url';

const hostname = process.env.ANON_EMAIL_LIST_HOST || 'anon-email-lists-eu-prod.herokuapp.com';

export function call(pathname, body, method = 'POST') {
	const endpoint = url.format({
		hostname,
		protocol: 'https',
		pathname,
	});

	return fetch(endpoint, {
		method,
		headers: {
			'Content-Type': 'application/json',
			'FT-Api-Key': process.env.ANON_EMAIL_LIST_API_KEY
		},
		body: body && JSON.stringify(body),
	});
};

export function subscribe({email, mailingList, deviceId, topics}={}) {
	logger.info(`anon-email-api about to subscribe user (device ${deviceId}) to ${mailingList} with topics: ${topics}`);

	let status;

	return call('/mailingList/subscribe', {
		'mailingListName': mailingList,
		'deviceId': deviceId,
		'userEmail': email,
		'topics': topics
	})
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

		// don't wait on this promise, log in the background
		call(`/user/${email}`, null, 'GET').then(r => r.json().then(json => {
			if(r.ok) {
				logger.info(`anon-email-api subscribed user (device ${deviceId}) as ${json.uuid}`)
			} else {
				const err = new Error(JSON.stringify(json));
				err.response = r;
			}
		})).catch(e => logger.warn(e));

		return {};
	});
};

export function unsubscribe(user) {
	logger.info(`anon-email-api unsubscribing ${user} via ${hostname}/user/${user}/unsubscribe`);

	return call(`/user/${user}/unsubscribe`);
};
