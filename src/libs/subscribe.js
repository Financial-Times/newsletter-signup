import { subscribe } from '../api/anon-email-lists';
import { send } from '../api/anon-email-svc';
import SpoorClient from '@financial-times/spoor-client';
import logger from '@financial-times/n-logger';

export default req => {

	const product = req.body && (req.body.product || req.body.source) || null;
	const mailingList = req.body && req.body.mailingList ? req.body.mailingList : 'light-signup';
	const topics = req.body && req.body.topics ? req.body.topics : 'default';
	const following = (req.body && req.body.following) || null;
	const articleUuid = req.body && req.body.articleUuid ? req.body.articleUuid : null;
	const cookies = (req.body && req.body.cookie) || req.get('cookie') || req.get('ft-cookie-original');
	const ua = (req.body && req.body.ua) || req.get('user-agent');
	const ip = req.get('fastly-client-ip') || req.ip;
	const deviceId = req.body && req.body.deviceId ? req.body.deviceId : extractDeviceId(cookies);

	if (process.env.LOG_HEADERS) {
		logger.info(`POST from ${deviceId} with IP ${ip}, headers: ${JSON.stringify(req.headers)}`);
	}

	const spoor = new SpoorClient({
		source: 'newsletter-signup',
		category: 'light-signup',
		product,
		cookies,
		ua,
		ip,
		deviceId
	});

	return validateRequest()
		.then(subscribeToMailingList)
		.then(silentlySubmitTrackingEvent)
		.then(sendEmailAfter5am);

	function validateRequest () {
		return new Promise(function (resolve, reject) {
			if (req.body && req.body.email && (req.body.product || req.body.source)) {
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
		const context = {
			list: mailingList,
			content: {
				uuid: articleUuid,
			}
		};
		if (following) {
			context.following = following;
		} else {
			context.topics = topics;
		}
		spoor.submit({ action: 'subscribed', context });
	}

	function extractDeviceId (cookie) {
		const id = /spoor-id=([^;]+)/.exec(cookie);
		return (id) ? id[1] : null;
	}

	function subscribeToMailingList () {
		return subscribe({
			email: req.body.email,
			mailingList,
			topics,
			following,
			deviceId,
		})
		.catch(error => {
			return Promise.reject(error);
		});
	}

	function sendEmailAfter5am () {
		const hourNow = new Date().getHours();
		if (hourNow >= 5) send(req.body.email);
		return Promise.resolve();
	}
}
