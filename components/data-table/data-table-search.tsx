"use client"

import type { Table } from "@tanstack/react-table"
import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

type Props<TData> = {
  table: Table<TData>
  searchField: string
  delay?: number
  className?: string
  placeholder?: string
}

export function DataTableSearch<TData>({
  table,
  searchField,
  delay = 300,
  className,
  placeholder,
}: Props<TData>) {
  const [inputValue, setInputValue] = useState(
    (table.getColumn(searchField)?.getFilterValue() as string) ?? "",
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      table.getColumn(searchField)?.setFilterValue(inputValue)
    }, delay)

    return () => clearTimeout(timeout)
  }, [inputValue, searchField, table, delay])

  return (
    <InputGroup className={cn("w-full md:w-[280px] h-8", className)}>
      <InputGroupInput
        placeholder={placeholder || "Search..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  )
}
