

/**
 * Represents a buffer that asynchronously loads and stores items of type T
 * automatically from a given function.
 * Items can be enqueued, dequeued, and the buffer can be cleared.
 *
 * @template T - The type of items stored in the buffer.
 */
export default class AwaitedBuffer<T> {
  private storage: T[] = [];
  private promiseLoad: Promise<T> | null = null;
  private current: T | null = null;

  /**
    * Creates a new AwaitedBuffer instance.
    *
    * @param reloadFunction - An asynchronous function that returns an array of items of type T.
    * @param low - The minimum number of items to in the buffer before loading more.
    * @param uniqueVals - Indicates whether duplicate items are allowed in the buffer.
    * @param autoExtendLowMax - The maximum number of items to load at once when the buffer is low.
    * @param clearQueueOnReloadChange - Indicates whether the buffer should be cleared when the reload function is changed.
    * @throws An error if low is less than 1.
    */
  constructor(
    private reloadFunction: () => Promise<T[]>,
    private low: number = 3,
    private uniqueVals = true,
    private autoExtendLowMax = 15, private clearQueueOnReloadChange = true) {
    if (low < 1) throw Error("low must be at least 1");

  }

  public async setReload(reload: () => Promise<T[]>) {
    this.reloadFunction = reload;
    if (this.clearQueueOnReloadChange) {
      if (this.promiseLoad) {
        await this.promiseLoad;
        this.promiseLoad = null;
      }
      this.storage = [];
    }
  }


  // for use with reloading ui without advancing queue
  public getCurrent(): T | null {
    return this.current;
  }

  // public so can manually add items
  public enqueue(item: T): boolean {
    if (this.uniqueVals && this.storage.includes(item)) return false;
    this.storage.push(item);
    return true;
  }



  private async loadMore(): Promise<T> {
    return new Promise((resolve) => {
      this.reloadFunction().then((newData) => {
        if (newData) {
          newData.forEach(item => this.enqueue(item));
          resolve(newData[0]);
        }
        this.promiseLoad = null;
      });
    });
  }

  async dequeue(): Promise<T> {
    if (this.isEmpty()) {
      if (this.promiseLoad) {
        // if there is a fetch in progress, wait for it to finish
        const nextValue = await this.promiseLoad;
        this.promiseLoad = null;
        if (this.low < this.autoExtendLowMax) {
          this.low++;
        }
        return nextValue;
      }
      this.promiseLoad = this.loadMore();
      await this.promiseLoad;
      this.promiseLoad = null;

    } else if (this.shouldLoadMoreData()) {
      // queue is low, load more
      this.promiseLoad = this.loadMore();
    }

    const nextItem: T | undefined = this.storage.shift();
    if (!nextItem) {
      throw Error("No data to load");
    }
    this.current = nextItem;
    return nextItem;
  }


  public async clear() {
    this.current = null;

    if (this.promiseLoad) {
      await this.promiseLoad;
    }

    this.storage.length = 0;
  }


  public shouldLoadMoreData(): boolean {
    return this.storage.length <= this.low && !this.promiseLoad;
  }

  public isEmpty(): boolean {
    return this.storage.length <= 0;
  }

  public count(): number {
    return this.storage.length;
  }
}