const JSFTP = require('jsftp')
const { params } = require('./config')
const ftp = new JSFTP(params)

module.exports = { ftp }