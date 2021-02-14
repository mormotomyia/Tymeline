/**
 * @license GPLv3 
 * @source https://github.com/visjs/vis-timeline/blob/c208182352e0be7d98663a0d1bb64126eba0024c/lib/timeline/TimeStep.js
 * @uses licensed work from VISJS distributed under MIT Licence
 */

import dayjs from "dayjs";
import  moment  from "moment";
import { exit } from "node:process";
var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)



// Time formatting
const FORMAT = {
    minorLabels: {
      millisecond:'SSS',
      second:     's',
      minute:     'HH:mm',
      hour:       'HH:mm',
      weekday:    'ddd D',
      day:        'D',
      week:       'w',
      month:      'MMM',
      year:       'YYYY'
    },
    majorLabels: {
      millisecond:'HH:mm:ss',
      second:     'D MMMM HH:mm',
      minute:     'ddd D MMMM',
      hour:       'ddd D MMMM',
      weekday:    'MMMM YYYY',
      day:        'MMMM YYYY',
      week:       'MMMM YYYY',
      month:      'YYYY',
      year:       ''
    }
  };

export class TimeStep{
    
    current: dayjs.Dayjs;
    left: dayjs.Dayjs;
    right: dayjs.Dayjs;
    minimumStep: number;
    scale: string;
    step: number;
    options: any;
    switchedYear: boolean = false;
    switchedMonth: boolean = false;
    switchedDay: boolean = false;
    autoScale: boolean;
    format: any;


    constructor(start:dayjs.Dayjs,end:dayjs.Dayjs,minimumStep:number){
        this.format = FORMAT; // default formatting
        this.left = start
        this.right = end

        this.minimumStep = minimumStep;
        this.autoScale  = true;
        this.scale = 'day';
        this.step = 1;
        this.setMinimumStep(this.minimumStep)
        this.current = dayjs()
    }

    updateScale(start: dayjs.Dayjs, end:dayjs.Dayjs, minimumStep:number=this.minimumStep ) {
      this.left = start;
      this.right = end;
      this.setMinimumStep(minimumStep)
    }

    start() {
        this.current = this.left.clone();
        this.roundToMinor();
    }
    getCurrent() {
        return this.current.clone();
    }


    hasNext() {
        return (this.current.valueOf() <= this.right.valueOf());
    }

    next() {
        const prev = this.current.valueOf();
        // console.log(this.current.valueOf())

        // Two cases, needed to prevent issues with switching daylight savings
        // (end of March and end of October)
        switch (this.scale) {
          case 'millisecond':  this.current =this.current.add(this.step, 'millisecond'); break;
          case 'second':       this.current =this.current.add(this.step, 'second'); break;
          case 'minute':       this.current =this.current.add(this.step, 'minute'); break;
          case 'hour':
            this.current =this.current.add(this.step, 'hour');
    
            if (this.current.month() < 6) {
              this.current = this.current.subtract(this.current.hour() % this.step, 'hour');
            } else {
              if (this.current.hour() % this.step !== 0) {
                this.current =this.current.add(this.step - this.current.hour() % this.step, 'hour');
              }
            }
            break;
          case 'weekday':      // intentional fall through
          case 'day':          this.current =this.current.add(this.step, 'day'); break;
          case 'week':

            if (this.current.day() !== 0){ // we had a month break not correlating with a week's start before
              this.current = this.current.day(0); // switch back to week cycles
              this.current = this.current.add(this.step, 'week');
            } else if(this.options.showMajorLabels === false) {
              this.current =this.current.add(this.step, 'week'); // the default case
            } else { // first day of the week
              const nextWeek = this.current.clone();
              nextWeek.add(1, 'week');
              if(nextWeek.isSame(this.current, 'month')){ // is the first day of the next week in the same month?
                this.current =this.current.add(this.step, 'week'); // the default case
              } else { // inject a step at each first day of the month
                this.current =this.current.add(this.step, 'week');
                this.current =this.current.date(1);
              }
            }
            break;
          case 'month':        this.current =this.current.add(this.step, 'month'); break;
          case 'year':         this.current =this.current.add(this.step, 'year'); break;
          default: break;
        }
    
        if (this.step != 1) {
          // round down to the correct major value
          switch (this.scale) {
            case 'millisecond':  if(this.current.millisecond() > 0 && this.current.millisecond() < this.step) this.current =this.current.millisecond(0);  break;
            case 'second':       if(this.current.second() > 0 && this.current.second() < this.step) this.current =this.current.second(0);  break;
            case 'minute':       if(this.current.minute() > 0 && this.current.minute() < this.step) this.current =this.current.minute(0); break;
            case 'hour':         if(this.current.hour() > 0 && this.current.hour() < this.step) this.current =this.current.hour(0);  break;
            case 'weekday':      // intentional fall through
            case 'day':          if(this.current.date() < this.step+1) this.current = this.current.date(1); break;
            case 'week':         if(this.current.week() < this.step) this.current = this.current.week(1); break; // week numbering starts at 1, not 0
            case 'month':        if(this.current.month() < this.step) this.current = this.current.month(0);  break;
            case 'year':         break; // nothing to do for year
            default:             break;
          }
        }
        // console.log(this.current = this.current.add(20,"minute"))
        // console.log(this.current.valueOf())
        // safety mechanism: if current time is still unchanged, move to the end
        if (this.current.valueOf() == prev) {
          this.current = this.right.clone();
        }
        
        // Reset switches for year, month and day. Will get set to true where appropriate in DateUtil.stepOverHiddenDates
        this.switchedDay = false;
        this.switchedMonth = false;
        this.switchedYear = false;
    
        // DateUtil.stepOverHiddenDates(this.moment, this, prev);
      }

