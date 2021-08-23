require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const UserModel = require('./model/UserModel');
app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ user })
   console.log("jj",user)
    res.json({ accessToken: accessToken})
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/login', (req, res) => {
  // Authenticate User
 // console.log(req.body)
  const { CUSCOD = '', PASSWORD } = req.body;
  UserModel.findUserByEmail({ CUSCOD: CUSCOD })
  .then(([row]) => {
    console.log('11',row.length)
    if (row.length !== 0) {
        return bcrypt.compare(PASSWORD, row[0].PASSWORD)
            .then((result) => {
              console.log('1')
            const  user= row[0].PRODUCTID
                if (!result) {
                  console.log('2')

                    res.status(401)
                        .json({
                            message: "Authentication failed"
                        })
                }
                else { 
                  console.log('3')                                           
                    let jwtToken = jwt.sign({
                       user,
                        expiresIn: 3600,
                        userId: row[0].ID                              
                    }, process.env.ACCESS_TOKEN_SECRET,
                        {
                        expiresIn: "1h"
                    });
                   
              const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
              refreshTokens.push(refreshToken)
                    res.status(200).json({  
                        cuscod: row[0].PRODUCTID,
                        status_login: true,
                        role:row[0].ROLE,
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

  

  
})

function generateAccessToken(jwtToken) {
  return jwt.sign(jwtToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

app.listen(4000)