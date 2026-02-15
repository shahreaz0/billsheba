"use client"

import type { Row, Table } from "@tanstack/react-table"
import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

export type CardItem = {
  uid: string
  title: string
  description?: string
  avatar?: string
}

type ItemWithRow<TData> = {
  item: CardItem
  row?: Row<TData>
}

type Props<TData> = {
  items?: CardItem[]
  table?: Table<TData>
  mapRow?: (row: Row<TData>) => CardItem
  renderRowActions?: (row: Row<TData>) => React.ReactNode
  renderItemActions?: (item: CardItem) => React.ReactNode
  onItemClick?: (item: CardItem, row?: Row<TData>) => void
  loading?: boolean
}

export function DataTableCardView<TData>({
  items,
  table,
  mapRow,
  renderRowActions,
  renderItemActions,
  onItemClick,
  loading,
}: Props<TData>) {
  const list: ItemWithRow<TData>[] = React.useMemo(() => {
    if (table && mapRow) {
      return table.getFilteredRowModel().rows.map((row) => ({ item: mapRow(row), row }))
    }
    return (items || []).map((it) => ({ item: it }))
  }, [items, table, mapRow])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse space-y-3 rounded-md border bg-white p-4 shadow-sm"
          >
            <div className="h-10 w-10 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ItemGroup>
      {list.map(({ item, row }, index) => (
        <React.Fragment key={item.uid}>
          <Item
            className={
              onItemClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""
            }
            onClick={() => {
              onItemClick?.(item, row)
            }}
          >
            {item.avatar ? (
              <ItemMedia>
                <Avatar className="rounded-md">
                  <AvatarImage src={item.avatar} />
                  <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
                </Avatar>
              </ItemMedia>
            ) : null}

            <ItemContent className="gap-1">
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDescription className="w-40 truncate">
                {item.description}
              </ItemDescription>
            </ItemContent>
            <ItemActions onClick={(e) => e.stopPropagation()}>
              {row && renderRowActions ? (
                renderRowActions(row)
              ) : renderItemActions ? (
                renderItemActions(item)
              ) : (
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg className="h-4 w-4" />
                </Button>
              )}
            </ItemActions>
          </Item>
          {index !== list.length - 1 && <ItemSeparator />}
        </React.Fragment>
      ))}
    </ItemGroup>
  )
}
