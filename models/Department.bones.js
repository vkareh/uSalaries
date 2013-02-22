model = Backbone.Model.extend({});

model.prototype.url = function() {
    return '/api/Department/' + encodeURIComponent(this.id);
}
