#!/usr/bin/env bash
# filename: ensure-db-server-running.bash
# purpose: Prior to starting the web-app, ensure the database is running so a
#          connection can be established between the node/express server and
#          the database for interaction.


# Check if server is already running, and start it if it's not.

# Array           Linux option            MacOS option
checkMysql=('systemctl status mysql' 'mysql.server status') # check commands
startMysql=('systemctl start mysql'  'mysql.server start')  # start commands
# commands         for Linux               for MacOS
# control:      (daemon server)    (temporary session server)

# For GNU/Linux (Linux kernel)
if [[ `uname -s` = "Linux" ]] ;  then os=0 ; fi

# For MacOS (Darwin core OS)
if [[ `uname -s` = "Darwin" ]] ; then os=1 ; fi

check=${checkMysql[os]}
start=${startMysql[os]}


# Do the check and start silently... (send output to "nowhere", ie "/dev/null")
checkExitCode=$(eval ${check} >/dev/null; echo $?)
if [[ ${checkExitCode} == "0" ]] ; then
  printf "%s\n\n" "The MySQL server is already running; no need to start it."
else
  printf "%s\n" "MySQL server not currently running, so starting now..."
  { $(eval ${start} >/dev/null); } || {
    printf "%s\n\n" "The MySQL server did not successfully start."
    exit 1
  }
  printf "%s\n" "The MySQL server successfully started."
  # No need to test:
  # printf "%s" "Checking status for readyness to connect."
  # checkExitCode=$(eval ${check} >/dev/null; echo $?)
  # while [[ ${checkExitCode} != "0" ]] ; do {
  #   printf "%s" "."
  #   sleep 0.5s
  #   checkExitCode=$(eval ${check} >/dev/null; echo $?)
  # } done
  # printf "\n%s\n\n" "Ready to connect."
fi

exit 0