# Steps to Set Up EDAPT

## Phase 1: Initial Set-Up

These initial steps will probably be performed in a local computer (as opposed
to a remote server computer) so you can set-up, initialize, become familiar
with EDAPT, and do any trouble-shooting or development necessary to get EDAPT
working for the first time.

<br/>

<ol>

<li> Ensure you have <a href="https://nodejs.org/en/">node</a>:

NodeJS (aka Node.js, node, etc) is a back-end runtime environment for
JavaScript/ECMAScript, with an associated shell command <code>node</code>.
Note that with node installed, you will also have the
<a href="https://www.npmjs.com/">npm</a> (node package manager)
<code>npm</code> utility at your command, which connects with an enormous
registry of useful Node/JavaScript packages.

In a command-line interface (also known as a CLI or (virtual) terminal) you can
find out if you already have node installed.  If the shell powering your
terminal is bash or zsh, these instructions will work for you.  You can confirm
which shell you're using by executing the command <code>echo $0</code> and see
that bash or zsh is printed (with a dash in front if it's acting as a login
shell).

You can execute <code>command -V node</code>, and if the result shows a path
location of "node", such as <code>usr/bin/node</code>, then you've already got
it installed, otherwise it will tell you that node is "not found".  The command
<code>node -v</code> will show you the version.  You might want to upgrade if
your version is, say, below version 16 -- you should prefer to use the "Active
LTS" (Long-Term Support) release of node, or a "Maintenance LTS" (which you can
find <a href="https://nodejs.org/en/about/releases/">here</a>).  (You can use
<code>command -V npm</code> and <code>npm -v</code> too.)

If you don't have node installed, you could just go to the
<a href="https://nodejs.org/en/">node website</a> and download from there, but
you should probably consider other methods, including using a package manager.
Here are two good options:
<ul>
  <li> (Not preferred for EDAPT.)
  <p> If you intend on just using node for a one-time implementation (without
using globally-installed npm packages), you can follow instructions from
<a href="https://github.com/nodesource/distributions">NodeSource</a> to just
install one version of node+npm.  If using GNU/Linux apt and NodeSource, you
can follow step 1 in <a href="https://www.digitalocean.com/community/tutorials
/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04">this
tutorial</a>.
  </p>
  </li>
  <li> (Preferred for EDAPT.)
  <p> If you intend on using node on an on-going basis during JavaScript/Node
development (or simply want to use a globally-installed npm package), it's best
to follow the instructions from <a href="https://github.com/nvm-sh/nvm">nvm
(node version manager)</a> to install nvm and node+npm.  As the
<a href="https://docs.npmjs.com/
resolving-eacces-permissions-errors-when-installing-packages-globally">npm
docs</a> explain, installing node/npm with nvm "is the best way to avoid
permissions issues".  Also, with nvm you'll be able to quickly switch between
versions of node, if you ever need to.
  </p>
  </li>
</ul>

Confirmation from <a href="https://linuxize.com/post/
how-to-install-node-js-on-ubuntu-18.04/">Linuxize</a>: "If you need Node.js
only as a local runtime for deploying Node.js applications then the simplest
option is to install Node.js from the NodeSource repository.  Developers should
prefer installing Node.js using the NVM script."  This is further confirmed on
<a href="https://stackoverflow.com/questions/28017374/
what-is-the-suggested-way-to-install-brew-node-js-io-js-nvm-npm-on-os-x">stackoverflow</a>
(see the 2nd "2019 update" answer).

Note that, if not using a package manager (such as
<a href="https://en.wikipedia.org/wiki/APT_(software)">apt</a> for GNU/Linux or
<a href="https://brew.sh/">Homebrew</a> for MacOS), you may have to take more
steps if you want to keep your software up-to-date.  For instance, you can use
the same "curl" or "wget" command to update nvm as the one used to install it
(if a newer file is referenced?).  And you can install more versions of
node+npm and switch between them; see <code>nvm --help</code> for more info.
Note also that your globally-installed packages (seen with
<code>npm ls -g --depth 0</code>) will change when switching between versions.
(Also, for your information, if you're using MacOS with Homebrew,
<code>brew doctor</code> will give a long warning about node, but that warning
can just be ignored.)
</li><br/>


