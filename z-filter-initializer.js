'use strict';

module.exports = {
    run: function (app, next) {
        app.filter = {};

        var folderPath = app.folderPath.app.root + app.config.zFilter.rootDir + '/';
        var filters = app.config.zFilter.filters;

        for (var i in filters) {
            var module = require(folderPath + filters[i])(app);
            app.filter[filters[i]] = {};

            for (var j in module) {
                (function (indexI, indexJ) {
                    app.filter[indexI][indexJ] = function (data) {
                        return function (req, res, next) {
                            if (data) {
                                module[indexJ](data, req, res, next);
                            } else {
                                module[indexJ](req, res, next);
                            }
                        }
                    }
                })(filters[i], j);
            }
        }
        next();
    }
};