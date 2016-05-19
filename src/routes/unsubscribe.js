import {unsubscribe} from '../api/anon-email-lists';

export default function (req, res, next) {
	unsubscribe(req.params.user)
		.then(response => {
			switch(response.status) {
				case 204:
					res.locals.success = true;
					break;
				case 403:
					res.locals.alreadyUnsubscribed = true;
					break;
				default:
					res.locals.failure = true;
			}

			next();
		}, err => next(err));
}
