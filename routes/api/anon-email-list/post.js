import AnonEmailList from '../../../apis/anon-email-lists';
import SpoorApi from '../../../apis/spoor';
import logger from '@financial-times/n-logger';

export default function (req, res, next) {

	const mailingList = 'staff-test';
	const spoor = new SpoorApi({req});

	logger.info(req.body);

	validateEmailAddress()
		.then(subscribeToMailingList)
		.then(silentlySubmitTrackingEvent)
		.then(render)
		.catch(error => {

			if (error && error.reason === 'ALREADY_SUBSCRIBED') {
				return res.redirect(302, '/signup/light-signup/oops?reason=ALREADY_SUBSCRIBED');
			}

			if (error && error.reason === 'USER_ARCHIVED') {
				return res.redirect(302, '/signup/light-signup/oops?reason=USER_ARCHIVED');
			}

			if (error && error.reason === 'INVALID_EMAIL') {
				return res.redirect(302, '/signup/light-signup/oops?reason=INVALID_EMAIL');
			}

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

			}
		});
	}

	function silentlySubmitTrackingEvent () {
		spoor.submit({
			category: 'light-signup',
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

	function render () {
		res.redirect(302, '/signup/light-signup/thanks');
	}
}
