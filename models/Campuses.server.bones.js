models.Campuses.prototype.sync = function(method, model, options) {
    if (method !== 'read') return options.error(new Error('Method not supported'));
    if (!(options.query && options.query.university)) return options.error(new Error('University not selected'));

    var query = {
        reduce: true,
        group_level: 1
    };

    this.couch(options.query.university).view('record/position', query, function(err, docs) {
        if (err) return options.error(new Error(err));
        var models = _.chain(docs).pluck('key').map(function(campus) {
            return {id: _.last(campus)};
        }).value();
        options.success(models);
    });
}
