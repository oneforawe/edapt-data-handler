# EDAPT Data Handler

EDAPT = Email-Data Assistant & Processor Tool:  
A Web-App for Data Ingestion via Email and Data Viewing & Downloading via
Website

The Problem:  
If you have regularly-generated data-containing email messages that you'd like
to have automatically processed so that you can easily query the data and
download it in a form that's convenient for displaying in a spreadsheet, then
you need a tool like EDAPT.

The Solution:  
EDAPT continually retrieves data from regularly-generated data-containing email
messages (via Gmail), parses the email messages to extract the data, ingests
that data into a (MySQL) database, allows queries by website graphical user
interface (GUI), and allows downloading the contents of the database in the
form of a CSV (comma-separated-values) file.

Example:  
EDAPT is particularly useful for people operating an automated self-serve
business (such as a car wash) that has auto-generated (sales report) data sent
by email on a daily basis.

Demo:  
<a href="https://www.edapt.datalux.xyz/">EDAPT @ datalux</a>


## Requirements for Set-Up

You can run EDAPT in a demo form (without incoming email, using static demo
data) on your own personal computer, viewing and interacting with it in a web
browser.

To run EDAPT fully as a web-app on the internet, you will need:
1. a computer with continual connection to the internet to act as a server, to
host and serve the web-app to the internet -- if you don't have one on-hand, a
small amount of money can get you easy access to such a computer with a
web-hosting company;
2. permissions (that is, sudo user access and maybe root user access) to set up
that server appropriately and in a secure way; and
3. regularly incoming data-containing email messages that can be directed or
forwarded to a Gmail email account (although you can go without this part if
you just want to set up a demo version with some static data).

When running EDAPT privately, not online, but on your own computer, the needs
for server set-up and security are drastically reduced.

Note that if you want to run EDAPT fully with incoming email, and if your email
messages' formatting and content do not match that of the default in this app,
then the code that parses the email messages will have to be re-written to
properly extract the data from your email messages.  You may also want to tweak
the timing of the email retrieval.  (The default is to retrieve once a day at
4am.)

In any scenario, you can use your own machine (for example, a personal desktop
or laptop computer) and/or a remote machine (for example, a GNU/Linux server
provided by a cloud-service or web hosting company).  It may be easiest to do
the initial setup, any necessary trouble-shooting, and perhaps some development
on your own computer when possible, and copy/push the final or production code
to a remote machine dedicated to hosting the web-app.


## Installation & Set-Up

There are three major phases of installation and set-up.  Visit each link for
detailed instructions.

1. [Initial Set-Up](./1-docs/1-InitialSetUp.md)  
  install in demo form (probably on a local personal computer)
2. [Email Set-Up](./1-docs/2-EmailSetUp.md)  
  set up for email retrieval (probably on a local personal computer)
3. [Hosting Set-Up](./1-docs/3-HostingSetUp.md)  
  set up for hosting online (probably on a remote server computer, either
hosting at a bare IP address or hosting with a domain like www.example.com)

If hosting a demo form of EDAPT, you can skip phase 2.


## Other References

* [Technologies Involved](./1-docs/Tech.md)
* [Structure of App](./1-docs/Structure.md)
* [Useful Commands](./1-docs/Commands.md) for installers and developers
* [Developer Notes](./1-docs/DevNotes.md)