const Router = require('express')
const router = new Router()
const tagController = require('../controllers/tagController')

router.post('/tag', tagController.createTag)
router.get('/tag/:id', tagController.getOne)
router.put('/tag/:id', authMiddleware, tagController.updateTag)
router.delete('/tag/:id', tagController.deleteTag)

module.exports = router