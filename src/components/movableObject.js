"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
exports.__esModule = true;
var Component_1 = __importDefault(require("./Component"));
var TableData = /** @class */ (function () {
    function TableData(id, length, start, content) {
        this.id = id;
        this.length = length;
        this.start = start;
        this.content = content;
    }
    return TableData;
}());
exports.TableData = TableData;
var MovableObject = /** @class */ (function (_super) {
    __extends(MovableObject, _super);
    function MovableObject() {
        return _super.call(this) || this;
    }
    MovableObject.prototype.destroy = function () {
    };
    MovableObject.prototype.redraw = function () {
    };
    return MovableObject;
}(Component_1["default"]));
exports.MovableObject = MovableObject;
