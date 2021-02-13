"use strict";
exports.__esModule = true;
var print = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return console.log(args);
};
Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
};
// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function () {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
};
var Transform = /** @class */ (function () {
    function Transform(x, y, scale) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (scale === void 0) { scale = 1; }
        this.deltaX = x;
        this.deltaY = y;
        this.scale = scale;
    }
    return Transform;
}());
exports.Transform = Transform;
exports.nextTimeScale = { "getDay": "getHours" };
var ScaleOptions;
(function (ScaleOptions) {
    ScaleOptions["years"] = "getFullYear";
    ScaleOptions["months"] = "getMonth";
    ScaleOptions["weeks"] = "getWeek";
    ScaleOptions["days"] = "getDay";
    ScaleOptions["hours"] = "getHours";
    ScaleOptions["minutes"] = "getMinutes";
    ScaleOptions["seconds"] = "getSeconds";
})(ScaleOptions = exports.ScaleOptions || (exports.ScaleOptions = {}));
function daysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
}
var Timeline = /** @class */ (function () {
    function Timeline(dom, start, end) {
        //stupid initializer!
        this.topScale = ScaleOptions.months;
        this.bottomScale = ScaleOptions.weeks;
        this.left = start;
        this.right = end;
        this.domElement = dom;
        this.applyTimescale();
    }
    Object.defineProperty(Timeline.prototype, "getWeek", {
        get: function () {
            return (this.right.getWeek() - this.left.getWeek());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "getDay", {
        get: function () {
            return this.left.getMonth() !== this.right.getMonth() ? daysInMonth(this.left) - this.left.getDate() + this.right.getDate() : this.right.getDate() - this.left.getDate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "getHours", {
        get: function () {
            return (this.right.getTime() - this.left.getTime()) / (1000 * 3600);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "getMinutes", {
        get: function () {
            return (this.right.getTime() - this.left.getTime()) / (1000 * 60);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "getSeconds", {
        get: function () {
            return (this.right.getTime() - this.left.getTime()) / (1000);
        },
        enumerable: true,
        configurable: true
    });
    Timeline.prototype.createBorderRegions = function () {
        var offsetfactor = new Date(2000, 11, 31, 23, 59, 59).[exports.nextTimeScale.[this.bottomScale]]() + 1;
        var leftOffset = this.left.[exports.nextTimeScale.[this.bottomScale]]() / offsetfactor;
        var rightOffset = this.right.[exports.nextTimeScale.[this.bottomScale]]() / offsetfactor;
        var totalOffset = -leftOffset + rightOffset;
        var translateFactor = Math.floor(this.domElement.timeContainer.getBoundingClientRect().width / (this.[this.bottomScale] + totalOffset));
        var startElement = document.createElement('div');
        startElement.style.width = translateFactor + "px";
        startElement.classList.add('mormo-time-element');
        startElement.classList.add(this.bottomScale.split('get')[1]);
        startElement.innerHTML = this.left[this.bottomScale]();
        console.log(new Date(2000, 11, 31, 23, 59, 59).[exports.nextTimeScale.[this.bottomScale]]());
        console.log(rightOffset);
        console.log(totalOffset);
        startElement.style.transform = "translate(" + translateFactor * -leftOffset + "px)";
        this.domElement.timeContainer.appendChild(startElement);
        // console.log(translateFactor)
        var endElement = document.createElement('div');
        endElement.style.width = translateFactor + "px";
        endElement.classList.add('mormo-time-element');
        endElement.classList.add(this.bottomScale.split('get')[1]);
        // this.domElement.timeContainer.appendChild(endElement);
        endElement.innerHTML = this.left[this.bottomScale]() + this.[this.bottomScale];
        endElement.style.transform = "translate(" + translateFactor * (this.[this.bottomScale] - rightOffset) + "px)";
        return { translateFactor: translateFactor, leftOffset: leftOffset, endElement: endElement };
        // console.log(this.left.[this.topScale]())
        // timeElement.innerHTML = this.left[this.topScale]()+index
        // console.log('___')
        // console.log(this.left.[this.bottomScale]())
        // console.log(this.[this.bottomScale])
        // timeElement.style.width = `${Math.floor(this.domElement.timeContainer.getBoundingClientRect().width/this.[this.topScale]).toString()}px`
    };
    Timeline.prototype.render = function () {
        var _a = this.createBorderRegions(), translateFactor = _a.translateFactor, leftOffset = _a.leftOffset, endElement = _a.endElement;
        for (var index = 1; index < this.[this.bottomScale]; index++) {
            var timeElement = document.createElement('div');
            timeElement.classList.add('mormo-time-element');
            timeElement.classList.add(this.bottomScale.split('get')[1]);
            timeElement.innerHTML = this.left[this.bottomScale]() + index;
            timeElement.style.width = translateFactor + "px";
            timeElement.style.transform = "translate(" + translateFactor * (index - leftOffset) + "px)";
            this.domElement.timeContainer.appendChild(timeElement);
        }
        this.domElement.timeContainer.appendChild(endElement);
        console.log(Math.abs(((11 - 30) % daysInMonth(this.left))));
    };
    Timeline.prototype.applyTransform = function (transform) {
        this.domElement.timeContainer.style.transform = "matrix(" + transform.scale + ",0,0,1," + transform.deltaX + "," + transform.deltaY;
    };
    Object.defineProperty(Timeline.prototype, "timeframe", {
        get: function () {
            return (this.right.getTime() - this.left.getTime()) / 1000;
        },
        enumerable: true,
        configurable: true
    });
    Timeline.prototype.applyTimescale = function () {
        console.log(this.timeframe);
        if (this.timeframe > 3600 * 24 * 365 * 2) {
            console.log('a');
            this.topScale = ScaleOptions.years;
            this.bottomScale = ScaleOptions.months;
            //years
        }
        else if (this.timeframe > 3600 * 24 * 60) {
            // months
            console.log('b');
            this.topScale = ScaleOptions.months;
            this.bottomScale = ScaleOptions.weeks;
        }
        else if (this.timeframe > 3600 * 24 * 10) {
            // days
            console.log('c');
            this.topScale = ScaleOptions.weeks;
            this.bottomScale = ScaleOptions.days;
        }
        else if (this.timeframe > 3600 * 24 * 3) {
            //hours
            this.topScale = ScaleOptions.days;
            this.bottomScale = ScaleOptions.hours;
        }
        else if (this.timeframe > 3600 * 12) {
            // minutes
            this.topScale = ScaleOptions.hours;
            this.bottomScale = ScaleOptions.minutes;
        }
        else {
            // minutes
            this.topScale = ScaleOptions.minutes;
            this.bottomScale = ScaleOptions.seconds;
        }
        this.timeframe;
    };
    return Timeline;
}());
exports.Timeline = Timeline;
