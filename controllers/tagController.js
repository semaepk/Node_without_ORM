const tagService = require('../service/tagService')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/apiError')
const jwtDecode = require('jwt-decode')

class TagController {

    async createTag(req, res, next) {
        
        try {
            
            const {uid} = jwtDecode(req.cookies.refreshToken)
            const {name, sortorder} = req.body
            const tag = await tagService.createTag(uid, name, sortorder)
            return res.json(tag)

        } catch (e) {
            next(e)
        }

    }
    async getOne(req, res, next) {

        try {
            const {id} = req.params
            const tag = await tagService.getOne(id)

            let data = {
                creator: {uid, nickname},
                ...tag
            }
            return res.json(data)
        } catch (e) {
            
        }

    }

    async getAllWithSort(req, res, next){

        const {sortByOrder, sortByName, page, pageSize} = req.params
        const usersSorted = await tagService.getAllWithSort(sortByOrder, sortByName, page, pageSize)



    }

    async updateTag(req, res, next) {

    }
    async deleteTag(req, res, next) {

    }
}

module.exports = new TagController()