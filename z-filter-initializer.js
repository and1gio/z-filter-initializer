'use strict';

module.exports = {
    run: function (app, next) {
        app.filter = {};

        var folderPath = app.folderPath.app.root + app.config.zFilter.rootDir + '/';
        var filters = app.config.zFilter.filters;

        var modules = {};

        for (var i in filters) {
            app.filter[filters[i]] = require(folderPath + filters[i])(app);

            modules[filters[i]] = require(folderPath + filters[i])(app);
            var module = modules[filters[i]];

            for (var j in module) {
                (function (indexI, indexJ) {
                    app.filter[indexI][indexJ] = function (data) {
                        return function (req, res, next) {
                            if (data) {
                                modules[indexI][indexJ](data, req, res, next);
                            } else {
                                modules[indexI][indexJ](req, res, next);
                            }
                        }
                    }
                })(filters[i], j);
            }
        }
        next();
    }
};