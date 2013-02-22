model = Backbone.Model.extend({});

model.prototype.url = function() {
    return '/api/Campus/' + encodeURIComponent(this.id);
}
