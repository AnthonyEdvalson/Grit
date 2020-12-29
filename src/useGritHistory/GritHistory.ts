import History from "./History";
import moment from 'moment';


class GritHistory {
  history: History<any>;
  constructor(history: History<any>) {
    this.history = history;
  }

  filter(filter: (details: any) => boolean) {
    return new GritHistory(this.history.filter(filter));
  }

  durationByDay(days=14) {
    let today = moment().startOf("day");

    let durations = Array(days).fill(0);
    for (let event of this.history.events) {
      let age = event.age(today);
      durations[age] += event.details.mins;
    }
    return durations;
  }

  durationToday() {
    return this.durationByDay(1)[0];
  }

  currentStreakLength(threshold=0, max=14, start=0) {
    let durations = this.durationByDay(max);

    let c = start;
    while (durations[c] > threshold)
      c++;
    return c;
  }

  continuedStreakLength(threshold=0, max=14) {
    return this.currentStreakLength(threshold, max, 1) - 1;
  }
}

export default GritHistory;
