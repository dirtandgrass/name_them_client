


export default class Queue<T> {
  private storage: T[] = [];
  private reload: () => Promise<T[] | undefined>;
  private low: number;
  private isReloading: boolean;

  constructor(reload: () => Promise<T[] | undefined>, low: number = 2, private capacity: number = Infinity) {
    this.reload = reload
    this.low = low;
    this.isReloading = false;
  }

  enqueue(item: T): boolean {
    if (this.count() === this.capacity) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    if (this.storage.includes(item)) return false;
    this.storage.push(item);
    return true;
  }
  async dequeue(): Promise<T | undefined> {
    //TODO : only enqueue if not already enqued

    // queue empty
    if (this.count() <= 0) {

      const newData = await this.reload();
      if (!newData || newData.length === 0) {
        return undefined;
      }
      newData.forEach(item => { this.enqueue(item) })
    } else if (this.count() <= this.low && !this.isReloading) {
      // queue low
      this.isReloading = true;
      this.reload().then((v) => {
        if (v) {
          v.forEach(item => this.enqueue(item))
          this.isReloading = false;
        }
      });
    }

    const v: T | undefined = this.storage.shift();

    return v;
  }

  count(): number {
    return this.storage.length;
  }
}