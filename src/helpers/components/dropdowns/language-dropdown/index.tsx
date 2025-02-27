import React, { type FC, useMemo } from 'react'
import type { Source } from '@odigos/ui-utils'
import { Dropdown, type DropdownProps } from '@odigos/ui-components'

interface LanguageDropdownProps {
  sources: Source[]

  title?: string
  value?: DropdownProps['options']
  onSelect: (val: DropdownProps['options'][0]) => void
  onDeselect: (val: DropdownProps['options'][0]) => void
  isMulti?: boolean
  required?: boolean
  showSearch?: boolean
}

const LanguageDropdown: FC<LanguageDropdownProps> = ({ sources, title = 'Programming Language', value, onSelect, onDeselect, ...props }) => {
  const options = useMemo(() => {
    const payload: DropdownProps['options'] = []

    sources.forEach(({ containers }) => {
      containers?.forEach(({ language }) => {
        if (!payload.find((opt) => opt.id === language)) {
          payload.push({ id: language, value: language })
        }
      })
    })

    return payload.sort((a, b) => a.id?.localeCompare(b.id || '') || 0)
  }, [sources])

  return (
    <Dropdown
      disabled={!options?.length}
      title={title}
      placeholder='All'
      options={options}
      value={value}
      onSelect={onSelect}
      onDeselect={onDeselect}
      {...props}
    />
  )
}

export { LanguageDropdown, type LanguageDropdownProps }
