router = Backbone.Router.extend({});

router.prototype.routes = {
    '/': 'home',
    '/about': 'about',
    '/u/:university': 'search',
    '/u/:university/employee/:name': 'employee',
    '/robots.txt': 'robots'
}

// Homepage
// --------
router.prototype.home = function() {
    this.send(views.Page, {
        template: 'Home',
        universities: (new models.University()).universities
    });
}

// About
// -----
router.prototype.about = function() {
    this.send(views.Page, {template: 'About'});
}

// Search
// ------
router.prototype.search = function(university) {
    university = new models.University({id: university});
    if (!university.exists()) {
        return this.send(views.Error, {message: 'University not found'});
    }

    this.send(views.Search, {university: university});
}

// Individual employee record
// --------------------------
router.prototype.employee = function(university, employee) {
    var router = this;
    university = new models.University({id: university});
    employee = new models.Employee({id: employee});

    if (!university.exists()) {
        return this.send(views.Error, {message: 'University not found'});
    }

    employee.fetch(_.extend({data: {university: university.id}}, Bones.utils.callback(function(err) {
        if (err) return router.error(err);
        if (_.size(employee.get('records'))) {
            router.send(views.EmployeeReport, {model: employee, university: university});
        } else {
            router.send(views.Error, {message: employee + ' not found'});
        }
    })));
}

// robots.txt
// ----------
router.prototype.robots = function() {
    this.res.send('User-agent: *\nDisallow: /data/', {'Content-Type': 'text/plain'});
}

// Helper to assemble the page title
// ---------------------------------
router.prototype.pageTitle = function(view) {
    var title = 'uSalaries';
    return (view.pageTitle ? view.pageTitle + ' | ' + title : title);
}

// Client-side router send
// -----------------------
router.prototype.send = function(view) {
    var options = (arguments.length > 1 ? arguments[1] : {});
    var v = new view(options);

    // Populate the #page div with the main view
    $('#page').empty().append(v.el);

    // Render and attach client-side behaviors
    v.render().attach().activeLinks().scrollTop();

    // Set the page title
    document.title = this.pageTitle(v);
}

// Generic error handling
// ----------------------
router.prototype.error = function(error) {
    this.send(views.Error, _.isArray(error) ? error.shift() : error);
}
