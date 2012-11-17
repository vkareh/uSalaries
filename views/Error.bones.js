view = views.Main.extend({id: 'error', pageTitle: 'Error'});

view.prototype.initialize = function(options) {
    _.bindAll(this, 'render');
    options = options || {};
    // @todo Push responseText parsing all the way up into Bones
    if (options.responseText) {
        try {
            options = $.parseJSON(options.responseText);
        } catch (err) {}
    }
    this.options = {};
    this.options.status = options.status || 'Error';
    this.options.message = options.message || 'Not found';
    views.Main.prototype.initialize.call(this, options);
}

view.prototype.render = function() {
    $(this.el).empty().append(templates.Error(this.options));
    return this;
}
