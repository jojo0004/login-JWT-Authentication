
const db = require('../db/Mysql')

class UserModel {

    static getUser({ CUSCOD = '' }) {

        return db.execute('select * from cal2009.newcontno  where CUSCOD = (select CUSCOD from cal2009.login  where PRODUCTID = ?)', [CUSCOD])
    }
    static findUserByEmail({ CUSCOD = '' }) {
        return db.execute('SELECT * FROM cal2009.login WHERE cal2009.login.CUSCOD = ?', [CUSCOD])
    }

    static getdamt({ contno = '', ddate = '', ma = '' }) {
        return db.execute("SELECT cal2009." + ma.toLowerCase() + "_arpay.CONTNO,T_NOPAY,NAME1,NAME2,REGNO,NOPAY,DDATE,DAMT,DATE1,PAYMENT,DELAY,INTAMT,cal2009." + ma.toLowerCase() + "_invtran.STRNO,cal2009." + ma.toLowerCase() + "_invtran.TYPE,cal2009." + ma.toLowerCase() + "_invtran.BAAB,GRDCOD "
            + " FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN cal2009." + ma.toLowerCase() + "_custmast ON cal2009." + ma.toLowerCase() + "_armast.CUSCOD = cal2009." + ma.toLowerCase() + "_custmast.CUSCOD JOIN cal2009." + ma.toLowerCase() + "_arpay ON cal2009." + ma.toLowerCase() + "_armast.CONTNO= cal2009." + ma.toLowerCase() + "_arpay.CONTNO JOIN cal2009." + ma.toLowerCase() + "_invtran ON cal2009." + ma.toLowerCase() + "_invtran.CONTNO = cal2009." + ma.toLowerCase() + "_arpay.CONTNO "
            + " WHERE cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? AND cal2009." + ma.toLowerCase() + "_arpay.ddate <= ? AND cal2009." + ma.toLowerCase() + "_arpay.DAMT > cal2009." + ma.toLowerCase() + "_arpay.PAYMENT order by nopay",
            [contno, ddate])
    }

    static getaa({ contno = '', ma = '' }) {
        return db.execute("select sum(cal2009." + ma.toLowerCase() + "_arpay.INTAMT) aa ,payment from  cal2009." + ma.toLowerCase() + "_arpay where cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? and cal2009." + ma.toLowerCase() + "_arpay.damt-cal2009." + ma.toLowerCase() + "_arpay.payment=0",
            [contno])
    }

    static getPayint({ contno = '', ma = '' }) {
        return db.execute(" select sum(PAYINT) PAYI,balanc from cal2009." + ma.toLowerCase() + "_chqtran LEFT JOIN cal2009." + ma.toLowerCase() + "_armast on cal2009." + ma.toLowerCase() + "_armast.CONTNO = cal2009." + ma.toLowerCase() + "_chqtran.CONTNO  where cal2009." + ma.toLowerCase() + "_chqtran.CONTNO = ? and cal2009." + ma.toLowerCase() + "_chqtran.flag = 'H' GROUP BY cal2009." + ma.toLowerCase() + "_chqtran.CONTNO",
            [contno])
    }

    static getarpay_0({ contno = '', ma = '' }) {
        return db.execute(" SELECT cal2009." + ma.toLowerCase() + "_arpay.CONTNO,T_NOPAY,NAME1,NAME2,REGNO,NOPAY,DDATE,DAMT,DATE1,PAYMENT,DELAY,INTAMT,cal2009." + ma.toLowerCase() + "_invtran.STRNO,cal2009." + ma.toLowerCase() + "_invtran.TYPE,cal2009." + ma.toLowerCase() + "_invtran.BAAB,GRDCOD "
            + " FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN cal2009." + ma.toLowerCase() + "_custmast ON cal2009." + ma.toLowerCase() + "_armast.CUSCOD = cal2009." + ma.toLowerCase() + "_custmast.CUSCOD JOIN cal2009." + ma.toLowerCase() + "_arpay ON cal2009." + ma.toLowerCase() + "_armast.CONTNO=  cal2009." + ma.toLowerCase() + "_arpay.CONTNO "
            + " JOIN cal2009." + ma.toLowerCase() + "_invtran ON cal2009." + ma.toLowerCase() + "_invtran.CONTNO = cal2009." + ma.toLowerCase() + "_arpay.CONTNO WHERE cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? AND DAMT-PAYMENT != 0 order by DDATE ASC LIMIT 2",
            [contno])
    }

