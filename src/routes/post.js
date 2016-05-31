import {subscribe} from '../api/anon-email-lists';
import {send} from '../api/anon-email-svc';
import SpoorClient from '@financial-times/n-spoor-client';
import logger from '@financial-times/n-logger';

export default function (req, res, next) {

	const mailingList = req.body && req.body.mailingList ? req.body.mailingList : 'light-signup';
	const spoor = new SpoorClient({
		source: 'newsletter-signup',
		category: 'light-signup',
		product: req.body && req.body.source ? req.body.source : null,
		req
	});

	logger.info(req.body);

	validateRequest()
		.then(subscribeToMailingList)
		.then(silentlySubmitTrackingEvent)
		.then(sendEmailAfter5am)
		.then(() => sendStatus('SUBSCRIPTION_SUCCESSFUL'))
		.catch(error => {
			if (error.reason) return sendStatus(error.reason);
			next(new Error(error));
		});

	function validateRequest () {
		return new Promise(function (resolve, reject) {
			if (req.body && req.body.email && req.body.source) {

				if (validateEmailAddress(req.body.email)) {
					resolve({});
				} else {
					reject({ reason: 'INVALID_EMAIL' });
				}

			} else {
				reject({reason: 'INVALID_REQUEST'});
			}
		});
	}

	function validateEmailAddress (email) {
		return /(.+)@(.+)/.test(email);
	}

	function silentlySubmitTrackingEvent () {
		spoor.submit({
			action: 'subscribed',
			context: {
				list: mailingList
			}
		});
	}

	function extractDeviceId (cookie) {
		const id = /spoor-id=([^;]+)/.exec(cookie);
		return (id) ? id[1] : null;
	}

	function subscribeToMailingList () {
		return subscribe({
			email: req.body.email,
			mailingList: mailingList,
			deviceId: extractDeviceId(req.get('ft-cookie-original'))
		})
		.catch(error => {
			return Promise.reject(error);
		});
	}

	function sendEmailAfter5am() {
		const hourNow = new Date().getHours();
		if (hourNow > 5) send(req.body.email);
		return Promise.resolve();
	}

	function sendStatus(response) {
		if(req.newsletterSignupPostNoResponse) {
			res.locals.newsletterSignupStatus = response;
			next();
		} else {
			res.status(200).send(response);
		}
	}
}
