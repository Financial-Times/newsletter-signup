import logger from '@financial-times/n-logger';

import subscribe from '../libs/subscribe';

const sendStatus = (req, res, next, response, deviceId) => {
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
		.then(({ deviceId } = { }) => sendRouteStatus('SUBSCRIPTION_SUCCESSFUL', deviceId))
		.catch(error => {
			if (error.reason) {
				return sendRouteStatus(error.reason, error.deviceId)
			}
			next(new Error(error));
		});
}
