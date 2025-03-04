import React, { type FC } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import type { UseSourceSelectionFormData } from '../../../../helpers'
import { Checkbox, Divider, ExtendArrow, FadeLoader, FlexRow, NoDataFound, Text, Toggle } from '@odigos/ui-components'

interface ListProps extends UseSourceSelectionFormData {
  isModal?: boolean
  namespacesLoading: boolean
  selectedNamespace: string
  onSelectNamespace: (namespace: string) => void
}

const Container = styled.div<{ $isModal: ListProps['isModal'] }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-height: ${({ $isModal }) => ($isModal ? 'calc(100vh - 510px)' : 'calc(100vh - 310px)')};
  height: fit-content;
  overflow-y: scroll;
`

const Group = styled.div<{ $selected: boolean; $isOpen: boolean }>`
  width: 100%;
  padding-bottom: ${({ $isOpen }) => ($isOpen ? '18px' : '0')};
  border-radius: 16px;
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.majestic_blue + Theme.opacity.hex['024'] : theme.colors.dropdown_bg_2 + Theme.opacity.hex['040']};
`

const NamespaceItem = styled.div<{ $selected: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 0;
  padding: 18px;
  border-radius: 16px;
  cursor: pointer;
  &:hover {
    background-color: ${({ $selected, theme }) =>
      $selected ? theme.colors.majestic_blue + Theme.opacity.hex['040'] : theme.colors.dropdown_bg_2 + Theme.opacity.hex['080']};
    transition: background-color 0.3s;
  }
`

const SourceItem = styled(NamespaceItem)`
  width: calc(100% - 50px);
  margin-left: auto;
  padding: 8px;
`

const RelativeWrapper = styled.div`
  position: relative;
`

const AbsoluteWrapper = styled.div`
  position: absolute;
  top: 6px;
  left: 18px;
`

const SelectionCount = styled(Text)`
  width: 18px;
`

const NoDataFoundWrapper = styled.div`
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  height: 100%;
  max-height: calc(100vh - 360px);
  overflow-y: auto;
`

const List: FC<ListProps> = ({
  isModal = false,

  filterNamespaces,
  filterSources,

  namespacesLoading,
  selectedNamespace,
  onSelectNamespace,

  selectedSources,
  onSelectSource,
  selectedFutureApps,
  onSelectFutureApps,

  onSelectAll,
}) => {
  const theme = Theme.useTheme()
  const namespaces = filterNamespaces()

  if (!namespaces.length) {
    return <NoDataFoundWrapper>{namespacesLoading ? <FadeLoader scale={2} /> : <NoDataFound title='No namespaces found' />}</NoDataFoundWrapper>
  }

  return (
    <Container $isModal={isModal}>
      {namespaces.map(([namespace, sources]) => {
        const sourcesForNamespace = selectedSources[namespace] || []
        const futureAppsForNamespace = selectedFutureApps[namespace] || false
        const isNamespaceLoaded = !!sourcesForNamespace.length
        const isNamespaceSelected = selectedNamespace === namespace

        const onlySelectedSources = sourcesForNamespace.filter(({ selected }) => selected)
        const filteredSources = filterSources(namespace, { cancelSearch: true })

        const isNamespaceAllSourcesSelected = !!onlySelectedSources.length && onlySelectedSources.length === sources.length
        const isNamespacePartiallySourcesSelected = !!onlySelectedSources.length && onlySelectedSources.length !== sources.length
        const hasFilteredSources = !!filteredSources.length

        return (
          <Group
            key={`namespace-${namespace}`}
            data-id={`namespace-${namespace}`}
            $selected={isNamespaceAllSourcesSelected}
            $isOpen={isNamespaceSelected && hasFilteredSources}
          >
            <NamespaceItem $selected={isNamespaceAllSourcesSelected} onClick={() => onSelectNamespace(namespace)}>
              <FlexRow $gap={12}>
                <Checkbox
                  partiallyChecked={isNamespacePartiallySourcesSelected}
                  value={isNamespaceAllSourcesSelected}
                  onChange={(bool) => onSelectAll(bool, namespace)}
                />
                <Text>{namespace}</Text>
              </FlexRow>

              <FlexRow $gap={12}>
                <Toggle
                  title='Include Future Sources'
                  initialValue={futureAppsForNamespace}
                  onChange={(bool) => onSelectFutureApps(bool, namespace)}
                />
                <Divider orientation='vertical' length='12px' margin='0' />
                <SelectionCount size={10} color={theme.text.grey}>
                  {isNamespaceLoaded ? `${onlySelectedSources.length}/${sources.length}` : null}
                </SelectionCount>
                <ExtendArrow extend={isNamespaceSelected} />
              </FlexRow>
            </NamespaceItem>

            {isNamespaceSelected &&
              (hasFilteredSources ? (
                <RelativeWrapper>
                  <AbsoluteWrapper>
                    <Divider orientation='vertical' length={`${filteredSources.length * 36 - 12}px`} />
                  </AbsoluteWrapper>

                  {filteredSources.map((source) => {
                    const isSourceSelected = !!onlySelectedSources.find(({ name }) => name === source.name)

                    return (
                      <SourceItem
                        key={`source-${source.name}`}
                        data-id={`source-${source.name}`}
                        $selected={isSourceSelected}
                        onClick={() => onSelectSource(source)}
                      >
                        <FlexRow $gap={12}>
                          <Checkbox value={isSourceSelected} onChange={() => onSelectSource(source, namespace)} />
                          <Text>{source.name}</Text>
                          <Text opacity={0.8} size={10}>
                            {source.numberOfInstances} running instance{source.numberOfInstances !== 1 && 's'} · {source.kind}
                          </Text>
                        </FlexRow>
                      </SourceItem>
                    )
                  })}
                </RelativeWrapper>
              ) : (
                <NoDataFoundWrapper>
                  {namespacesLoading ? (
                    <FadeLoader scale={1.5} />
                  ) : (
                    <NoDataFound title='No sources available in this namespace' subTitle='Try searching again or select another namespace.' />
                  )}
                </NoDataFoundWrapper>
              ))}
          </Group>
        )
      })}
    </Container>
  )
}

export { List, type ListProps }
