var path = require('path')
,   fs = require('fs');

Bones.Command.options['couch'] = { 
    'title': 'couch=[path]',
    'description': 'Path to CouchDB configuration file.',
    'default': function(options, config) {
        var files = config ? config.files : Bones.Command.options['files'].default();
        return path.join(files, 'couch.json');
    }   
};

Bones.Command.augment({
    bootstrap: function(parent, plugin, callback) {
        parent.call(this, plugin, function() {
            try {
                plugin.config.couch = JSON.parse(fs.readFileSync(plugin.config.couch));
            } catch (e) {
                console.error(e);
            }
            callback();
        }); 
    }   
});
