import React, { type FC } from 'react'
import { PlusIcon } from '@odigos/ui-icons'
import { useModalStore } from '../../store'
import Theme, { styled } from '@odigos/ui-theme'
import { ConfiguredList } from './configured-list'
import { DestinationModal } from '../destination-modal'
import type { DestinationFormData } from '../../@types'
import type { TestConnectionProps } from '../destination-form/test-connection'
import { Button, CenterThis, FadeLoader, NotificationNote, SectionTitle, Text } from '@odigos/ui-components'
import { type DestinationCategories, type DestinationOption, ENTITY_TYPES, NOTIFICATION_TYPE } from '@odigos/ui-utils'

interface DestinationSelectionFormProps {
  categories: DestinationCategories
  potentialDestinations: DestinationOption[]
  createDestination: (destination: DestinationFormData) => Promise<void>
  isLoading: boolean
  testConnection: TestConnectionProps['testConnection']
  testLoading: TestConnectionProps['testLoading']
  testResult: TestConnectionProps['testResult']
  isSourcesListEmpty: boolean
  goToSources: () => void
}

const ContentWrapper = styled.div`
  width: 640px;
  padding-top: 64px;
`

const NotificationNoteWrapper = styled.div`
  margin-top: 24px;
`

const AddDestinationButtonWrapper = styled.div`
  width: 100%;
  margin-top: 24px;
`

const StyledAddDestinationButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
`

const DestinationSelectionForm: FC<DestinationSelectionFormProps> = ({
  categories,
  potentialDestinations,
  createDestination,
  isLoading,
  testConnection,
  testLoading,
  testResult,
  isSourcesListEmpty,
  goToSources,
}) => {
  const theme = Theme.useTheme()

  const { setCurrentModal } = useModalStore()
  const onOpen = () => setCurrentModal(ENTITY_TYPES.DESTINATION)

  return (
    <ContentWrapper>
      <SectionTitle
        title='Configure destinations'
        description='Select destinations where telemetry data will be sent and configure their settings.'
      />

      {!isLoading && isSourcesListEmpty && (
        <NotificationNoteWrapper>
          <NotificationNote
            type={NOTIFICATION_TYPE.WARNING}
            message='No sources selected. Please go back to select sources.'
            action={{
              label: 'Select Sources',
              onClick: goToSources,
            }}
          />
        </NotificationNoteWrapper>
      )}

      <AddDestinationButtonWrapper>
        <StyledAddDestinationButton variant='secondary' disabled={isLoading} onClick={onOpen}>
          <PlusIcon />
          <Text color={theme.colors.secondary} size={14} decoration='underline' family='secondary'>
            ADD DESTINATION
          </Text>
        </StyledAddDestinationButton>

        <DestinationModal
          isOnboarding={true}
          categories={categories}
          potentialDestinations={potentialDestinations}
          createDestination={createDestination}
          testConnection={testConnection}
          testLoading={testLoading}
          testResult={testResult}
        />
      </AddDestinationButtonWrapper>

      {isLoading ? (
        <CenterThis>
          <FadeLoader scale={2} cssOverride={{ marginTop: '3rem' }} />
        </CenterThis>
      ) : (
        <ConfiguredList />
      )}
    </ContentWrapper>
  )
}

export { DestinationSelectionForm, type DestinationSelectionFormProps }
