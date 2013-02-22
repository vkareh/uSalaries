model = Backbone.Model.extend({});

model.prototype.url = function() {
    return '/api/Position/' + encodeURIComponent(this.id);
}
