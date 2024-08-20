const mongoose = require('mongoose')

const eventSchema = mongoose.Schema(
    {
        tgId : {
            type : String,
            required : true
        },
        text : {
            type : String,
            required : true
        }
    },
    {timestamps : true}
)

module.exports = mongoose.model('Event' , eventSchema)