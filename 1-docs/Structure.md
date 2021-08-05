# Structure of App

<br/>

## Core vs Ecosystem

We could say that the app consists of a core and its ecosystem:
* Core:
  - edapt (served by node/express, directly or indirectly via the pm2
process manager)
* Ecosystem:
  - mysql: the mysql database is the most closely-tied external piece of the
  app (using Sequelize)
  - gmail: the Gmail account that the data-email is retrieved from is also
  closely tied to the app (via Google Cloud Platform, Google APIs, Gmail API)
  - pm2: in production, edapt is run as pm2 process to make sure the app
  restarts if the system server restarts
  - nginx: nginx serves the app to the internet
  - systemd: manages the server operating system and system "services", such as
  nginx, pm2, and mysql; ensures that these services restart if the system
  restarts


<br/>

## SystemD & App Structure

SystemD (systemd) comes with its utility command <code>systemctl</code>.  When
everything is running in production, systemd controls these parts of the app:
* nginx (web server as a reverse proxy for the server serving the edapt web-app)
* mysql (database server)
* pm2 (process manager)

In turn, pm2 controls <code>edapt</code> (the core app as a pm2 process) via
node/express (the app-server).  And edapt relies on mysql.


<br/>

## Core Structure

The major pieces of the edapt web-app are:
* database-api: provides tools at the interface between the JavaScript code (in
the email-handler and web-app) and the mysql database
* email-handler: provides tools to retrieve data-email from Gmail, parse the
email messages, and ingest the data into the mysql database (using the
database-api)
* web-app
  - client: client-side (web browser) code that displays the edapt web-app
  - server: server-side code that connects the displayed client-side interface
  with the back-end mysql database (via database-api) and orchestrates
  regularly timed email retrieval and database-updates (via email-handler)