    roundToMinor() {
        // round to floor
        // to prevent year & month scales rounding down to the first day of week we perform this separately
        if (this.scale == 'week') {
          this.current.day(0);
        }
        // IMPORTANT: we have no breaks in this switch! (this is no bug)
        // noinspection FallThroughInSwitchStatementJS
        switch (this.scale) {
          case 'year':
            this.current =this.current.year(this.step * Math.floor(this.current.year() / this.step));
            this.current =this.current.month(0);
          case 'month':        this.current =this.current.date(1);          // eslint-disable-line no-fallthrough
          case 'week':                                        // eslint-disable-line no-fallthrough
          case 'day':                                         // eslint-disable-line no-fallthrough
          case 'weekday':      this.current =this.current.hour(0);         // eslint-disable-line no-fallthrough
          case 'hour':         this.current =this.current.minute(0);       // eslint-disable-line no-fallthrough
          case 'minute':       this.current =this.current.second(0);       // eslint-disable-line no-fallthrough
          case 'second':       this.current =this.current.millisecond(0);  // eslint-disable-line no-fallthrough
          //case 'millisecond': // nothing to do for milliseconds
        }
    
        if (this.step != 1) {
          // round down to the first minor value that is a multiple of the current step size
          let  priorCurrent = this.current.clone();
          switch (this.scale) {        
            case 'millisecond':  this.current =this.current.subtract(this.current.millisecond() % this.step, 'milliseconds');  break;
            case 'second':       this.current =this.current.subtract(this.current.second() % this.step, 'seconds'); break;
            case 'minute':       this.current =this.current.subtract(this.current.minute() % this.step, 'minutes'); break;
            case 'hour':         this.current =this.current.subtract(this.current.hour() % this.step, 'hours'); break;
            case 'weekday':      // intentional fall through
            case 'day':          this.current =this.current.subtract((this.current.date() - 1) % this.step, 'day'); break;
            case 'week':         this.current =this.current.subtract(this.current.week() % this.step, 'week'); break;
            case 'month':        this.current =this.current.subtract(this.current.month() % this.step, 'month');  break;
            case 'year':         this.current =this.current.subtract(this.current.year() % this.step, 'year'); break;
            default: break;
          }
        //   if (!priorCurrent.isSame(this.current)) {
        //       this.current = this.dayjs(DateUtil.snapAwayFromHidden(this.hiddenDates, this.current.valueOf(), -1, true));
        //   }
        }
      }

    
    setMinimumStep(minimumStep: number ) {


        //var b = asc + ds;

        const stepYear       = (1000 * 60 * 60 * 24 * 30 * 12);
        const stepMonth      = (1000 * 60 * 60 * 24 * 30);
        const stepDay        = (1000 * 60 * 60 * 24);
        const stepHour       = (1000 * 60 * 60);
        const stepMinute     = (1000 * 60);
        const stepSecond     = (1000);
        const stepMillisecond= (1);

        // find the smallest step that is larger than the provided minimumStep
        if (stepYear*1000 > minimumStep)        {this.scale = 'year';        this.step = 1000;}
        if (stepYear*500 > minimumStep)         {this.scale = 'year';        this.step = 500;}
        if (stepYear*100 > minimumStep)         {this.scale = 'year';        this.step = 100;}
        if (stepYear*50 > minimumStep)          {this.scale = 'year';        this.step = 50;}
        if (stepYear*10 > minimumStep)          {this.scale = 'year';        this.step = 10;}
        if (stepYear*5 > minimumStep)           {this.scale = 'year';        this.step = 5;}
        if (stepYear > minimumStep)             {this.scale = 'year';        this.step = 1;}
        if (stepMonth*3 > minimumStep)          {this.scale = 'month';       this.step = 3;}
        // if (stepMonth > minimumStep)            {this.scale = 'month';       this.step = 1;}
        // if (stepDay*7 > minimumStep && this.options.showWeekScale)            {this.scale = 'week';        this.step = 1;}
        if (stepDay*45 > minimumStep)            {this.scale = 'day';         this.step = 4;}
        if (stepDay*2 > minimumStep)            {this.scale = 'day';         this.step = 2;}
        if (stepDay > minimumStep)              {this.scale = 'day';         this.step = 1;}
        if (stepDay/2 > minimumStep)            {this.scale = 'weekday';     this.step = 1;}
        if (stepHour*4 > minimumStep)           {this.scale = 'hour';        this.step = 4;}
        if (stepHour > minimumStep)             {this.scale = 'hour';        this.step = 1;}
        if (stepMinute*15 > minimumStep)        {this.scale = 'minute';      this.step = 15;}
        if (stepMinute*10 > minimumStep)        {this.scale = 'minute';      this.step = 10;}
        if (stepMinute*5 > minimumStep)         {this.scale = 'minute';      this.step = 5;}
        if (stepMinute > minimumStep)           {this.scale = 'minute';      this.step = 1;}
        if (stepSecond*15 > minimumStep)        {this.scale = 'second';      this.step = 15;}
        if (stepSecond*10 > minimumStep)        {this.scale = 'second';      this.step = 10;}
        if (stepSecond*5 > minimumStep)         {this.scale = 'second';      this.step = 5;}
        if (stepSecond > minimumStep)           {this.scale = 'second';      this.step = 1;}
        if (stepMillisecond*200 > minimumStep)  {this.scale = 'millisecond'; this.step = 200;}
        if (stepMillisecond*100 > minimumStep)  {this.scale = 'millisecond'; this.step = 100;}
        if (stepMillisecond*50 > minimumStep)   {this.scale = 'millisecond'; this.step = 50;}
        if (stepMillisecond*10 > minimumStep)   {this.scale = 'millisecond'; this.step = 10;}
        if (stepMillisecond*5 > minimumStep)    {this.scale = 'millisecond'; this.step = 5;}
        if (stepMillisecond > minimumStep)      {this.scale = 'millisecond'; this.step = 1;}
    }

