model = models.Record.extend({});

model.prototype.initialize = function(options) {
    this.set({name: this.universities[options.id]});
}

model.prototype.exists = function() {
    return this.get('name') ? true : false;
}

model.prototype.universities = {
    'umich': 'University of Michigan'
}
