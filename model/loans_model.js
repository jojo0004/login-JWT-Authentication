const pool = require('../db/Mysql');


exports.queryAllLoansByPersonalId = async (personalId) => {
    try {
        return await pool.query("SELECT * FROM newcontno WHERE CUSCOD =  (select CUSCOD from cal2009.login  where PRODUCTID = ?) ",
            [personalId]);
    }
    catch (err) {
        console.log(err.message);
    }
};


exports.getAllBycustmast = async ({personalId,ma}) => {
    try {
        return await pool.query("SELECT NAME1,NAME2  FROM "+ ma.toLowerCase() + "_custmast WHERE CUSCOD =  (select CUSCOD from cal2009.login  where PRODUCTID = ?) ",
            [personalId]);
    }
    catch (err) {
        console.log(err.message);
    }
};

exports.queryLoanByContnoAndMa = async ({ ma, contno }) => {
    try {
        return await pool.query("SELECT * , SUM(PAYMENT) AS SUMPAYMENT FROM " + ma.toLowerCase() + "_armast INNER JOIN " + ma.toLowerCase() + "_invtran " +
            "ON " + ma.toLowerCase() + "_armast.CONTNO = " + ma.toLowerCase() + "_invtran.CONTNO JOIN " + ma.toLowerCase() + "_arpay ON " +
            ma.toLowerCase() + "_armast.CONTNO = " + ma.toLowerCase() + "_arpay.CONTNO WHERE " + ma.toLowerCase() + "_armast.CONTNO = ? ORDER BY NOPAY DESC LIMIT 1",
            [contno]);
    }
    catch (err) {
        console.log(err.message);
    }
};

exports.queryInstallmentByContco = async ({ ma, contno }) => {
    try {
        return await pool.query("SELECT * FROM " + ma.toLowerCase() + "_chqtran WHERE CONTNO = ? AND FLAG = 'H' ORDER BY L_PAY DESC LIMIT 1", [contno]);
    }
    catch (err) {
        console.log(err.message);
    }
};

exports.queryInstallmentHistoryByContco = async ({ ma, contno }) => {
    try {
        return await pool.query("SELECT * FROM " + ma.toLowerCase() + "_chqtran JOIN " + ma.toLowerCase() + "_arpay ON " + ma.toLowerCase() + "_chqtran.CONTNO = " + ma.toLowerCase() + "_arpay.CONTNO AND " + ma.toLowerCase() + "_chqtran.L_PAY = " + ma.toLowerCase() + "_arpay.NOPAY WHERE " + ma.toLowerCase() + "_chqtran.CONTNO = ? ORDER BY L_PAY DESC", [contno]);
    }
    catch (err) {
        console.log(err.message);
    }
};



exports.querychqtran = async ({ ma, contno }) => {
    try {
        return await pool.query("SELECT sdate,TCSHPRC,paydt,payamt FROM " + ma.toLowerCase() +"_chqtran JOIN "+ ma.toLowerCase() + "_armast ON " + ma.toLowerCase() + "_chqtran.CONTNO =" + ma.toLowerCase() +"_armast.CONTNO where " + ma.toLowerCase() +"_chqtran.CONTNO = ? ORDER BY "  + ma.toLowerCase() +"_chqtran.PAYDT" , [contno]);
    }
    catch (err) {
        console.log(err.message);
    }
};


exports.querycusmast = async ({ ma, contno }) => {
    try {
        return await pool.query("SELECT " + ma.toLowerCase() +"_armast.TOT_UPAY,T_NOPAY, DDATE,NAME1, NAME2, SNAM, " + ma.toLowerCase() +"_armast.CONTNO, " + ma.toLowerCase() +"_armast.PRODUCTID, " + ma.toLowerCase() +"_armast.SDATE,TCSHPRC, TYPE, BAAB, STRNO, MODEL, COLOR, ENGNO, REGNO FROM cal2009." + ma.toLowerCase() +"_custmast left join " + ma.toLowerCase() +"_armast on " + ma.toLowerCase() +"_custmast.CUSCOD = " + ma.toLowerCase() +"_armast.CUSCOD join " + ma.toLowerCase() +"_arpay on " + ma.toLowerCase() +"_arpay.contno = " + ma.toLowerCase() +"_armast.contno   join " + ma.toLowerCase() +"_invtran on " + ma.toLowerCase() +"_invtran.contno = " + ma.toLowerCase() +"_armast.contno where " + ma.toLowerCase() +"_armast.contno = ? order by NOPAY asc limit 1" , [contno]);
    }
    catch (err) {
        console.log(err.message);
    }
};