<li> Ensure you have <a href="https://git-scm.com/">git</a>:

It is git, the "stupid content tracker", for file/project version control and
downloading/uploading.  You need git, but you're more likely to already have
this installed by default.  If using MacOS with Homebrew, you can use brew to
<a href="https://git-scm.com/download/mac">install git</a>.
</li><br/>


<li> Pick and go to desired code location:

In a terminal change directory to a location where you'd like to place the
EDAPT code.  Create any new folders/directories you'd like, if you want the
EDAPT directory to be inside a new folder structure.  Change directory to that
final location where you'd like the EDAPT code to be placed.
</li><br/>


<li> Download, install, and configure EDAPT:

<code>git clone https://github.com/oneforawe/edapt-data-handler.git
edapt-data-handler</code> (Download the code with <code>git clone</code>) <br/>
<code>cd edapt-data-handler</code> (enter the repo)<br/>
<code>npm run install-all</code> (install all the npm packages in the repo;
this can take a little while; ignore warnings from npm) <br/>

Configs:

<ol>
<li> <code>email-acct-info.js</code>: <br/>
<code>cp email-handler/reference/email-acct-info-template.js email-handler/reference/email-acct-info.js</code>
(copy this file) <br/>
Later, you can edit <code>email-handler/reference/email-acct-info.js</code> if
you end up using a Gmail label to filter your data messages.  You can follow
the commented-out example of the label 'Biz Data', adding a line with your own
label, and commenting out the <code>labelsRequire</code> line with an empty
array.  If you use a special Gmail account for development testing, you can
note the username and address in this file, for reference, replacing the dummy
example at the top of the file.  (It would be best to store the password for
this or any other accounts elsewhere in a more secure manner, especially the
password for any business/production accounts.)
</li><br/>

<li> <code>dbConfig.js</code>: <br/>
<code>cp database-api/config/dbConfig-template.js database-api/config/dbConfig.js</code>
(copy this file) <br/>
Edit the file <code>database-api/config/dbConfig.js</code> so that the string
<code>"PICK-A-PASSWORD"</code> contains your own chosen password.  You will use
this password when setting up a MySQL database with a user called "edapt".
This config file will then allow the app to access the MySQL database with this
username and password.
</li><br/>

<li> <code>users.js</code>: <br/>
<code>cp web-app/server/app/config/users-template.js web-app/server/app/config/users.js</code>
(copy this file) <br/>
Edit the file <code>web-app/server/app/config/users.js</code> to contain all
the users that you'd like the app to allow.  You can use the file
<code>add-user.js</code> to create new users, following the instructions in
that file.  The <code>users.js</code> file should not contain any user
passwords, so you can start by deleting the line with the password for
'theuser'.  If you want to get rid of 'theuser' (and you probably should if
you want a secure system), then delete the remaining three lines that declare
that user and add your own user(s) with <code>add-user.js</code>.  If you plan
on just setting up a demo version of the app, you should leave 'theuser' as
your user.
</li><br/>

<li> <code>auth.config.js</code>: <br/>
<code>cp web-app/server/app/config/auth.config-template.js web-app/server/app/config/auth.config.js</code>
(copy this file) <br/>
Edit the file <code>web-app/server/app/config/auth.config.js</code> to give
your own secret string for jwt (jsonwebtoken).  You can simply add more
characters to the string that's already there.
</li>
</ol>

</li><br/>


<li> Ensure you have <a href="https://www.mysql.com/">mysql</a>:

The MySQL (Community) Server runs as a background process and can be
interacted-with via a client shell (via the command <code>mysql</code>) or via
port calls (to port 3306) in JavaScript code (say, with
<a href="https://sequelize.org/">Sequelize</a>).

You can execute <code>command -V mysql</code>, and if the result shows a path
location of "mysql", such as <code>usr/bin/mysql</code>, then you've already
got it installed.  The command <code>mysql -V</code> will show you the version.

