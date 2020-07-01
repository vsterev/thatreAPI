const { Router } = require('express')
const playController = require('../controllers/play')
const auth = require('../utils/auth')
const router = Router()

// router.get('/create', auth(), playController.get.create)
router.post('/create', auth(), playController.post.create)

router.get('/details/:id', auth(), playController.get.details)

router.get('/sort-likes', playController.get.sortByLikes)
router.get('/sort-date', playController.get.sortByDate)
router.get('/my-plays', auth(), playController.get.myPlays)
router.patch('/edit', auth(), playController.patch.edit)

router.delete('/delete/:id', auth(), playController.delete.delete)
router.patch('/like', auth(), playController.patch.like)
router.all('*', auth(), playController.get.notFound)

module.exports = router