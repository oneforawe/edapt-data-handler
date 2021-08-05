/* USING A GMAIL ACCOUNT *****************************************************/

// For development testing:
// username: Throwaway Test <throwaway.test@gmail.com>
// password: See other secure records for password.

// For business usage:
// username: See other secure records for username.
// password: See other secure records for password.


/* INFO TO SHARE WITH email-handler APP **************************************/

// Only access messages with all of these labels:
//const labelsRequire = ['Biz Data']  // See note below.
const labelsRequire = []  // See note below.
/* NOTE: If you edit `labelsRequire`, read all the comments below to ensure
** that the default value for `refreshDate` is appropriate for your case. */


// Old arbitrary reference date for initializing records process, if needed.
const oldDate = new Date('1980/01/01').getTime()

/**
 * If you edit the labelsRequire array, opening up the possibility of
 * processing more email messages from times before the last successful update
 * (while under the previous labelsRequire regimen), then this is a date from
 * which to re-start collecting email messages in the account.  (Some of the
 * previously ingested email may be processed again, but this should not create
 * duplicates, since duplicates will be checked-for and not allowed.)
 */
const refreshDate = oldDate
/* Use the old default 1980 date if there isn't early email you'd like to
** exclude. */


module.exports = { labelsRequire, oldDate, refreshDate }