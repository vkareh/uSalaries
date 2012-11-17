view = views.Main.extend({id: 'page'});

view.prototype.render = function() {
    this.pageTitle = this.options.template;
    $(this.el).empty().append(templates[this.options.template](this.options));
    return this;
}
