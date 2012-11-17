view = views.Main.extend({pageTitle: 'Search'});

view.prototype.render = function() {
    var university = this.options.university;
    this.pageTitle = university.get('name');

    // Render search box
    $(this.el).empty().append(templates.Search({
        university: university.get('name')
    }));

    // Render university-specific template
    $(this.el).append(templates[university.id]);
    return this;
}

view.prototype.attach = function() {
    $('#search').trigger('focus');
    return this;
}

view.prototype.events = {
    'keyup #search': 'search'
}

view.prototype.search = function(event) {
    var make = this.make
    ,   university = this.options.university
    ,   key = $(event.currentTarget).val();

    // Start searching after 3 characters
    if (key.length >= 3) {
        // Cancel any open requests
        if (this.jqXHR && this.jqXHR.readyState === 1) {
            this.jqXHR.abort('stale');
        } else {
            // Show throbber
            $ajaxLoader = make('img', {src: '/assets/uSalaries/images/ajax-loader.gif'});
            $('span.add-on').empty().append($ajaxLoader);
        }

        // Fetch employee names
        var names = new models.Names({id: key.toLowerCase()});
        this.jqXHR = names.fetch({
            data: {university: university.id},
            success: function(names) {
                // Display results
                $('#results').empty().append(make('ul', {class: 'unstyled'}));
                _.each(names.get('names'), function(name) {
                    $('#results ul').append(make('li', {}, make('a', {href: '/u/' + university.id + '/employee/' + name}, name)));
                });
                // Remove throbber
                var $searchIcon = make('i', {class: 'icon-search'});
                $('span.add-on').empty().append($searchIcon);
            }
        });
        
    }
}
