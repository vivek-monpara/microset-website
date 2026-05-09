'use client';

interface MarqueeProps {
  items: string[];
  bgColor?: string;
  textColor?: string;
  speed?: number;
  separator?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Marquee({
  items,
  bgColor = '#F4C430',
  textColor = '#0A1628',
  speed = 25,
  separator = '✦',
  size = 'md',
}: MarqueeProps) {
  const doubled = [...items, ...items, ...items, ...items];

  const sizeStyles = {
    sm: { fontSize: '13px', padding: '8px 0', letterSpacing: '0.12em' },
    md: { fontSize: '15px', padding: '11px 0', letterSpacing: '0.15em' },
    lg: { fontSize: '18px', padding: '14px 0', letterSpacing: '0.18em' },
  };

  return (
    <div className="overflow-hidden w-full" style={{ backgroundColor: bgColor }}>
      <div
        className="flex whitespace-nowrap w-max"
        style={{ animation: `marquee-scroll ${speed}s linear infinite` }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center font-bold uppercase"
            style={{
              color: textColor,
              fontFamily: 'var(--font-heading), sans-serif',
              fontSize: sizeStyles[size].fontSize,
              padding: sizeStyles[size].padding,
              letterSpacing: sizeStyles[size].letterSpacing,
            }}
          >
            <span className="px-5">{item}</span>
            <span style={{ color: textColor, opacity: 0.4, fontSize: '0.7em' }}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
