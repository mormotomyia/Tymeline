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
var movableObject_1 = require("./movableObject");
var Timeline_1 = require("../Timeline");
var Component_1 = __importDefault(require("./Component"));
var MormoTable = /** @class */ (function (_super) {
    __extends(MormoTable, _super);
    // tableData: Array<{ id: number; length: number; text: string; }> = [];
    function MormoTable(container, options) {
        var _this = _super.call(this) || this;
        _this.tableData = new Map();
        _this.root = container;
        _this.dom = {};
        _this.tableOptions = options;
        if (_this.tableOptions ? .dates === undefined : ) {
            _this.tableOptions.dates = { start: new Date(new Date().getTime() - (12 * 24 * 3600 * 1000)), end: new Date(new Date().getTime() + (7 * 24 * 3600 * 1000)) };
        }
        // this.dom.
        // this.body = document.createElement(elementType)
        _this.dom.root = document.createElement('div');
        _this.dom.innerContainer = document.createElement('div');
        _this.dom.tableContainer = document.createElement('div');
        _this.dom.timeContainer = document.createElement('div');
        _this.dom.tableRows = document.createElement('div');
        _this.dom.timeContainer.classList.add('mormo-time');
        _this.dom.tableContainer.classList.add('mormo-table');
        _this.dom.tableRows.classList.add('mormo-table-rows');
        _this.dom.tableContainer.appendChild(_this.dom.timeContainer);
        _this.dom.tableContainer.appendChild(_this.dom.tableRows);
        _this.dom.innerContainer.appendChild(_this.dom.tableContainer);
        _this.dom.root.appendChild(_this.dom.innerContainer);
        _this.dom.root.onwheel = _this.changeZoom;
        // propertyClasses
        _this.timeline = new Timeline_1.Timeline(_this.dom, _this.tableOptions.dates.start, _this.tableOptions.dates ? .end : );
        console.log(_this.timeline.left);
        console.log(_this.timeline.right);
        // this.dom.root.addEventListener('wheel',this.changeZoom)
        _this.styleTimeline();
        if (_this.tableOptions) {
            _this.dom.tableContainer.style.width = _this.tableOptions.size.width + "px";
            _this.dom.tableContainer.style.height = _this.tableOptions.size.height + "px";
            if (_this.tableOptions.colorschema) {
                _this.dom.tableContainer.style.color = "" + _this.tableOptions.colorschema.text;
                _this.dom.tableContainer.style.backgroundColor = "" + _this.tableOptions.colorschema.background;
            }
        }
        // this.dom.tableContainer.style.borderRadius= '10px';
        _this.dom.tableContainer.style.padding = '0px';
        _this.dom.tableContainer.style.margin = '0px';
        return _this;
    }
    MormoTable.prototype.styleTimeline = function () {
        // this.root.style.margin="20px";
        this.root ? this.root.style.paddingLeft = "20px" : null;
        this.dom.tableContainer.style.position = 'relative';
        this.dom.timeContainer.style.position = "absolute";
        this.dom.timeContainer.style.bottom = "0";
        this.dom.timeContainer.style.left = "0";
        this.dom.timeContainer.style.height = "50px";
        this.dom.timeContainer.style.width = "-moz-available"; /* WebKit-based browsers will ignore this. */
        this.dom.timeContainer.style.width = "-webkit-fill-available"; /* Mozilla-based browsers will ignore this. */
        this.dom.timeContainer.style.width = "fill-available";
        this.dom.timeContainer.style.border = "solid";
        this.dom.timeContainer.style.borderWidth = "thin";
        this.dom.timeContainer.style.borderTopWidth = "thick";
        this.dom.timeContainer.style.overflow = 'hidden';
        // this.dom.timeContainer.style.display="inline-flex"
        if (this.tableOptions ? .colorschema : ) {
            this.dom.timeContainer.style.borderColor = this.tableOptions ? .colorschema ? .borders :  : ;
        }
    };
    MormoTable.prototype.changeZoom = function (event) {
        event.preventDefault();
        console.log(event.deltaY);
    };
    MormoTable.prototype.updateTable = function (objects) {
        var _this = this;
        if (Array.isArray(objects)) {
            objects.forEach(function (element) {
                // this.tableData.
                _this.tableData.set(element.id.toString(), new movableObject_1.TableData(element.id, element.length, element.start, element.content));
            });
        }
        else {
            Object.entries(objects).forEach(function (e) {
                var element = e[1];
                _this.tableData.set(e[0], new movableObject_1.TableData(e[0], element.length, element.start, element.content));
            });
        }
        console.log(this.tableData);
    };
    MormoTable.prototype.setTable = function (objects) {
        var _this = this;
        this.tableData.clear();
        if (Array.isArray(objects)) {
            objects.forEach(function (element) {
                _this.tableData.set(element.id.toString(), new movableObject_1.TableData(element.id, element.length, element.start, element.content));
            });
        }
        else {
            Object.entries(objects).forEach(function (e) {
                var element = e[1];
                _this.tableData.set(e[0], new movableObject_1.TableData(e[0], element.length, element.start, element.content));
            });
        }
        console.log(this.tableData);
    };
    MormoTable.prototype.render = function () {
        this.initialized = true;
        this.root ? .appendChild(this.dom.root)
            :
        ;
        console.log(new Date().getMilliseconds());
        this.timeline.render();
        console.log(new Date().getMilliseconds());
        // this.dom.tableContainer.appendChild(new TableElement())
    };
    MormoTable.prototype.destroy = function () {
    };
    MormoTable.prototype.redraw = function () {
        if (this.initialized) {
            // do something
        }
    };
    return MormoTable;
}(Component_1["default"]));
exports.MormoTable = MormoTable;
