"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * Use a ResizeObserver to react to changes in an element's size
 *
 */

export function useResizeObserver(
  elementRef: RefObject<Element>
): ResizeObserverEntry | undefined {
  const [entry, setEntry] = useState<ResizeObserverEntry>();

  const updateEntry = ([entry]: ResizeObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const node = elementRef?.current;

    if (!node) return;

    const observer = new ResizeObserver(updateEntry);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef]);

  return entry;
}
