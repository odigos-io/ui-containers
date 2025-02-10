import React, { type FC } from 'react'
import { Fast, type FastProps } from './fast'
import { Simple, type SimpleProps } from './simple'

interface SourceSelectionFormProps extends FastProps, SimpleProps {
  componentType: 'SIMPLE' | 'FAST'
}

const SourceSelectionForm: FC<SourceSelectionFormProps> = ({ componentType, ...props }) => {
  switch (componentType) {
    case 'SIMPLE':
      return <Simple {...props} />

    case 'FAST':
      return <Fast {...props} />

    default:
      return null
  }
}

export { SourceSelectionForm, type SourceSelectionFormProps }
