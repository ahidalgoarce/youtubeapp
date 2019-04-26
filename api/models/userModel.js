const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
    name: { type: String },
    surnames: { type: String },
    email: { type: String },
    country: { type: String },
    birthDate: { type: Date},
    password: { type: String },
    verified: { type: String }

});

module.exports = mongoose.model('users', user);