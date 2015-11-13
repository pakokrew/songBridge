var _ = require('lodash');

function User() {
    this._id = _.uniqueId();

    this.connections = {};
}

User.prototype.setConnection = function(Service, tokens) {

    this.connections[Service.infos.serviceId] = tokens;
};

User.prototype.refreshToken = function(Service, access_token) {

    this.connections[Service.infos.serviceId].access_token = access_token;
};

User.prototype.unsetConnection = function(Service, tokens) {

    delete this.connections[Service.infos.serviceId];
};


module.exports = User;
