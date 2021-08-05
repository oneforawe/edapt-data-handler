//import require from 'requirejs'
const { DataTypes } = require('sequelize')


//const tableName = 'Reports'
//const tableName = 'ReportsEml'
//const tableName = 'ReportsRec'
//const tableName = 'Demo'


// Reference:
// https://sequelize.org/v5/manual/data-types.html

const tableStructure = {
  // Model attributes are defined here
  // first attribute is 'id' added by default
  reportDateInt: {           // An integer label for dates (& thus reports).
    type: DataTypes.INTEGER, // EG: -5, 0 for (arbitrary) reference date, 7, ..
    allowNull: false         // one int assigned to two reports (2 bays, daily)
  },
  reportForDate: {
    type: DataTypes.STRING(10), // EG: '05/15/2021'
    allowNull: false
  },
  reportForWeekday: {
    type: DataTypes.STRING(3), //  EG: 'Mon', 'Tue', 'Wed', etc
    allowNull: false
  },
  reportSendDate: {
    type: DataTypes.STRING(20), // EG: '05/16/2021 00:00:59'
    allowNull: false
  },
  gmailMsgDate: {               // Examples for main msg and part/attch msg
    type: DataTypes.STRING(40), // EG: 'Fri, 28 May 2021 18:27:05 -0700'
    allowNull: false            // or: 'Wed, 12 May 2021 00:02:06 -0700 (PDT)'
  },
  reportIsConsistent: {
    type: DataTypes.BOOLEAN, // => Look at bay/access, sums, etc
    allowNull: false
  },
  bay: { // The number 2 specifies display-width padding, zerofill adds zeroes
    type: DataTypes.TINYINT(2).ZEROFILL, // => 01, 02, ...
    allowNull: false
  },
  netMoneyCalc: {
    type: DataTypes.DECIMAL(11,2),
    allowNull: false
  },
  salesTotal: {
    type: DataTypes.DECIMAL(11,2),
    allowNull: false
  },
  salesCash: {
    type: DataTypes.DECIMAL(11,2),
    allowNull: false
  },
  salesCredit: {
    type: DataTypes.DECIMAL(11,2),
    allowNull: false
  },
  cashIn: {
    type: DataTypes.DECIMAL(11,2),
    allowNull: false
  },
  cashOut: {
    type: DataTypes.DECIMAL(11,2),
    allowNull: false
  },
  cashNet: {
    type: DataTypes.DECIMAL(11,2),
    allowNull: false
  },
  cashNotRefunded: {
    type: DataTypes.DECIMAL(11,2),
    allowNull: false
  },
  creditIn: {
    type: DataTypes.DECIMAL(11,2),
    allowNull: false
  },
  creditRefunds: {
    type: DataTypes.DECIMAL(11,2),
    allowNull: false
  },
  creditNet: {
    type: DataTypes.DECIMAL(11,2),
    allowNull: false
  },
  unitsWashTotal: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  unitsWashCash: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  unitsWashCredit: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  unitsWashAccount: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  unitsWashEmployee: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  unitsWashW: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  unitsWashP: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  unitsWashD: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  unitsWashE: {
    type: DataTypes.SMALLINT,
    allowNull: false
  }
}

// Arbitrary reference date for assigning reportInteger labels
const refForReportDateInt = '05/16/2021'


const tableExports = { tableStructure, refForReportDateInt }

module.exports = tableExports