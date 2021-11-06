require('dotenv').config()

const express = require('express');
const router  = express.Router();
const { loginController,logoutController,refreshTokenController,authenticateToken,Postcontno,getre2} = require('../controller/userController');

const {getchtan,getcusmast,getchtan1}  = require('../controller/loans_controller');

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

//-----------------------------ทนายโต้ง------------------//
router.get('/gettest/:contno/:ma',getchtan);
router.get('/getcusmast/:contno/:ma',getcusmast);

//------------------------------ทนายโต้ง-------------------//


//----------------------------บัญชี3------------------//
router.get('/gettest1/:contno/:ma',getchtan1);
//-----------------------------บัญชี3-------------------//

module.exports = router;