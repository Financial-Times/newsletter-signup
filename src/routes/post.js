import { subscribe } from '../libs/subscribe';

const sendStatus = (req, res, next, response) => {
	logger.info(`Final status is ${response}`, { deviceId });
	if (req.newsletterSignupPostNoResponse) {
		res.locals.newsletterSignupStatus = response;
		next();
	} else {
		res.status(200).send(response);
	}
}

export default (req, res, next) => {
	const sendRouteStatus = sendStatus.bind(null, req, res, next);

	return subscribe(req)
		.then(() => sendRouteStatus('SUBSCRIPTION_SUCCESSFUL'))
		.catch(error => {
			if (error.reason) {
				return sendRouteStatus(error.reason)
			}
			next(new Error(error));
		});
}
