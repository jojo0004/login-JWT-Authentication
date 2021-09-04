const loansModel = require('../model/loans_model');

exports.getAllLoansByPersonalId = (req, res, next) => {
    const personalId = req.user.user;
    loansModel.queryAllLoansByPersonalId(personalId)
        .then(([row]) => {

            res.send(row);
        }).catch((err) => {
            res.status(500).json({ message: err })
        });

}

exports.getAllBycustmast = (req, res, next) => {
    const personalId = req.user.user;
    const ma = req.user.ma;
    loansModel.getAllBycustmast({ personalId, ma })
        .then(([row]) => {

            res.send(row);
        }).catch((err) => {
            res.status(500).json({ message: err })
        });

}


exports.getLoanByMaAndContno = (req, res, next) => {
    const { ma, contno } = req.params;
    loansModel.queryLoanByContnoAndMa({ ma, contno })
        .then(([row]) => {
            // console.log(row);
            res.send(row)
        }).catch((err) => {
            res.status(500).json({ message: err })
        });
};

exports.getInstallmentByMaAndContno = (req, res, next) => {
    const { ma, contno } = req.params;
    loansModel.queryInstallmentByContco({ ma, contno })
        .then(([row]) => {
            // console.log(row);
            res.send(row)
        }).catch((err) => {
            res.status(500).json({ message: err })
        });
};

exports.getInstallmentHistoryByMaAndContno = (req, res, next) => {
    const { ma, contno } = req.params;
    loansModel.queryInstallmentHistoryByContco({ ma, contno })
        .then(([row]) => {
            // console.log(row);
            res.send(row)
        }).catch((err) => {
            res.status(500).json({ message: err })
        });
};


exports.getchtan = (req, res, next) => {
    //  StratDate = new Date('2021-06-04');
    //  Stte = new Date('2021-07-06');
    //  ff = Stte.getTime() - StratDate.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
    //  ff = Math.floor(ff / (1000 * 60 * 60 * 24));
    //  console.log("aa=",ff)
    const { ma, contno } = req.params;
    loansModel.querychqtran({ ma, contno })
        .then(([row]) => {
            // console.log(sdate,TCSHPRC,paydt,payamt);

            let su = [];
            StratDate = new Date(row[0].sdate);
            Stte = new Date(row[0].paydt);
            ff = Stte.getTime() - StratDate.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
            ff = Math.floor(ff / (1000 * 60 * 60 * 24));
            const payamt = row[0].payamt
            const TCSHPRC = row[0].TCSHPRC
            const total1 = TCSHPRC * (0.15 / 365) * ff
            const total2 = payamt - total1
            const total = TCSHPRC - total2
            su.push({ dat: row[0].paydt, pay: row[0].payamt, dok: total1.toFixed(2), ton: total2.toFixed(2), kong: total.toFixed(2) })
            // console.log(su);
            const ggg = generate(su, row)

            res.send(ggg)

        }).catch((err) => {
            res.status(500).json({ message: err })
        });
};



function generate(su, row) {

    for (i = 0; i <= row.length - 1; i++) {
        let j = i
        StratDate = new Date(row[j].paydt);
        Stte = new Date(row[j + 1].paydt);
        ff = Stte.getTime() - StratDate.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
        ff = Math.floor(ff / (1000 * 60 * 60 * 24));
        const payamt = row[j + 1].payamt
        const TCSHPRC = su[j].kong
        const total1 = TCSHPRC * (0.15 / 365) * ff
        const total2 = payamt - total1
        const total = TCSHPRC - total2

        su.push({ dat: row[j + 1].paydt, pay: row[j + 1].payamt, dok: total1.toFixed(2), ton: total2.toFixed(2), kong: total.toFixed(2) })
        if (su.length == row.length) {
            return su
        }

    }



}