  /**
   * Snap a date to a rounded value.
   * The snap intervals are dependent on the current scale and step.
   * Static function
   * @param {Date} date    the date to be snapped.
   * @param {string} scale Current scale, can be 'millisecond', 'second',
   *                       'minute', 'hour', 'weekday, 'day', 'week', 'month', 'year'.
   * @param {number} step  Current step (1, 2, 4, 5, ...
   * @return {Date} snappedDate
   */
  static snap(date: any, scale: string, step: number) {
    const clone = dayjs(date);

    if (scale == 'year') {
      const year = clone.year() + Math.round(clone.month() / 12);
      clone.year(Math.round(year / step) * step);
      clone.month(0);
      clone.date(0);
      clone.hour(0);
      clone.minute(0);
      clone.second(0);
      clone.millisecond(0);
    }
    else if (scale == 'month') {
      if (clone.date() > 15) {
        clone.date(1);
        clone.add(1, 'month');
        // important: first set Date to 1, after that change the month.
      }
      else {
        clone.date(1);
      }

      clone.hour(0);
      clone.minute(0);
      clone.second(0);
      clone.millisecond(0);
    }
    else if (scale == 'week') {
        if (clone.day() > 2) { // doing it the momentjs locale aware way
            clone.day(0);
            clone.add(1, 'week');
        }
        else {
            clone.day(0);
        }

        clone.hour(0);
        clone.minute(0);
        clone.second(0);
        clone.millisecond(0);
    }
    else if (scale == 'day') {
      //noinspection FallthroughInSwitchStatementJS
      switch (step) {
        case 5:
        case 2:
          clone.hour(Math.round(clone.hour() / 24) * 24); break;
        default:
          clone.hour(Math.round(clone.hour() / 12) * 12); break;
      }
      clone.minute(0);
      clone.second(0);
      clone.millisecond(0);
    }
    else if (scale == 'weekday') {
      //noinspection FallthroughInSwitchStatementJS
      switch (step) {
        case 5:
        case 2:
          clone.hour(Math.round(clone.hour() / 12) * 12); break;
        default:
          clone.hour(Math.round(clone.hour() / 6) * 6); break;
      }
      clone.minute(0);
      clone.second(0);
      clone.millisecond(0);
    }
    else if (scale == 'hour') {
      switch (step) {
        case 4:
          clone.minute(Math.round(clone.minute() / 60) * 60); break;
        default:
          clone.minute(Math.round(clone.minute() / 30) * 30); break;
      }
      clone.second(0);
      clone.millisecond(0);
    } else if (scale == 'minute') {
      //noinspection FallthroughInSwitchStatementJS
      switch (step) {
        case 15:
        case 10:
          clone.minute(Math.round(clone.minute() / 5) * 5);
          clone.second(0);
          break;
        case 5:
          clone.second(Math.round(clone.second() / 60) * 60); break;
        default:
          clone.second(Math.round(clone.second() / 30) * 30); break;
      }
      clone.millisecond(0);
    }
    else if (scale == 'second') {
      //noinspection FallthroughInSwitchStatementJS
      switch (step) {
        case 15:
        case 10:
          clone.second(Math.round(clone.second() / 5) * 5);
          clone.millisecond(0);
          break;
        case 5:
          clone.millisecond(Math.round(clone.millisecond() / 1000) * 1000); break;
        default:
          clone.millisecond(Math.round(clone.millisecond() / 500) * 500); break;
      }
    }
    else if (scale == 'millisecond') {
      const _step = step > 5 ? step / 2 : 1;
      clone.millisecond(Math.round(clone.millisecond() / _step) * _step);
    }

    return clone;
  }

