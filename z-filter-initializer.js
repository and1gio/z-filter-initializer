'use strict';

module.exports = {
    run: function (app, next) {
        app.filter = {};

        var folderPath = app.folderPath.app.root + app.config.zFilter.rootDir + '/';
        var filters = app.config.zFilter.filters;

        for (var i in filters) {
            (function (indexI) {
                var module = require(folderPath + filters[indexI])(app);
                app.filter[filters[indexI]] = {};

                for (var j in module) {
                    (function (idxI, idxJ) {
                        app.filter[idxI][idxJ] = function (data) {
                            return function (req, res, next) {
                                if (data) {
                                    module[indexJ](data, req, res, next);
                                } else {
                                    console.log(idxI, idxJ, module);
                                    module[idxJ](req, res, next);
                                }
                            }
                        }
                    })(filters[indexI], j);
                }
            })(i)
        }

        next();
    }
};