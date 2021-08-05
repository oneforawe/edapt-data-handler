# Web App for EDAPT

This is the portion of EDAPT that connects all the pieces, orchestrates the
activities of the app, and serves the front-end web interface.

The `server` portion is the back-end orchestrator, directing the email-handler,
connecting with the database (via the database-api), and serving the front-end
client code.  The `client` portion controls the user interface in the browser.