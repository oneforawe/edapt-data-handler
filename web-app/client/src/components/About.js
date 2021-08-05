import React from "react"
import { Redirect } from 'react-router-dom'
import { useSelector } from "react-redux"
import './About.css'


const About = () => {
  const { user: currentUser } = useSelector((state) => state.auth)

  if (!currentUser) {
    return <Redirect to="/login" />
  }

  return (
    <div className="container">

      <header className="jumbotron">
        <h3>About</h3>
      </header>

      <div className="top-matter">


        <h4>The App</h4>

        <div className="indent">

        <p>EDAPT = Email-Data Assistant &amp; Processor Tool</p>

        <p>A Web-App for Data Ingestion via Email and Data Viewing &amp;
          Downloading via Website</p>

        <ul>
          <li> <span className="li-title">The Problem</span>
            <span className="li-content">
              If you have regularly-generated data-containing email messages
              that you'd like to have automatically processed so that you can
              easily query the data and download it in a form that's convenient
              for displaying in a spreadsheet, then you need a tool like EDAPT.
            </span>
          </li>
          <li> <span className="li-title">The Solution</span>
            <span className="li-content">
              EDAPT continually retrieves data from regularly-generated
              data-containing email messages (via Gmail), parses the email
              messages to extract the data, ingests that data into a (MySQL)
              database, allows queries by website graphical user interface
              (GUI), and allows downloading the contents of the database in the
              form of a CSV (comma-separated-values) file.
            </span>
          </li>
          <li> <span className="li-title">Example</span>
            <span className="li-content">
              EDAPT is particularly useful for people operating an automated
              self-serve business (such as a car wash) that has auto-generated
              (sales report) data sent by email on a daily basis.
            </span>
          </li>
        </ul>

        </div>


        <h4>The Tech</h4>

        <div className="indent">

        <p>Here are the main technologies involved in the internals and
          infrastructure for running EDAPT:</p>

        <ul>
          <li> <span className="li-title">Content-Display</span>
            <span className="li-content">
              <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">HTML</a>,
              {' '} <a href="https://developer.mozilla.org/en-US/docs/Web/CSS">CSS</a>, {' '}
              <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">JavaScript/JS</a>
              {' '} / <a href="https://tc39.es/ecma262/">ECMAScript</a>,
              {' '} <a href="https://reactjs.org/">React</a>,
              {' '} <a href="https://redux.js.org/">Redux</a>
            </span>
          </li>
          <li> <span className="li-title">Data</span>
            <span className="li-content">
              <a href="https://www.mysql.com/">MySQL</a>,
              {' '} <a href="https://sequelize.org/">Sequelize</a>
            </span>
          </li>
          <li> <span className="li-title">Email</span>
            <span className="li-content">
              <a href="https://en.wikipedia.org/wiki/Gmail">Gmail</a>,
              {' '} <a href="https://cloud.google.com/">Google Cloud Platform</a>,
              {' '} <a href="https://github.com/googleapis/google-api-nodejs-client">Google APIs</a>,
              {' '} <a href="https://developers.google.com/gmail/api">Gmail API</a>
            </span>
          </li>
          <li> <span className="li-title">App-Security</span>
            <span className="li-content">
              JSON web tokens
              (<a href="https://www.npmjs.com/package/jsonwebtoken">jsonwebtoken</a>),
              {' '} <a href="https://developers.google.com/identity/protocols/oauth2">OAuth2</a>
            </span>
          </li>
          <li> <span className="li-title">App-Server</span>
            <span className="li-content">
              <a href="https://nodejs.org/en/">Node</a>,
              {' '} <a href="https://expressjs.com/">Express</a>
            </span>
          </li>
          <li> <span className="li-title">Optional Infrastructure</span>
            <span className="li-content">
              Web-Server system (eg, a {' '}
              <a href="https://www.gnu.org/software/software.html">GNU</a>/
              <a href="https://en.wikipedia.org/wiki/Linux">Linux</a> {' '}
              virtual server such as {' '}
              <a href="https://ubuntu.com/download/server">Ubuntu server</a> in
              a virtual machine provided by a web-hosting / cloud-service
              company such as {' '}
              <a href="https://www.digitalocean.com/">DigitalOcean</a>)
            </span>
          </li>
          <li> <span className="li-title">Optional Web-Server &amp; Managers</span>
            <span className="li-content">
              <a href="https://nginx.org/en/">Nginx</a> (web-server application
              using reverse proxy),
              {' '} <a href="https://pm2.keymetrics.io/">PM2</a> (process
              manager), <a href="https://github.com/systemd/systemd">systemd</a>
              {' '} (system &amp; service manager)
            </span>
          </li>
          <li> <span className="li-title">Optional Web Security</span>
            <span className="li-content">
              firewall
              (<a href="https://help.ubuntu.com/community/UFW">ufw</a>), {' '}
              <a href="https://en.wikipedia.org/wiki/HTTPS">HTTPS</a>, {' '}
              <a href="https://letsencrypt.org/">LetsEncrypt</a> {' '}
              <a href="https://certbot.eff.org/">Certbot</a> {' '}
              (auto-renewal of SSL certificates)
            </span>
          </li>
        </ul>

        </div>


        <h4>The Developer</h4>

        <div className="indent">

        <ul>
          <li> <a href="https://github.com/oneforawe">Andrew Forrester</a>
          </li>
        </ul>

        </div>


        <div className="bottom-spacing"/>


      </div>

    </div>
  )
}

export default About