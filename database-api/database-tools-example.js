const { Op } = require('sequelize')


async function getReportExample(Model) {
  const reportArray = await Model.findAll({
    where: {
      firstName: { [Op.eq]: 'Jane' }
    }
  })
  .then(data => data.map(row => row.dataValues))
  const report = reportArray[0]
  return report
}


module.exports = getReportExample