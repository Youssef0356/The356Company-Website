import { FC, ReactNode, CSSProperties } from 'react';

interface GlassCardProps {
  children: ReactNode;
  id?: string;
  className?: string;
  glowColor?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export const GlassCard: FC<GlassCardProps> = ({
  children,
  id,
  className = '',
  glowColor = '#DCB0FF',
  style = {},
  onClick,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      style={{
        ...style,
        ['--card-glow' as string]: glowColor,
      }}
      className={`group relative rounded-3xl p-6 sm:p-8 transition-all duration-500
        bg-[#0E071F]/70 backdrop-blur-2xl
        border border-[rgba(220,176,255,0.15)] hover:border-[rgba(220,176,255,0.35)]
        shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        hover:shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_var(--card-glow,rgba(220,176,255,0.2))]
        hover:-translate-y-1.5
        ${onClick ? 'cursor-pointer' : ''}
        ${className}`}
    >
      {/* Specular corner highlight */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      {/* Internal ambient radial glow */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: glowColor }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
