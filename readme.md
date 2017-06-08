newsletter-signup
=================

#### :warning: deprecated
**This feature (aka. light signup / email only signup) has been deprecated and is no longer in use. Please consult the #ft-next-conversion team.**

----


Endpoints to sign an email address up to the FT newsletter (and unsubscribe)

```shell
npm i -S @financial-times/newsletter-signup
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

If a middleware sets `req.newsletterSignupPostNoResponse` to a truthy value, this endpoint will not send a response, but instead set `res.locals.newsletterSignupStatus` to the status string, so a product can render a template if it needs regular form submission instead of AJAX.

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

The (self-explanatory) environment variables `ANON_EMAIL_SVC_API_KEY` and `ANON_EMAIL_LIST_API_KEY` are required. There's also the optional variables `ANON_EMAIL_SVC_HOST` and `ANON_EMAIL_LIST_HOST` to configure the hostnames to talk to for these services.

---

Originally part of [next-signup](https://github.com/Financial-Times/next-signup).
