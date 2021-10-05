/** To use this file, rename this file as `table-structure.json` and place it
 *  in the `database/config` directory.  Other code may have to be changed a
 *  lot to use this file without errors.
 */
//import require from 'requirejs'
const { DataTypes } = require('sequelize')


//const tableName = 'Users'


// Reference:
// https://sequelize.org/v5/manual/data-types.html

const tableStructure = {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}


const tableExports = { tableStructure }

module.exports = tableExports