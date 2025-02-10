import React, { type FC } from 'react'
import { ModalBody } from '../../../helpers'
import { List, type ListProps } from './list'
import { Controls, type ControlsProps } from './controls'

interface SimpleProps extends ControlsProps, ListProps {}

const Simple: FC<SimpleProps> = (props) => {
  return (
    <ModalBody $isNotModal={!props.isModal}>
      <Controls {...props} />
      <List {...props} />
    </ModalBody>
  )
}

export { Simple, type SimpleProps }
