import React, { Fragment, useMemo, useState } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { TrashIcon } from '@odigos/ui-icons'
import { ENTITY_TYPES, useTransition } from '@odigos/ui-utils'
import { type SelectedState, useSelectedStore } from '../../store'
import { Badge, Button, DeleteWarning, Divider, Text } from '@odigos/ui-components'

interface MultiSourceControlProps {
  totalSourceCount: number
  uninstrumentSources: (payload: SelectedState['selectedSources']) => void
}

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 100%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 24px;
  border-radius: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.dropdown_bg};
`

const MultiSourceControl: React.FC<MultiSourceControlProps> = ({ totalSourceCount, uninstrumentSources }) => {
  const theme = Theme.useTheme()
  const Transition = useTransition({
    container: Container,
    animateIn: Theme.animations.slide.in['center'],
    animateOut: Theme.animations.slide.out['center'],
  })

  const { selectedSources, setSelectedSources } = useSelectedStore()
  const [isWarnModalOpen, setIsWarnModalOpen] = useState(false)

  const totalSelected = useMemo(() => {
    let num = 0

    Object.values(selectedSources).forEach((items) => {
      num += items.length
    })

    return num
  }, [selectedSources])

  const onDeselect = () => {
    setSelectedSources({})
  }

  const onDelete = () => {
    uninstrumentSources(selectedSources)
    setIsWarnModalOpen(false)
    onDeselect()
  }

  return (
    <Fragment>
      <Transition data-id='multi-source-control' enter={!!totalSelected}>
        <Text>Selected sources</Text>
        <Badge label={totalSelected} filled />

        <Divider orientation='vertical' length='16px' />

        <Button variant='tertiary' onClick={onDeselect}>
          <Text family='secondary' decoration='underline'>
            Deselect
          </Text>
        </Button>

        <Button variant='tertiary' onClick={() => setIsWarnModalOpen(true)}>
          <TrashIcon />
          <Text family='secondary' decoration='underline' color={theme.text.error}>
            Uninstrument
          </Text>
        </Button>
      </Transition>

      <DeleteWarning
        isOpen={isWarnModalOpen}
        name={`${totalSelected} sources`}
        type={ENTITY_TYPES.SOURCE}
        isLastItem={totalSelected === totalSourceCount}
        onApprove={onDelete}
        onDeny={() => setIsWarnModalOpen(false)}
      />
    </Fragment>
  )
}

export { MultiSourceControl, type MultiSourceControlProps }
