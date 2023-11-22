const express = require('express');
const essaysController = require('../../controllers/essays/controller');

const router = express.Router();

router.get('/', essaysController.getAllEssays);
router.post('/getByNo', essaysController.getEssayById);
router.post('/checkAndCorrectEssay', essaysController.checkAndCorrectEssay);
router.post('/checkAndCorrectEssays', essaysController.checkAndCorrectEssays);

module.exports = router;