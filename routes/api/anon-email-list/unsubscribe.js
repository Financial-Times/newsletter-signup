import AnonEmailList from '../../../apis/anon-email-lists';

export default function (req, res) {

	AnonEmailList.unsubscribe(req.params.user)
		.then(response => {

			if (response.status === 204) res.render('light-signup-unsubscribe', {
				layout: 'wrapper',
				success: true
			});

			if (response.status === 403) res.render('light-signup-unsubscribe', {
				layout: 'wrapper',
				alreadyUnsubscribed: true
			});

			res.render('light-signup-unsubscribe', {
				layout: 'wrapper',
				failure: true
			});

		});

}
