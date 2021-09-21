
const db = require('../db/Mysql')

class UserModel {

static getUser({ CUSCOD = '' }) {
    
    return db.execute('select * from cal2009.newcontno  where CUSCOD = (select CUSCOD from cal2009.login  where PRODUCTID = ?)', [CUSCOD])
}
static findUserByEmail({ CUSCOD = '' }) {
    return db.execute('SELECT * FROM cal2009.login WHERE cal2009.login.CUSCOD = ?', [CUSCOD])
}

static getdamt({contno='',ddate='',ma=''}) {       
    return db.execute("SELECT cal2009." + ma.toLowerCase() + "_arpay.CONTNO,T_NOPAY,NAME1,NAME2,REGNO,NOPAY,DDATE,DAMT,DATE1,PAYMENT,DELAY,INTAMT,cal2009." + ma.toLowerCase() + "_invtran.STRNO,cal2009." + ma.toLowerCase() + "_invtran.TYPE,cal2009." + ma.toLowerCase() + "_invtran.BAAB,GRDCOD "
    +" FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN cal2009." + ma.toLowerCase() + "_custmast ON cal2009." + ma.toLowerCase() + "_armast.CUSCOD = cal2009." + ma.toLowerCase() + "_custmast.CUSCOD JOIN cal2009." + ma.toLowerCase() + "_arpay ON cal2009." + ma.toLowerCase() + "_armast.CONTNO= cal2009." + ma.toLowerCase() + "_arpay.CONTNO JOIN cal2009." + ma.toLowerCase() + "_invtran ON cal2009." + ma.toLowerCase() + "_invtran.CONTNO = cal2009." + ma.toLowerCase() + "_arpay.CONTNO "
    +" WHERE cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? AND cal2009." + ma.toLowerCase() + "_arpay.ddate <= ? AND cal2009." + ma.toLowerCase() + "_arpay.DAMT > cal2009." + ma.toLowerCase() + "_arpay.PAYMENT order by nopay",
    [contno,ddate])
}

static getaa({contno='',ma=''}) {       
    return db.execute("select sum(cal2009." + ma.toLowerCase() + "_arpay.INTAMT) aa ,payment from  cal2009." + ma.toLowerCase() + "_arpay where cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? and cal2009." + ma.toLowerCase() + "_arpay.damt-cal2009." + ma.toLowerCase() + "_arpay.payment=0",
    [contno])
}

static getPayint({contno='',ma=''}) {       
    return db.execute(" select sum(PAYINT) PAYI,balanc from cal2009." + ma.toLowerCase() + "_chqtran LEFT JOIN cal2009." + ma.toLowerCase() + "_armast on cal2009." + ma.toLowerCase() + "_armast.CONTNO = cal2009." + ma.toLowerCase() + "_chqtran.CONTNO  where cal2009." + ma.toLowerCase() + "_chqtran.CONTNO = ? and cal2009." + ma.toLowerCase() + "_chqtran.flag = 'H' GROUP BY cal2009." + ma.toLowerCase() + "_chqtran.CONTNO",
    [contno])
}

static getarpay_0({contno='',ma=''}) {       
    return db.execute(" SELECT cal2009." + ma.toLowerCase() + "_arpay.CONTNO,T_NOPAY,NAME1,NAME2,REGNO,NOPAY,DDATE,DAMT,DATE1,PAYMENT,DELAY,INTAMT,cal2009." + ma.toLowerCase() + "_invtran.STRNO,cal2009." + ma.toLowerCase() + "_invtran.TYPE,cal2009." + ma.toLowerCase() + "_invtran.BAAB,GRDCOD " 
    +" FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN cal2009." + ma.toLowerCase() + "_custmast ON cal2009." + ma.toLowerCase() + "_armast.CUSCOD = cal2009." + ma.toLowerCase() + "_custmast.CUSCOD JOIN cal2009." + ma.toLowerCase() + "_arpay ON cal2009." + ma.toLowerCase() + "_armast.CONTNO=  cal2009." + ma.toLowerCase() + "_arpay.CONTNO "
    +" JOIN cal2009." + ma.toLowerCase() + "_invtran ON cal2009." + ma.toLowerCase() + "_invtran.CONTNO = cal2009." + ma.toLowerCase() + "_arpay.CONTNO WHERE cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? AND DAMT-PAYMENT != 0 order by DDATE ASC LIMIT 2",
    [contno])
}

static getarpay = async ({ ma, contno }) => {
    try {
        return await db.query(" SELECT cal2009." + ma.toLowerCase() + "_arpay.CONTNO,T_NOPAY,NAME1,NAME2,REGNO,NOPAY,DDATE,DAMT,DATE1,PAYMENT,DELAY,INTAMT,cal2009." + ma.toLowerCase() + "_invtran.STRNO,cal2009." + ma.toLowerCase() + "_invtran.TYPE,cal2009." + ma.toLowerCase() + "_invtran.BAAB,GRDCOD " 
        +" FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN cal2009." + ma.toLowerCase() + "_custmast ON cal2009." + ma.toLowerCase() + "_armast.CUSCOD = cal2009." + ma.toLowerCase() + "_custmast.CUSCOD JOIN cal2009." + ma.toLowerCase() + "_arpay ON cal2009." + ma.toLowerCase() + "_armast.CONTNO=  cal2009." + ma.toLowerCase() + "_arpay.CONTNO "
        +" JOIN cal2009." + ma.toLowerCase() + "_invtran ON cal2009." + ma.toLowerCase() + "_invtran.CONTNO = cal2009." + ma.toLowerCase() + "_arpay.CONTNO WHERE cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? AND DAMT-PAYMENT != 0 order by DDATE ASC LIMIT 1",
        [contno]);
    }
    catch (err) {
        console.log(err.message);
    }
};

}


module.exports = UserModel;