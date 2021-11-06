const express = require('express');
const loansController  = require('../controller/loans_controller');

const { authenticateToken} = require('../controller/userController');
const router = express.Router();

router.get('/personalId',authenticateToken,loansController.getAllLoansByPersonalId);
router.get('/getAllBycustmast',authenticateToken,loansController.getAllBycustmast);
router.get('/:ma/:contno',authenticateToken,loansController.getLoanByMaAndContno);
router.get('/installment/:ma/:contno',authenticateToken,loansController.getInstallmentByMaAndContno);
router.get('/installment/history/:ma/:contno',authenticateToken,loansController.getInstallmentHistoryByMaAndContno)
router.get('/getCard/:ma/:contno',loansController.getAllcard);
router.get('/qr/:textId/:suffix/:ref1/:ref2/:amount',loansController.getqr);




router.get('/getcontno',loansController.getcontno);
router.post('/getcontno/:contno/:ma',loansController.getre1,loansController.getre2);
router.post('/custmast/:contno/:ma',loansController.getcustmast);

module.exports = router;