exports.getcard = async ({contno='',ddate='',ma=''}) => {      
    try { 
    return await pool.query("SELECT cal2009." + ma.toLowerCase() + "_arpay.CONTNO,T_NOPAY,NAME1,NAME2,REGNO,NOPAY,DDATE,DAMT,DATE1,PAYMENT,DELAY,INTAMT,cal2009." + ma.toLowerCase() + "_invtran.STRNO,cal2009." + ma.toLowerCase() + "_invtran.TYPE,cal2009." + ma.toLowerCase() + "_invtran.BAAB,GRDCOD,LPAYD,LPAYA  "
    +" FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN cal2009." + ma.toLowerCase() + "_custmast ON cal2009." + ma.toLowerCase() + "_armast.CUSCOD = cal2009." + ma.toLowerCase() + "_custmast.CUSCOD JOIN cal2009." + ma.toLowerCase() + "_arpay ON cal2009." + ma.toLowerCase() + "_armast.CONTNO= cal2009." + ma.toLowerCase() + "_arpay.CONTNO JOIN cal2009." + ma.toLowerCase() + "_invtran ON cal2009." + ma.toLowerCase() + "_invtran.CONTNO = cal2009." + ma.toLowerCase() + "_arpay.CONTNO "
    +" WHERE cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? AND cal2009." + ma.toLowerCase() + "_arpay.ddate <= ? AND cal2009." + ma.toLowerCase() + "_arpay.DAMT > cal2009." + ma.toLowerCase() + "_arpay.PAYMENT order by nopay",
    [contno,ddate])
    }
    catch (err) {
        console.log(err.message);
    }
}



exports.getarpay_0= async ({contno='',ma=''}) =>{ 
    try {       
    return await pool.query(" SELECT cal2009." + ma.toLowerCase() + "_arpay.CONTNO,T_NOPAY,NAME1,NAME2,REGNO,NOPAY,DDATE,DAMT,DATE1,PAYMENT,DELAY,INTAMT,cal2009." + ma.toLowerCase() + "_invtran.STRNO,cal2009." + ma.toLowerCase() + "_invtran.TYPE,cal2009." + ma.toLowerCase() + "_invtran.BAAB,GRDCOD,LPAYD,LPAYA  " 
    +" FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN cal2009." + ma.toLowerCase() + "_custmast ON cal2009." + ma.toLowerCase() + "_armast.CUSCOD = cal2009." + ma.toLowerCase() + "_custmast.CUSCOD JOIN cal2009." + ma.toLowerCase() + "_arpay ON cal2009." + ma.toLowerCase() + "_armast.CONTNO=  cal2009." + ma.toLowerCase() + "_arpay.CONTNO "
    +" JOIN cal2009." + ma.toLowerCase() + "_invtran ON cal2009." + ma.toLowerCase() + "_invtran.CONTNO = cal2009." + ma.toLowerCase() + "_arpay.CONTNO WHERE cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? AND DAMT-PAYMENT != 0 order by DDATE ASC LIMIT 2",
    [contno])
}
catch (err) {
    console.log(err.message);
}
}


exports.getarpay = async ({ ma, contno }) => {
    try {
        return await pool.query(" SELECT cal2009." + ma.toLowerCase() + "_arpay.CONTNO,T_NOPAY,NAME1,NAME2,REGNO,NOPAY,DDATE,DAMT,DATE1,PAYMENT,DELAY,INTAMT,cal2009." + ma.toLowerCase() + "_invtran.STRNO,cal2009." + ma.toLowerCase() + "_invtran.TYPE,cal2009." + ma.toLowerCase() + "_invtran.BAAB,GRDCOD,LPAYD,LPAYA  " 
        +" FROM cal2009." + ma.toLowerCase() + "_armast LEFT JOIN cal2009." + ma.toLowerCase() + "_custmast ON cal2009." + ma.toLowerCase() + "_armast.CUSCOD = cal2009." + ma.toLowerCase() + "_custmast.CUSCOD JOIN cal2009." + ma.toLowerCase() + "_arpay ON cal2009." + ma.toLowerCase() + "_armast.CONTNO=  cal2009." + ma.toLowerCase() + "_arpay.CONTNO "
        +" JOIN cal2009." + ma.toLowerCase() + "_invtran ON cal2009." + ma.toLowerCase() + "_invtran.CONTNO = cal2009." + ma.toLowerCase() + "_arpay.CONTNO WHERE cal2009." + ma.toLowerCase() + "_arpay.CONTNO = ? AND DAMT-PAYMENT != 0 order by DDATE ASC LIMIT 1",
        [contno]);
    }
    catch (err) {
        console.log(err.message);
    }
};
