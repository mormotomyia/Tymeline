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
var TableElement = /** @class */ (function (_super) {
    __extends(TableElement, _super);
    function TableElement(id, length, start, content) {
        var _this = _super.call(this) || this;
        // this.root = container
        _this.id = id;
        _this.length = length;
        _this.content = content;
        _this.dom.root = document.createElement('div');
        _this.dom.root.onmousemove = _this.changeMouseOnEdgeLeftRight;
        return _this;
    }
    TableElement.prototype.destroy = function () {
    };
    TableElement.prototype.redraw = function () {
        if (this.initialized) {
            // do something
        }
    };
    TableElement.prototype.changeMouseOnEdgeLeftRight = function (event) {
        // console.log(<HTMLElement>event.target?.)
        var element = event.target;
        var offsetLeft = element.getBoundingClientRect().left;
        if (element.clientWidth + offsetLeft - event.clientX < 10) {
            element.style.cursor = 'e-resize';
        }
        else if (element.offsetWidth + offsetLeft - event.clientX > element.offsetWidth - 10) {
            element.style.cursor = 'W-resize';
        }
        else {
            element.style.cursor = 'default';
        }
        // console.log(event.clientX)
        // console.log(event.clientY)
        // console.log(<HTMLElement>event.target.clientWidth)
        // console.log(<HTMLElement>event.target.clientWidth)
    };
    return TableElement;
}(Component_1["default"]));
exports.TableElement = TableElement;
