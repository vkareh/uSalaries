var vendor = servers.Route.prototype.assets.vendor;
vendor.push(require.resolve('../assets/flot/jquery.flot.js'));
vendor.push(require.resolve('../assets/flot/jquery.flot.stack.js'));
vendor.push(require.resolve('../node_modules/accounting/accounting.min.js'));
vendor.push(require.resolve('../node_modules/jStat/src/core.js'));
vendor.push(require.resolve('../node_modules/jStat/src/vector.js'));
