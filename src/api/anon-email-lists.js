import logger from '@financial-times/n-logger';
import fetch from 'node-fetch';

export default class AnonEmailApi {
	static subscribe ({email, mailingList, deviceId}={}) {
		const url = process.env.ANON_EMAIL_LIST_HOST || `https://anon-email-lists-eu-prod.herokuapp.com/mailingList/subscribe`;

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

		logger.info(`anon-email-api subscribing ${email} (${deviceId}) to ${mailingList} via ${url}`);

		let status;

		return fetch(url, opts)
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

	static unsubscribe (user) {
		const url = `https://anon-email-lists-eu-prod.herokuapp.com/user/${user}/unsubscribe`;

		const opts = {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'FT-Api-key': process.env.ANON_EMAIL_LIST_API_KEY
			}
		};

		logger.info(`anon-email-api unsubscribing ${user} via ${url}`);

		return fetch(url, opts);
	};
}
