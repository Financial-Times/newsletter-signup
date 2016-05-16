newsletter-signup
=================

Endpoints to sign an email address up to the FT newsletter (and unsubscribe)

```shell
npm i -S @financial-times/newsletter
```

Usage
-----

Import it, and either call `.listen(port)` directly:

```javascript
import newsletterSignup from '@financial-times/newsletter-signup';

newsletterSignup.listen(process.env.PORT || 3000);
```

or `.use()` it in your own app:

```javascript
import newsletterSignup from '@financial-times/newsletter-signup';
import express from 'express';

const app = express();
app.use('/middleware/root', newsletterSignup);
```

Endpoints
---------

### `POST [/middleware/root]/`

Subscribe an email address provided by the POST body parameter `email` to the mailing list.

### `GET [/middleware/root]/unsubscribe/:user`

Unsubscribe the user id `:user` from the list. By default, this does not send a response, but sets status variables in `res.locals`. Products using this middleware are responsible for rendering a response, by attaching a route to the same path:

```js
app.use('/middleware/root', newsletterSignup);
app.get('/middleware/root/unsubscribe/:user', (req, res) => {
	res.render('unsubscribe');
});
```

#### Status template variables

The variables `success`, `alreadyUnsubscribed` and `failure` are available in `res.locals` and so any templates rendered in this response. They are mutually-exclusive booleans, i.e. exactly one of them will be true.


Environment vars
----------------

The (self-explanatory) environment variables `ANON_EMAIL_SVC_API_KEY` and `ANON_EMAIL_LIST_API_KEY` are required.

---

Originally part of [next-signup](https://github.com/Financial-Times/next-signup).