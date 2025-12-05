import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Progress({ 
  value, 
  max = 100, 
  className, 
  showLabel = false,
  size = 'md' 
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-decathlon-gray">Progression</span>
          <span className="font-medium text-decathlon-blue">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-decathlon-gray-light rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className="h-full bg-gradient-to-r from-decathlon-blue to-decathlon-blue-dark rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