    static getarpay = async ({ ma='', contno='' }) => {
        try {
            return await db.query(" SELECT cal2009." + ma.toLowerCase() + "_arpay.CONTNO,T_NOPAY,NAME1,NAME2,REGNO,NOPAY,DDATE,DAMT,DATE1,PAYMENT,DELAY,INTAMT,cal2009." + ma.toLowerCase() + "_invtran.STRNO,cal2009." + ma.toLowerCase() + "_invtran.TYPE,cal2009." + ma.toLowerCase() + "_invtran.BAAB,GRDCOD "
                + " FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN cal2009." + ma.toLowerCase() + "_custmast ON cal2009." + ma.toLowerCase() + "_armast.CUSCOD = cal2009." + ma.toLowerCase() + "_custmast.CUSCOD JOIN cal2009." + ma.toLowerCase() + "_arpay ON cal2009." + ma.toLowerCase() + "_armast.CONTNO=  cal2009." + ma.toLowerCase() + "_arpay.CONTNO "
                + " JOIN cal2009." + ma.toLowerCase() + "_invtran ON cal2009." + ma.toLowerCase() + "_invtran.CONTNO = cal2009." + ma.toLowerCase() + "_arpay.CONTNO WHERE cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? AND DAMT-PAYMENT != 0 order by DDATE ASC LIMIT 1",
                [contno]);
        }
        catch (err) {
            console.log(err.message);
        }
    };



    //-----------------------------------ขอส่วนลด--------------------------------------------------//

    static getcontno = async (ma='') => {
        try {
            return await db.execute("SELECT m.contno, m.SDATE , m.balanc , m.salcod , m.tcshprc ,m.t_nopay ,count(p.ddate)+1 as totalnopay,p.damt,aa.jj as totalpayment,m.NCARCST "
                + " FROM cal2009." + ma.toLowerCase() + "_armast m LEFT JOIN  cal2009." + ma.toLowerCase() + "_arpay p on m.contno = p.contno "
                + " join ( SELECT cal2009." + ma.toLowerCase() + "_armast.contno,balanc,sum(payment) as jj FROM  cal2009." + ma.toLowerCase() + "_armast LEFT JOIN  cal2009." + ma.toLowerCase() + "_arpay on cal2009." + ma.toLowerCase() + "_armast.contno = cal2009." + ma.toLowerCase() + "_arpay.contno WHERE SALCOD = 'lex00004' and date1 <= '2021-09-27' group by cal2009." + ma.toLowerCase() + "_armast.contno desc having  sum(payment) >= balanc*0.5) aa "
                + " where m.contno = aa.contno and p.ddate <= '2021-09-27' group by m.contno desc having  sum(p.payment) >= m.balanc*0.5 and m.balanc - aa.jj != 0")
        }
        catch (err) {
            console.log(err.message);
        }
    }
    static getre1 = async ({ma='', contno = '', ddate = '' }) => {
        try {
            return await db.execute("SELECT m.contno, m.SDATE , m.balanc , m.salcod , m.tcshprc ,m.t_nopay ,count(p.ddate)+1 as totalnopay,p.damt,aa.jj as totalpayment,m.NCARCST "
            +"FROM cal2009." + ma.toLowerCase() + "_armast m  LEFT JOIN  cal2009." + ma.toLowerCase() + "_arpay p on m.contno = p.contno "
            +"join ( SELECT cal2009." + ma.toLowerCase() + "_armast.contno,balanc,sum(payment) as jj "
            +  " FROM  cal2009." + ma.toLowerCase() + "_armast LEFT JOIN  cal2009." + ma.toLowerCase() + "_arpay on cal2009." + ma.toLowerCase() + "_armast.contno = cal2009." + ma.toLowerCase() + "_arpay.contno "
            + "  WHERE cal2009." + ma.toLowerCase() + "_armast.CONTNO = ? and date1 <= ? group by cal2009." + ma.toLowerCase() + "_armast.contno desc ) aa "
          + "where  m.contno = aa.contno and p.ddate <= ? group by m.contno  desc",
          [contno, ddate,ddate])

       //     return await db.execute("SELECT cal2009." + ma.toLowerCase() + "_armast.contno, SDATE , balanc , salcod , tcshprc ,t_nopay , sum(payment) as totalpayment ,count(ddate)+1 as totalnopay,damt"
       //         + " FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN  cal2009." + ma.toLowerCase() + "_arpay on cal2009." + ma.toLowerCase() + "_armast.contno = cal2009." + ma.toLowerCase() + "_arpay.contno " +
       //         " where cal2009." + ma.toLowerCase() + "_armast.contno = ? and ddate <= ? group by cal2009." + ma.toLowerCase() + "_armast.contno desc ",
       //         [contno, ddate])
        }
        catch (err) {
            console.log(err.message);
        }
    }
    static getdamt = async ({ ma='',contno = '', ddate = '' }) => {
        try {
            return await db.execute("SELECT cal2009." + ma.toLowerCase() + "_arpay.CONTNO,T_NOPAY,NAME1,NAME2,REGNO,NOPAY,DDATE,DAMT,DATE1,PAYMENT,DELAY,INTAMT,cal2009." + ma.toLowerCase() + "_invtran.STRNO,cal2009." + ma.toLowerCase() + "_invtran.TYPE,cal2009." + ma.toLowerCase() + "_invtran.BAAB "
                + " FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN cal2009." + ma.toLowerCase() + "_custmast ON cal2009." + ma.toLowerCase() + "_armast.CUSCOD = cal2009." + ma.toLowerCase() + "_custmast.CUSCOD JOIN cal2009." + ma.toLowerCase() + "_arpay ON cal2009." + ma.toLowerCase() + "_armast.CONTNO= cal2009." + ma.toLowerCase() + "_arpay.CONTNO JOIN cal2009." + ma.toLowerCase() + "_invtran ON cal2009." + ma.toLowerCase() + "_invtran.CONTNO = cal2009." + ma.toLowerCase() + "_arpay.CONTNO "
                + " WHERE cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? AND cal2009." + ma.toLowerCase() + "_arpay.ddate <= ? AND cal2009." + ma.toLowerCase() + "_arpay.DAMT > cal2009." + ma.toLowerCase() + "_arpay.PAYMENT order by nopay",
                [contno, ddate])
        }
        catch (err) {
            console.log(err.message);
        }
    }

