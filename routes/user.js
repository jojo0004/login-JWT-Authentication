require('dotenv').config()

const express = require('express');
const router  = express.Router();
const { loginController,logoutController,refreshTokenController,authenticateToken,Postcontno,getre2} = require('../controller/userController');

const {getchtan,getcusmast}  = require('../controller/loans_controller');

router.get('/', (req, res, next) => {
    res.send('User api')
})

router.post('/login',loginController)
router.delete('/logout',logoutController)
router.post('/token',refreshTokenController)

//------------------------------authenticateToken-------------------//


router.get('/posts', authenticateToken,Postcontno)
router.get('/getcontno1/:contno/:ma',authenticateToken,getre2);
   

//------------------------------authenticateToken-------------------//

//------------------------------test-------------------//
router.get('/gettest/:contno/:ma',getchtan);
router.get('/getcusmast/:contno/:ma',getcusmast);

//------------------------------test-------------------//

module.exports = router;