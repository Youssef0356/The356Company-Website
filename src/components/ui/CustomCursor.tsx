import { useEffect, useState, useRef, FC } from 'react';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const CustomCursor: FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [visible, setVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  const cursorVariant = useExperienceStore((s) => s.cursorVariant);
  const cursorText = useExperienceStore((s) => s.cursorText);

  useEffect(() => {
    setMounted(true);
    // Suppress custom cursor on touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${e.clientX - 150}px, ${e.clientY - 150}px, 0)`;
      }
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth RAF loop for outer ring
    let animationFrameId: number;
    const render = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(render);
    };
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [visible]);

  if (!mounted || isTouchDevice) return null;

  const isHovered = cursorVariant === 'hover';
  const isDrag = cursorVariant === 'drag-3d';
  const isMarkup = cursorVariant === 'reading-markup';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Ambient Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-[#DCB0FF]/10 blur-[90px] pointer-events-none will-change-transform"
      />

      {/* Center Dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFFFFF] will-change-transform"
      />

      {/* Outer Magnetic Ring */}
      <div
        ref={ringRef}
        className={`absolute top-0 left-0 -ml-5 -mt-5 rounded-full flex items-center justify-center transition-[width,height,margin,border-color,background-color] duration-200 will-change-transform border ${
          isHovered
            ? 'w-16 h-16 -ml-8 -mt-8 border-white bg-white/10 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.4)]'
            : isDrag
            ? 'w-20 h-20 -ml-10 -mt-10 border-[#00E5FF] bg-[#00E5FF]/10 shadow-[0_0_24px_rgba(0,229,255,0.5)]'
            : isMarkup
            ? 'w-12 h-12 -ml-6 -mt-6 border-[#DCB0FF] bg-[#DCB0FF]/15'
            : 'w-10 h-10 border-[#DCB0FF]/40 bg-transparent'
        }`}
      >
        {cursorText && (
          <span className="text-[9px] font-mono font-bold tracking-wider text-white uppercase px-1 text-center select-none animate-pulse">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
