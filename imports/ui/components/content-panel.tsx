import React, {PropsWithChildren} from 'react'
import {cn} from '@/lib/utils'

type ContentPanelProps = PropsWithChildren<{
  className?: string
}>

export const ContentPanel = ({ className, ...rest }: ContentPanelProps) =>
  <div className={cn("bg-white border border-gray-200 rounded-lg p-4", className)} {...rest} />
