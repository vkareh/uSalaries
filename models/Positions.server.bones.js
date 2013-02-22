models.Positions.prototype.sync = function(method, model, options) {
    if (method !== 'read') return options.error(new Error('Method not supported'));
    if (!(options.query && options.query.university)) return options.error(new Error('University not selected'));
    if (!(options.query && options.query.campus)) return options.error(new Error('Campus not selected'));
    if (!(options.query && options.query.department)) return options.error(new Error('Department not selected'));

    var query = {
        startkey: [options.query.campus, options.query.department],
        endkey: [options.query.campus, options.query.department, {}],
        reduce: true,
        group_level: 3
    };

    this.couch(options.query.university).view('record/position', query, function(err, docs) {
        if (err) return options.error(new Error(err));
        var models = _.chain(docs).pluck('key').map(function(position) {
            return {id: _.last(position)};
        }).value();
        options.success(models);
    });
}
