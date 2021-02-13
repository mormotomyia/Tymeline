/**
 * @license GPLv3 
 * @source https://github.com/visjs/vis-timeline/blob/c208182352e0be7d98663a0d1bb64126eba0024c/lib/timeline/TimeStep.js
 * @uses licensed work from VISJS distributed under MIT Licence
 */

import  moment  from "moment";
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
    
    current: moment.Moment;
    left: moment.Moment;
    right: moment.Moment;
    minimumStep: number;
    scale: string;
    step: number;
    options: any;
    switchedYear: boolean = false;
    switchedMonth: boolean = false;
    switchedDay: boolean = false;
    autoScale: boolean;
    format: any;


    constructor(start:Date,end:Date,minimumStep:number){
        this.format = FORMAT; // default formatting
        this.left = moment(start)
        this.right = moment(end)

        this.minimumStep = minimumStep;
        this.autoScale  = true;
        this.scale = 'day';
        this.step = 1;
        this.setMinimumStep(this.minimumStep)
        this.current = moment()
    }

    updateScale(start: moment.Moment, end:moment.Moment, minimumStep:number=this.minimumStep ) {
        this.setMinimumStep(minimumStep)
        this.left = start;
        this.right = end;
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
    
        // Two cases, needed to prevent issues with switching daylight savings
        // (end of March and end of October)
        switch (this.scale) {
          case 'millisecond':  this.current.add(this.step, 'millisecond'); break;
          case 'second':       this.current.add(this.step, 'second'); break;
          case 'minute':       this.current.add(this.step, 'minute'); break;
          case 'hour':
            this.current.add(this.step, 'hour');
    
            if (this.current.month() < 6) {
              this.current.subtract(this.current.hours() % this.step, 'hour');
            } else {
              if (this.current.hours() % this.step !== 0) {
                this.current.add(this.step - this.current.hours() % this.step, 'hour');
              }
            }
            break;
          case 'weekday':      // intentional fall through
          case 'day':          this.current.add(this.step, 'day'); break;
          case 'week':
            if (this.current.weekday() !== 0){ // we had a month break not correlating with a week's start before
              this.current.weekday(0); // switch back to week cycles
              this.current.add(this.step, 'week');
            } else if(this.options.showMajorLabels === false) {
              this.current.add(this.step, 'week'); // the default case
            } else { // first day of the week
              const nextWeek = this.current.clone();
              nextWeek.add(1, 'week');
              if(nextWeek.isSame(this.current, 'month')){ // is the first day of the next week in the same month?
                this.current.add(this.step, 'week'); // the default case
              } else { // inject a step at each first day of the month
                this.current.add(this.step, 'week');
                this.current.date(1);
              }
            }
            break;
          case 'month':        this.current.add(this.step, 'month'); break;
          case 'year':         this.current.add(this.step, 'year'); break;
          default: break;
        }
    
        if (this.step != 1) {
          // round down to the correct major value
          switch (this.scale) {
            case 'millisecond':  if(this.current.milliseconds() > 0 && this.current.milliseconds() < this.step) this.current.milliseconds(0);  break;
            case 'second':       if(this.current.seconds() > 0 && this.current.seconds() < this.step) this.current.seconds(0);  break;
            case 'minute':       if(this.current.minutes() > 0 && this.current.minutes() < this.step) this.current.minutes(0); break;
            case 'hour':         if(this.current.hours() > 0 && this.current.hours() < this.step) this.current.hours(0);  break;
            case 'weekday':      // intentional fall through
            case 'day':          if(this.current.date() < this.step+1) this.current.date(1); break;
            case 'week':         if(this.current.week() < this.step) this.current.week(1); break; // week numbering starts at 1, not 0
            case 'month':        if(this.current.month() < this.step) this.current.month(0);  break;
            case 'year':         break; // nothing to do for year
            default:             break;
          }
        }
    
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
          this.current.weekday(0);
        }
        // IMPORTANT: we have no breaks in this switch! (this is no bug)
        // noinspection FallThroughInSwitchStatementJS
        switch (this.scale) {
          case 'year':
            this.current.year(this.step * Math.floor(this.current.year() / this.step));
            this.current.month(0);
          case 'month':        this.current.date(1);          // eslint-disable-line no-fallthrough
          case 'week':                                        // eslint-disable-line no-fallthrough
          case 'day':                                         // eslint-disable-line no-fallthrough
          case 'weekday':      this.current.hours(0);         // eslint-disable-line no-fallthrough
          case 'hour':         this.current.minutes(0);       // eslint-disable-line no-fallthrough
          case 'minute':       this.current.seconds(0);       // eslint-disable-line no-fallthrough
          case 'second':       this.current.milliseconds(0);  // eslint-disable-line no-fallthrough
          //case 'millisecond': // nothing to do for milliseconds
        }
    
        if (this.step != 1) {
          // round down to the first minor value that is a multiple of the current step size
          let  priorCurrent = this.current.clone();
          switch (this.scale) {        
            case 'millisecond':  this.current.subtract(this.current.milliseconds() % this.step, 'milliseconds');  break;
            case 'second':       this.current.subtract(this.current.seconds() % this.step, 'seconds'); break;
            case 'minute':       this.current.subtract(this.current.minutes() % this.step, 'minutes'); break;
            case 'hour':         this.current.subtract(this.current.hours() % this.step, 'hours'); break;
            case 'weekday':      // intentional fall through
            case 'day':          this.current.subtract((this.current.date() - 1) % this.step, 'day'); break;
            case 'week':         this.current.subtract(this.current.week() % this.step, 'week'); break;
            case 'month':        this.current.subtract(this.current.month() % this.step, 'month');  break;
            case 'year':         this.current.subtract(this.current.year() % this.step, 'year'); break;
            default: break;
          }
        //   if (!priorCurrent.isSame(this.current)) {
        //       this.current = this.moment(DateUtil.snapAwayFromHidden(this.hiddenDates, this.current.valueOf(), -1, true));
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
        if (stepMonth > minimumStep)            {this.scale = 'month';       this.step = 1;}
        // if (stepDay*7 > minimumStep && this.options.showWeekScale)            {this.scale = 'week';        this.step = 1;}
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
    const clone = moment(date);

    if (scale == 'year') {
      const year = clone.year() + Math.round(clone.month() / 12);
      clone.year(Math.round(year / step) * step);
      clone.month(0);
      clone.date(0);
      clone.hours(0);
      clone.minutes(0);
      clone.seconds(0);
      clone.milliseconds(0);
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

      clone.hours(0);
      clone.minutes(0);
      clone.seconds(0);
      clone.milliseconds(0);
    }
    else if (scale == 'week') {
        if (clone.weekday() > 2) { // doing it the momentjs locale aware way
            clone.weekday(0);
            clone.add(1, 'week');
        }
        else {
            clone.weekday(0);
        }

        clone.hours(0);
        clone.minutes(0);
        clone.seconds(0);
        clone.milliseconds(0);
    }
    else if (scale == 'day') {
      //noinspection FallthroughInSwitchStatementJS
      switch (step) {
        case 5:
        case 2:
          clone.hours(Math.round(clone.hours() / 24) * 24); break;
        default:
          clone.hours(Math.round(clone.hours() / 12) * 12); break;
      }
      clone.minutes(0);
      clone.seconds(0);
      clone.milliseconds(0);
    }
    else if (scale == 'weekday') {
      //noinspection FallthroughInSwitchStatementJS
      switch (step) {
        case 5:
        case 2:
          clone.hours(Math.round(clone.hours() / 12) * 12); break;
        default:
          clone.hours(Math.round(clone.hours() / 6) * 6); break;
      }
      clone.minutes(0);
      clone.seconds(0);
      clone.milliseconds(0);
    }
    else if (scale == 'hour') {
      switch (step) {
        case 4:
          clone.minutes(Math.round(clone.minutes() / 60) * 60); break;
        default:
          clone.minutes(Math.round(clone.minutes() / 30) * 30); break;
      }
      clone.seconds(0);
      clone.milliseconds(0);
    } else if (scale == 'minute') {
      //noinspection FallthroughInSwitchStatementJS
      switch (step) {
        case 15:
        case 10:
          clone.minutes(Math.round(clone.minutes() / 5) * 5);
          clone.seconds(0);
          break;
        case 5:
          clone.seconds(Math.round(clone.seconds() / 60) * 60); break;
        default:
          clone.seconds(Math.round(clone.seconds() / 30) * 30); break;
      }
      clone.milliseconds(0);
    }
    else if (scale == 'second') {
      //noinspection FallthroughInSwitchStatementJS
      switch (step) {
        case 15:
        case 10:
          clone.seconds(Math.round(clone.seconds() / 5) * 5);
          clone.milliseconds(0);
          break;
        case 5:
          clone.milliseconds(Math.round(clone.milliseconds() / 1000) * 1000); break;
        default:
          clone.milliseconds(Math.round(clone.milliseconds() / 500) * 500); break;
      }
    }
    else if (scale == 'millisecond') {
      const _step = step > 5 ? step / 2 : 1;
      clone.milliseconds(Math.round(clone.milliseconds() / _step) * _step);
    }

    return clone;
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
        return (date.milliseconds() == 0);
      case 'second':
        return (date.seconds() == 0);
      case 'minute':
        return (date.hours() == 0) && (date.minutes() == 0);
      case 'hour':
        return (date.hours() == 0);
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
}


  



export default TimeStep;
