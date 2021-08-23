
const db = require('../db/Mysql')

class UserModel {

static getUser({ CUSCOD = '' }) {
    
    return db.execute('select * from cal2009.newcontno  where CUSCOD = (select CUSCOD from cal2009.login  where PRODUCTID = ?)', [CUSCOD])
}
static findUserByEmail({ CUSCOD = '' }) {
    return db.execute('SELECT * FROM cal2009.login WHERE cal2009.login.CUSCOD = ?', [CUSCOD])
}
}
module.exports = UserModel;