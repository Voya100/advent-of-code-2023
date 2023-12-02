export class HeapItem<T> {
  constructor(
    public object: T,
    public value: number
  ) {}
}

export class MinHeap<T> {
  items: HeapItem<T>[] = [];

  constructor(private valueFunction: (object: T) => number) {}

  addItem(item: T) {
    this.items.push(new HeapItem(item, this.valueFunction(item)));
    for (let i = Math.floor(this.items.length / 2); i >= 0; i--) {
      this.heapify(i);
    }
  }

  addItems(items: T[]) {
    for (const item of items) {
      this.items.push(new HeapItem(item, this.valueFunction(item)));
    }
    for (let i = Math.floor(this.items.length / 2); i >= 0; i--) {
      this.heapify(i);
    }
  }

  pop() {
    const item = this.items[0];
    this.swap(0, this.items.length - 1);
    this.items.pop();
    this.heapify(0);
    return item.object;
  }

  private heapify(index = 0) {
    const left = 2 * index + 1;
    const right = 2 * (index + 1);
    let smallest = index;
    if (left < this.items.length && this.items[left].value < this.items[smallest].value) {
      smallest = left;
    }
    if (right < this.items.length && this.items[right].value < this.items[smallest].value) {
      smallest = right;
    }
    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapify(smallest);
    }
  }

  private swap(index1: number, index2: number) {
    const value1 = this.items[index1];
    this.items[index1] = this.items[index2];
    this.items[index2] = value1;
  }

  get length() {
    return this.items.length;
  }
}
