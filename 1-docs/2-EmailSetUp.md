# Steps to Set Up EDAPT

## Phase 2: Email Set-Up

EDAPT uses the Gmail API and the Google Cloud Platform to interact with email,
so you'll have to use a Gmail email account.

If the data-email is not already being received in a Gmail email account, then
you'll have to either change where the data-email is being sent (so it goes
directly to a Gmail account) or forward the data-email from their current
destination to a Gmail account.  If you don't already have an available Gmail
account that is appropriate for this use, then you'll have to create one.  You
can also set up a label in the destination Gmail account and filter incoming
messages so that the data-email is associated with that label.  (Providing that
label to EDAPT will allow it to more efficiently retrieve and parse the
appropriate messages.)

If you're setting up EDAPT for someone else's use, not your own personal use,
then you'll have to cooperate to get the user's email situation sorted out,
which will be easiest if you can get temporary access to the user's Gmail
account.

<br/>

<ol>

<li> Perform these steps with a test account:

If you're setting up the app for someone else, you'll probably want to run
through these steps first with your own test Gmail account, then execute them
again with the normal/business/production account when finalizing the setup.
You can create a new Gmail account and be sure to get some realistic copies of
data-email messages (or genuine, directly sent messages) so you can ensure the
parsing and ingestion into the database works properly, in addition to simply
ensuring that the connection with the test Gmail account is working fine.  This
will help the transition to the actual user's account to be more smooth and
trouble-free.
</li><br/>


