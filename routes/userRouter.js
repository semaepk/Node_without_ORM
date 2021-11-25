const Router = require('express')
const router = new Router()
const { check } = require('express-validator')
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/signin',
    check('email', "Поле должно быть заполнено почтовым адресом").isEmail(),
    check('password', "Минимальная длина пароля 8 символов, пароль должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
    check('nickname', "Поле не должно быть пустым").not().isEmpty(),
    userController.signin)
router.post('/login', userController.login)
router.post('/logout', authMiddleware, userController.logout)
router.get('/user', authMiddleware, userController.check)
router.put('/user', authMiddleware, userController.updateUser)
router.delete('/user', authMiddleware, userController.delete)

module.exports = router