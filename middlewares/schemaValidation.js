const joi = require('joi')

const adminJoi = joi.object({
    username: joi.string().min(4).max(10).required(),
    password:joi.string().min(4).max(10).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

const userjoi = joi.object({
    username: joi.string().min(4).max(10).required(),
    password:joi.string().min(4).max(10).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})



module.exports  = {adminJoi,
                   userjoi}