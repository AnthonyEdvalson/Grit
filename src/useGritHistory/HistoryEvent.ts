import moment, { Moment } from "moment";

class HistoryEvent<T> {
  details: T;
  time: Moment;

  constructor(time: Moment, details: T) {
    this.details = details;
    console.log(time);
    this.time = time;
  }

  age(now=moment()) {
    let nowDay = moment(now).startOf("day");
    let timeDay = moment(this.time).startOf("day");
    return nowDay.diff(timeDay, "days");
  }

  toObject() {
    return [this.time, this.details];
  }

  static fromObject<T>(o: [string, T]) {
    let time = moment(o[0]);
    let details = o[1]
    return new HistoryEvent<T>(time, details);
  }
}

export default HistoryEvent;