    static getMax_nopay = async ({ ma='',contno = '' }) => {
        try {
            return await db.execute("SELECT NOPAY FROM cal2009." + ma.toLowerCase() + "_arpay where  CONTNO = ? and DATE1 is not null  order by ddate desc limit 1;",
                [contno])
        }
        catch (err) {
            console.log(err.message);
        }
    }

    static getaa = async ({ ma='',contno = '' }) => {
        try {
            return await db.execute("select sum(cal2009." + ma.toLowerCase() + "_arpay.INTAMT) aa ,payment from  cal2009." + ma.toLowerCase() + "_arpay where cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? and cal2009." + ma.toLowerCase() + "_arpay.damt-cal2009." + ma.toLowerCase() + "_arpay.payment=0",
                [contno])
        }
        catch (err) {
            console.log(err.message);
        }
    }

    static getPayint = async ({ma='', contno = '' }) => {
        try {
            return await db.execute(" select sum(PAYINT) PAYI,balanc from cal2009." + ma.toLowerCase() + "_chqtran LEFT JOIN cal2009." + ma.toLowerCase() + "_armast on cal2009." + ma.toLowerCase() + "_armast.CONTNO = cal2009." + ma.toLowerCase() + "_chqtran.CONTNO  where cal2009." + ma.toLowerCase() + "_chqtran.CONTNO = ? and cal2009." + ma.toLowerCase() + "_chqtran.flag = 'H' GROUP BY cal2009." + ma.toLowerCase() + "_chqtran.CONTNO",
                [contno])
        }
        catch (err) {
            console.log(err.message);
        }
    }

    static getCustmast = async ({ ma='',contno = '' }) => {
        try {
            return await db.execute(" SELECT cal2009." + ma.toLowerCase() + "_armast.CONTNO,NAME1,NAME2,REGNO,TYPE, BAAB, STRNO, MODEL, COLOR, ENGNO, MILERT, RVCODE, REFNO, MANUYR, STAT, FLAG,GRDCOD,SALCOD,TELP "
           +"FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN cal2009." + ma.toLowerCase() + "_custmast ON cal2009." + ma.toLowerCase() + "_custmast.CUSCOD = cal2009." + ma.toLowerCase() + "_armast.CUSCOD JOIN cal2009." + ma.toLowerCase() + "_invtran "
       +" ON cal2009." + ma.toLowerCase() + "_armast.CONTNO=  cal2009." + ma.toLowerCase() + "_invtran.CONTNO WHERE cal2009." + ma.toLowerCase() + "_armast.CONTNO = ? " 
          ,[contno])
        }
        catch (err) {
            console.log(err.message);
        }
    }

    //-----------------------------------ขอส่วนลด--------------------------------------------------//


}


module.exports = UserModel;