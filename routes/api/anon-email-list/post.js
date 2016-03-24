import AnonEmailList from '../../../apis/anon-email-lists';
import ApiResult from '../../../libs/api-result';
import ErrorRenderer from '../../../libs/error-renderer';

export default function (req, res, next) {

	const er = new ErrorRenderer(next);

	console.log(req.body);

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

	function render (n) {
		res.status(200).json(n);
	}
}
