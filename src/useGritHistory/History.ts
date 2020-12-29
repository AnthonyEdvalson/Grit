import HistoryEvent from "./HistoryEvent";
import moment from 'moment';

class History<T> {
  events: HistoryEvent<T>[];

  constructor(events: HistoryEvent<T>[]) {
    // Sort list so newest items are first
    this.events = events.sort((a, b) => b.time.valueOf() - a.time.valueOf());
  }

  filter(filter: (details: any) => boolean) {
    return new History(this.events.filter(e => filter(e.details)));
  }

  stringify() {
    return JSON.stringify(this.events.map(e => e.toObject()), null, 2);
  }

  record(details: T) {
    let time = moment();
    let newEvents = [new HistoryEvent(time, details), ...this.events.filter(e => e.age() < 14)];
    return new History(newEvents);
  }

  static parse(string: string) {
    let data: [string, any][] = JSON.parse(string);
    let events = data.map(HistoryEvent.fromObject)
    return new History(events);
  }
}

export default History;
