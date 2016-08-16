import logger from '@financial-times/n-logger';
import SpoorClient from '@financial-times/spoor-client';

import { subscribe } from '../api/anon-email-lists';
import { send } from '../api/anon-email-svc';

const extractDeviceId = cookie => {
	const id = /spoor-id=([^;]+)/.exec(cookie);
	return id ? id[1] : null;
};

const validateEmailAddress = email => /(.+)@(.+)/.test(email);

const validateRequest = (email, { product, source, deviceId } = {}) => {
	return new Promise((resolve, reject) => {
		if (email && (product || source)) {
			if (validateEmailAddress(email)) {
				resolve({ });
			} else {
				reject({ reason: 'INVALID_EMAIL', deviceId });
			}
		} else {
			reject({ reason: 'INVALID_REQUEST', deviceId });
		}
	});
}

const silentlySubmitTrackingEvent = ({ product, source, cookies, ua, ip, deviceId, mailingList, articleUuid, following, topics } = { }) => {
	const spoor = new SpoorClient({
		source: 'newsletter-signup',
		category: 'light-signup',
		product: product || source,
		cookies,
		ua,
		ip,
		deviceId
	});
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
};

const sendEmailAfter5am = email => {
	if ((new Date()).getHours() >= 5) {
		send(email)
	};
};

export default req => {
	const ip = req.get('fastly-client-ip') || req.ip;
	const cookies = req.body.cookie || req.get('cookie') || req.get('ft-cookie-original');
	const defaultParams = {
		mailingList: 'light-signup',
		topics: 'default',
		ua: req.get('user-agent'),
		deviceId: extractDeviceId(cookies)
	};

	const { email, mailingList, topics, following, deviceId, product, source, ua, articleUuid } =
		Object.assign({}, defaultParams, req.body);

	if (process.env.LOG_HEADERS) {
		logger.info('Subscribing...', Object.assign({}, req.headers, { deviceId, ip}));
	}

	return validateRequest(email, { product, source, deviceId })
		.then(subscribe.bind(null, { email, mailingList, topics, following, deviceId }))
		.then(silentlySubmitTrackingEvent.bind(null, { product, cookies, ua, ip, deviceId, mailingList, articleUuid, following, topics }))
		.then(sendEmailAfter5am.bind(null, email, { product, source }))
		.then(() => ({ deviceId }));
};
