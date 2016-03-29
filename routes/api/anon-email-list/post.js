import AnonEmailList from '../../../apis/anon-email-lists';
import ApiResult from '../../../libs/api-result';
import ErrorRenderer from '../../../libs/error-renderer';
import {logger} from 'ft-next-logger';

export default function (req, res, next) {

	const er = new ErrorRenderer(next);

	logger.info(req.body);

	subscribeToMailingList()
		.then(render)
		.catch(error => {
			next(new Error(error));
		});

	function subscribeToMailingList () {
		return AnonEmailList.subscribe({
			email: req.body.email
		})
		.catch(error => {
			return Promise.reject(error);
		});
	}

	function render (status) {
		const destination = (status === 204) ? '/signup/light-signup-thanks' : `/signup/light-signup-failure?reason=${status}`;
		res.redirect(302, destination);
	}
}
