import AnonEmailList from '../../../apis/anon-email-lists';

export default function (req, res) {

	AnonEmailList.unsubscribe(req.params.user)
		.then(response => {

			const opts = {
				layout: 'wrapper'
			};

			if (response.status === 204) res.render('light-signup-unsubscribe-success', opts);
			if (response.status === 403) res.render('light-signup-already-unsubscribed', opts);
			res.render('light-signup-unsubscribe-failure', opts);

		});

}
