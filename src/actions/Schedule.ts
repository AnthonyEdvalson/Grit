import Rate from './Rate';

class Schedule extends Rate {
  delay: number;

  constructor(base: number, inc: number, limit: number, delay: number=0) {
    super(base, inc, limit);
    this.delay = delay;
  }
}

export default Schedule;
