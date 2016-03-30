import AnonEmailList from '../../../apis/anon-email-lists';
import ApiResult from '../../../libs/api-result';
import ErrorRenderer from '../../../libs/error-renderer';
import {logger} from 'ft-next-logger';

export default function (req, res, next) {

	const er = new ErrorRenderer(next);

	logger.info(req.body);

	validateEmailAddress()
		.then(subscribeToMailingList)
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

	function subscribeToMailingList () {
		return AnonEmailList.subscribe({
			email: req.body.email
		})
		.catch(error => {
			return Promise.reject(error);
		});
	}

	function render (response) {
		res.redirect(302, '/signup/light-signup/thanks');
	}
}
