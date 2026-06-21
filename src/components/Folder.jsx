import { useState } from 'react';
import './Folder.css';

const darkenColor = (hex, percent) => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map((part) => part + part)
      .join('');
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

export default function Folder({ color = '#5227FF', size = 1, items = [], className = '' }) {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) papers.push(null);

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })),
  );

  const folderStyle = {
    '--folder-color': color,
    '--folder-back-color': darkenColor(color, 0.12),
    '--paper-1': darkenColor('#ffffff', 0.1),
    '--paper-2': darkenColor('#ffffff', 0.05),
    '--paper-3': '#ffffff',
  };

  const handleClick = () => {
    setOpen((prev) => {
      const next = !prev;
      if (!next) setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
      return next;
    });
  };

  const handlePaperMouseMove = (event, index) => {
    if (!open) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (event.clientX - centerX) * 0.15;
    const offsetY = (event.clientY - centerY) * 0.15;

    setPaperOffsets((prev) => {
      const next = [...prev];
      next[index] = { x: offsetX, y: offsetY };
      return next;
    });
  };

  const handlePaperMouseLeave = (_, index) => {
    setPaperOffsets((prev) => {
      const next = [...prev];
      next[index] = { x: 0, y: 0 };
      return next;
    });
  };

  return (
    <div className={className} style={{ transform: `scale(${size})` }}>
      <div className={`folder ${open ? 'open' : ''}`} style={folderStyle} onClick={handleClick}>
        <div className="folder__back">
          {papers.map((item, index) => (
            <div
              key={index}
              className={`paper paper-${index + 1}`}
              onMouseMove={(event) => handlePaperMouseMove(event, index)}
              onMouseLeave={(event) => handlePaperMouseLeave(event, index)}
              style={
                open
                  ? {
                      '--magnet-x': `${paperOffsets[index]?.x || 0}px`,
                      '--magnet-y': `${paperOffsets[index]?.y || 0}px`,
                    }
                  : undefined
              }
            >
              {item}
            </div>
          ))}
          <div className="folder__front" />
          <div className="folder__front right" />
        </div>
      </div>
    </div>
  );
}
