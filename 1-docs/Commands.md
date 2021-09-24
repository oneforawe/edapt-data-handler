# Useful Commands

Here are some useful commands (and notes) for installers and developers working
with EDAPT.


<br/>

## General

See my <a href="https://github.com/oneforawe/config-files/blob/master/config/
bash/notes/notes.md">notes on bash</a> for an introduction to bash and shells.


<br/>

## System Check

When everything is situated for running in production, one can check that all
systems are up and running with these commands: <br/>
<code>systemclt status nginx</code> (check if loaded, enabled, and active)<br/>
<code>systemclt status pm2-username</code> (check if loaded, enabled, and
active) <br/>
<code>systemclt status mysql</code>  (check if loaded, enabled, and active)
<br/>
<code>pm2 ls</code> (see that "edapt" or "edapt-demo" is online)


<br/>

## EDAPT

For top-level dev work, see the npm scripts in <code>package.json</code>. For
example: <br/>
<code>npm run install-all</code> <br/>
<code>npm run dev-demo</code> <br/>
<code>npm run build-prod</code> <br/>
<code>npm run serve-prod</code> <br/>
<code>npm run build-demo</code> <br/>
<code>npm run serve-demo</code>

Testing front-end only (in the web-app client directory): <br/>
<code>npm run dev</code>

A couple tests: <br/>
<code>node database-api/test-runs/test-run-example.js</code> <br/>
<code>node email-handler/test-runs/test-run.js</code>


<br/>

## SSH & SCP

<code>ssh username@ip.add.re.ss</code> (log in to machine at ip.add.re.ss via
OpenSSH from local machine; SSH = Secure SHell) <br/>
<code>scp source target</code> (copy from source to target using OpenSSH) <br/>
<code>scp path/to/local/src-file username@ip.add.re.ss:path/to/dest-file</code>
(copy from local to remote) <br/>
<code>scp username@ip.add.re.ss:path/to/dest-file path/to/local/src-file</code>
(copy from remote to local)


<br/>

## SystemD

Example systemd service units: <br/>
<code>mysql</code> (<code>mysql.service</code>) <br/>
<code>nginx</code> (<code>nginx.service</code>) <br/>
<code>pm2-username</code> (<code>pm2-username.service</code>)

See this <a href="https://www.digitalocean.com/community/tutorials/
how-to-use-systemctl-to-manage-systemd-services-and-units">tutorial on
systemd</a>.  The systemd manager, with its <code>systemctl</code> utility
command, is involved here, and these commands generalize to other systemd
service "units", generically listed as <code>application.service</code> where
the <code>.service</code> suffix can be omitted (eg, <code>mysql</code> and
<code>mysql.service</code> are interchangeable in this context):
<br/>
<code>systemctl list-units</code> (see a huge list of units)<br/>
<code>systemctl list-units | grep mysql</code> <br/>
<code>systemctl list-unit-files</code> <br/>
<code>systemctl cat application.service</code> (view unit file) <br/>
<code>systemctl status application.service</code> (view status) <br/>
<code>sudo systemctl stop application.service</code>    (current-session) <br/>
<code>sudo systemctl start application.service</code>   (current-session) <br/>
<code>sudo systemctl restart application.service</code> (current-session) <br/>
<code>sudo systemctl reload application.service</code>  (current-session) <br/>
<code>sudo systemctl disable application.service</code> (daemon) <br/>
<code>sudo systemctl enable application.service</code>  (daemon) <br/>
<code>sudo systemctl mask application.service</code> ("make unavailable")<br/>
<code>sudo systemctl unmask application.service</code> ("make available")<br/>
See more of the tutorial for info on safely editing the service unit files and
other topics.  For info on manually deleting services/units, see <a href=
"https://superuser.com/questions/513159/how-to-remove-systemd-services">this
forum post</a>.


<br/>

## Node (& Npm & Nvm)

Nvm is optional (for development use).

### install/version check

<code>command -V nvm</code> (note that <code>which nvm</code> does not work,
since nvm is a shell function) <br/>
<code>nvm -v</code>

<code>command -V node</code> <br/>
<code>node -v</code>

<code>command -V npm</code> <br/>
<code>npm -v</code>

### nvm (if using)

<code>nvm --help</code> <br/>
<code>nvm ls</code> (see node+npm versions installed and available on your
system) <br/>
<code>nvm current</code> (see the currently-active/used version) <br/>
<code>nvm use [version]</code> (switch version being used) <br/>
See the <a href="https://github.com/nvm-sh/nvm">nvm website</a> curl or wget
command for updating nvm.

### node

