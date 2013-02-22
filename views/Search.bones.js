view = views.Main.extend({pageTitle: 'Search'});

view.prototype.render = function() {
    var university = this.options.university;
    this.pageTitle = university.get('name');

    // Render search box
    $(this.el).empty().append(templates.Search({
        university: university.get('name')
    }));

    // Render university-specific template
    $(this.el).append(this.make('div', {'class': 'clearfix'})).append(templates[university.id]);
    return this;
}

view.prototype.attach = function() {
    $('#search').trigger('focus');
    this.loadCampuses();
    return this;
}

view.prototype.events = {
    'keyup #search': 'search',
    'change #campus': 'loadDepartments',
    'change #department': 'loadPositions',
    'change #position': 'loadEmployees'
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

// Load list of campuses
// ---------------------
view.prototype.loadCampuses = function() {
    var make = this.make
    ,   university = this.options.university.id
    ,   campuses = new models.Campuses();

    $('#graph').empty();
    campuses.fetch({
        data: {
            university: university
        },
        success: function(campuses) {
            $('select#campus').empty().append(make('option'));
            $('select#department').empty().append(make('option'));
            $('select#position').empty().append(make('option'));
            campuses.forEach(function(campus) {
                $('select#campus').append(make('option', {value: campus.get('id')}, campus.get('id')));
            });
        }
    });
    return this;
}

// Load departments for selected campus
// ------------------------------------
view.prototype.loadDepartments = function(event) {
    var make = this.make
    ,   university = this.options.university
    ,   campus = new models.Campus({id: $(event.currentTarget).val()})
    ,   departments = new models.Departments();

    $('#graph').empty();
    $('select#department').empty().append(make('option'));
    $('select#position').empty().append(make('option'));
    this.options.campus = campus;
    if (!campus.get('id')) return;

    departments.fetch({
        data: {
            university: university.get('id'),
            campus: campus.get('id')
        },
        success: function(departments) {
            departments.forEach(function(department) {
                $('select#department').append(make('option', {value: department.get('id')}, department.get('id')));
            });
        }
    });
    return this;
}

// Load positions for selected department
// --------------------------------------
view.prototype.loadPositions = function(event) {
    var make = this.make
    ,   university = this.options.university
    ,   campus = this.options.campus
    ,   department = new models.Department({id: $(event.currentTarget).val()})
    ,   positions = new models.Positions();

    $('#graph').empty();
    $('select#position').empty().append(make('option'));
    this.options.department = department;
    if (!department.get('id')) return;

    positions.fetch({
        data: {
            university: university.get('id'),
            campus: campus.get('id'),
            department: department.get('id')
        },
        success: function(positions) {
            positions.forEach(function(position) {
                $('select#position').append(make('option', {value: position.get('id')}, position.get('id')));
            });
        }
    });
    return this;
}

// Load employees for selected position
// ------------------------------------
view.prototype.loadEmployees = function(event) {
    var self = this
    ,   make = this.make
    ,   university = this.options.university
    ,   campus = this.options.campus
    ,   department = this.options.department
    ,   position = new models.Position({id: $(event.currentTarget).val()})
    ,   employees = new models.Employees();

    $('#graph').empty();
    this.options.position = position;
    if (!position.get('id')) return;

    employees.fetch({
        data: {
            university: university.get('id'),
            campus: campus.get('id'),
            department: department.get('id'),
            position: position.get('id')
        },
        success: function(employees) {
            // Display results
            self.loadStats(employees);
            $('#results').empty().append(make('ul', {class: 'unstyled'}));
            employees.forEach(function(employee) {
                $('#results ul').append(make('li', {}, make('a', {href: '/u/' + university.get('id') + '/employee/' + employee.get('id')}, employee.get('id'))));
            });
        }
    });
    return this;
}

// Load statistics for employee list
// ---------------------------------
view.prototype.loadStats = function(employees) {
    var self = this
    ,   university = this.options.university
    ,   campus = this.options.campus
    ,   department = this.options.department
    ,   position = this.options.position;

    Bones.utils.fetch(employees.models, {university: university.get('id')}, function(err) {
        var years = [];
        var data = {
            max: {label: 'Max', data: []},
            median: {label: 'Median', data: []},
            min: {label: 'Min', data: []}
        };
        // Get salaries per year and compile graphing data
        _.chain(employees.pluck('records')).flatten().sortBy('year').groupBy('year').each(function(salaries, year) {
            // Only get salary data for the selected department/position
            salaries = _.chain(salaries).filter(function(salary) {
                return salary.department.replace(/ <small>(.*)<\/small>/, '') === department.get('id') && salary.title === position.get('id');
            }).pluck('salary').value();
            if (_.size(salaries)) {
                years.push(parseInt(year));
                data.min.data.push([parseInt(year), jStat.min(salaries)]);
                data.max.data.push([parseInt(year), jStat.max(salaries)]);
                data.median.data.push([parseInt(year), jStat.median(salaries)]);
            }
        });

        // Plot graph
        $.plot($('#graph'), _.values(data), {
            colors: ['#3465a4', '#f57900', '#cc0000'],
            series: {
                lines: { show: true },
                points: { show: true }
            },
            xaxis: { ticks: _.uniq(years).sort() },
            yaxis: { tickFormatter: accounting.formatMoney },
            legend: { show: true, position: 'nw', noColumns: 3, backgroundOpacity: 0, labelBoxBorderColor: '#ffffff' },
            grid: { hoverable: true, borderColor: '#ffffff', tickColor: '#ffffff' }
        });

        // Re-bind plothover to use within scope
        $('#graph').bind('plothover', self.plotHover);
    });
    return this;
}

var showTooltip = function(x, y, contents) {
    $('<div></div>')
    .attr('id', 'tooltip')
    .addClass('tooltip')
    .text(contents)
    .css({
        'visibility': 'visible',
        'position': 'absolute',
        'display': 'none',
        'top': y - 32,
        'left': x - 8,
        'opacity': 0.8,
        'filter': 'alpha(opacity=80)',
        'max-width': '200px',
        'padding': '3px 8px',
        'color': '#ffffff',
        'text-align': 'center',
        'text-decoration': 'none',
        'background-color': '#000000',
        '-webkit-border-radius': '4px',
        '-moz-border-radius': '4px',
        'border-radius': '4px'
    })
    .appendTo('body')
    .fadeIn(200); 
}

view.prototype.previousPoint = null;
view.prototype.plotHover = function(event, pos, item) {
    if (item) {
        if (this.previousPoint != item.dataIndex) {
            this.previousPoint = item.dataIndex;
            $('#tooltip').remove();
            showTooltip(item.pageX, item.pageY, accounting.formatMoney(item.datapoint[1]));
        }
    } else {
        $('#tooltip').remove();
        this.previousPoint = null;
    }
}
