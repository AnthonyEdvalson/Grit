class Rate {
  base: number;
  inc: number;
  limit: number;

  constructor(base: number, inc: number, limit: number) {
    this.base = base;
    this.inc = inc;
    this.limit = limit;
  }

  eval(x: number) {
    if (this.inc > 0)
      return Math.min(this.base + x * this.inc, this.limit);
    else
      return Math.max(this.base + x * this.inc, this.limit);
  }
}

export default Rate;
