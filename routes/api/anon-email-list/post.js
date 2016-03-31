import AnonEmailList from '../../../apis/anon-email-lists';
import ApiResult from '../../../libs/api-result';
import ErrorRenderer from '../../../libs/error-renderer';
import SpoorApi from '../../../apis/spoor';
import {logger} from 'ft-next-logger';

export default function (req, res, next) {

	const er = new ErrorRenderer(next);
	const mailingList = 'most-popular';
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
		return new Promise(function(resolve, reject) {
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

	function subscribeToMailingList () {
		return AnonEmailList.subscribe({
			email: req.body.email,
			mailingList: mailingList
		})
		.catch(error => {
			return Promise.reject(error);
		});
	}

	function render (response) {
		res.redirect(302, '/signup/light-signup/thanks');
	}
}
