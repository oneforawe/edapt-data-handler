The re-process mode allows the email-handler to re-process old email messages
(in one pass) that in the past were mis-parsed and mis-categorized as non-data.

Discovering that messages have been mis-categorized is, so far, still a manual
process: for example, search and find that the number of "Sales Report" messages
in the email folder is more than the number of records in the database.  Then
set aside some recorded messages (eg, save a copy of
`records/last-msgs-list.json` as `records/last-msgs-list-bsn-2.json`) and use
them with `test-runs/examine-record-msg.js` to find out why the message or
messages aren't parsing correctly.  When the parsing code is fixed, place the
old trouble messages in a file such as
`records/records-via-records/oldTroubleMsgs-20210706.json`, then set the
`emailHandlerIsInReprocessMode` to true and run the `test-run/test-run.js`
message processing file (or a better-named version if one is made).


ALSO
TODO
Should change `parse-email-mgs.js` to raise a flag on messages that have the
correct subject type but do not parse, so they are categorized as trouble-
messages and passed on for future re-processing.  If the code is fixed in the
interim, then the message will already be cued up for re-processing / re-
parsing and this mode won't have to be used in those cases.