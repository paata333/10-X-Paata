export type ButtonVariant = 'primary' | 'dark' | 'outline'
export type ButtonSize = 'sm' | 'md'

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg border-2 border-neutral-950 font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-lime-300 text-neutral-950 shadow-[3px_3px_0_0_#0a0a0a] hover:-translate-x-px hover:-translate-y-px hover:bg-lime-200 hover:shadow-[4px_4px_0_0_#0a0a0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
  dark: 'bg-neutral-950 text-white shadow-[3px_3px_0_0_#bef264] hover:-translate-x-px hover:-translate-y-px hover:bg-neutral-800 hover:shadow-[4px_4px_0_0_#bef264] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
  outline:
    'bg-white text-neutral-950 shadow-[3px_3px_0_0_#0a0a0a] hover:-translate-x-px hover:-translate-y-px hover:bg-lime-100 hover:shadow-[4px_4px_0_0_#0a0a0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
}

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  fullWidth = false,
): string {
  return [baseClasses, variantClasses[variant], sizeClasses[size], fullWidth ? 'w-full' : '']
    .filter(Boolean)
    .join(' ')
}
