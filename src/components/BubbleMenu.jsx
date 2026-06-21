import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import './BubbleMenu.css';

export default function BubbleMenu({
  items = [],
  className = '',
  menuBg = 'rgba(239, 230, 255, 0.94)',
  menuContentColor = '#15101d',
  animationEase = 'power3.out',
  animationDuration = 0.56,
  staggerDelay = 0.08,
  ariaLabel = 'Card quick points',
}) {
  const rootRef = useRef(null);
  const bubbleRefs = useRef([]);
  const labelRefs = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    const card = root?.closest('.strength-card');
    const bubbles = bubbleRefs.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!root || !card || !bubbles.length) return undefined;

    gsap.set(bubbles, { scale: 0, y: 24, autoAlpha: 0, transformOrigin: '50% 50%' });
    gsap.set(labels, { y: 14, autoAlpha: 0 });

    const open = () => {
      gsap.killTweensOf([...bubbles, ...labels]);
      bubbles.forEach((bubble, index) => {
        const delay = index * staggerDelay + gsap.utils.random(-0.025, 0.035);
        const timeline = gsap.timeline({ delay });
        timeline.to(bubble, {
          scale: 1,
          y: 0,
          autoAlpha: 1,
          duration: animationDuration,
          ease: animationEase,
        });
        if (labels[index]) {
          timeline.to(
            labels[index],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration * 0.88,
              ease: 'power3.out',
            },
            `-=${animationDuration * 0.74}`,
          );
        }
      });
    };

    const close = () => {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, { y: 12, autoAlpha: 0, duration: 0.18, ease: 'power3.in' });
      gsap.to(bubbles, {
        scale: 0.76,
        y: 18,
        autoAlpha: 0,
        duration: 0.22,
        ease: 'power3.in',
      });
    };

    card.addEventListener('pointerenter', open);
    card.addEventListener('pointerleave', close);
    card.addEventListener('focusin', open);
    card.addEventListener('focusout', close);

    return () => {
      card.removeEventListener('pointerenter', open);
      card.removeEventListener('pointerleave', close);
      card.removeEventListener('focusin', open);
      card.removeEventListener('focusout', close);
    };
  }, [animationDuration, animationEase, staggerDelay]);

  if (!items.length) return null;

  return (
    <div ref={rootRef} className={`bubble-menu-card ${className}`.trim()} aria-label={ariaLabel}>
      <ul className="pill-list">
        {items.map((item, index) => (
          <li className="pill-col" key={`${item.label}-${index}`}>
            <span
              className="pill-link"
              style={{
                '--item-rot': `${item.rotation ?? 0}deg`,
                '--pill-bg': item.hoverStyles?.bgColor || menuBg,
                '--pill-color': item.hoverStyles?.textColor || menuContentColor,
              }}
              ref={(element) => {
                if (element) bubbleRefs.current[index] = element;
              }}
            >
              <span
                className="pill-label"
                ref={(element) => {
                  if (element) labelRefs.current[index] = element;
                }}
              >
                {item.label}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