  getClassName() {
    const m = dayjs(this.current);
    const current = m.locale('en')
    // const current = m.locale ? m.locale('en') : m.lang('en'); // old versions of moment have .lang() function
    const step = this.step;
    const classNames = [];

    /**
     *
     * @param {number} value
     * @returns {String}
     */
    function even(value:number) {
      return (value / step % 2 == 0) ? ' mormo-even' : ' mormo-odd';
    }

    /**
     *
     * @param {Date} date
     * @returns {String}
     */
    function today(date:dayjs.Dayjs) {
      if (date.isSame(Date.now(), 'day')) {
        return ' mormo-today';
      }
      if (date.isSame(dayjs().add(1, 'day'), 'day')) {
        return ' mormo-tomorrow';
      }
      if (date.isSame(dayjs().add(-1, 'day'), 'day')) {
        return ' mormo-yesterday';
      }
      return '';
    }

    /**
     *
     * @param {Date} date
     * @returns {String}
     */
    function currentWeek(date:dayjs.Dayjs) {
      return date.isSame(Date.now(), 'week') ? ' mormo-current-week' : '';
    }

    /**
     *
     * @param {Date} date
     * @returns {String}
     */
    function currentMonth(date:dayjs.Dayjs) {
      return date.isSame(Date.now(), 'month') ? ' mormo-current-month' : '';
    }

    /**
     *
     * @param {Date} date
     * @returns {String}
     */
    function currentYear(date:dayjs.Dayjs) {
      return date.isSame(Date.now(), 'year') ? ' mormo-current-year' : '';
    }

    switch (this.scale) {
      case 'millisecond':
        classNames.push(today(current));
        classNames.push(even(current.millisecond()));
        break;
      case 'second':
        classNames.push(today(current));
        classNames.push(even(current.second()));
        break;
      case 'minute':
        classNames.push(today(current));
        classNames.push(even(current.minute()));
        break;
      case 'hour':
        classNames.push(`mormo-h${current.hour()}${this.step == 4 ? '-h' + (current.hour() + 4) : ''}`);
        classNames.push(today(current));
        classNames.push(even(current.hour()));
        break;
      case 'weekday':
        classNames.push(`mormo-${current.format('dddd').toLowerCase()}`);
        classNames.push(today(current));
        classNames.push(currentWeek(current));
        classNames.push(even(current.date()));
        break;
      case 'day':
        classNames.push(`mormo-day${current.date()}`);
        classNames.push(`mormo-${current.format('MMMM').toLowerCase()}`);
        classNames.push(today(current));
        classNames.push(currentMonth(current));
        classNames.push(this.step <= 2 ? today(current) : '');
        classNames.push(this.step <= 2 ? `mormo-${current.format('dddd').toLowerCase()}` : '');
        classNames.push(even(current.date() - 1));
        break;
      case 'week':
        classNames.push(`mormo-week${current.format('w')}`);
        classNames.push(currentWeek(current));
        classNames.push(even(current.week()));
        break;
      case 'month':
        classNames.push(`mormo-${current.format('MMMM').toLowerCase()}`);
        classNames.push(currentMonth(current));
        classNames.push(even(current.month()));
        break;
      case 'year':
        classNames.push(`mormo-year${current.year()}`);
        classNames.push(currentYear(current));
        classNames.push(even(current.year()));
        break;
    }
    return classNames.filter(String).join(" ");
  }


