const listeners = new Set<() => void>();

export const BookEvents = {
  subscribe(callback: () => void) {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },
  notify() {
    listeners.forEach(callback => callback());
  }
};