<code>man node</code> <br/>
<code>node [executable.js] </code> (execute code with node runtime)

### npm

<code>man npm</code> <br/>
<code>npm help</code> <br/>
<code>npm init -y</code> (create and initialize a <code>package.json</code>
file to record installed npm packages)<br/>
<code>npm install [package]</code> (install node package in the current
directory's module)
<code>npm ls -g --depth 0</code> (see globally installed packages for the
currently-used version of node+npm) <br/>


<br/>

## MySQL

### install/version check

<code>command -V mysql</code> <br/>
<code>mysql -V</code>

Depending on how MySQL was installed, to gain MySQL root user access in the
mysql repl, you may have to use either <code>sudo mysql</code> or
<code>mysql -u root -p</code>.

### gnu/linux

<code>sudo mysqladmin status</code> (show server status)

<code>ps -A | grep -i mysql</code> (see all processes that involve mysql)

<code>systemctl status mysql</code> (show status of daemon and session server)
<code>sudo systemctl start mysql</code> (start daemon)
<code>sudo systemctl stop mysql</code>  (stop daemon)

<code>sudo mysql</code> (enter mysql shell)

<code>sudo mysqldump database_name > dump-file.sql</code> (save a copy of a
database) <br/>
<code>sudo mysqldump database_name table_name > dump-file.sql</code> (save a
copy of a database table) <br/>
<code>sudo mysql < dump-file.sql</code> (restore database) <br/>
<code>sudo mysql database_name < dump-file.sql</code> (restore table) <br/>

### mac os

I'm not exactly sure about the distinction between what I'm calling the
"session server(s)" and the "daemon server(s)"; hopefully I'm roughly correct.

<code>mysqladmin -u root -p status</code> (see status of mysql server(s); looks
like when mysql is running, there are 2 threads correspond to two servers, as
shown with <code>ps</code> command below)

<code>ps -A | grep -i mysql</code> (see all processes that involve mysql,
including this usage of grep; when mysql is running, it looks like there are
actually two daemons that operate: mysqld_safe and mysqld)

<code>mysql.server status</code> (see if session server is running) <br/>
<code>mysql.server start</code> (start the server) <br/>
<code>mysql.server stop</code> (stop the server; note: if the daemon /
brew-service is running, this stops the server(s) but they immediately start
again, as can be seen with the <code>ps</code> command above, with new process
IDs)

<code>brew services</code> (if you installed mysql with Homebrew, this controls
daemons, including mysql daemon) <br/>
<code>brew services list | grep mysql</code> (check mysql daemon status) <br/>
<code>brew services start mysql</code> (start daemon) <br/>
<code>brew services stop mysql</code> (stop daemon) <br/>
Note: If the daemon server is running, then the session server is running, but
the reverse isn't true: if the session server is running, the daemon server may
or may not be running.

<code>mysql -u root -p</code> (enter mysql shell)

<code>mysqldump -u root -p database_name > dump-file.sql</code> (save a copy of
a database) <br/>
<code>mysqldump -u root -p database_name table_name > dump-file.sql</code>
(save a copy of a database table) <br/>
<code>mysql -u root -p < dump-file.sql</code> (restore database) <br/>
<code>mysql -u root -p database_name < dump-file.sql</code> (restore table)

### mysql shell

In the mysql client shell (REPL), with a <code>mysql></code> prompt:

<code>exit;</code> (exit mysql) <br/>
<code>show databases;</code> <br/>
<code>use [database_name];</code> (select a database for further exploration or
editing) <br/>
<code>show tables;</code> (show all the tables in the selected database) <br/>
<code>select * from [table_name];</code> (show all records in table) <br/>
<code>drop [table_name];</code> (delete table)


<br/>

## Nginx

<code>command -V nginx</code> <br/>
<code>ps -A | grep -i nginx</code> <br/>
<code>man nginx</code> <br/>
<code>nginx -h</code> (help)<br/>
<code>sudo nginx -t</code> (test the configuration file) <br/>
See above for the many systemctl commands available for nginx (nginx.service).


<br/>

## PM2

<code>command -V pm2</code> <br/>
<code>ps -A | grep -i pm2</code> <br/>
<code>pm2 --help</code> <br/>
<code>pm2 kill</code> <br/>
<code>pm2 ls</code> <br/>
<code>pm2 start "code here" --name "process-name-here"</code> <br/>
<code>pm2 stop process-name</code> <br/>
<code>pm2 start process-name</code> <br/>
<code>pm2 save</code> <br/>
<code>pm2 startup systemd</code> <br/>
<code>pm2 unstartup</code> <br/>
See above for the many systemctl commands available for pm2-username
(pm2-username.service).