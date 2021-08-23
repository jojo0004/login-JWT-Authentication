require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const UserModel = require('./model/UserModel');

app.use(express.json())

const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  }
]

app.get('/posts', authenticateToken, (req, res) => {
 // console.log(user,req.user)
  UserModel.getUser({CUSCOD:req.user.user})
  .then(([row]) => {
      if (row.length !== 0) {
        console.log("bb",row)
        //  res.send(row)
         
      }else{
       
         // console.log(MA)
      }

  }).catch((error) => {
      res.status(500)
          .json({
              message: error
          })
  })
 // res.json(posts.filter(post => post.username === req.user.name))

})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    console.log("aa",req.user.user)
    next()
  })
}

app.listen(3000)