  /**
   * Check if the current value is a major value (for example when the step
   * is DAY, a major value is each first day of the MONTH)
   * @return {boolean} true if current date is major, else false.
   */
  isMajor() {
    if (this.switchedYear == true) {
      switch (this.scale) {
        case 'year':
        case 'month':
        case 'week':
        case 'weekday':
        case 'day':
        case 'hour':
        case 'minute':
        case 'second':
        case 'millisecond':
          return true;
        default:
          return false;
      }
    }
    else if (this.switchedMonth == true) {
      switch (this.scale) {
        case 'week':
        case 'weekday':
        case 'day':
        case 'hour':
        case 'minute':
        case 'second':
        case 'millisecond':
          return true;
        default:
          return false;
      }
    }
    else if (this.switchedDay == true) {
      switch (this.scale) {
        case 'millisecond':
        case 'second':
        case 'minute':
        case 'hour':
          return true;
        default:
          return false;
      }
    }

    const date = this.current
    switch (this.scale) {
      case 'millisecond':
        return (date.millisecond() == 0);
      case 'second':
        return (date.second() == 0);
      case 'minute':
        return (date.hour() == 0) && (date.minute() == 0);
      case 'hour':
        return (date.hour() == 0);
      case 'weekday': // intentional fall through
      case 'day':
        return (date.date() == 1);
      case 'week':
        return (date.date() == 1);
      case 'month':
        return (date.month() == 0);
      case 'year':
        return false;
      default:
        return false;
    }
  }

  getLabel(date:dayjs.Dayjs, isMajor:boolean) {
    

    if (typeof(this.format.minorLabels) === "function") {
      return this.format.minorLabels(date, this.scale, this.step);
    }

    if (typeof(this.format.majorLabels) === "function") {
      return this.format.majorLabels(date, this.scale, this.step);
    }
    let format;
    if (isMajor){
      format = this.format.majorLabels[this.scale];
    }else{
      format = this.format.minorLabels[this.scale];

    }

    return (format && format.length > 0) ? dayjs(date).format(format) : '';
    // noinspection FallThroughInSwitchStatementJS
    // switch (this.scale) {
    //   case 'week':
    //     // Don't draw the minor label if this date is the first day of a month AND if it's NOT the start of the week.
    //     // The 'date' variable may actually be the 'next' step when called from TimeAxis' _repaintLabels.
    //     if(date.date() === 1 && date.week() !== 0){
    //         return "";
    //     }
    //   default: // eslint-disable-line no-fallthrough
    //     return (format && format.length > 0) ? dayjs(date).format(format) : '';
    // }
  }


}


  



export default TimeStep;
