"use strict";

var mongoose = require('mongoose');

var Config = require('../modules/config');
var RamCache = require('../modules/ramcache');
var Logger = require('../modules/logger');

var UserSchema = require('../models/user');
var LobbySchema = require('../scmodels/lobby');

class Connections {
    constructor() {
    }

    init(callback) {
        var self = this;
        var readyCnt = 0;
        self.cache = new RamCache();

        self.mongo = mongoose.createConnection(Config.connections.mongoUrl)
            .on('connected', function() {
                Logger.info('Mongo connected');
                self.bindModels.call(self);
                ready();
            })
            .on('error', function(err) {
                Logger.error('Mongo connection error', err);
            })
            .on('close', function() {
                Logger.warn('Mongo connection closed');
            })
            .on('disconnected', function() {
                Logger.warn('Mongo connection lost');
            });

        function ready() {
            readyCnt ++;
            if(readyCnt >= 1) {
                callback();
            }
        }
    }

    bindModels() {
        this.models = {};
        this.models.User = this.mongo.model("User", UserSchema);
        this.models.Lobby = this.mongo.model("Lobby", LobbySchema);
    }

    close(callback) {
        delete this.cache;

        this.mongo.close(function(error) {
            if(error) {
                Logger.error(error);
                callback();
            }
        });
    }
}


module.exports = Connections;