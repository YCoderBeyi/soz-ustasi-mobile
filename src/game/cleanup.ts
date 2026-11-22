export function createCleanupRegistry() {
  const timeouts = new Set<ReturnType<typeof setTimeout>>();
  const rafHandles = new Set<number>();

  function safeTimeout(fn: () => void, ms: number): ReturnType<typeof setTimeout> {
    const id = setTimeout(() => {
      timeouts.delete(id);
      fn();
    }, ms);
    timeouts.add(id);
    return id;
  }

  function safeRaf(fn: () => void): void {
    const id = requestAnimationFrame(() => {
      rafHandles.delete(id);
      fn();
    });
    rafHandles.add(id);
  }

  function flushAll() {
    timeouts.forEach(clearTimeout);
    timeouts.clear();
    rafHandles.forEach(cancelAnimationFrame);
    rafHandles.clear();
  }

  return { safeTimeout, safeRaf, flushAll };
}
