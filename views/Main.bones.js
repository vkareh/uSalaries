view = Backbone.View.extend({id: 'main'});

view.prototype.initialize = function(options) {
    if (!this.app) {
        this.app = new views.App({model: this});
    }
    return this;
}

view.prototype.attach = function() {
    return this;
}

// Scrolls to top or fragment
// --------------------------
view.prototype.scrollTop = function() {
    var offset = $(window.location.hash).offset();
    var top = offset ? offset.top : 0;
    // Scroll top FF, IE, Chrome safe
    if ($('body').scrollTop(0)) {
        $('body').scrollTop(top);
        return this;
    }
    if ($('html').scrollTop(0)) {
        $('html').scrollTop(top);
    }
    return this;
}

view.prototype.activeLinks = function() {
    var activePath = window.location.pathname;
    $('li.active').removeClass('active');
    $('a.exact').each(function(i, a) {
        activePath == $(a).attr('href') && $(a).parent('li').addClass('active');
    });
    $('a:not(.exact)').each(function(i, a) {
        (activePath.indexOf($(a).attr('href')) == 0) && $(a).parent('li').addClass('active');
    });
    return this;
}
