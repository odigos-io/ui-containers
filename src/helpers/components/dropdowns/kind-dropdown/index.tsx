import React, { type FC, useMemo } from 'react'
import { useEntityStore } from '../../../../store'
import { Dropdown, type DropdownProps } from '@odigos/ui-components'

interface KindDropdownProps {
  title?: string
  value?: DropdownProps['options']
  onSelect: (val: DropdownProps['options'][0]) => void
  onDeselect: (val: DropdownProps['options'][0]) => void
  isMulti?: boolean
  required?: boolean
  showSearch?: boolean
}

const KindDropdown: FC<KindDropdownProps> = ({ title = 'Kind', value, onSelect, onDeselect, ...props }) => {
  const { sources } = useEntityStore()

  const options = useMemo(() => {
    const payload: DropdownProps['options'] = []

    sources.forEach(({ kind: id }) => {
      if (!payload.find((opt) => opt.id === id)) {
        payload.push({ id, value: id })
      }
    })

    return payload
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

export { KindDropdown, type KindDropdownProps }
