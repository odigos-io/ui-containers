import React, { type FC } from 'react'
import { ModalBody } from '../../../helpers'
import { type ListProps, List } from './list'
import { Controls, type ControlsProps } from './controls'

interface FastProps extends ControlsProps, ListProps {}

const Fast: FC<FastProps> = ({ isModal, ...props }) => {
  return (
    <ModalBody $isNotModal={!isModal}>
      <Controls {...props} />
      <List {...props} />
    </ModalBody>
  )
}

export { Fast, type FastProps }
