var mongoose = require('mongoose');
var _ = require('lodash');

var artistSchema = mongoose.Schema({
        sc_id_artist: {type: String, index: true},
        lastFetchedSong: String
    },
    {
        strict: true,
        _id: false
    }
);

artistSchema.methods = {
    getLobbies: function(callback) {
        // TODO get all lobbies containing this artist
        callback([]);
    },
    updateLastSong: function(songId, callback) {
        if(typeof songId !== string) {
            return callback("Wrong song id");
        }

        this.lastFetchedSong = songId;
        this.save(callback);
    }
};

var Lobby = mongoose.model('Artist', artistSchema);

module.exports = Lobby;
