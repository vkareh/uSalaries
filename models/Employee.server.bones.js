models.Employee.prototype.sync = function(method, model, options) {
    var query = options.data || options.query || {};

    if (method !== 'read') return options.error(new Error('Method not supported'));
    if (!query.university) return options.error(new Error('University not selected'));

    var params = {
        key: decodeURIComponent(model.get('id')),
        include_docs: false
    }

    this.couch(query.university).view('record/employee', params, function(err, doc) {
        if (err) return options.error(new Error(err));
        var records = _.chain(doc).pluck('value').reject(function(record) {
            return record.salary === 0;
        }).value();
        model.set({records: records});
        options.success(model);
    });
}