<li> Get Gmail account & Google Cloud Platform (GCP) account access:

  Gmail:  
    You'll need the username, password, and (optionally) a label name (if the
    data-email will be filtered and labeled with a specific label).

  * As explained in <a href="./1-InitialSetUp.md">Phase 1</a>, you'll need to
  put the email label (if any) in
  <code>email-handler/reference/email-acct-info.js</code>.

  GCP:  
    You'll use the same account as Gmail but need to sign-up specifically for
    GCP (creating an account or getting existing account info).

  * The app-user needs to create the GCP account (if it doesn't already exist).

    Explain to the app-user:

    > To get the app to work, I need you to sign up for a GCP (Google Cloud
    Platform) account that's linked to the gmail account that will be used for
    the app.  I need you to do this yourself because you need to provide
    payment info and you need to decide up front and permanently whether you
    want this GCP account to be "Business" or "Individual" type.
    >
    > Read further for more explanation, including about the account type.
    >
    > While you are in a browser, signed in to you the Gmail account you'll be
    using for the app, open another browser tab and go to the GCP website at
    https://cloud.google.com/
    >
    > On that website, you should see your Gmail account name icon in the upper
    left side of the page: a colored circle with the first letter of your
    account name.  When you click on that icon, it should show your gmail
    address.  Make sure it shows the correct gmail address (and not some other
    gmail address that you might also have).  If it's not showing the correct
    gmail address, sign out of that incorrect account and try again or sign in
    again until it shows the correct address.
    >
    > Then you can click on the "Get started for free" button to initiate the
    sign-up process.  That way, the Gmail API infrastructure that I will be
    setting up via this GCP account will have access to your correct
    gmail/email messages.
    >
    > As the sign-up page notes:
    >   - "Your payment information helps us reduce fraud and abuse. You won't
    be charged unless you turn on automatic billing."
    >   - "Only Business accounts can have multiple users. You cannot change
    the account type after signing up. In some countries, this selection
    affects your tax options."  
    > .
    >
    > It may not matter at this point whether you select "Business" or
    "Individual", but if you'd like your linked gmail account to be your single
    business account, for convenience perhaps, then it would be good to select
    "Business" since you can't change it later.

  * Sign in to Gmail and GCP and confirm access.

</li><br/>


<li> Create a project on GCP.

  * Google Cloud Platform project  
    Go to <https://developers.google.com/drive/api/v3/quickstart/nodejs>
    for instructions.

  * Authorization credentials for a desktop application  
    ("desktop" is appropriate since what's relevant here is the back-end
    server part of the app)

    - Create New Project  
      <table><tbody>
       <tr><td>Project Name:</td>
           <td><code>EDAPT Email Retriever</code></td></tr>
       <tr><td>Project ID:</td>
           <td><code>edapt-email-retriever</code></td></tr>
      </tbody></table>

    - Select the project and enable APIs and Services; enable Gmail API.

    - OAuth Consent

      Go to Menu > APIs & Services > Credentials.  Click on the "Configure
      Consent Screen" button.

      OAuth Consent Screen:  
      Select "Internal".
      <table><tbody>
       <tr><td>App name:</td>
           <td><code>EDAPT Data Handler</code></td></tr>
       <tr><td>User support email:</td>
           <td>(forced to select gmail account address)</td></tr>
       <tr><td>App logo:</td>
           <td>(can select
           <code>email-handler/images/email-icon-circle.png</code> image file
           from this repo)</td></tr>
       <tr><td>App domain:</td><td>(can leave blank)</td></tr>
       <tr><td>Authorized domains:</td><td>(can leave blank)</td></tr>
       <tr><td>Developer contact information:</td><td>(can use the account's
       gmail address again)</td></tr>
      </tbody></table>

      Scopes:  
      Click "Add or remove scopes"  
      Search "Gmail API"  
      Select:  
       <code>.../auth/gmail.addons.current.message.readonly</code>  
         View your email messages when the add-on is running  
         (a "sensitive" scope)

    - OAuth client ID credential

      Still within the APIs & Services page, in the left-hand navigation
      section, click on "Credentials", then "Create Credentials" and select
      "OAuth client ID".

      <table><tbody>
       <tr><td>Application type:</td>
           <td><code>Desktop app</code></td></tr>
       <tr><td>Name:</td>
           <td><code>EDAPT Email Retriever OAuth client</code></td></tr>
      </tbody></table>

      Click OK. You don't need to note the info in the pop-up, since you'll
      download the credentials file.

      Download the (json) client id file by clicking on the download icon at
      the far right.  (Or click on the client name and then click on "Download
      JSON".)

      You can note the original filename somewhere, but change the file name
      to <code>credentials.json</code> and place the file in
      <code>edapt-data-handler/email-handler/auth/</code>.

</li><br/>


<li> Manually authorize & initialize Gmail connection & Fix parsing (if
necessary): <br/>

This will require manual web-browser confirmation of the Gmail connection.
Execute the following.

<code>node email-handler/test-runs/test-run.js</code> (This will prompt you
to interact, by copying a URI, pasting it in a web browser, giving access to
the email account, copying a token string, and pasting that string back in
the terminal.  This should give the app access to then retrieve email messages
and display the progress and results of the retrieval.)

You'll probably need to fix the message-parsing code to make sure that your
email messages are parsing correctly and being injected into the database
properly (into an edapt_db table called "Reports").  This could take a bit of
work to iron out properly.

NOTE: If you need to start over from scratch with the ingested email-data in
the database, you should:
* Enter mysql, select the 'edapt_db' database, and drop (delete) the 'Reports'
table.
* Remove/delete or rename these records files (in
<code>email-handler/records/</code>): <br/>
  <code>email-ingestion-records.json</code> <br/>
  <code>updates-stats.log</code> <br/>
This will allow the app to start again without knowledge of previous ingestion
of email-data and will restart the "updates-stats" log for your own records.

</li><br/>


<li> Serve the email-retrieving web-app: <br/>

Build the normal/business version of the client files: <br/>
<code>npm run build-prod</code>

Do a test run of the server and check the website: <br/>
<code>npm run serve-prod</code>

</li><br/>


</ol>


If all of that worked successfully, then you are ready for setting up the web
hosting in <a href="./3-HostingSetUp.md">Phase 3</a>.