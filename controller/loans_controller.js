const loansModel = require('../model/loans_model');

exports.getAllcard = (req, res, next) => {
    //  const personalId = req.user.user;

    const { ma, contno } = req.params;
    console.log(ma, contno)
    const CREAT = new Date();
    const Year = CREAT.getFullYear();
    const day = CREAT.getDate();
    const Month = CREAT.getMonth() + 1;
    EndDate = new Date()
    const t = "" + Year + "" + '-' + "" + Month + "" + '-' + "" + day + ""
    loansModel.getcard({ contno: contno, ddate: t, ma: ma })
        .then(([row]) => {
            const re = row.reduce((sum, number) => {
                return sum + +number.DAMT - +number.PAYMENT
            }, 0)
            if (row.length === 0) {
                loansModel.getarpay_0({ contno: contno, ma: ma })
                    .then(([row]) => {
                        if (+row[0].DAMT - +row[0].PAYMENT === 0) {
                            res.send({ row, DAMT: row[0].DAMT,LPAYD:row[0].LPAYD,LPAYA:row[0].LPAYA })
                        } else {
                            loansModel.getarpay({ contno: contno, ma: ma })
                                .then(([row]) => {
                                    res.send({ row, DAMT: row[0].DAMT,LPAYD:row[0].LPAYD,LPAYA:row[0].LPAYA})
                                })
                        }

                    })
            } else {
                res.send({ row: row, DAMT: re,LPAYD:row[0].LPAYD,LPAYA:row[0].LPAYA  });
            }

        }).catch((err) => {
            res.status(500).json({ message: err })
        });

}



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

            su = [];
            data_total1 = [];
            data_total2 = [];
            datatotal2 = [];
            data_dokkang = 0;
            StratDate = new Date(row[0].sdate);
            Stte = new Date(row[0].paydt);
            ff = Stte.getTime() - StratDate.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
            ff = Math.floor(ff / (1000 * 60 * 60 * 24));
            const payamt = row[0].payamt
            const TCSHPRC = row[0].TCSHPRC
            const total1 = TCSHPRC * (0.15 / 365) * ff
            const total2 = payamt - total1
           // console.log(TCSHPRC);
            var d = new Date("2015-03");
            if (total2 <= 0) {
                const total = TCSHPRC - 0
                let sum2 = payamt.toFixed(2)
                data_total2.push({ dok: sum2 })
                const re2 = su.reduce((sum, number) => {
                    //  console.log("sum=",number.dok)
                    return sum += +number.dok
                }, 0)
                let sum = 0
                data_total1.push({ ton: sum })

                const re3 = data_total1.reduce((sum, number) => {
                    return sum += +number.ton
                }, 0)
              //  let sum3 = total2
              //  datatotal2.push({ dok_kang: sum3 })
              //  const re1 = datatotal2.reduce((sum, number) => {
              //      return sum -= +number.dok_kang
              //  }, 0)
              //  data_dokkang = sum3
                // console.log("sum=",sum3)
                su.push({ a: re3, b: re2.toFixed(2), c: 0, dat: Stte.toLocaleDateString(), datekang: ff, pay: row[0].payamt, dok: total1.toFixed(2), ton: total2| 0, kong: total.toFixed(2) })
                //  console.log("ff",payamt1);

                //  data_total1.push(~~total1.toFixed(2))

                console.log('1=');
                const ggg = generate(su, row)

                res.send(ggg)
            } else {
                let sum = total2.toFixed(2)
                data_total1.push({ ton: sum })

                const re3 = data_total1.reduce((sum, number) => {
                    return sum += +number.ton
                }, 0)

                let sum2 = total1.toFixed(2)
                data_total2.push({ dok: sum2 })
                const re2 = data_total2.reduce((sum, number) => {
                    // console.log("sum1=",number.dok)
                    return sum += +number.dok
                }, 0)
              // let sum3 = 0
              // datatotal2.push({ dok_kang: sum3 })
              // const re1 = datatotal2.reduce((sum, number) => {
              //     return sum -= +number.dok_kang
              // }, 0)
                const total = TCSHPRC - total2
                su.push({ a: re3.toFixed(2), b: re2.toFixed(2), c: 0, dat: Stte.toLocaleDateString(), datekang: ff, pay: row[0].payamt, dok: total1.toFixed(2), ton: total2.toFixed(2), kong: total.toFixed(2) })
                console.log('2=');


                const ggg = generate(su, row)

                res.send(ggg)
            }


        }).catch((err) => {
            res.status(500).json({ message: err })
        });
};

