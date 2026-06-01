import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export default function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-2 focus-visible:outline-[#CDFF00] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]'

  const variants = {
    primary: 'bg-[#CDFF00] text-[#0D0D0D] hover:bg-[#b8e600]',
    secondary: 'bg-[#0D0D0D] text-white hover:bg-[#333]',
    ghost: 'bg-transparent text-[#0D0D0D] border-2 border-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizes = {
    sm: 'text-sm px-4 py-2.5 rounded-xl min-h-[40px]',
    md: 'text-sm px-5 py-3 rounded-xl min-h-[44px]',
    lg: 'text-base px-7 py-3.5 rounded-2xl min-h-[52px]',
  }

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
