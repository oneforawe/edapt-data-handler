# Technologies Involved

Here are the main technologies involved in the internals and infrastructure for
running EDAPT:

* Content-Display: [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML),
[CSS](https://developer.mozilla.org/en-US/docs/Web/CSS),
[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)/JS /
[ECMAScript](https://tc39.es/ecma262/), [React](https://reactjs.org/),
[Redux](https://redux.js.org/)
* Data: [MySQL](https://www.mysql.com/), [Sequelize](https://sequelize.org/)
* Email: [Gmail](https://en.wikipedia.org/wiki/Gmail),
[Google Cloud Platform](https://cloud.google.com/),
[Google APIs](https://github.com/googleapis/google-api-nodejs-client),
[Gmail API](https://developers.google.com/gmail/api)
* App-Security: JSON web tokens
([jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)),
[OAuth2](https://developers.google.com/identity/protocols/oauth2)
* App-Server: [Node](https://nodejs.org/en/), [Express](https://expressjs.com/)
* Optional Infrastructure: Web-Server system (eg, a
[GNU](https://www.gnu.org/software/software.html)/
[Linux](https://en.wikipedia.org/wiki/Linux) virtual server such as
[Ubuntu server](https://ubuntu.com/download/server) in a virtual machine
provided by a web-hosting / cloud-service company such as
[DigitalOcean](https://www.digitalocean.com/))
* Optional Web-Server & Managers: [Nginx](https://nginx.org/en/) (web-server
application using reverse proxy), [PM2](https://pm2.keymetrics.io/) (process
manager), [systemd](https://github.com/systemd/systemd) (system & service
manager)
* Optional Web Security: firewall ([ufw](https://help.ubuntu.com/community/UFW)),
[HTTPS](https://en.wikipedia.org/wiki/HTTPS),
[LetsEncrypt](https://letsencrypt.org/) [Certbot](https://certbot.eff.org/)
(auto-renewal of SSL certificates)