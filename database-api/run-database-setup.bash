#!/usr/bin/env bash
# filename: run-database-setup.bash
# purpose: Automate installation and initialization of EDAPT's MySQL database.

# For now, this can be done by hand, but later this could be automated.

#commands...

# see if the mysqld (mysql daemon) is running (nice human-readable output)
#service mysql status

# see if the mysqld (mysql daemon) is running
#ps -e | grep mysqld

# ensure mysqld is set up properly
# ensure mysql client server is running
# Enter mysql client. Create special user and give access.
# mysql> CREATE USER edapt@localhost IDENTIFIED BY 'pick-a-password';
# mysql> CREATE DATABASE edapt_db;
# mysql> GRANT ALL ON edapt_db.* TO edapt@localhost;