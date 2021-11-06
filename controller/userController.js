require('dotenv').config()


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../model/UserModel');
let refreshTokens = []





exports.loginController = (req, res, next) => {
    const { CUSCOD = '', PASSWORD } = req.body;
    console.log(req.body)
    UserModel.findUserByEmail({ CUSCOD: CUSCOD })
        .then(([row]) => {
            if (row.length !== 0) {
                return bcrypt.compare(PASSWORD, row[0].PASSWORD)
                    .then((result) => {                 
                        const user = row[0].PRODUCTID
                        const ma = row[0].MA
                        if (!result) {

                            res.status(401)
                                .json({
                                    message: "Authentication failed"
                                })
                        }
                        else {

                            let jwtToken = jwt.sign({
                                user,
                                ma,
                                expiresIn: 3600,
                                userId: row[0].ID
                            }, process.env.ACCESS_TOKEN_SECRET,
                                {
                                    expiresIn: "1h"
                                });

                            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                            refreshTokens.push(refreshToken)
                            res.status(200).json({
                                status_login: true,
                                role: row[0].ROLE,
                                accessToken: jwtToken, refreshToken: refreshToken
                            });

                        }
                    }).catch((error) => {
                        res.status(401)
                            .json({
                                message: "Authentication failed1",
                                error: error

                            })
                    })
            } else {
                res.status(401)
                    .json({
                        message: "Authentication failed2"
                    })
            }
        })
        .catch((error) => {
            res.status(500)
                .json({
                    message: error
                })
        })
}

exports.logoutController = (req, res, next) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
}

exports.refreshTokenController = (req, res, next) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ user })
      
        res.json({ accessToken: accessToken })
    })
}

