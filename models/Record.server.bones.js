models.Record.prototype.sync = function(method, model, options) {
    if (method != 'read') return options.error(new Error('Method not supported'));
    if (!(options.query && options.query.university)) return options.error(new Error('University not selected'));
    this.couch(options.query.university).get(model.get('id'), function(err, doc) {
        model.set(doc);
        options.success(model);
    });
}
