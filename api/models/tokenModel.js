const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const token = new Schema({
    _token: { type: String },
    role: { type: String },
});

module.exports = mongoose.model('tokens', token);