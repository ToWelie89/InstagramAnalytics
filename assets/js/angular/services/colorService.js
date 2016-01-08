(function() {
    var app = angular.module('instaAnalyzeApp');

    var colorService = ['$q', '$log', function($q, log) {

        function getColor(c,n,i,d){
            for(i=3;i--;c[i]=d<0?0:d>255?255:d|0)d=c[i]+n;return c
        };

        var getColorAsHex = function(rgb, offset) {
            var color = getColor(rgb, offset);

            var r = color[0].toString(16);
            var g = color[1].toString(16);
            var b = color[2].toString(16);

            r = (r.length === 1) ? ('0' + r) : r;
            g = (g.length === 1) ? ('0' + g) : g;
            b = (b.length === 1) ? ('0' + b) : b;

            var newColor = '#' + r + g + b;
            return newColor;
        };

        return {
            getColorAsHex: function(rgb, offset) {
                return getColorAsHex(rgb, offset);
            }
        };
    }];

    app.service('colorService', colorService);
}());