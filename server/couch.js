var Bones = require('bones')
,   cradle = require('cradle');

// Return CouchDB instance
// -----------------------
Backbone.Model.prototype.couch = Backbone.Collection.prototype.couch = function(u) {
    var config = Bones.plugin.config.couch[u];
    return new(cradle.Connection)(config.host, config.port, config.options).database(u);
}
