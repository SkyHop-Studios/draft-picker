import React from 'react'
import {cn} from '@/lib/utils'

type ContentPaneProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const ContentPane = (props: ContentPaneProps) =>
  <div {...props} className={cn("bg-gray-200 p-6 rounded-lg", props.className)}/>

export const ContentPaneTitle = (props: ContentPaneProps) =>
  <div {...props} className={cn("flex justify-between items-center text-xl font-bold mb-6", props.className)} />