On a Mac, if you plan on using
<a href="https://formulae.brew.sh/formula/mysql#default">Homebrew</a>, you can
follow the steps in
<a href="https://flaviocopes.com/mysql-how-to-install/">this tutorial</a>, plus
Step 3 in <a href="https://www.digitalocean.com/community/tutorials/
how-to-install-mysql-on-ubuntu-20-04">this tutorial</a>.  For GNU/Linux, there
are
<a href="https://dev.mysql.com/doc/refman/8.0/en/linux-installation.html">many
potential methods</a> you could use to install mysql, and the
<a href="https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/">official
steps</a> for installing using apt seem a bit excessive, so I'd recommend using
this <a href="https://www.digitalocean.com/community/tutorials/
how-to-install-mysql-on-ubuntu-20-04">simpler tutorial</a>.  (Instead of adding
user 'sammy', you'll add user 'edapt', with the password you created in the
previous step.)  Briefly, the steps are:

For MacOS (with Homebrew): <br/>
<code>brew install mysql</code> <br/>
<code>mysql_secure_installation</code> (see "NOTE" below) <br/>
And play around with starting/stopping the daemon, starting/stopping the
session server, and entering and exiting the mysql client shell. <br/>
<code>brew services</code> (shows whether the daemon is running or not) <br/>
<code>mysql.server status</code> (show session server status)

For GNU/Linux (with apt): <br/>
<code>sudo apt update</code> <br/>
<code>sudo apt install mysql-server</code> <br/>
<code>sudo mysql_secure_installation</code> (see "NOTE" below) <br/>
<code>systemctl status mysql</code> (show status of daemon and session server)

NOTE: Optionally set up the VALIDATE PASSWORD component -- might as well say
yes -- create new password for mysql root user and store securely for
reference; remove anonymous users; DO NOT disallow root login remotely; remove
test database; reload privileges table now.

For both: <br/>
Enter mysql client: <br/>
<code>sudo mysql</code> or <code>mysql -u root -p</code> <br/>
Create special user and give access: <br/>
<code>mysql> CREATE USER edapt@localhost IDENTIFIED BY 'password';</code> (put
your chosen password from <code>database-api/config/dbConfig.js</code> here)
<br/>
<code>mysql> CREATE DATABASE edapt_db;</code> <br/>
<code>mysql> GRANT ALL ON edapt_db.* TO edapt@localhost;</code>

See <a href="./Commands.md">commands reference</a> for more mysql commands and
context with systemd/systemctl.
</li><br/>


<li> Test the Database: <br/>

You can do a quick initial test of the database by executing the command below.
(If you check beforehand, you should see that there are no tables yet in the
edapt_db database.)

<code>node database-api/test-runs/test-run-example.js</code> <br/>
You should see "Sequelize database connection: opened successfully.", a
"report" with "Jane", and "Sequelize database connection: closed
successfully.".

And if you check in the edapt_db database, there should now be a table called
"Users" with a record showing the same details as the "report" that was
displayed by the command above.
</li><br/>


<li> Test the demo web-app: <br/>

First import the demo table: <br/>
<code>sudo mysql edapt_db < database-api/demo-files/edapt_db.Demo.sql</code>
<br/>
You can check and see that a table named "Demo" is now in the database
edapt_db.

Then build the demo client-side code: <br/>
<code>npm run build-demo</code> (This could take a little while.) <br/>
(If the files in <code>web-app/client/build/</code> do not change, then the
demo build was already in place.)

Then start the server: <br/>
<code>npm run serve-demo</code> <br/>
This command will not halt, but will settle when it displays "Server is running
on port 8080."  At that point you can open a web browser and enter the URI
<a href="http://localhost:8080">http://localhost:8080</a>.  The EDAPT web-app
being locally-served (offline, not on the internet) by the server, and at that
URI the Login page should appear.  You can use any of your earlier-chosen
username-password combinations to log in.  From there you can explore the
web-app.

When you want to stop exploring the web-app and stop the server, you can go
back to the terminal where it still shows "Server is running on port 8080." and
press Control-C to kill the process.  If you go back to the browser and
refresh, the web-app should no longer be available.
</li><br/>

</ol>

If everything has worked so far, you should now be able to work on setting up
the email-retrieval with the "email-handler" part of the app.  If you don't
intend on setting up the email portion, perhaps because you just want to serve
the demo web-app, you can skip to <a href="./3-HostingSetUp.md">Phase 3</a>.
Otherwise, on to <a href="./2-EmailSetUp.md">Phase 2</a>.