import { cn } from '@/lib/utils';
import DecathlonLogo from '@/assets/Decathlon.png';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-4 border-decathlon-gray-light" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-decathlon-blue animate-spin" />
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Chargement en cours...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <Spinner size="xl" />
      <p className="mt-4 text-lg font-medium text-decathlon-dark animate-pulse">{message}</p>
    </div>
  );
}

interface LoadingCardProps {
  message?: string;
  submessage?: string;
}

export function LoadingCard({ message = 'Analyse en cours...', submessage }: LoadingCardProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Top White Bar with Decathlon Logo */}
      <div className="bg-white h-20 px-8 shadow-md flex items-center" style={{ flexShrink: 0 }}>
        <div className="container mx-auto flex items-center">
          <img src={DecathlonLogo} alt="Decathlon" style={{ height: '40px', marginLeft: '40px' }} />
        </div>
      </div>

      {/* Main Section with Blue Gradient */}
      <div
        className="flex-1 relative flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #0082c3 0%, #004f7c 50%, #003a5d 100%)",
        }}
      >
        {/* Decorative background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
            }}
          />
          <div
            className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)"
            }}
          />
        </div>

        {/* Loading Content Card */}
        <div 
          className="relative z-10 flex flex-col items-center"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px 64px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Animated Brain Icon */}
          <div 
            className="relative mb-8"
            style={{
              width: '100px',
              height: '100px',
            }}
          >
            {/* Outer spinning ring */}
            <div 
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                border: '4px solid transparent',
                borderTopColor: '#ffeb00',
                borderRightColor: 'rgba(255, 235, 0, 0.3)',
                animationDuration: '1.5s',
              }}
            />
            {/* Inner spinning ring (opposite direction) */}
            <div 
              className="absolute rounded-full"
              style={{
                top: '10px',
                left: '10px',
                right: '10px',
                bottom: '10px',
                border: '3px solid transparent',
                borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                borderLeftColor: 'rgba(255, 255, 255, 0.2)',
                animation: 'spin 2s linear infinite reverse',
              }}
            />
            {/* Center brain emoji */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ fontSize: '40px' }}
            >
              🧠
            </div>
          </div>

          {/* Message */}
          <h2 
            className="text-2xl font-bold text-white mb-3 text-center"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}
          >
            {message}
          </h2>
          
          {submessage && (
            <p 
              className="text-center mb-6"
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '320px',
                lineHeight: '1.6',
              }}
            >
              {submessage}
            </p>
          )}

          {/* Animated dots */}
          <div className="flex gap-2 mt-4">
            <span 
              className="rounded-full animate-bounce"
              style={{ 
                width: '10px', 
                height: '10px', 
                backgroundColor: '#ffeb00',
                animationDelay: '0ms',
                animationDuration: '1s',
              }} 
            />
            <span 
              className="rounded-full animate-bounce"
              style={{ 
                width: '10px', 
                height: '10px', 
                backgroundColor: '#ffeb00',
                animationDelay: '150ms',
                animationDuration: '1s',
              }} 
            />
            <span 
              className="rounded-full animate-bounce"
              style={{ 
                width: '10px', 
                height: '10px', 
                backgroundColor: '#ffeb00',
                animationDelay: '300ms',
                animationDuration: '1s',
              }} 
            />
          </div>
        </div>
      </div>

      {/* Bottom White Bar */}
      <div className="bg-white h-16 px-8 flex items-center justify-center" style={{ flexShrink: 0 }}>
        <span className="text-sm text-gray-500">
          Made by <span className="font-semibold" style={{ color: '#0082c3' }}>Cods</span>
        </span>
      </div>
    </div>
  );
}
