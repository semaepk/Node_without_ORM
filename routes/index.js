const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
// const tagRouter = require('./tagRouter')

router.use('/user', userRouter)
// router.use('/tag', tagRouter)

module.exports = router