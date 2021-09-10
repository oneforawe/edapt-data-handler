import { clientIsInDemoMode } from '../client-mode/mode'


function getDemoInit() {

  const demoToday = new Date('7/25/21')
  let demoYesterday = new Date(demoToday)
  let demoWeekAgo = new Date(demoToday)
  demoYesterday.setDate(demoToday.getDate() - 1)
  demoWeekAgo.setDate(demoToday.getDate() - 7)

  const demoTimeOptionsInit = {
    today: demoToday, // not mod'd by user/form, used by back-end server query
    yesterday: demoYesterday, // ditto
    daysAgo: '7',
    intvlStart: demoWeekAgo,
    intvlFinal: demoYesterday,
    reportDate: demoYesterday,
    timeSearchSel: ['byNdays'],
  }

  return demoTimeOptionsInit

}

let yesterday = new Date(today)
let weekAgo = new Date(today)
yesterday.setDate(today.getDate() - 1)
weekAgo.setDate(today.getDate() - 7)

let timeOptionsInit = {
  today,     // not modified by user/form, used by back-end server query
  yesterday, // not modified by user/form, used by back-end server query
  daysAgo: '7',
  intvlStart: weekAgo,
  intvlFinal: yesterday,
  reportDate: yesterday,
  timeSearchSel: ['byNdays'],
}

if (clientIsInDemoMode) { timeOptionsInit = getDemoInit() }

const queryInit = {
  bayOption: 'both',
  quantities: quantitiesInit,
  timeOptions: timeOptionsInit,
}

// Could have / should have used an array structure instead. See example below.
const quantitiesInit = {
    netSales: {
      combined: true,  cash: false, credit: false,
    },
    netMoney: {
      combined: true, cash: false, credit: false, unRefunded: true,
    },
    vehicles: {
      combined: true,
      cash: false, credit: false, account: false, employee: false,
      works: false, premium: false, deluxe: false, express: false,
    },
}

const initialState = {
  isQuerying: false,
  query: null,
  queryResult: null,
  queryFailed: false,
}

export default initialState


// Alternative array structure:
// const quantitiesInit = [
//   {
//     title: 'Net Sales',
//     content: [
//       { title: 'combined', content: true  },
//       { title: 'cash',     content: false },
//       { title: 'credit',   content: false },
//     ],
//   },
//   {
//     title: 'Net Money',
//     content: [
//       { title: 'combined',   content: false },
//       { title: 'cash',       content: false },
//       { title: 'credit',     content: false },
//       { title: 'unrefunded', content: true  },
//     ],
//   },
//   {
//     title: 'Vehicles',
//     content: [
//       { title: 'combined', content: true  },
//       { title: 'cash',     content: false },
//       { title: 'credit',   content: false },
//       { title: 'account',  content: false },
//       { title: 'employee', content: false },
//       { title: 'works',    content: false },
//       { title: 'premium',  content: false },
//       { title: 'deluxe',   content: false },
//       { title: 'express',  content: false },
//     ],
//   },
// ]