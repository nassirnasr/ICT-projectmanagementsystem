'use client'

import { cn } from '@/lib/utils'
import React, { 
  useState,
  useRef,
  useEffect,
  ComponentPropsWithoutRef,
  forwardRef,
  ElementRef,
} from 'react'

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, {
            isOpen,
            setIsOpen
          })
        }
        return child
      })}
    </div>
  )
}

interface DropdownMenuTriggerProps extends ComponentPropsWithoutRef<'button'> {
    asChild?: boolean
    isOpen?: boolean
    setIsOpen?: (open: boolean) => void
  }
  
  const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
    ({ className, isOpen, setIsOpen, asChild = false, children, ...props }, ref) => {
      if (asChild) {
        return React.cloneElement(children as React.ReactElement, {
          onClick: () => setIsOpen?.(!isOpen),
          ref
        })
      }
      
      return (
        <button
          ref={ref}
          onClick={() => setIsOpen?.(!isOpen)}
          className={cn('outline-none', className)}
          {...props}
        />
      )
    }
  )
  
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

const DropdownMenuContent = forwardRef<
  ElementRef<'div'>,
  ComponentPropsWithoutRef<'div'> & {
    isOpen?: boolean
  }
>(({ className, isOpen, ...props }, ref) => {
  return isOpen ? (
    <div
      ref={ref}
      className={cn(
        'absolute right-0 z-50 mt-2 min-w-[180px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80',
        className
      )}
      {...props}
    />
  ) : null
})
DropdownMenuContent.displayName = 'DropdownMenuContent'

interface DropdownMenuItemProps extends ComponentPropsWithoutRef<'div'> {
    disabled?: boolean
  }
  
  const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
    ({ className, disabled = false, ...props }, ref) => (
      <div
        ref={ref}
        className={cn(
          'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
          !disabled && 'focus:bg-accent focus:text-accent-foreground',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        aria-disabled={disabled}
        {...props}
      />
    )
  )
DropdownMenuItem.displayName = 'DropdownMenuItem'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
}