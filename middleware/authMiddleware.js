const ApiError = require('../exceptions/apiError')
const tokenService = require('../service/tokenService')

module.exports = function(req, res, next){
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader){
            throw next(ApiError.UnauthorizedError()) 
        }

        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken){
            throw next(ApiError.UnauthorizedError()) 
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData){
            throw next(ApiError.UnauthorizedError())
        }

        req.user = userData
        next()

    } catch (e) {
        throw next(ApiError.UnauthorizedError()) 
    }
}