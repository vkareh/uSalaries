models.Employees.prototype.sync = function(method, model, options) {
    if (method !== 'read') return options.error(new Error('Method not supported'));
    if (!(options.query && options.query.university)) return options.error(new Error('University not selected'));
    if (!(options.query && options.query.campus)) return options.error(new Error('Campus not selected'));
    if (!(options.query && options.query.department)) return options.error(new Error('Department not selected'));
    if (!(options.query && options.query.position)) return options.error(new Error('Position not selected'));

    var query = {
        key: [options.query.campus, options.query.department, options.query.position],
        reduce: false
    };

    this.couch(options.query.university).view('record/position', query, function(err, docs) {
        if (err) return options.error(new Error(err));
        var models = _.chain(docs).pluck('value').uniq().map(function(employee) {
            return {id: employee};
        }).value();
        options.success(models);
    });
}
