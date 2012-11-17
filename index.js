#!/usr/bin/env node

var bones = require('bones');

// Load extra plugins
require('./server/couch');

// Force load order
require('./models/Record');
require('./views/Main');

bones.load(__dirname);

if (!module.parent) {
    bones.start();
}