function generateAccessToken(jwtToken) {
    return jwt.sign(jwtToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}



//-------------------------------authenticate--------------------------//

exports.Postcontno = (req, res, next) => {
    UserModel.getUser({ CUSCOD: req.user.user })
        .then(([row]) => {
            if (row.length !== 0) {
                //console.log("bb",row)
                //  res.send(row)
                res.json(row)
            } else {

                // console.log(MA)
            }

        }).catch((error) => {
            res.status(500)
                .json({
                    message: error
                })
        })
}

//---------------------คิดดอกเบี้ย-----------------------------//
exports.getre2 = (req, res, next) => {
    const contno = req.params.contno
    const ma = req.params.ma
    
    if (ma === 'PSFHP') {
        
     //  StratDate = new Date('2021-06-04');
     //  Stte = new Date('2021-07-06');
     //  ff = Stte.getTime() - StratDate.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
     //  ff = Math.floor(ff / (1000 * 60 * 60 * 24));
     //  console.log(ff)
        const CREAT = new Date();
        const Year = CREAT.getFullYear();
        const day = CREAT.getDate();
        const Month = CREAT.getMonth() + 1;
        EndDate = new Date()
        const t = "" + Year + "" + '-' + "" + Month + "" + '-' + "" + day + ""
        // select CONTNO ,NOPAY,DDATE,DAMT,DELAY,INTAMT from SFHP.ARPAY where CONTNO = '?' and DDATE like '%?%' and DDATE like '%?%'
        UserModel.getdamt({ contno: contno, ddate: t, ma: ma })
        .then(([row]) => { 
            
                dataDAMT = []
                dataDELAY = []
                dataNOPAT = []
                data = []
                data1 = []
                te = []
                contno_ = []
                bu = []
                tttt = []
                if (row.length === 0) {
                    UserModel.getarpay_0({ contno: contno, ma: ma })
                    .then(([row]) => {
                        if(~~row[0].DAMT-~~row[0].PAYMENT === 0)
                        {
                            const CONTNO = row[0].CONTNO
                            const DATE1 = row.length - 1
                            contno_.push(DATE1)
                            var str = CONTNO.split("-");
                            var str1 = str[1].split(" ")
                            if (str[0] === '8') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === '1') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === '2') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === '3') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === 'C') {
                                contno_.push('04' + str1[0])
                            }
                            else if (str[0] === 'I') {
                                contno_.push('05' + str1[0])
                                console.log(str1[0])
                            }
                            else if (str[0] === 'K') {
                                contno_.push('09' + str1[0])
                            }
                            else if (str[0] === 'Q') {
                                contno_.push('07' + str1[0])
                            }
                            else if (str[0] === 'V') {
                                contno_.push('06' + str1[0])
                            }
                            else if (str[0] === '0') {
                                contno_.push('00' + str1[0])
                            } else {
                                contno_.push('00' + str1[0])
                            }
                            const re3 = dataDAMT.reduce((sum, number) => {
                                return sum + number
                            }, 0)      
                                        
                            res.send({ intamt: 0, fee_intamt: 0, DELAY: 0, b: 0, DAMT: row[0].DAMT, contno_, row })
                        }else
                        {
                            UserModel.getarpay({ contno: contno, ma: ma })
                            .then(([row]) => {
                                const CONTNO = row[0].CONTNO
                                const DATE1 = row.length - 1
                                contno_.push(DATE1)
                                var str = CONTNO.split("-");
                                var str1 = str[1].split(" ")
                                if (str[0] === '8') {
                                    contno_.push('0' + str[0] + str1[0])
                                }
                                else if (str[0] === '1') {
                                    contno_.push('0' + str[0] + str1[0])
                                }
                                else if (str[0] === '2') {
                                    contno_.push('0' + str[0] + str1[0])
                                }
                                else if (str[0] === '3') {
                                    contno_.push('0' + str[0] + str1[0])
                                }
                                else if (str[0] === 'C') {
                                    contno_.push('04' + str1[0])
                                }
                                else if (str[0] === 'I') {
                                    contno_.push('05' + str1[0])
                                    console.log(str1[0])
                                }
                                else if (str[0] === 'K') {
                                    contno_.push('09' + str1[0])
                                }
                                else if (str[0] === 'Q') {
                                    contno_.push('07' + str1[0])
                                }
                                else if (str[0] === 'V') {
                                    contno_.push('06' + str1[0])
                                }
                                else if (str[0] === '0') {
                                    contno_.push('00' + str1[0])
                                } else {
                                    contno_.push('00' + str1[0])
                                }
                                const re3 = dataDAMT.reduce((sum, number) => {
                                    return sum + number
                                }, 0)              
                                    
                                res.send({ intamt: 0, fee_intamt: 0, DELAY: 0, b: 0, DAMT: row[0].DAMT, contno_, row })
                            })
                        }                     
                                                                                                                                                                                                                                                                                                                                                                                
                    })
                } else {
                    
                    for (i = 0; i <= row.length - 1; i++) {
                        dataDAMT.push(~~row[i].DAMT - ~~row[i].PAYMENT)
                        if (row.length === 0) {
                        
                            UserModel.getarpay_0({ contno: contno, ma: ma })
                            .then(([row]) => {
                                dataDAMT.push(~~row[i].DAMT - ~~row[i].PAYMENT)
                                const CONTNO = row[0].CONTNO
                                const DATE1 = row.length - 1
                                contno_.push(DATE1)
                                var str = CONTNO.split("-");
                                var str1 = str[1].split(" ")


                                if (str[0] === '8') {
                                    contno_.push('0' + str[0] + str1[0])

                                }
                                else if (str[0] === '1') {
                                    contno_.push('0' + str[0] + str1[0])
                                }
                                else if (str[0] === '2') {
                                    contno_.push('0' + str[0] + str1[0])
                                }
                                else if (str[0] === '3') {
                                    contno_.push('0' + str[0] + str1[0])
                                }
                                else if (str[0] === 'C') {
                                    contno_.push('04' + str1[0])
                                }
                                else if (str[0] === 'I') {
                                    contno_.push('05' + str1[0])
                                    console.log(str1[0])
                                }
                                else if (str[0] === 'K') {
                                    contno_.push('09' + str1[0])
                                }
                                else if (str[0] === 'Q') {
                                    contno_.push('07' + str1[0])
                                }
                                else if (str[0] === 'V') {
                                    contno_.push('06' + str1[0])
                                }
                                else if (str[0] === '0') {
                                    contno_.push('00' + str1[0])
                                } else {
                                    contno_.push('00' + str1[0])
                                }
                                const re3 = dataDAMT.reduce((sum, number) => {
                                    return sum + number
                                }, 0)
                                tttt.push(0)
                                te.push({ INTAMT: 0, fee: 0, DELAY: 0, DAMT: re3, row, contno_})
                                res.send(te)
                            })
                        } else {
                            const CONTNO = row[0].CONTNO
                            const DATE1 = row.length - 1
                            contno_.push(DATE1)
                            var str = CONTNO.split("-");
                            var str1 = str[1].split(" ")
                            if (str[0] === '8') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === '1') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === '2') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === '3') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === 'C') {
                                contno_.push('04' + str1[0])
                            }
                            else if (str[0] === 'I') {
                                contno_.push('05' + str1[0])
                            }
                            else if (str[0] === 'K') {
                                contno_.push('09' + str1[0])
                            }
                            else if (str[0] === 'Q') {
                                contno_.push('07' + str1[0])
                            }
                            else if (str[0] === 'V') {
                                contno_.push('06' + str1[0])
                            }
                            else if (str[0] === '0') {
                                contno_.push('00' + str1[0])
                            } else {
                                contno_.push('00' + str1[0])
                            }
                        }
                    }
                    const re = data.reduce((sum, number) => {
                        return sum + number
                    }, 0)
                    const re1 = data1.reduce((sum, number) => {
                        return sum + number
                    }, 0)
                    const re2 = dataDELAY.reduce((sum, number) => {
                        return sum + number
                    }, 0)
                    const re3 = dataDAMT.reduce((sum, number) => {
                        return sum + number
                    }, 0)
                   
                    te.push({ INTAMT: re, fee: re1, DELAY: re2, DAMT: re3, row, contno_});
                    res.send(te)
                }

            
        })

    }
    else {
        // console.log(nopay)
        const CREAT = new Date();
        const Year = CREAT.getFullYear();
        const day = CREAT.getDate();
        const Month = CREAT.getMonth() + 1;
        EndDate = new Date()
        const t = "" + Year + "" + '-' + "" + Month + "" + '-' + "" + day + ""
        
        UserModel.getdamt({ contno: contno, ddate: t, ma: ma })
            .then(([row]) => {
                console.log(row) 
                dataDAMT = []
                checkDelay = []
                dataDELAY = []
                dataNOPAT = []
                data = []
                data1 = []
                te = []
                contno_ = []
                bu = []
                var arr = new Array();
                bu1 = []
                tttt = []
                if (row.length === 0) {
                    UserModel.getarpay_0({ contno: contno, ma: ma })
                    .then(([row]) => {
                        if(~~row[0].DAMT-~~row[0].PAYMENT === 0)
                        {
                            const CONTNO = row[0].CONTNO
                            const DATE1 = row.length - 1
                            contno_.push(DATE1)
                            var str = CONTNO.split("-");
                            var str1 = str[1].split(" ")
                            if (str[0] === '8') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === '1') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === '2') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === '3') {
                                contno_.push('0' + str[0] + str1[0])
                            }
                            else if (str[0] === 'C') {
                                contno_.push('04' + str1[0])
                            }
                            else if (str[0] === 'I') {
                                contno_.push('05' + str1[0])
                                console.log(str1[0])
                            }
                            else if (str[0] === 'K') {
                                contno_.push('09' + str1[0])
                            }
                            else if (str[0] === 'Q') {
                                contno_.push('07' + str1[0])
                            }
                            else if (str[0] === 'V') {
                                contno_.push('06' + str1[0])
                            }
                            else if (str[0] === '0') {
                                contno_.push('00' + str1[0])
                            } else {
                                contno_.push('00' + str1[0])
                            }
                            const re3 = dataDAMT.reduce((sum, number) => {
                                return sum + number
                            }, 0)      
                                        
                            res.send({ intamt: 0, fee_intamt: 0, DELAY: 0, b: 0, DAMT: row[0].DAMT, contno_, row })
                        }else
                        {
                            UserModel.getarpay({ contno: contno, ma: ma })
                            .then(([row]) => {
                                const CONTNO = row[0].CONTNO
                                const DATE1 = row.length - 1
                                contno_.push(DATE1)
                                var str = CONTNO.split("-");
                                var str1 = str[1].split(" ")
                                if (str[0] === '8') {
                                    contno_.push('0' + str[0] + str1[0])
                                }
                                else if (str[0] === '1') {
                                    contno_.push('0' + str[0] + str1[0])
                                }
                                else if (str[0] === '2') {
                                    contno_.push('0' + str[0] + str1[0])
                                }
                                else if (str[0] === '3') {
                                    contno_.push('0' + str[0] + str1[0])
                                }
                                else if (str[0] === 'C') {
                                    contno_.push('04' + str1[0])
                                }
                                else if (str[0] === 'I') {
                                    contno_.push('05' + str1[0])
                                    console.log(str1[0])
                                }
                                else if (str[0] === 'K') {
                                    contno_.push('09' + str1[0])
                                }
                                else if (str[0] === 'Q') {
                                    contno_.push('07' + str1[0])
                                }
                                else if (str[0] === 'V') {
                                    contno_.push('06' + str1[0])
                                }
                                else if (str[0] === '0') {
                                    contno_.push('00' + str1[0])
                                } else {
                                    contno_.push('00' + str1[0])
                                }
                                const re3 = dataDAMT.reduce((sum, number) => {
                                    return sum + number
                                }, 0)              
                                    
                                res.send({ intamt: 0, fee_intamt: 0, DELAY: 0, b: 0, DAMT: row[0].DAMT, contno_, row })
                            })
                        }                     
                                                                                                                                                                                                                                                                                                                                                                                
                    })


                } else {
                    for (i = 0; i <= row.length - 1; i++) {
                        const StartDDATE = row[i].DDATE;
                        const StartDate = row[i].DATE1;
                        const PAY = ~~row[i].NOPAY;
                        const TCSHPRC = ~~row[i].DAMT;
                        const TOTPRC = ~~row[i].DELAY;
                        const PAYMENT = ~~row[i].PAYMENT;
                        StartD = new Date(StartDDATE)
                        Start1 = new Date(StartDate)
                        diffD = EndDate.getTime() - StartD.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
                        diffD = Math.floor(diffD / (1000 * 60 * 60 * 24));
    
                        if (StartDate !== null && TCSHPRC > PAYMENT) {
    
                            StartD = new Date(StartDDATE)
                            Start1 = new Date(StartDate)
                            if (Start1.getTime() <= StartD.getTime()) {
                                diffD = EndDate.getTime() - StartD.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
                                diffD = Math.floor(diffD / (1000 * 60 * 60 * 24));
    
                                if (diffD >= 8) {
                                    var DAMs = TCSHPRC - PAYMENT
                                    var fees = ((DAMs * 0.0175) / 30)
                                    var INTAMTs = ((DAMs * 0.0125) / 30)
                                    var INTAMTD = (INTAMTs * diffD)
                                    var feeD = (fees * diffD)
                                    tttt.push(INTAMTD + feeD)
                                    data.push(INTAMTD)
                                    data1.push(feeD)
                                    dataDELAY.push(diffD)
                                    checkDelay.push(diffD)
    
                                } else {
                                    tttt.push(0)
    
                                }
    
                            } else {
                                //----เริ่มคิดตั้งแต่วันที่ชำระ จนถึงงวดที่ตัวเองต้องจ่าย------//
                                diffD = Start1.getTime() - StartD.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
                                diffD = Math.floor(diffD / (1000 * 60 * 60 * 24));
    
                                if (diffD >= 8) {
                                    var DAMs = TCSHPRC
                                    var fees = ((DAMs * 0.0175) / 30)
                                    var INTAMTs = ((DAMs * 0.0125) / 30)
                                    var INTAMTD = (INTAMTs * diffD)
                                    var feeD = (fees * diffD)
                                    tttt.push(INTAMTD + feeD)
                                    diff = EndDate.getTime() - Start1.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
                                    diff = Math.floor(diff / (1000 * 60 * 60 * 24));
    
                                    if (diff >= 8) {
                                        var DAMs = TCSHPRC - PAYMENT
                                        var fees = ((DAMs * 0.0175) / 30)
                                        var INTAMTs = ((DAMs * 0.0125) / 30)
                                        var INTAMTst = (INTAMTs * diff)
                                        var feest = (fees * diff)
                                        data.push(INTAMTst)
                                        data1.push(feest)
                                        dataDELAY.push(diff)
                                        checkDelay.push(diffD)
    
                                    }
    
    
    
                                } else {
                                    tttt.push(0)
                                    diff = EndDate.getTime() - Start1.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
                                    diff = Math.floor(diff / (1000 * 60 * 60 * 24));
    
                                    if (diff >= 8) {
                                        var DAMs = TCSHPRC - PAYMENT
                                        var fees = ((DAMs * 0.0175) / 30)
                                        var INTAMTs = ((DAMs * 0.0125) / 30)
                                        var INTAMTst = (INTAMTs * diff)
                                        var feest = (fees * diff)
                                        data.push(INTAMTst)
                                        data1.push(feest)
                                        dataDELAY.push(diff)
    
                                    }
                                }
                            }
                        }
                        if (diffD >= 8 && StartDate === null) {
    
                            DDATE = new Date(StartDDATE)
                            diff1 = EndDate.getTime() - DDATE.getTime();
                            diff1 = Math.floor(diff1 / (1000 * 60 * 60 * 24));
                            var DAM = TCSHPRC - PAYMENT
                            var fee0 = ((TCSHPRC * 0.0175) / 30)
                            var INTAMT0 = ((TCSHPRC * 0.0125) / 30)
                            var INTAMT = Math.round(INTAMT0 * diff1)
                            var fee = Math.round(fee0 * diff1)
                            dataNOPAT.push(PAY)
                            dataDAMT.push(DAM)
                            dataDELAY.push(diff1)
                            data.push(INTAMT)
                            data1.push(fee)
                        } else {
    
                            var DAM = TCSHPRC - PAYMENT
                            dataNOPAT.push(PAY)
                            dataDAMT.push(DAM)
                            INTAMT = 0
                            fee = 0
                        }
                    }

                    const re = data.reduce((sum, number) => {
                        return sum + number
                    }, 0)
                    const re1 = data1.reduce((sum, number) => {
                        return sum + number
                    }, 0)
                    const re2 = dataDELAY.reduce((sum, number) => {
                        return sum + number
                    }, 0)
                    const re3 = dataDAMT.reduce((sum, number) => {
                        return sum + number
                    }, 0)

                    te.push({ INTAMT: re, fee: re1, DELAY: re2, DAMT: re3, tttt, checkDelay, row })

                    UserModel.getaa({ contno: contno, ma: ma })
                        .then(([row]) => {
                            row.forEach((i) => {

                                let a = ~~i.aa + Math.round(~~te[0].tttt)
                                //  console.log(a)
                                bu.push(a, i.payment)
                             

                            })
                            UserModel.getPayint({ contno: contno, ma: ma })
                                .then(([row1]) => {

                                    if (row1.length !== 0) {
                                        row1.forEach((i) => {
                                            //  console.log(bu[1])
                                            let b = ~~i.PAYI - ~~bu[0]
                                            var INTAMT_fee = Math.round(-b * 0.415667)
                                            var fee_INTAMT = Math.round(-b * 0.5843337)
                                            var c = Math.round(te[0].INTAMT + INTAMT_fee) + Math.round(te[0].fee + fee_INTAMT)
                                            var intamt = te[0].INTAMT + INTAMT_fee
                                            var fee_intamt = te[0].fee + fee_INTAMT                                     
                                            var DELAY = te[0].DELAY
                                            var row = te[0].row
                                            var DAMT = te[0].DAMT
                                           
                                            
                                            const CONTNO = row[0].CONTNO
                                            const DATE1 = row.length - 1
                                            contno_.push(DATE1)
                                            var str = CONTNO.split("-");
                                            var str1 = str[1].split(" ")
                                            if (str[0] === '8') {
                                                contno_.push('0' + str[0] + str1[0])
                                            }
                                            else if (str[0] === '1') {
                                                contno_.push('0' + str[0] + str1[0])
                                            }
                                            else if (str[0] === '2') {
                                                contno_.push('0' + str[0] + str1[0])
                                            }
                                            else if (str[0] === '3') {
                                                contno_.push('0' + str[0] + str1[0])
                                            }
                                            else if (str[0] === 'C') {
                                                contno_.push('04' + str1[0])
                                            }
                                            else if (str[0] === 'I') {
                                                contno_.push('05' + str1[0])
                                            }
                                            else if (str[0] === 'K') {
                                                contno_.push('09' + str1[0])
                                            }
                                            else if (str[0] === 'Q') {
                                                contno_.push('07' + str1[0])
                                            }
                                            else if (str[0] === 'V') {
                                                contno_.push('06' + str1[0])
                                            }
                                            else if (str[0] === '0') {
                                                contno_.push('00' + str1[0])
                                            } else {
                                                contno_.push('00' + str1[0])
                                            }


                                            res.json({ intamt, fee_intamt, DELAY, DAMT, b,contno_, row })

                                        })
                                    }

                                }).catch((error) => {
                                    console.log(error)
                                })


                        }).catch((error) => {
                            console.log(error)
                        })



                }


            }).catch((error) => {
                console.log(error)
            })


    }

}


//---------------------คิดดอกเบี้ย-----------------------------//








exports.authenticateToken = (req, res, next) => {
   
    const authHeader = req.headers['authorization']
 
    const token = authHeader && authHeader.split(' ')[1]
   
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
//---------------------------------authenticate-----------------------------//

