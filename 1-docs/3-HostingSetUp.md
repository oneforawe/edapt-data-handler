# Steps to Set Up EDAPT

## Phase 3: Hosting Set-Up

Your hosting machine could be, for example, a virtual machine or "droplet" at
DigitalOcean.com where the machine is configured as an Ubuntu server.  These
instructions take this example to be the case; interpret and translate the
instructions as necessary if you're operating under a different case.

<ol>

<li> SSH Keys <br/>
After creating an account, but before setting up a machine, you can add your
public ssh key to the machine (first, if necessary, generating your public /
private key pair).  For more instruction on a variety of methods, see
<a href="https://docs.digitalocean.com/products/droplets/how-to/
add-ssh-keys/">How To Add SSH Keys</a>.  In DigitalOcean, you can go to
Settings > Security, click on the button to "Add SSH Key", copy and paste your
public key, and give it a name (perhaps something like "master linux key").
Then you can add the key to your machine at creation time.  Or, if you've
already created / initialized the machine, you can add the key manually as
described in the how-to.
</li><br/>


<li> Server <br/>
Create the server machine (attempting to use the latest OS / operating system
release for whichever operating system you're using, since a later release can
make enabling higher-level security easier) and make sure your public SSH key
is added to the machine.  For a service like an Ubuntu server with
DigitalOcean, you can name your project and machine/droplet to your taste.
Note the IP address (eg, ipv4) associated with the machine, which I'll refer to
as <code>ip.add.re.ss</code>.
</li><br/>


<li> DNS <br/>
If you're using a domain (or subdomain) for hosting the app, you can now log in
with your registrar and create the settings for name servers and DNS records,
as illustrated below.  You can use the registrar's own default name servers and
use an A (address) record and CNAME (canonical name) record, replacing
<code>ip.add.re.ss</code> with your server's IP address and using a TTL value
that makes sense (perhaps 30 seconds on the low end for an A Record, or 1 hour,
or "automatic"):

Style 1:
<table><tbody>
  <tr> <th> Type </th> <th> Host </th> <th> Data/Value </th> </tr>
  <tr> <td> A Record </td>
       <td> <code>example.com</code> </td>
       <td> <code>ip.add.re.ss</code> </td> </tr>
  <tr> <td> CNAME Record </td>
       <td> <code>www.example.com</code> </td>
       <td> <code>example.com</code> </td> </tr>
</tbody></table>

Style 2 (for example.com):
<table><tbody>
  <tr> <th> Type </th> <th> Host </th> <th> Data/Value </th> </tr>
  <tr> <td> A Record </td>
       <td> <code>@</code> </td>
       <td> <code>ip.add.re.ss</code> </td> </tr>
  <tr> <td> CNAME Record </td>
       <td> <code>www</code> </td>
       <td> <code>example.com</code> </td> </tr>
</tbody></table>

Subdomain Style 1:
<table><tbody>
  <tr> <th> Type </th> <th> Host </th> <th> Data/Value </th> </tr>
  <tr> <td> A Record </td>
       <td> <code>sub.example.com</code> </td>
       <td> <code>ip.add.re.ss</code> </td> </tr>
  <tr> <td> CNAME Record </td>
       <td> <code>www.sub.example.com</code> </td>
       <td> <code>sub.example.com</code> </td> </tr>
</tbody></table>

Subdomain Style 2 (for example.com):
<table><tbody>
  <tr> <th> Type </th> <th> Host </th> <th> Data/Value </th> </tr>
  <tr> <td> A Record </td>
       <td> <code>sub</code> </td>
       <td> <code>ip.add.re.ss</code> </td> </tr>
  <tr> <td> CNAME Record </td>
       <td> <code>www.sub</code> </td>
       <td> <code>sub.example.com</code> </td> </tr>
</tbody></table>

</li><br/>


<li> Upgrade Distro <br/>
If you weren't able to initialize the server with the latest OS relase, you can
now log in to the machine and update the current distro (GNU/Linux
distribution/release) packages and upgrade to a more recent release (if one is
available).  Here's an example tutorial: <br/>
<a href="https://www.digitalocean.com/community/tutorials/
how-to-upgrade-to-ubuntu-20-04-focal-fossa">How To Upgrade to Ubuntu 20.04
Focal Fossa</a> <br/>

