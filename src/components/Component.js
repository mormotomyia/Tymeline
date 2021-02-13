"use strict";
exports.__esModule = true;
var Component = /** @class */ (function () {
    function Component() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.dom = {};
        ;
        console.log(args);
        this.options = null;
        this.props = null;
        this.initialized = false;
        this.root = null;
    }
    return Component;
}());
exports["default"] = Component;
