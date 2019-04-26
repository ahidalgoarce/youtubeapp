const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const guest = new Schema({
    fullname: { type: String },
    username: { type: String },
    pin: { type: String },
    age: { type: String },
    user_id:{type:String}
});

module.exports = mongoose.model('guests', guest);