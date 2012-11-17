model = models.Record.extend({});

model.prototype.url = function() {
    return '/api/Employee/' + encodeURIComponent(this.id);
}
