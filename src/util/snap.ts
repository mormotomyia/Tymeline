import dayjs from 'dayjs';
var weekday = require('dayjs/plugin/weekday');
dayjs.extend(weekday);

export function snap(date: dayjs.Dayjs, scale: string, step: number) {
    var clone = dayjs(date);
    var result = dayjs(date);

    if (scale == 'year') {
        const year = clone.year() + Math.round(clone.month() / 12);
        clone = clone.year(Math.round(year / step) * step);
        clone = clone.month(0);
        clone = clone.date(0);
        clone = clone.hour(0);
        clone = clone.minute(0);
        clone = clone.second(0);
        clone = clone.millisecond(0);
    } else if (scale == 'month') {
        if (clone.date() > 15) {
            clone =clone.date(1);
            clone =clone.add(1, 'month');
            // important: first set Date to 1, after that change the month.
        } else {
            clone =clone.date(1);
        }

        clone =clone.hour(0);
        clone =clone.minute(0);
        clone =clone.second(0);
        clone =clone.millisecond(0);
    } else if (scale == 'week') {
        if (clone.weekday() > 2) {
            // doing it the momentjs locale aware way
            clone =clone.weekday(0);
            clone =clone.add(1, 'week');
        } else {
            clone =clone.weekday(0);
        }

        clone =clone.hour(0);
        clone =clone.minute(0);
        clone =clone.second(0);
        clone =clone.millisecond(0);
    } else if (scale == 'day') {
        
        //noinspection FallthroughInSwitchStatementJS
        switch (step) {
            case 5:
            case 2:
                clone =clone.hour(Math.round(clone.hour() / 24) * 24);
                break;
            default:
                
                clone =clone.hour(Math.round(clone.hour() / 12) * 12))
                break;
        }
        clone =clone.minute(0);
        clone =clone.second(0);
        clone =clone.millisecond(0);
    } else if (scale == 'weekday') {
        //noinspection FallthroughInSwitchStatementJS
        switch (step) {
            case 5:
            case 2:
                clone =clone.hour(Math.round(clone.hour() / 12) * 12);
                break;
            default:
                clone =clone.hour(Math.round(clone.hour() / 6) * 6);
                break;
        }
        clone =clone.minute(0);
        clone =clone.second(0);
        clone =clone.millisecond(0);
    } else if (scale == 'hour') {
        switch (step) {
            case 4:
                clone =clone.minute(Math.round(clone.minute() / 60) * 60);
                break;
            default:
                clone =clone.minute(Math.round(clone.minute() / 30) * 30);
                break;
        }
        clone =clone.second(0);
        clone =clone.millisecond(0);
    } else if (scale == 'minute') {
        //noinspection FallthroughInSwitchStatementJS
        switch (step) {
            case 15:
            case 10:
                clone =clone.minute(Math.round(clone.minute() / 5) * 5);
                clone =clone.second(0);
                break;
            case 5:
                clone =clone.second(Math.round(clone.second() / 60) * 60);
                break;
            default:
                clone =clone.second(Math.round(clone.second() / 30) * 30);
                break;
        }
        clone =clone.millisecond(0);
    } else if (scale == 'second') {
        //noinspection FallthroughInSwitchStatementJS
        switch (step) {
            case 15:
            case 10:
                clone =clone.second(Math.round(clone.second() / 5) * 5);
                clone =clone.millisecond(0);
                break;
            case 5:
                clone =clone.millisecond(Math.round(clone.millisecond() / 1000) * 1000);
                break;
            default:
                clone =clone.millisecond(Math.round(clone.millisecond() / 500) * 500);
                break;
        }
    } else if (scale == 'millisecond') {
        const _step = step > 5 ? step / 2 : 1;
        clone =clone.millisecond(Math.round(clone.millisecond() / _step) * _step);
    }

    return clone;
}
