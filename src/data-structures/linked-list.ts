export class LinkedListItem<T> {
  left?: LinkedListItem<T>;
  right?: LinkedListItem<T>;

  constructor(public value: T) {}

  addRight(item: LinkedListItem<T>) {
    if (item === this) {
      throw new Error("Can't reference self");
    }
    if (this.right) {
      this.right.left = item;
      item.right = this.right;
    }
    this.right = item;
    item.left = this;
  }

  addLeft(item: LinkedListItem<T>) {
    if (item === this) {
      throw new Error("Can't reference self");
    }
    if (this.left) {
      this.left.right = item;
      item.left = this.left;
    }
    this.left = item;
    item.right = this;
  }
}

export class LinkedList<T> {
  start?: LinkedListItem<T>;
  end?: LinkedListItem<T>;

  constructor(items: Iterable<T>) {
    const itemIterator = items[Symbol.iterator]();
    let next = itemIterator.next();
    if (next.done) {
      return;
    }
    this.start = new LinkedListItem(next.value);
    let end = this.start;
    next = itemIterator.next();
    while (!next.done) {
      const nextItem = new LinkedListItem(next.value);
      end.addRight(nextItem);
      end = nextItem;
      next = itemIterator.next();
    }
    this.end = end;
  }

  getIndex(index: number, wrap = false) {
    if (!this.start) {
      return undefined;
    }
    return this.getItemWithOffset(this.start, index, wrap);
  }

  /**
   * Gets item that is offset amoung to its right/left, depending on whether offset is positive or negative.
   * If wrap is true, reaching end/start wraps to start/end
   */
  getItemWithOffset(item: LinkedListItem<T>, offset: number, wrap = false) {
    let value: LinkedListItem<T> | undefined = item;
    const isDirectionRight = offset > 0;
    let distance = Math.abs(offset);
    if (!isDirectionRight) {
      // Since addition is added to right side of node, offset of 1 needs to be added
      // when going to other direction
      distance++;
    }
    for (let i = 0; i < distance; i++) {
      value = isDirectionRight ? value!.right : value!.left;
      if (!value && wrap) {
        if (isDirectionRight) {
          value = this.start;
        } else {
          value = this.end;
        }
      }
    }
    return value;
  }

  getIterator(): Iterator<LinkedListItem<T>> {
    let next = this.start;
    return {
      next() {
        const value = next;
        next = next?.right;
        if (value) {
          return {
            value,
            done: false,
          };
        }
        return {
          value: undefined,
          done: true,
        };
      },
    };
  }

  getValueIterator(): Iterator<T> {
    let nextItem = this.start;
    return {
      next() {
        const item = nextItem;
        nextItem = nextItem?.right;
        if (item) {
          return {
            value: item.value,
            done: false,
          };
        }
        return {
          value: undefined,
          done: true,
        };
      },
    };
  }

  [Symbol.iterator]() {
    return this.getIterator();
  }

  getArray() {
    return [...this];
  }

  getValueArray() {
    return [...this].map((item) => item.value);
  }

  find(isMatch: (value: T) => unknown) {
    for (const item of this) {
      if (isMatch(item.value)) {
        return item;
      }
    }
    return undefined;
  }

  moveItemBy(item: LinkedListItem<T>, offset: number, wrap = false) {
    const targetItem = this.getItemWithOffset(item, offset, wrap)!;
    if (item === targetItem) {
      return;
    }
    this.remove(item);
    this.addRight(targetItem, item);
  }

  addRight(item: LinkedListItem<T>, itemToAdd: LinkedListItem<T>) {
    item.addRight(itemToAdd);
    if (item === this.end) {
      this.end = itemToAdd;
    }
  }

  remove(item: LinkedListItem<T>) {
    if (item === this.start) {
      this.start = item.right;
    }
    if (item === this.end) {
      this.end = item.left;
    }
    if (item.left) {
      item.left.right = item.right;
    }
    if (item.right) {
      item.right.left = item.left;
    }
    item.left = undefined;
    item.right = undefined;
  }
}
