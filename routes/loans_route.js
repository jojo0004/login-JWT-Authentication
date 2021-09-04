const express = require('express');
const loansController  = require('../controller/loans_controller');

const { authenticateToken} = require('../controller/userController');
const router = express.Router();

router.get('/personalId',authenticateToken,loansController.getAllLoansByPersonalId);
router.get('/getAllBycustmast',authenticateToken,loansController.getAllBycustmast);
router.get('/:ma/:contno',authenticateToken,loansController.getLoanByMaAndContno);
router.get('/installment/:ma/:contno',authenticateToken,loansController.getInstallmentByMaAndContno);
router.get('/installment/history/:ma/:contno',authenticateToken,loansController.getInstallmentHistoryByMaAndContno)

module.exports = router;