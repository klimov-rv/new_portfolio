export function useTargetObserver(
  selector: string,
  root: HTMLElement | null,
  onEnter: () => void,
  onLeave: () => void,
) {
  const activeElements = new Set<HTMLElement>();
  let observer: MutationObserver | null = null;

  const addListeners = (el: HTMLElement) => {
    if (activeElements.has(el)) return;
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    activeElements.add(el);
  };

  const removeListeners = (el: HTMLElement) => {
    if (!activeElements.has(el)) return;
    el.removeEventListener('mouseenter', onEnter);
    el.removeEventListener('mouseleave', onLeave);
    activeElements.delete(el);
  };

  const refresh = () => {
    if (!root) return;

    activeElements.forEach(removeListeners);

    root.querySelectorAll<HTMLElement>(selector).forEach(addListeners);
  };

  const init = () => {
    if (!root) return;

    refresh();

    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const el = node as HTMLElement;
              if (el.matches?.(selector)) addListeners(el);
              el.querySelectorAll?.(selector).forEach(addListeners);
            }
          });

          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const el = node as HTMLElement;
              if (el.matches?.(selector)) removeListeners(el);
              el.querySelectorAll?.(selector).forEach(removeListeners);
            }
          });
        } else if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const target = mutation.target as HTMLElement;
          if (target.matches?.(selector)) {
            if (!activeElements.has(target)) addListeners(target);
          } else {
            if (activeElements.has(target)) removeListeners(target);
          }
        }
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });
  };

  const destroy = () => {
    observer?.disconnect();
    activeElements.forEach(removeListeners);
    activeElements.clear();
  };

  return { init, destroy, refresh };
}
