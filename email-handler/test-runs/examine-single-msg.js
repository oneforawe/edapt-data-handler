const fs = require('fs')
const {
  assureFile, assureJSONfile, getJSONobject, setJSONobject
} = require('../helper-js/file-interact')
const { getCredentials, authorize } = require('../helper-js/acct-and-auth')
const { getMessage } = require('../helper-js/gmail-api')
const {
  simplifyHeaders, getRelevantAttachments,
} = require('../helper-js/process-msg')
const { parseEmailMsg } = require('../helper-js/parse-email-msg')


// const idObj = {
//   id: '17a3a37d8faaf15b',
//   threadId: '17a3a37d8faaf15b',
// }

// report id = 159
// (7/13 bay 2 millions; an error w/ the email report generator, not EDAPT)
const idObj = {
  id: '17aa3d1b246760ee',
  threadId: '17aa3d1b246760ee',
}


async function examineOne() {

  const creds = await getCredentials()
  const msgFullObj = await authorize(creds, getMessage, idObj, 'getMessage')
  const gmailIDs = msgFullObj.gmailIDs
  const simpleHeaders = simplifyHeaders(msgFullObj.msgPayload.headers)
  const body = msgFullObj.msgPayload.body.data
  const attachments = getRelevantAttachments(msgFullObj.msgPayload.parts)
  msgSimpleObj = {
    gmailIDs, headers: simpleHeaders, bodyAsBase64String: body, attachments
  }

  const { reportObj, bodyString } = await parseEmailMsg(msgSimpleObj)
  const examFileName = 'emailMsg_Millions_2.txt'
  await assureFile(examFileName)
  await fs.promises.writeFile(examFileName, bodyString)

  // console.log('body:')
  // console.dir(msgObj.msgPayload.body)
  // console.log('parts:')
  // console.dir(msgObj.msgPayload.parts)


  //msgObj.msgPayload.parts.forEach( (part, index) => {

    /*
    if (part.filename && part.filename.slice(-4) === '.eml') {
      console.log(`Keeper:      part.filename = ${part.filename}`)
      // thus part.parts[0]           ~   message.msgPayload
      //  and part.parts[0].headers       message.msgPayload.headers
      //  and part.parts[0].body.data     message.msgPayload.body.data

      console.log('part.parts[0].headers[0]')
      console.dir(part.parts[0].headers[0])
      console.log('translated snippet of part.parts[0].body.data')
      const body = Buffer.from(part.parts[0].body.data, "base64").toString("utf8")
      console.dir(body.slice(0, 30))

    }
    else {
      console.log(`NOT keeping: part.filename = ${part.filename}`)
    }
    */

    // if (part.parts) {
    //   console.log('part.parts[0]:')
    //   console.log(part.parts[0])
    // }


    // console.log(`\npart ${index}:`)
    // console.log(`partId: ${part.partId}`)
    // console.log(`headers: ${part.headers[0]} ..`)
    // if (part.body.attachmentId) {
    //   console.log('body.attachmentId:')
    //   console.log(part.body.attachmentId)
    // }
    // if (part.body.data) {
    //   const dataString = Buffer.from(part.body.data, "base64").toString("utf8")
    //   console.log('body.data:')
    //   console.log(dataString)
    // }
    // if (part.parts) {
    //   console.log('part.parts[0]:')
    //   console.log(part.parts[0])
    // }
  //})
}

examineOne()