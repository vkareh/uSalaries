view = views.Main.extend({id: 'report'});

view.prototype.render = function() {
    this.pageTitle = _.chain(this.model.get('records')).first().value().name;
    var years = _.chain(this.model.get('records')).sortBy('year').groupBy('year').value();

    // Render employee data
    $(this.el).empty().append(templates.EmployeeReport({
        name: this.pageTitle,
        years: years
    }));

    // Render university-specific template
    $(this.el).append(templates[this.options.university.id]);
    return this;
}

view.prototype.attach = function() {
    // Format currency
    $('td.money').each(function() {
        $(this).text(accounting.formatMoney($(this).text()));
    });

    // Generate graph data
    var data = {};
    var records = _.sortBy(this.model.get('records'), function(record) { return record.year; });
    // Stack bar graphs for each appointment
    _.each(records, function(record) {
        if (!data[record.title]) {
            data[record.title] = {
                label: record.title,
                data: []
            };
        }
        data[record.title].data.push([record.year, record.salary]);
    });

    // Plot graph
    $.plot($('#graph'), _.values(data), {
        colors: ['#f57900', '#3465a4', '#cc0000', '#73d216', '#75507b', '#edd400', '#c17d11', '#2e3436'],
        series: {
            stack: true,
            lines: { show: false },
            points: { show: false },
            bars: { show: true, barWidth: 0.75, align: 'center' }
        },
        xaxis: { tickDecimals: 0 },
        yaxis: { tickFormatter: accounting.formatMoney },
        legend: { show: true, position: 'nw', noColumns: 2, backgroundOpacity: 0, labelBoxBorderColor: '#ffffff' },
        grid: { hoverable: true, borderColor: '#ffffff', tickColor: '#ffffff' }
    });

    // Re-bind plothover to use within scope
    $('#graph').bind('plothover', this.plotHover);
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
