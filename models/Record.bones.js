model = Backbone.Model.extend({});

model.prototype.url = function() {
    return '/api/Record/' + encodeURIComponent(this.id);
}
