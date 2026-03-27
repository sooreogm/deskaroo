import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fixedWeeks = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      fixedWeeks={fixedWeeks}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col gap-4 sm:flex-row sm:gap-4',
        month: 'space-y-4',
        month_caption: 'relative flex items-center justify-center pt-1',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday:
          'w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground',
        week: 'mt-2 flex w-full',
        day: cn(
          'h-9 w-9 p-0 text-center text-sm',
          props.mode === 'range'
            ? '[&:has(>.rdp-range_end)]:rounded-r-2xl [&:has(>.rdp-range_start)]:rounded-l-2xl first:[&:has([aria-selected])]:rounded-l-2xl last:[&:has([aria-selected])]:rounded-r-2xl [&:has([aria-selected])]:bg-primary/10'
            : '[&:has([aria-selected])]:rounded-2xl [&:has([aria-selected])]:bg-primary/10',
          '[&:has([aria-selected].rdp-day_button)]:bg-primary/10 focus-within:relative focus-within:z-20'
        ),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
        ),
        range_start: 'rdp-range_start',
        range_end: 'rdp-range_end',
        selected:
          'bg-primary text-primary-foreground shadow-[0_16px_30px_-20px_rgba(245,179,8,0.9)] hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'border border-primary/30 bg-primary/12 text-foreground',
        outside:
          'text-muted-foreground opacity-45 aria-selected:bg-primary/5 aria-selected:text-muted-foreground aria-selected:opacity-60',
        disabled: 'text-muted-foreground opacity-35',
        range_middle:
          'rounded-none bg-primary/10 text-foreground aria-selected:bg-primary/10 aria-selected:text-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation = "left", className, ..._props }) =>
          orientation === "right" ? (
            <ChevronRight className={cn('h-4 w-4', className)} />
          ) : (
            <ChevronLeft className={cn('h-4 w-4', className)} />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
