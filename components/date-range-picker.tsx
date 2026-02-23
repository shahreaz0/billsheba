"use client"

import { endOfMonth, format, startOfMonth, subMonths } from "date-fns"
import { CalendarIcon } from "lucide-react"
import * as React from "react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  className?: string
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
}: Readonly<DateRangePickerProps>) {
  const [month, setMonth] = React.useState<Date | undefined>(date?.from)

  React.useEffect(() => {
    if (date?.from) {
      setMonth(date.from)
    }
  }, [date?.from])

  // If no month is set (e.g. during SSR), default to current month only on mount
  React.useEffect(() => {
    if (!month) {
      setMonth(new Date())
    }
  }, [month])

  const presets = [
    {
      label: "This Month",
      value: {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      },
    },
    {
      label: "Previous Month",
      value: {
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1)),
      },
    },
  ]

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "w-full justify-start text-left font-normal bg-white h-8",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              <>
                {format(date.from, "LLL dd, y")}
                {date.to && <> - {format(date.to, "LLL dd, y")}</>}
              </>
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col gap-1 p-2 border-b md:border-b-0 md:border-r">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="justify-start font-normal h-8"
                  onClick={() => {
                    onDateChange(preset.value)
                    setMonth(preset.value.from)
                  }}
                >
                  {preset.label}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="justify-start font-normal text-muted-foreground h-8"
                onClick={() => onDateChange(undefined)}
              >
                Clear
              </Button>
            </div>
            <Calendar
              mode="range"
              month={month}
              onMonthChange={setMonth}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={1}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
