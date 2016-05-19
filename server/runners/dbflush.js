var async = require('async');

var Config = require('../modules/config');
var Connections = require('../modules/connections');
var Logger = require('../modules/logger');

var usersInitial = require('../../test/mocks/initialData/users');
var lobbiesInitial = require('../../test/mocks/initialData/lobbies');

var connections = new Connections();

connections.init(function(error) {
    if(error) {
        return Logger.error(error);
    }

    async.waterfall(
        [
            flush,
            populate,
            close
        ],
        function(err) {
            if(err) return Logger.error(err.toString(), err);

            Logger.silly("finished resetting database");
        }
    );
});



function flush(callback) {
    Logger.silly("Flushing Database");
    var collectionsToFlush = ["caca", "User", "Lobby"];
    connections.mongo.collection("SC_Lobbies").drop();
    connections.mongo.collection("Users_Generic").drop();


    function flushCollection(item, cb) {
        connections.mongo.collection(item).remove({}, cb);
    }

    async.each(collectionsToFlush, flushCollection, function(err) {
        if(!err){
            Logger.silly("Finished Flushing");
        }
        callback(err);
    });
}

function populate(callback) {
    Logger.silly("Populating Database");

    var User = connections.mongo.model("User");
    var Lobby = connections.models.Lobby;

    var itemstosave = [];
    for (var i = 0; i < usersInitial.length; i++) {
        var user = new User(usersInitial[i]);
        itemstosave.push(user);
    }
    for (var i = 0; i < lobbiesInitial.length; i++) {
        var lobby = new Lobby(lobbiesInitial[i]);
        itemstosave.push(lobby);
    }

    function saveItem(item, cb) {
        Logger.silly("Saving item", item.toObject());
        item.save(function(err, added) {
            if(err) {
                return cb(err);
            }
            Logger.silly("added: " + added._id.toString());
            cb(null);
        });
    }

    async.each(itemstosave, saveItem, function(err) {
        if(!err){
            Logger.silly("finished populating db");
        }
        callback(err);
    });
}

function close() {
    connections.close(function() {
        Logger.info("Connections closed");
    });
}