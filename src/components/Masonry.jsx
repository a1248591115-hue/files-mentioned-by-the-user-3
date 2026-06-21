import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

import './Masonry.css';

const MASONRY_QUERIES = ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'];
const MASONRY_COLUMNS = [4, 3, 2, 2];

function useMedia(queries, values, defaultValue) {
  const get = () => values[queries.findIndex((query) => matchMedia(query).matches)] ?? defaultValue;
  const [value, setValue] = useState(get);

  useEffect(() => {
    const handler = () => setValue(get());
    queries.forEach((query) => matchMedia(query).addEventListener('change', handler));
    return () => queries.forEach((query) => matchMedia(query).removeEventListener('change', handler));
  }, [queries]);

  return value;
}

function useMeasure() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return undefined;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, []);

  return [ref, size];
}

async function preloadImages(urls) {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        }),
    ),
  );
}

export default function Masonry({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick,
}) {
  const columns = useMedia(MASONRY_QUERIES, MASONRY_COLUMNS, 1);
  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    setImagesReady(false);
    hasMounted.current = false;
    preloadImages(
      items
        .filter((item) => item.type !== 'video')
        .slice(0, 12)
        .map((item) => item.thumb || item.img),
    ).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo(() => {
    if (!width) return { children: [], height: 0 };

    const gap = 14;
    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;
    const children = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height / 2;
      const y = colHeights[col];

      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });

    return { children, height: Math.max(...colHeights, 0) };
  }, [columns, items, width]);

  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'];
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.children.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: initialPos.x,
            y: initialPos.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' }),
          },
          {
            opacity: 1,
            ...animationProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger,
          },
        );
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration,
          ease,
          overwrite: 'auto',
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (event, item) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (colorShiftOnHover) {
      const overlay = event.currentTarget.querySelector('.color-overlay');
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (event, item) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (colorShiftOnHover) {
      const overlay = event.currentTarget.querySelector('.color-overlay');
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  return (
    <div ref={containerRef} className="masonry-list" style={{ minHeight: `${grid.height}px` }}>
      {grid.children.map((item, index) => (
        <button
          type="button"
          key={item.id}
          data-key={item.id}
          className={`masonry-item-wrapper ${item.type === 'video' ? 'is-video' : ''}`}
          aria-label={item.title ? `查看${item.title}` : '查看作品'}
          onClick={() => onItemClick?.(item)}
          onMouseEnter={(event) => {
            handleMouseEnter(event, item);
            const video = event.currentTarget.querySelector('video');
            if (video) {
              if (!video.src && video.dataset.src) {
                video.src = video.dataset.src;
                video.load();
              }
              video.play().catch(() => {});
            }
          }}
          onMouseLeave={(event) => {
            handleMouseLeave(event, item);
            const video = event.currentTarget.querySelector('video');
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
          }}
        >
          {item.type === 'video' ? (
            <div className="masonry-item-media masonry-item-video">
              <video data-src={item.url || item.img} muted loop playsInline preload="none" />
              <span className="masonry-item-badge">VIDEO</span>
              {item.title && <strong>{item.title}</strong>}
            </div>
          ) : (
            <div className="masonry-item-media masonry-item-img">
              <img
                src={item.thumb || item.img}
                alt={item.title || 'Portfolio work'}
                loading={index < 8 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={index < 4 ? 'high' : 'auto'}
                onError={(event) => {
                  event.currentTarget.closest('.masonry-item-media')?.classList.add('is-broken');
                }}
              />
              <span className="masonry-item-fallback">IMAGE UNAVAILABLE</span>
              {colorShiftOnHover && <div className="color-overlay" />}
              {item.title && <strong>{item.title}</strong>}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
