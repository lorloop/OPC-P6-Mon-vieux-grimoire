const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const sharp = require('../middlewares/sharp');
const bookCtrl = require('../controllers/books');

router.get('/', bookCtrl.all);
router.post('/', auth, multer, sharp, bookCtrl.create);
router.get('/bestrating', bookCtrl.bestRating);
router.get('/:id', bookCtrl.one);
router.put('/:id', auth, multer, sharp, bookCtrl.update);
router.post('/:id/rating', auth, bookCtrl.addRating);
router.delete('/:id', auth, bookCtrl.delete);


module.exports = router;