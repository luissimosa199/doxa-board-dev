import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  onIntersect: () => void;
  canFetch: boolean;
  options?: IntersectionObserverInit;
}

const useInfiniteScroll = ({
  onIntersect,
  canFetch,
  options = { threshold: 0.1 },
}: UseInfiniteScrollProps) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && canFetch) {
        onIntersect();
      }
    }, options);

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [onIntersect, canFetch, options]);

  return sentinelRef;
};

export default useInfiniteScroll;