Update/Upgrade notes: <br/>
<code>apt update</code> <br/>
<code>apt upgrade</code> <br/>
<code>apt dist-upgrade</code> <br/>
<code>do-release-upgrade</code>
</li><br/>


<li> Alt Access <br/>
You can look into whether your cloud-service/server provider offers an
alternate means of accessing your server, such as a browser console.  This
might help if you accidentally set up a firewall that blocks SSH access,
preventing you from logging in from your own computer via SSH.  As of the time
of this writing, DigitalOcean provides a means of enabling a "Droplet Console"
giving native-like terminal access to your Droplet from your browser.  It's a
relatively quick process, where you can enable this feature by executing a
one-line command as a root or sudo-group user.
</li><br/>


<li> Firewall <br/>
You can log into your server machine and set up a firewall. <br/>
<code>local-shell> ssh root@ip.add.re.ss</code>  (log in to the remote machine,
switching <code>ip.add.re.ss</code> with the machine's IP address) <br/>
<code>remote-shell> ufw app list</code> (this should show OpenSSH) <br/>
<code>ufw app list</code> (I'll omit the <code>remote-shell></code> prompt
illustration part now) <br/>
<code>ufw allow OpenSSH</code> (add an "allow" rule for OpenSSH to make sure
ssh access is not blocked) <br/>
<code>ufw enable</code>        (to turn on the firewall) <br/>
<code>ufw status</code>        (to see the current firewall status) <br/>
Log out and log back in to to see that it worked.
</li><br/>


<li> Configs <br/>
At this point I'll usually add my own personal computer config files to make
working with the machine more efficient and pleasing.  See my
<a href="https://github.com/oneforawe/config-repo/tree/master/setup/
remote-machine-setup">config-repo</a> on github for instructions.  (If doing
this, manually copy over my gitconfig file and edit the email address.)
Additionally, one can update the GNU/Linux system at this point (eg, using
<code>aptup</code> in my system).
</li><br/>


<li> Hostname <br/>
If the machine hostname (droplet name) did not get properly transferred to the
machine (for example, if the prompt reads <code>root@ubuntu</code>), then you
can use the <code>hostnamectl</code> command to see the current state, and use
the following to change the hostname: <br/>
<code>hostnamectl set-hostname your-preferred-hostname-here</code>
</li><br/>


