class FileWriteQueue {
  constructor() {
    this.queues = new Map();
  }

  run(file, operation) {
    const previous = this.queues.get(file) || Promise.resolve();
    const current = previous.catch(() => {}).then(operation);
    this.queues.set(file, current);
    return current.finally(() => {
      if (this.queues.get(file) === current) this.queues.delete(file);
    });
  }
}

module.exports = FileWriteQueue;
