import React from 'react';

/**
 * High-precision SVG Barcode component (Code 128 style representation)
 */
export const SvgBarcode: React.FC<{
  value: string;
  height?: number;
  width?: number;
  showText?: boolean;
}> = ({ value, height = 48, width = 240, showText = true }) => {
  // Deterministic bar widths pattern based on string characters
  const generateBars = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    
    const bars: { x: number; w: number }[] = [];
    let currentX = 10;
    // Start guard bars
    bars.push({ x: currentX, w: 2 });
    currentX += 4;
    bars.push({ x: currentX, w: 1 });
    currentX += 3;

    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const pattern = [
        (charCode % 3) + 1,
        ((charCode >> 1) % 2) + 1,
        ((charCode >> 2) % 3) + 1,
        ((charCode >> 3) % 2) + 1,
      ];
      
      pattern.forEach((w, idx) => {
        if (idx % 2 === 0) {
          bars.push({ x: currentX, w });
        }
        currentX += w + 1;
      });
    }

    // Stop guard bars
    bars.push({ x: currentX, w: 2 });
    currentX += 3;
    bars.push({ x: currentX, w: 2 });
    currentX += 4;

    return { bars, totalWidth: currentX + 10 };
  };

  const { bars, totalWidth } = generateBars(value);

  return (
    <div className="flex flex-col items-center justify-center font-mono">
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full max-w-[280px] h-auto text-black"
        style={{ minHeight: height }}
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width={totalWidth} height={height} fill="#FFFFFF" />
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={2}
            width={bar.w}
            height={height - 4}
            fill="#000000"
          />
        ))}
      </svg>
      {showText && (
        <span className="text-[12px] font-bold tracking-widest text-gray-800 mt-1 select-all">
          {value}
        </span>
      )}
    </div>
  );
};

/**
 * Vector SVG QR Code style component
 */
export const SvgQrCode: React.FC<{
  value: string;
  size?: number;
}> = ({ value, size = 96 }) => {
  // Generate a deterministic grid matrix (21x21 QR Version 1 layout)
  const gridSize = 21;
  const grid: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  // Position detection finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          grid[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(gridSize - 7, 0);
  drawFinder(0, gridSize - 7);

  // Timing patterns
  for (let i = 8; i < gridSize - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Fill data cells deterministically
  let seed = 0;
  for (let i = 0; i < value.length; i++) {
    seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Don't overwrite finders or timing patterns
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= gridSize - 8;
      const inBottomLeft = r >= gridSize - 8 && c < 8;
      const inTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        grid[r][c] = (seed % 100) > 48;
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <div
      className="inline-block p-1 bg-white border border-gray-300 rounded shadow-xs"
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <rect width={size} height={size} fill="#ffffff" />
        {grid.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#000000"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
