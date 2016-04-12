import AnonEmailList from '../../../apis/anon-email-lists';
import AnonEmailSvc from '../../../apis/anon-email-svc';
import ApiResult from '../../../libs/api-result';
import ErrorRenderer from '../../../libs/error-renderer';
import SpoorApi from '../../../apis/spoor';
import {logger} from 'ft-next-logger';

export default function (req, res, next) {

	const er = new ErrorRenderer(next);
	const mailingList = 'staff-test';
	const spoor = new SpoorApi({req});

	logger.info(req.body);

	validateEmailAddress()
		.then(subscribeToMailingList)
		.then(silentlySubmitTrackingEvent)
		.then(sendEmail)
		.then(render)
		.catch(error => {
			if (error.reason) return res.status(400).send(error.reason);
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

			} else {
				reject({reason: 'INVALID_REQUEST'});
			}
		});
	}

	function silentlySubmitTrackingEvent () {
		spoor.submit({
			category: 'light-signup',
			action: 'subscribed',
			context: {
				list: mailingList,
				lightSignupID: 'testing1212'
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

	function sendEmail() {
		AnonEmailSvc.send(req.body.email);
		return Promise.resolve(); // because we don't want to wait for the response from this
	}


	function render (response) {
		res.status(200).send('SUBSCRIPTION_SUCCESSFUL');
	}
}
