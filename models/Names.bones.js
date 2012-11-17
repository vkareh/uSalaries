model = models.Record.extend({});

model.prototype.url = function() {
    return '/api/Names/' + encodeURIComponent(this.id);
}
