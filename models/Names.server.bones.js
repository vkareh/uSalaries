models.Names.prototype.sync = function(method, model, options) {
    if (method !== 'read') return options.error(new Error('Method not supported'));
    if (!(options.query && options.query.university)) return options.error(new Error('University not selected'));
    var query = _.map(model.get('id').split(' '), function(word) { return 'name:' + word + '*'}).join(' AND ');
    var params = {
        method: 'GET',
        path: '_design/record/_search/employee',
        query: { q: query }
    };
    this.couch(options.query.university).query(params, function(err, docs) {
        if (err) return options.error(new Error(err));
        model.set({names: _.chain(docs).pluck('fields').pluck('name').uniq().value()});
        options.success(model);
    });
}