function generate(su, row) {
    for (i = 0; i <= row.length - 1; i++) {
        let j = i
        StratDate = new Date(row[j].paydt);
        Stte = new Date(row[j + 1].paydt);
        EndDate = new Date()
        ff = Stte.getTime() - StratDate.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
        ff = Math.floor(ff / (1000 * 60 * 60 * 24));
        if (su[j].ton <= 0) {
            const payamt = ~~row[j + 1].payamt + ~~su[j].ton
            //  console.log("su=",su[j].ton,"row=",row[j + 1].payamt,"pay=",payamt.toFixed(2))
            const TCSHPRC = su[j].kong
            const total1 = TCSHPRC * (0.15 / 365) * ff 
            const total2 = +payamt - +total1
            const total = TCSHPRC - total2
            console.log('3=');
            // console.log("tt",payamt ,data_dokkang,total1,total2 )
            if (total2 <= 0) {
               // console.log("ร=",total2,total1)
               console.log('4=');
                const total = TCSHPRC - 0
                let sum2 = +row[j + 1].payamt.toFixed(2)
                data_total2.push({ dok: sum2 })
                const re2 = data_total2.reduce((sum, number) => {
                  //  console.log("s=", number.dok)
                    return sum += +number.dok
                }, 0)
                let sum = 0
                data_total1.push({ ton: sum })

                const re3 = data_total1.reduce((sum, number) => {
                    return sum += +number.ton
                }, 0)
               // let sum3 = total2
               // datatotal2.push({ dok_kang: sum3 })
               // const re1 = datatotal2.reduce((sum, number) => {
               //     // console.log(number.dok_kang)
               //     return sum -= +number.dok_kang
               // }, 0)
               // data_dokkang = sum3
                //  console.log("sum-",sum3)
                su.push({ a: re3, b: re2.toFixed(2), c: 0, dat: Stte.toLocaleDateString(), datekang: ff, pay: row[j + 1].payamt, dok: row[j + 1].payamt, ton: total2| 0, kong: total.toFixed(2) })
                //   const ggg = generate(su, row)

                //      data_total1.push(~~total1.toFixed(2))

                //res.send(ggg)

            } else {
                console.log('5=');
               // console.log("sum4=", +su[j].ton ) 
                let sum = total2.toFixed(2)
                data_total1.push({ ton: sum })
                const re3 = data_total1.reduce((sum, number) => {
                    return sum += +number.ton
                }, 0)
                let sum2 = +total1.toFixed(2) - +su[j].ton
                data_total2.push({ dok: sum2 })
                const re2 = data_total2.reduce((sum, number) => {
                 //   console.log("sum4=", number.dok)
                    return sum += +number.dok
                }, 0)
              //  let sum3 = 0
              //  datatotal2.push({ dok_kang: sum3 })
              //  const re1 = datatotal2.reduce((sum, number) => {
              //      return sum -= +number.dok_kang
              //  }, 0)
                //  data_dokkang.push({dok_kang:sum3 })
                su.push({ a: re3.toFixed(2), b: re2.toFixed(2), c: 0, dat: Stte.toLocaleDateString(), datekang: ff, pay: row[j + 1].payamt, dok: +total1.toFixed(2) - +su[j].ton , ton: total2.toFixed(2), kong: total.toFixed(2) })

                //   const ggg = generate(su, row)

                // res.send(ggg)
            }

        } else {
            console.log('6=');
            const payamt = row[j + 1].payamt
            //  console.log("su=",su[j].ton,"row=",row[j + 1].payamt,"pay=",payamt.toFixed(2))
            const TCSHPRC = su[j].kong
            const total1 = TCSHPRC * (0.15 / 365) * ff
            const total2 = +payamt - +total1
            const total = TCSHPRC - total2
           //  console.log("j=",+payamt , +total1)
            if (total2 <= 0 ) {
                console.log('7=');
          //       console.log("j=",total2,total1)
                const total = TCSHPRC - 0
                let sum2 = +row[j + 1].payamt.toFixed(2)
                data_total2.push({ dok: sum2 })
                const re2 = data_total2.reduce((sum, number) => {
                  //  console.log("l=", number.dok)
                    return sum += +number.dok
                }, 0)
                let sum = 0
                data_total1.push({ ton: sum })

                const re3 = data_total1.reduce((sum, number) => {
                    return sum += +number.ton
                }, 0)
              //  let sum3 = total2
              //  datatotal2.push({ dok_kang: sum3 })
              //  const re1 = datatotal2.reduce((sum, number) => {
              //      return sum -= +number.dok_kang
              //  }, 0)
              //  data_dokkang = sum3
               //   console.log("s",total2)
                //  data_dokkang=sum3
                su.push({ a: re3.toFixed(2), b: re2.toFixed(2), c: 0, dat: Stte.toLocaleDateString(), datekang: ff, pay: row[j + 1].payamt, dok: row[j + 1].payamt, ton: total2| 0, kong: total.toFixed(2) })
                //   const ggg = generate(su, row)

                // data_total1.push(~~total1.toFixed(2))

                //res.send(ggg)
            }
       //    else if(total2 <= 0 & su.length !== row.length)
       //    {
       //        const total = TCSHPRC - 0
       //        let sum2 = +row[j + 1].payamt
       //        data_total2.push({ dok: sum2 })
       //        const re2 = data_total2.reduce((sum, number) => {
       //            return sum += +number.dok
       //        }, 0)
       //        let sum = 0
       //        data_total1.push({ ton: sum })
       //        const re3 = data_total1.reduce((sum, number) => {
       //            return sum += +number.ton
       //        }, 0)
       //     
       //          console.log("s1",sum)
       //       
       //        su.push({ a: re3.toFixed(2), b: re2.toFixed(2), c: 0, dat: Stte.toLocaleDateString(), datekang: ff, pay: row[j + 1].payamt, dok: row[j + 1].payamt, ton: total2| 0, kong: total.toFixed(2) })
       //      

       //    }
            else
              {
                console.log('8=');
                let sum = total2.toFixed(2)
                data_total1.push({ ton: sum })

                const re3 = data_total1.reduce((sum, number) => {
                    return sum += +number.ton
                }, 0)
                let sum2 = total1.toFixed(2)
                data_total2.push({ dok: sum2 })
                const re2 = data_total2.reduce((sum, number) => {
                 //   console.log("um=", number.dok)
                    return sum += +number.dok
                }, 0)
               // let sum3 = 0
               // datatotal2.push({ dok_kang: sum3 })
               // const re1 = datatotal2.reduce((sum, number) => {
               //     return sum -= +number.dok_kang
               // }, 0)
                su.push({ a: re3.toFixed(2), b: re2.toFixed(2), c: 0, dat: Stte.toLocaleDateString(), datekang: ff, pay: row[j + 1].payamt, dok: total1.toFixed(2), ton: total2.toFixed(2), kong: total.toFixed(2) })
                //  console.log('a=',total2);
                //   const ggg = generate(su, row)


                // res.send(ggg)
            }
        }




        //   su.push({ dat: Stte.toLocaleDateString(), pay: row[j + 1].payamt, dok: total1.toFixed(2), ton: total2.toFixed(2), kong: total.toFixed(2) })
        if (su.length == row.length) 
        {
          //  ff = EndDate.getTime() - StratDate.getTime();   //วันสุดท้าย - วันเริ่ม = ? millisec
          //  ff = Math.floor(ff / (1000 * 60 * 60 * 24));
        //
      //
          //  
          //  const TCSHPRC = su[su.length-1].kong
          //  const total1 = TCSHPRC * (0.15 / 365) * ff
          //  const total2 = +total1
          // 
          //  console.log("sum=",su[su.length-1].kong) 
          //  if (total2 <= 0) {
          //      const total = TCSHPRC - 0
          //      let sum2 = 0
          //      data_total2.push({ dok: sum2 })
          //      const re2 = su.reduce((sum, number) => {
          //          
          //          return sum += +number.dok
          //      }, 0)
          //     //let sum3 = total2
          //     //datatotal2.push({ dok_kang: sum3 })
          //     //const re1 = datatotal2.reduce((sum, number) => {
          //     //    return sum -= +number.dok_kang
          //     //}, 0)
          //     //data_dokkang = sum3
          //      // console.log("sum=",sum3)
          //      su.push({ d: "d", b: re2.toFixed(2), c: 0, dat: EndDate.toLocaleDateString(), datekang: ff, pay: 0, dok: 0, ton: total1.toFixed(2), kong: su[su.length-1].kong })
          //      //  console.log("ff",payamt1);
//
          //      //  data_total1.push(~~total1.toFixed(2))
//
          //      console.log('7=');
          //      return su
          //  } else {
          //      let sum = 0
          //      data_total1.push({ ton: sum })
//
          //      const re3 = data_total1.reduce((sum, number) => {
          //          return sum += +number.ton
          //      }, 0)
//
          //      let sum2 = 0
          //      data_total2.push({ dok: sum2 })
          //      const re2 = data_total2.reduce((sum, number) => {
          //          // console.log("sum1=",number.dok)
          //          return sum += +number.dok
          //      }, 0)
          //   //   let sum3 = 0
          //   //   datatotal2.push({ dok_kang: sum3 })
          //   //   const re1 = datatotal2.reduce((sum, number) => {
          //   //       return sum -= +number.dok_kang
          //   //   }, 0)
          //  
          //      su.push({ a: re3.toFixed(2), b: re2.toFixed(2), c: 0, dat: EndDate.toLocaleDateString(), datekang: ff, pay: 0, dok: 0, ton: -total1.toFixed(2), kong: su[su.length-1].kong })
          //      console.log('10=');
          //      return su
//
          //  }
          return su
        }

    }

}

exports.getcusmast = (req, res, next) => {
    const { ma, contno } = req.params;
    loansModel.querycusmast({ ma, contno })
        .then(([row]) => {
            DDATE = new Date(row[0].DDATE);
            SDATE = new Date(row[0].SDATE);
            res.send({ TOT_UPAY: row[0].TOT_UPAY, T_NOPAY: row[0].T_NOPAY, DDATE: DDATE.toLocaleDateString(), NAME1: row[0].NAME1, NAME2: row[0].NAME2, SNAM: row[0].SNAM, CONTNO: row[0].CONTNO, PRODUCTID: row[0].PRODUCTID, SDATE: SDATE.toLocaleDateString(), TCSHPRC: row[0].TCSHPRC, TYPE: row[0].TYPE, BAAB: row[0].BAAB, STRNO: row[0].STRNO, MODEL: row[0].MODEL, COLOR: row[0].COLOR, ENGNO: row[0].ENGNO, REGNO: row[0].REGNO })

        }).catch((err) => {
            res.status(500).json({ message: err })
        });
};

