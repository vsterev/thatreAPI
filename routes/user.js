const { Router } = require('express')
const playController = require('../controllers/play')
const userController = require('../controllers/user')
const auth = require('../utils/auth')
const router = Router()

router.post('/login', userController.post.login)
router.post('/register', userController.post.register)
router.get('/logout', auth(), userController.get.logout)
router.all('*', auth(false), playController.get.notFound)
module.exports = router