import AnonEmailList from '../api/anon-email-lists';
import AnonEmailSvc from '../api/anon-email-svc';
import SpoorClient from '@financial-times/n-spoor-client';
import logger from '@financial-times/n-logger';

export default function (req, res, next) {

	const mailingList = 'staff-test';
	const spoor = new SpoorClient({
		source: 'next-signup',
		category: 'light-signup',
		req,
	});

	logger.info(req.body);

	validateEmailAddress()
		.then(subscribeToMailingList)
		.then(silentlySubmitTrackingEvent)
		.then(sendEmailAfter5am)
		.then(() => send('SUBSCRIPTION_SUCCESSFUL'))
		.catch(error => {
			if (error.reason) return send(error.reason);
			next(new Error(error));
		});

	function validateEmailAddress () {
		return new Promise(function (resolve, reject) {
			if (req.body && req.body.email) {

				if (/(.+)@(.+)/.test(req.body.email)) {
					resolve({});
				} else {
					reject({ reason: 'INVALID_EMAIL' });
				}

			} else {
				reject({reason: 'INVALID_REQUEST'});
			}
		});
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
		return AnonEmailList.subscribe({
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
		if (hourNow > 5) AnonEmailSvc.send(req.body.email);
		return Promise.resolve();
	}

	function send(response) {
		res.status(200).send(response);
	}
}
