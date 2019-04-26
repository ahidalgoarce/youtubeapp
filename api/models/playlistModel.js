const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const playlist = new Schema({
    url: { type: String },
    name: { type: String },
    guestId: { type: String },
    userId: { type: String }
});

module.exports = mongoose.model('playlists', playlist);