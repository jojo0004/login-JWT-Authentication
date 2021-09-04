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
