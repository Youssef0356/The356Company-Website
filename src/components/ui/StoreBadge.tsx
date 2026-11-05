import { FC } from 'react';
import { ExternalLink } from 'lucide-react';

interface StoreBadgeProps {
  platform: 'google-play' | 'itch' | 'github' | 'web';
  url: string;
  label?: string;
  sublabel?: string;
  variant?: 'pill' | 'solid' | 'ghost';
  className?: string;
}

export const StoreBadge: FC<StoreBadgeProps> = ({
  platform,
  url,
  label,
  sublabel,
  variant = 'pill',
  className = '',
}) => {
  const getPlatformDetails = () => {
    switch (platform) {
      case 'google-play':
        return {
          defaultLabel: 'Google Play',
          defaultSublabel: 'GET IT ON',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a2.072 2.072 0 0 1-.22-.963V2.777c0-.353.078-.684.219-.963zM15.207 13.414l2.56 2.56-11.884 6.862 9.324-9.422zM17.767 7.025l-2.56 2.56-9.324-9.422L17.767 7.025zM18.847 11.536l2.977 1.719c.772.446.772 1.173 0 1.619l-2.977 1.719-2.315-2.315 2.315-2.742z" fill="url(#gp-gradient)" />
              <defs>
                <linearGradient id="gp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="50%" stopColor="#DCB0FF" />
                  <stop offset="100%" stopColor="#2C115F" />
                </linearGradient>
              </defs>
            </svg>
          ),
        };
      case 'itch':
        return {
          defaultLabel: 'itch.io',
          defaultSublabel: 'AVAILABLE ON',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.697 3C3.764 3 3 3.791 3 4.757v1.894a4.136 4.136 0 0 0 2.222 3.666 4.137 4.137 0 0 0 4.444 0 4.136 4.136 0 0 0 4.444 0 4.137 4.137 0 0 0 4.444 0A4.136 4.136 0 0 0 21 6.65V4.757C21 3.79 20.236 3 19.303 3H4.697zm1.18 8.654a4.116 4.116 0 0 0 2.923 1.22c1.127 0 2.162-.457 2.92-1.22.758.763 1.793 1.22 2.92 1.22 1.127 0 2.162-.457 2.92-1.22.758.763 1.793 1.22 2.92 1.22 1.09 0 2.096-.43 2.852-1.156L21 20.315C21 21.25 20.25 22 19.333 22H4.667C3.75 22 3 21.25 3 20.315l-1.632-8.683c.756.726 1.762 1.156 2.852 1.156 1.127 0 2.162-.457 2.92-1.22.25-.252.46-.532.637-.834.177.302.387.582.637.834zM8.5 15.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
            </svg>
          ),
        };
      case 'github':
        return {
          defaultLabel: 'GitHub Source',
          defaultSublabel: 'EXPLORE REPO',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          ),
        };
      case 'web':
      default:
        return {
          defaultLabel: 'Live Website',
          defaultSublabel: 'VISIT SHOWCASE',
          icon: <ExternalLink className="w-5 h-5 flex-shrink-0" />,
        };
    }
  };

  const { defaultLabel, defaultSublabel, icon } = getPlatformDetails();

  const variantStyles = {
    pill: 'bg-white/10 hover:bg-white text-white hover:text-[#2C115F] border border-white/20 hover:border-white shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_24px_rgba(220,176,255,0.6)]',
    solid: 'bg-white text-[#2C115F] hover:bg-[#DCB0FF] hover:text-[#2C115F] border border-transparent shadow-[0_10px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_0_28px_rgba(220,176,255,0.7)]',
    ghost: 'bg-transparent text-white/80 hover:text-white border border-white/15 hover:border-white/40 hover:bg-white/5',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 font-sans ${variantStyles[variant]} ${className}`}
    >
      {icon}
      <div className="flex flex-col text-left">
        <span className="text-[9px] uppercase tracking-wider font-semibold opacity-70 leading-none">
          {sublabel || defaultSublabel}
        </span>
        <span className="text-sm font-bold tracking-tight leading-tight">
          {label || defaultLabel}
        </span>
      </div>
    </a>
  );
};
