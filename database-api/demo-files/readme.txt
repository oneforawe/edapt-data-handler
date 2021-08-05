To create demo table, I dumped data from remote machine's mysql database/table
into a file, copied that file (by scp) to local computer, modified the file to
refer to 'PreDemo' rather than 'Reports', imported that 'PreDemo' file into the
local database/table, then used that table with `create-demo.js` to transform /
anonymize/randomize that data (mostly generating new data) and create a new
'Demo' mysql table.  Then dumped that new 'Demo' data from the local machine's
mysql database/table into a file, copied that file (by scp) to the remote
computer, and imported that data into the remote mysql server.

Then added the demo file to the git repo so it comes packaged with EDAPT.