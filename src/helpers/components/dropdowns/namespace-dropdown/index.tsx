import React, { type FC, useMemo } from 'react'
import { Dropdown, type DropdownProps } from '@odigos/ui-components'

interface NamespaceDropdownProps {
  namespaces: { name: string }[]

  title?: string
  value?: DropdownProps['options']
  onSelect: (val: DropdownProps['options'][0]) => void
  onDeselect: (val: DropdownProps['options'][0]) => void
  isMulti?: boolean
  required?: boolean
  showSearch?: boolean
}

const NamespaceDropdown: FC<NamespaceDropdownProps> = ({ namespaces, title = 'Namespace', value, onSelect, onDeselect, ...props }) => {
  const options = useMemo(() => {
    const payload: DropdownProps['options'] = []

    namespaces?.forEach(({ name }) => {
      if (!payload.find((opt) => opt.id === name)) {
        payload.push({ id: name, value: name })
      }
    })

    return payload
  }, [namespaces])

  return (
    <Dropdown
      disabled={!options?.length}
      title={title}
      placeholder='Select namespace'
      options={options}
      value={value}
      onSelect={onSelect}
      onDeselect={onDeselect}
      {...props}
    />
  )
}

export { NamespaceDropdown, type NamespaceDropdownProps }
