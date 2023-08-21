


export default class AwaitedBuffer<T> {
  private storage: T[] = [];
  private promiseLoad: Promise<T> | null = null;

  // takes an asynchromous function that returns an array of items type T
  constructor(
    private reload: () => Promise<T[]>,
    private low: number = 3,
    private uniqueVals = true,
    private capacity: number = Infinity) {
    if (low < 1) throw Error("low must be at least 1");
    if (capacity < low) throw Error("capacity must be at least low");
  }

  // public so can manually add items
  enqueue(item: T): boolean {
    if (this.count() === this.capacity) {
      throw Error("Queue is full");
    }
    if (this.uniqueVals && this.storage.includes(item)) return false;
    this.storage.push(item);
    return true;
  }

  // take next item from queue
  async dequeue(): Promise<T> {
    // queue empty
    if (this.count() <= 0) {
      if (this.promiseLoad) { // theres a fetch in progress
        const nextValue = await this.promiseLoad; // wait for it
        this.promiseLoad = null; // clear promise
        return nextValue; // return next value

      }

      // otherwise, fetch new data
      const newData = await this.reload();


      // problem fetching new data (or no new data)
      if (!newData || newData.length === 0) {
        throw Error("No data to load");
      }
      // add new data to queue
      newData.forEach(item => { this.enqueue(item) })

    } else if (this.count() <= this.low && !this.promiseLoad) {
      // queue low, prefetch new data

      //fetch new data it if fetching is not in progress
      this.promiseLoad = new Promise((resolve) => {
        this.reload().then((v) => {
          if (v) {
            v.forEach(item => this.enqueue(item))
            resolve(v[0])
          }

          this.promiseLoad = null; // clear promise
        })
      });
    }

    // take next item from queue
    const v: T | undefined = this.storage.shift();

    if (!v) throw Error("No data to load");

    return v;
  }



  private count(): number {
    return this.storage.length;
  }
}