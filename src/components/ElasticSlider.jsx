import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import './ElasticSlider.css';

const MAX_OVERFLOW = 42;

function decay(value, max) {
  if (max === 0) return 0;

  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);

  return sigmoid * max;
}

export default function ElasticSlider({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  className = '',
  label = 'Volume',
  mutedLabel = '声音关闭',
  activeLabel = '声音开启',
  leftIcon = null,
  rightIcon = null,
  onChange,
}) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [region, setRegion] = useState('middle');
  const sliderRef = useRef(null);
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useMotionValueEvent(clientX, 'change', (latest) => {
    if (!sliderRef.current) return;

    const { left, right } = sliderRef.current.getBoundingClientRect();
    let overflowAmount = 0;

    if (latest < left) {
      setRegion('left');
      overflowAmount = left - latest;
    } else if (latest > right) {
      setRegion('right');
      overflowAmount = latest - right;
    } else {
      setRegion('middle');
    }

    overflow.jump(decay(overflowAmount, MAX_OVERFLOW));
  });

  const commitValue = (nextValue) => {
    const stepped = Math.round(nextValue / step) * step;
    const clamped = Math.min(Math.max(stepped, min), max);
    setCurrentValue(clamped);
    onChange?.(clamped);
  };

  const toggleSound = () => {
    commitValue(currentValue <= min ? 55 : min);
    setIsOpen(true);
  };

  const updateFromPointer = (event) => {
    if (!sliderRef.current) return;

    const { left, width } = sliderRef.current.getBoundingClientRect();
    const nextValue = min + ((event.clientX - left) / width) * (max - min);

    commitValue(nextValue);
    clientX.jump(event.clientX);
  };

  const handlePointerMove = (event) => {
    if (event.buttons > 0) updateFromPointer(event);
  };

  const handlePointerDown = (event) => {
    updateFromPointer(event);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = () => {
    animate(overflow, 0, { type: 'spring', bounce: 0.42, duration: 0.62 });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      commitValue(currentValue - step * 5);
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      commitValue(currentValue + step * 5);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      commitValue(min);
    }

    if (event.key === 'End') {
      event.preventDefault();
      commitValue(max);
    }
  };

  const percentage = max === min ? 0 : ((currentValue - min) / (max - min)) * 100;
  const isMuted = currentValue <= min;

  return (
    <div
      className={`elastic-slider ${className} ${isOpen ? 'is-open' : ''}`.trim()}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        className="elastic-slider__button"
        type="button"
        aria-label={isMuted ? 'Turn video sound on' : 'Turn video sound off'}
        aria-pressed={!isMuted}
        onClick={toggleSound}
      >
        <span className="elastic-slider__button-icon">{isMuted ? leftIcon : rightIcon}</span>
        <span>{isMuted ? mutedLabel : activeLabel}</span>
      </button>

      <div className="elastic-slider__popover" aria-hidden={!isOpen}>
        <motion.div
          className="elastic-slider__panel"
          onHoverStart={() => animate(scale, 1.08, { type: 'spring', stiffness: 220, damping: 20 })}
          onHoverEnd={() => animate(scale, 1, { type: 'spring', stiffness: 220, damping: 22 })}
          onTouchStart={() => animate(scale, 1.08, { type: 'spring', stiffness: 220, damping: 20 })}
          onTouchEnd={() => animate(scale, 1, { type: 'spring', stiffness: 220, damping: 22 })}
          style={{
            opacity: useTransform(scale, [1, 1.08], [0.88, 1]),
            scaleX: useTransform(() => {
              if (!sliderRef.current) return 1;
              const { width } = sliderRef.current.getBoundingClientRect();
              return 1 + overflow.get() / width;
            }),
            scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.9]),
            transformOrigin: useTransform(() => {
              if (!sliderRef.current) return 'center';
              const { left, width } = sliderRef.current.getBoundingClientRect();
              return clientX.get() < left + width / 2 ? 'right' : 'left';
            }),
          }}
        >
          <motion.span
            className="elastic-slider__icon"
            animate={{ scale: region === 'left' ? [1, 1.36, 1] : 1 }}
            transition={{ duration: 0.26 }}
            style={{ x: useTransform(() => (region === 'left' ? -overflow.get() / scale.get() : 0)) }}
          >
            {leftIcon}
          </motion.span>

          <div
            ref={sliderRef}
            className="elastic-slider__root"
            role="slider"
            tabIndex={0}
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={Math.round(currentValue)}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onLostPointerCapture={handlePointerUp}
            onKeyDown={handleKeyDown}
          >
            <span className="elastic-slider__track">
              <span className="elastic-slider__range" style={{ width: `${percentage}%` }} />
            </span>
          </div>

          <motion.span
            className="elastic-slider__icon"
            animate={{ scale: region === 'right' ? [1, 1.36, 1] : 1 }}
            transition={{ duration: 0.26 }}
            style={{ x: useTransform(() => (region === 'right' ? overflow.get() / scale.get() : 0)) }}
          >
            {rightIcon}
          </motion.span>
          <span className="elastic-slider__value">{Math.round(currentValue)}%</span>
        </motion.div>
      </div>
    </div>
  );
}
