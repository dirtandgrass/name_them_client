import AwaitedBuffer from "./AwaitedBuffer";

describe('AwaitedBuffer', () => {
  let buffer: AwaitedBuffer<number>;

  beforeEach(() => {
    buffer = new AwaitedBuffer<number>(() => Promise.resolve([]));
  });

  describe('enqueue', () => {
    it('should enqueue a unique item', () => {
      const item = 1;
      const result = buffer.enqueue(item);
      expect(result).toBe(true);
      expect(buffer.count()).toBe(1);
    });

    it('should not enqueue a non-unique item', () => {
      const item = 1;
      buffer.enqueue(item);
      const result = buffer.enqueue(item);
      expect(result).toBe(false);
      expect(buffer.count()).toBe(1);
    });
  });

  describe('dequeue', () => {
    it('should dequeue an item from the buffer', async () => {
      const item = 1;
      buffer.enqueue(item);
      const result = await buffer.dequeue();
      expect(result).toBe(item);
      expect(buffer.count()).toBe(0);
    });

    it('should load more data if buffer is empty', async () => {
      const newData = [1, 2, 3];
      buffer.setReload(() => Promise.resolve(newData));
      const result = await buffer.dequeue();
      expect(result).toBe(newData[0]);
      expect(buffer.count()).toBe(newData.length - 1);
    });
  });

  describe('clear', () => {
    it('should clear the buffer', async () => {
      buffer.enqueue(1);
      buffer.enqueue(2);
      buffer.enqueue(3);
      await buffer.clear();
      expect(buffer.count()).toBe(0);
    });
  });

  describe('shouldLoadMoreData', () => {
    it('should return true if buffer is low and no fetch in progress', () => {
      buffer.enqueue(1);
      buffer.enqueue(2);
      buffer.enqueue(3);
      expect(buffer.shouldLoadMoreData()).toBe(true);
    });

    it('should return false if buffer is not low', () => {
      buffer.enqueue(1);
      buffer.enqueue(2);
      buffer.enqueue(3);
      buffer.enqueue(4);
      expect(buffer.shouldLoadMoreData()).toBe(false);
    });


    it('should return false if reload is in progress', async () => {
      buffer.setReload(() => new Promise((resolve) => {
        setTimeout(() => {
          console.log('fetching');
          resolve([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }, 200);
      }));
      buffer.dequeue();
      expect(buffer.shouldLoadMoreData()).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true if buffer is empty', () => {
      expect(buffer.isEmpty()).toBe(true);
    });

    it('should return false if buffer is not empty', () => {
      buffer.enqueue(1);
      expect(buffer.isEmpty()).toBe(false);
    });
  });

  describe('count', () => {
    it('should return the number of items in the buffer', () => {
      buffer.enqueue(1);
      buffer.enqueue(2);
      buffer.enqueue(3);
      expect(buffer.count()).toBe(3);
    });
  });
});