
import {logger} from 'ft-next-logger';

const mailingList = 'most-popular';

export default class AnonEmailApi {

	static subscribe ({email}={}) {

		const url = `https://anon-email-lists-eu-test.herokuapp.com/mailingList/subscribe`;

		const opts = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'mailingListName': mailingList,
				'userEmail': email
			})
		};

		logger.info(`anon-email-api subscribing ${email} to ${mailingList} via ${url}`);

		return fetch(url, opts).then(response => {
			logger.info(`anon-email-api response ${response.status}`);

			if (response.status !== 204) {
				throw new Error('response from anon email api was not a HTTP 204');
			}

			return response.text()
		});
	}
};
