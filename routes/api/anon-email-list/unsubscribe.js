import AnonEmailList from '../../../apis/anon-email-lists';

export default function (req, res) {

    AnonEmailList.unsubscribe(req.params.user)
	    .then(response => {

		    // TODO: handle status codes 403 (user already susbscribed) and 404 (something went wrong, subscription failed)

		    res.render('light-signup-unsubscribe', {
			    layout: 'wrapper',
			    userEmail: 'name.name@server.com'
		    });
	    });

}
