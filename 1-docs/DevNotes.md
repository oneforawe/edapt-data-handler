# Developer Notes

Note that the time zone for the app is set in the
<code>database-api/database-tools.js</code> file.  You may need to alter it or
rewrite the code to be more general if using this app in one or more different
time zones.

And of course the email message parsing may have to be altered if the content
or format of the specific data-email of concern differs from that of the email
used in the development of this app.  The file to edit will be
<code>email-handler/helper-js/parse-email-msg.js</code>.

A potential addition to the app hinted at within the code (in
<code>database-api/database-tools.js</code>) could be to add a regular
assessment of the "quality" of the database conveyed to the app user in the
website.  The quality could refer to:
* apparent inconsistencies in information in the sales reports
* apparent missing reports
* duplicate reports