<li> Non-Root User <br/>
For security reasons, it's best not to always be using the root user to perform
tasks.  Create a new user that has super-user "sudo" privileges.  As root user,
execute the following (with, say, the new user name being <code>one</code>):
<br/>
<code>adduser one</code>           (add the new user, and create password for
the user) <br/>
<code>usermod -aG sudo one</code>  (add user to the <code>sudo</code> group, to
have <code>sudo</code> privileges) <br/>
<code>rsync --archive --chown=one:one ~/.ssh /home/one</code>
  (give the user ssh access to the machine, so there's no need for a password)
</li><br/>


<li> Reboot<br/>
You may want to log out and log back in, and in case a system restart is
required (given the updates and changes made), you can reboot the server.
</li><br/>


<li> Configs (again) <br/>
Log out and log back in as the non-root user using
<code>ssh one@ip.add.re.ss</code>  (switching <code>ip.add.re.ss</code> with
the machine's IP address and <code>one</code> with whatever user name was
chosen).  Install personal configs again if desired.
</li><br/>


<li> Nginx & systemd <br/>
Install nginx with <code>sudo apt install nginx</code>, adjust the firewall,
and add default html content and an nginx server block.  Follow instructions in
a tutorial such as this: <br/>
<a href="https://www.digitalocean.com/community/tutorials/
how-to-install-nginx-on-ubuntu-20-04">How To Install Nginx on Ubuntu 20.04</a>

Nginx notes: <br/>
<code>systemctl status nginx</code> <br/>
<code>sudo systemctl stop nginx</code>    (stop current-session process) <br/>
<code>sudo systemctl start nginx</code>   (start current-session process) <br/>
<code>sudo systemctl restart nginx</code> (restart current-session process)<br/>
<code>sudo systemctl reload nginx</code>  (reload current-session process)<br/>
<code>sudo systemctl disable nginx</code> (turn off daemon behavior) <br/>
<code>sudo systemctl enable nginx</code>  (turn on  daemon behavior) <br/>
<code>sudo nginx -t</code>             (check if nginx configs are valid)

Systemd notes: <br/>
See my <a href="./Commands.md">commands reference</a> for notes on
systemd/systemctl.

init.d notes: <br/>
See also that a shell script for <code>nginx</code> resides in
<code>/etc/init.d/</code>.

Firewall notes: <br/>
<code>sudo ufw app list</code> <br/>
<code>sudo ufw allow 'Nginx HTTPS'</code> (add an "allow" rule to the
firewall) <br/>
<code>sudo ufw status</code>              (Note: in a browser, navigating to
the IP address, site still not available) <br/>
<code>sudo ufw delete allow 'Nginx HTTPS'</code> (delete the "allow" rule)<br/>
<code>sudo ufw allow 'Nginx Full'</code>  (Note: in a browser, navigating to
the IP address, site is now available)

Server block notes: <br/>
See the <code>2-peripherals/nginx-files-example</code> folder in this github
repo for example files. <br/>
<code>/var/www/example.com/html/index.html</code>  (the html content, where
<code>example.com</code> is your domain, if you have one; you don't need this
file if you don't have a domain for this project) <br/>
<code>/var/www/ip-address-content/html/index.html</code>  (whether or not you
have a domain for this project, you can put content in a folder structure such
as this, where <code>ip-address-content</code> can be an arbitrarily chosen
name, and we'll make it show up when navigating a browser to the server's IP
address) <br/>
<code>/etc/nginx/sites-available/example.com</code>  (server block file, if
using domain example.com) <br/>
<code>/etc/nginx/sites-available/ip-address-content</code>  (server block file,
using your own <code>ip.add.re.ss</code>)
<br/>
<code>sudo ln -s /etc/nginx/sites-available/ip-address-content
/etc/nginx/sites-enabled/</code>
<br/>
<code>sudo nginx -t</code> <br/>
<code>sudo systemctl reload nginx</code>  (the site should now display the
<code>ip-address-content</code> content) <br/>
<code>sudo rm /etc/nginx/sites-enabled/ip-address-content</code>  (can delete
this or keep it in place) <br/>
<code>sudo systemctl reload nginx</code>  (the site should now display the
default content again) <br/>
<code>sudo ln -s /etc/nginx/sites-available/example.com
/etc/nginx/sites-enabled/</code>
<br/>
<code>sudo systemctl reload nginx</code>  (the site should now display the
example.com content when the browser is navigated to
<code>http://example.com</code> or <code>http://www.example.com</code> -- note
that it's still not secure) <br/>
<code>etc/nginx/nginx.conf</code> (uncomment the
<code>server_names_hash_bucket_size</code> line) <br/>
<code>sudo nginx -t</code> <br/>
<code>sudo systemctl restart nginx</code>
</li><br/>


<li> Secure Nginx <br/>
Securing with Let's Encrypt / Certbot, to enable HTTPS with an SSL certificate.
<br/>
Note 1: If you're looking to add the security and privacy benefits of an HTTPS
certificate to your website, you may not need Certbot. Many hosting providers
have internal tools to enable HTTPS. Before using Certbot, check if your
hosting provider is one of them.  (See <a href="https://certbot.eff.org/
about/">certbot.eff.org/about/</a>) <br/>
Note 2: If not using a domain and just using an IP address, take note of this:
"It is possible to purchase certificates for IP addresses, but not from Let's
Encrypt. Let's Encrypt may offer IP address certificates in the future, but as
of September 2018 we do not."  (See <a href="https://community.letsencrypt.org/
t/certificate-for-public-ip-without-domain-name/6082">community forum</a>)

Tutorial: <br/>
<a href="https://www.digitalocean.com/community/tutorials/
how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04">How to Secure Nginx
with Let's Encrypt on Ubuntu 20.04</a>

Preliminary notes: <br/>
Make sure firewall allows 'Nginx Full' (and no need to have redundant 'HTTP' or
'HTTPS' allow rules -- we'll redirect HTTP to HTTPS). <br/>
Make sure the server block file lists both 'example.com' and 'www.example.com'
if that's what you want to secure.

Certbot notes: <br/>
<code>sudo apt install certbot python3-certbot-nginx</code> (install certbot)
<br/>
<code>sudo certbot --nginx -d example.com -d www.example.com</code> (give email
address, select option 2 for redirect of HTTP to HTTPS if that's what's
desired, and visit the provided SSL test links -- should get an 'A' rating, so
trouble-shoot if not; note that the website is now secure!  Visit and see.)
<br/>
<code>sudo systemctl status certbot.timer</code> (check the renew timer) <br/>
<code>sudo certbot renew --dry-run</code> (renewal dry run) <br/>

Certbot (more) subdomains: <br/>
See <a href="https://certbot.eff.org/docs/using.html">certbot docs</a> for more
functionality. <br/>
Before executing the following two commands, be sure to add the subdomain(s) to the
registrar DNS records, add the appropriate content to <code>/var/www/</code>,
add the appropriate server block(s) to <code>/etc/nginx/sites-available</code>,
link the 3 or 4 server block(s) in <code>/etc/nginx/sites-enabled</code>, check
the configs with <code>sudo nginx -t</code>, and restart nginx with <code>sudo
systemctl restart nginx</code>. (NOTE: In the second server block, <code>
sub.example.com-static-secure</code>, the ssl location will refer to the domain
without the subdomain: <code>/etc/letsencrypt/live/example.com/</code>. Also,
although the main domain server block has <code>ipv6only=on</code> in it, this
subdomain server block must not have this setting, since setting it twice will
cause problems.<br/>
<code>sudo certbot --nginx certonly --cert-name example.com -d
example.com,www.example.com,sub.example.com,www.sub.example.com</code> (to add
certificate coverage of more subdomains beyond www) <br/>
<code>sudo systemctl reload nginx</code> (may be necessary to integrate new
ssl settings)
</li><br/>


<li> Node <br/>
(You may want to install with nvm instead of following the instructions below;
new edits have been made to the <a href="./1-InitialSetUp.md">Phase 1</a> notes
that indicate this is the preferred method, given EDAPT's usage of the
globally-installed PM2 package.)

This tutorial gives a high-level set of instructions that link to many of the
steps already taken and contain instructions for the next few steps:
<a href="https://www.digitalocean.com/community/tutorials/
how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04">How To Set
Up a Node.js Application for Production on Ubuntu 20.04</a>

Node notes: <br/>
<code>cd ~</code> <br/>
<code>curl -sL https://deb.nodesource.com/setup_16.x -o
nodesource_setup.sh</code> (prepare to install Node.js via
<code>nodesource_setup.sh</code>) <br/>
<code>sudo bash nodesource_setup.sh</code> (more prep)<br/>
<code>sudo apt install nodejs</code> (install node and npm)<br/>
<code>sudo apt install build-essential</code> (good extras to have)<br/>
<code>rm nodesource_setup.sh</code> (cleanup)
</li><br/>


<li> Test Server <br/>
Running a simple test server before running EDAPT, to ensure proper set up of
server infrastructure, allowing for trouble-shooting.

Test server notes: <br/>
<code>mkdir ~/test-server</code> <br/>
<code>vim ~/test-server/hello.js</code> (use the code provided in the
instructions above) <br/>
<code>node ~/test-server/hello.js</code> (run the server)<br/>
<code>curl http://localhost:3000</code> (in another terminal, log in to the
server machine and execute this command to see that the server serves content,
"Hello World!" at the given uri) <br/>
<code>Control-C</code> (logout from and close the extra terminal, and stop the
test server in the original terminal with <code>Ctrl-C</code>)
</li><br/>


<li> PM2 <br/>
Using PM2, a process manager, to control local web-servers as background
processes in a robust way (dealing with reboots, etc).  See a PM2 reference
here: <br/>
<a href="https://pm2.keymetrics.io/docs/usage/quick-start/">PM2 Quick Start</a>

PM2 notes: <br/>
<code>sudo npm install pm2@latest -g</code> (install pm2 globally; ignore npm
warnings)<br/>
<code>pm2 start /home/one/test-server/hello.js --name "hello-world"</code>
(name the server, as a pm2 process, "hello-world" and start it, implicitly
calling node to start <code>hello.js</code>; note this time that it runs in the
background so we can still work in the same terminal) <br/>
<code>curl http://localhost:3000</code> (the same content should be served)
<br/>
<code>pm2 stop hello-world</code> <br/>
<code>pm2 ls</code> <br/>
<code>curl http://localhost:3000</code> (no content served) <br/>
<code>pm2 start hello-world</code>      (content served again) <br/>
<code>pm2 ls</code>

PM2/systemd Robustness: <br/>
See page on <a href="https://pm2.keymetrics.io/docs/usage/startup/">PM2 Startup
Script</a>. <br/>
<code>pm2 startup systemd</code> (generate a pm2 startup script for machine
boots, to be controlled by systemd; copy the command that's generated for
activating/setting-up that startup script -- we'll execute that after a couple
peeks in the systemd world) <br/>
<code>systemctl list-unit-files | grep pm2</code> (no file there yet...) <br/>
<code>systemctl status pm2-one</code> (no unit service yet...) <br/>
<code>sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup
systemd -u one --hp /home/one</code> (create and/or activate(?) a systemd
"unit" to activate the pm2 startup script; see unit at
<code>/etc/systemd/system/pm2-one.service</code>) <br/>
<code>systemctl list-unit-files | grep pm2</code> (see that a unit file is now
present) <br/>
<code>systemctl status pm2-one</code> (inactive, but loaded and enabled) <br/>
<code>pm2 save</code> (save/"dump" current pm2 process list for respawning
after reboots; saved in <code>~/.pm2/dump.pm2</code>) <br/>
<code>pm2 kill</code> (kill the pm2 daemon here, before giving control to
systemd, to prevent error on the <code>systemctl start pm2-one</code> command)
<br/>
<code>systemctl status pm2-one</code> (inactive, but loaded and enabled) <br/>
<code>sudo systemctl start pm2-one</code> (start unit; maybe get an error here,
but shouldn't due to <code>pm2 kill</code> step)<br/>
<code>sudo reboot</code> (if there was an error, reboot and log back in) <br/>
<code>systemctl status pm2-one</code> (active, and loaded and enabled) <br/>
<code>pm2 ls</code> (should see that the hello-world process has a status of
"online", so you can sample what's served with curl)

More PM2 Usage: <br/>
<code>pm2 --help</code> (see subcommands and options)<br/>
<code>pm2 kill</code> (kill the pm2 daemon, separate from systemd control)<br/>
<code>pm2 start   app_name_or_id</code> <br/>
<code>pm2 stop    app_name_or_id</code> <br/>
<code>pm2 restart app_name_or_id</code> <br/>
<code>pm2 delete  app_name_or_id</code> <br/>
<code>pm2 info app_name</code> <br/>
<code>pm2 monitor</code> <br/>
<code>pm2 unstartup systemd</code> (remove the systemd init script for pm2)
<br/>
Note that some PM2 files are saved in <code>~/.pm2</code>.
</li><br/>


<li> Reverse Proxy Test <br/>
That is, serving via Nginx by port, referring to a local Node server. Let's
create a new server block that refers to the port which we're using to serve
hello-world.

New server block(s) for test: <br/>
I'll deviate from the instructions a little to keep file names and purposes
clear. <br/>
<code>cd /etc/nginx/sites-available</code> <br/>
<code>sudo cp example.com-static-secure example.com-port-secure-test</code>
<br/>
<code>sudo vim example.com-port-secure-test</code> (modify file so reverse-
proxy server points to port 3000 for test; can delete <code>ipv6only=on</code>
-- it's the default anyway) <br/>
<code>sudo cp example.com-port-secure-test
sub.example.com-port-secure-test</code> (can simultaneously run the test for
the subdomain too) <br/>
<code>sudo vim sub.example.com-port-secure-test</code> (modify file so it's
appropriate for sub.example.com)

Check test: <br/>
Remove the links to server blocks with static content and add links to the
server blocks with reverse-proxy content delivered by port.  Check nginx
configs and restart nginx as usual.  Then check the website to ensure things
are working properly.  You should see "Hello world!" on the website.

Check robustness: <br/>
At this point you can execute <code>sudo reboot</code> to see that the pm2-one
systemd unit works and the hello-world pm2 process is successfully restarted
upon reboot.  The website will be down while the server is off and restarting,
but it should come back after fully rebooting.
</li><br/>


<li> Dismantle Test <br/>
Remove the test links to test server blocks (and replace with links to secure
static blocks if desired), check/reset nginx, and stop the hello-world process.
For extra dismantling, you can get rid of the pm2-one systemd unit (and create
it again when setting up EDAPT).

Extra: <br/>
<code>sudo systemctl stop pm2-one</code> <br/>
<code>pm2 ls</code> (respawns a pm2 daemon, but gives a warning about process
list not being in synch with saved list) <br/>
<code>pm2 kill</code> (let's start again and dismantle as much as possible via
systemctl) <br/>
<code>sudo systemctl start pm2-one</code> <br/>
<code>pm2 ls</code> (no problems now) <br/>
<code>pm2 delete hello-world</code> (stop and erase hello-world pm2 process;
gives a sensible warning) <br/>
<code>pm2 save</code> (gives a warning and skips save) <br/>
<code>pm2 save --force</code> <br/>
<code>sudo systemctl stop pm2-one</code> <br/>
<code>pm2 unstartup</code> (copy and paste command given)<br/>
<code>sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 unstartup
systemd -u one --hp /home/one</code> <br/>
<code>sudo npm remove pm2 -g</code> <br/>
<code>rm -r ~/.pm2</code> <br/>
The infrastructure for the test is removed now. (The test-server is still
present for testing, if desired.)
</li><br/>


<li> EDAPT <br/>
You can repeat steps 3 and 4 from <a href="./1-InitialSetUp.md">Phase 1</a>,
except that the configuration files for EDAPT can be copied from your local
computer to the remote computer (if you are will be using the same
configurations).
</li><br/>


<li> MySQL <br/>
You can use step 5 from <a href="./1-InitialSetUp.md">Phase 1</a> again, using
the instructions for GNU/Linux with apt.
</li><br/>


<li> Nginx Reverse Proxy<br/>
Ensure there is a file <code>example.com-port-secure</code> (or
<code>sub.example.com-port-secure</code>) that can enable serving of content
from port 8080.  Then set nginx back into a "reverse proxy" mode by pointing to
port 8080 for content delivery (for the main domain, the subdomain, or both).
Once that's done we'll set up to serve some demo content on that port.
</li><br/>


<li> Test the Database & Demo Web-App:<br/>
You can use steps 6 and 7 from <a href="./1-InitialSetUp.md">Phase 1</a> again,
but this time in step 7 the web-app will be served online (on the internet)
frrom the remote machine.  Note that if it turns out that the remote machine
does not have the resources necessary to build the files, then you might have
to do the build on your own computer and push/copy the files over to the remote
machine.

Now set up PM2 again to be able to use edapt.  Depending on how much of the
test you dismantled, you may need to re-install pm2 and integrate it again with
systemd.  Ensure the pm2-one service is loaded, enabled, and active (with the
pm2 daemon spawned and running).  Set up "edapt-demo" as a pm2 process, and
make sure it is robustly running with systemd: <br/>
<code>node /home/one/edapt-data-handler/web-app/server/server.js server-port=8080 demo</code>
(test that this works first; edit the path to <code>server.js</code> if
necessary) <br/>
<code>pm2 start "node /home/one/edapt-data-handler/web-app/server/server.js server-port=8080 demo" --name "edapt-demo"</code>
(edit the path if necessary)

To test that you've got everything robustly running with systemd, you can check
that the demo web-app is live on the website, then reboot and watch to see that
the app disappears and then comes back on its own.

If your goal was just to get the demo web-app up and running, then we're done
here!
</li><br/>


<li> Implement Full EDAPT Web-App <br/>
If you want to implement the full, email-retrieving, database-updating web-app,
then we have a bit more to do.  You can dismantle the demo web-app, and then
build a normal "business" version of the client, and then do a test serve of
the full app.  Note that when the client "build" is normal (non-demo) -- that
is, when the files in <code>web-app/client/build/</code> provide the normal
non-demo behavior -- the demo will not be available and the "edapt-demo" pm2
process will not work.  You might want to delete that pm2 process in order not
to confuse anyone, including yourself, into thinking that it should work.

Your actions will include the following: <br/>
<code>npm run build-prod</code> (build either there on the remote machine or
locally and then push/copy to the remote machine) <br/>
<code>npm run serve-prod</code> (see that the website is served properly) <br/>
<code>node /home/one/edapt-data-handler/web-app/server/server.js server-port=8080</code>
(edit the path if necessary; see that this works too, in preparation for
creating a new pm2 process) <br/>
<code>pm2 start "node /home/one/edapt-data-handler/web-app/server/server.js server-port=8080" --name "edapt"</code>
(edit the path if necessary)

If that's working, you can ensure that the "edapt" pm2 process will robustly
serve the web-app: <br/>
<code>pm2 save</code> <br/>
<code>sudo systemctl restart pm2-one</code> <br/>
<code>sudo reboot</code>
</li><br/>


</ol>


That should be it!