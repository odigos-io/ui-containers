import React, { useMemo, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import { ErrorTriangleIcon } from '@odigos/ui-icons'
import { useDrawerStore, useFilterStore, usePendingStore, useSelectedStore } from '../../store'
import {
  CenterThis,
  Checkbox,
  FlexRow,
  IconGroup,
  IconTitleBadge,
  InteractiveTable,
  InteractiveTableProps,
  NoDataFound,
  Status,
  Tooltip,
} from '@odigos/ui-components'
import {
  CONDITION_STATUS,
  ENTITY_TYPES,
  getEntityIcon,
  getEntityLabel,
  getProgrammingLanguageIcon,
  NOTIFICATION_TYPE,
  splitCamelString,
  type Source,
} from '@odigos/ui-utils'

interface SourceTableProps {
  sources: Source[]
}

const SourceTable: FC<SourceTableProps> = ({ sources }) => {
  const theme = Theme.useTheme()
  const filters = useFilterStore()
  const { isThisPending } = usePendingStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()
  const { selectedSources, setSelectedSources } = useSelectedStore()

  const [hasSelected, totalSelectedSources] = useMemo(() => {
    let num = 0

    Object.values(selectedSources).forEach((selectedSources) => {
      num += selectedSources.length
    })

    return [num !== 0, num]
  }, [selectedSources])

  const onSelectAll = (bool: boolean) => {
    if (bool) {
      const payload: Record<string, Source[]> = {}

      sources?.forEach((source) => {
        const id = { namespace: source.namespace, name: source.name, kind: source.kind }
        const isPending = isThisPending({ entityType: ENTITY_TYPES.SOURCE, entityId: id })

        if (!isPending) {
          if (!payload[source.namespace]) {
            payload[source.namespace] = [source]
          } else {
            payload[source.namespace].push(source)
          }
        }
      })

      setSelectedSources(payload)
    } else {
      setSelectedSources({})
    }
  }

  const onSelectOne = (source: Source) => {
    const { namespace, name, kind } = source

    const payload = { ...selectedSources }
    if (!payload[namespace]) payload[namespace] = []

    const foundIndex = payload[namespace].findIndex((x) => x.name === name && x.kind === kind)
    if (foundIndex === -1) {
      payload[namespace].push(source)
    } else {
      payload[namespace].splice(foundIndex, 1)
    }

    setSelectedSources(payload)
  }

  const filtered = useMemo(() => {
    let arr = [...sources]

    if (!!filters.namespaces?.length) arr = arr.filter((source) => !!filters.namespaces?.find((ns) => ns.id === source.namespace))
    if (!!filters.kinds?.length) arr = arr.filter((source) => !!filters.kinds?.find((type) => type.id === source.kind))
    if (!!filters.languages?.length)
      arr = arr.filter((source) => !!filters.languages?.find((language) => !!source.containers?.find((cont) => cont.language === language.id)))

    if (!!filters.onlyErrors) arr = arr.filter((source) => !!source.conditions?.find((cond) => cond.status === CONDITION_STATUS.FALSE))
    if (!!filters.errors?.length)
      arr = arr.filter((source) => !!filters.errors?.find((error) => !!source.conditions?.find((cond) => cond.message === error.id)))

    return arr
  }, [sources, filters.namespaces, filters.kinds, filters.languages, filters.onlyErrors, filters.errors])

  return (
    <>
      <FlexRow $gap={16} style={{ padding: '16px' }}>
        <Checkbox
          partiallyChecked={hasSelected && sources?.length !== totalSelectedSources}
          value={hasSelected && sources?.length === totalSelectedSources}
          onChange={onSelectAll}
          disabled={!sources?.length}
        />
        <IconTitleBadge
          icon={getEntityIcon(ENTITY_TYPES.SOURCE)}
          title='Sources'
          badge={filtered.length !== sources.length ? `${filtered.length}/${sources.length}` : sources.length}
        />
      </FlexRow>

      <InteractiveTable
        columns={[
          { key: 'checkbox-and-icon', title: '' },
          { key: 'name', title: 'Name' },
          { key: 'type', title: 'Kubernetes Type' },
          { key: 'namespace', title: 'Namespace' },
          { key: 'containers', title: 'Containers' },
          { key: 'status', title: 'Status' },
        ]}
        rows={filtered.map((source) => {
          const isPending = isThisPending({
            entityType: ENTITY_TYPES.SOURCE,
            entityId: { namespace: source.namespace, name: source.name, kind: source.kind },
          })

          const isChecked = !!selectedSources[source.namespace]?.find(
            (x) => x.namespace === source.namespace && x.name === source.name && x.kind === source.kind
          )

          const iconSrcs = source.containers?.map(({ language }) => getProgrammingLanguageIcon(language)) || []
          const instrumentedCount = source.containers?.reduce((prev, curr) => (curr.instrumented ? prev + 1 : prev), 0)
          const containerCount = source.containers?.length || 0

          const errors = source.conditions?.filter(({ status }) => status === CONDITION_STATUS.FALSE || status === NOTIFICATION_TYPE.ERROR) || []

          return {
            status: errors.length ? NOTIFICATION_TYPE.ERROR : undefined,
            cells: [
              {
                columnKey: 'checkbox-and-icon',
                component: () => (
                  <FlexRow $gap={16}>
                    <Checkbox disabled={isPending} value={isChecked} onChange={() => onSelectOne(source)} />
                    <IconGroup iconSrcs={iconSrcs} />
                  </FlexRow>
                ),
              },
              { columnKey: 'name', value: getEntityLabel(source, ENTITY_TYPES.SOURCE, { extended: true }) },
              { columnKey: 'type', value: source.kind, textColor: theme.text.info },
              { columnKey: 'namespace', value: source.namespace, textColor: theme.text.info },
              {
                columnKey: 'containers',
                component: () => (
                  <div style={{ lineHeight: 1 }}>
                    <Status status={NOTIFICATION_TYPE.INFO} title={`${instrumentedCount}/${containerCount} instrumented`} withBorder />
                  </div>
                ),
              },
              {
                columnKey: 'status',
                component: () => (
                  <div style={{ lineHeight: 1 }}>
                    {!!errors.length ? (
                      <FlexRow>
                        {errors.map(({ type, reason, message, lastTransitionTime }) => (
                          <Tooltip
                            titleIcon={ErrorTriangleIcon}
                            title={splitCamelString(type)}
                            text={message || splitCamelString(reason)}
                            timestamp={lastTransitionTime}
                          >
                            <Status status={NOTIFICATION_TYPE.ERROR} title={splitCamelString(type)} withBorder withIcon />
                          </Tooltip>
                        ))}
                      </FlexRow>
                    ) : (
                      <Status status={NOTIFICATION_TYPE.SUCCESS} title='success' withBorder withIcon />
                    )}
                  </div>
                ),
              },
            ] as InteractiveTableProps['rows'][0]['cells'],
          }
        })}
        onRowClick={(idx) => {
          setDrawerType(ENTITY_TYPES.SOURCE)
          setDrawerEntityId({ namespace: filtered[idx].namespace, name: filtered[idx].name, kind: filtered[idx].kind })
        }}
      />

      {!filtered.length && (
        <CenterThis style={{ marginTop: '2rem' }}>
          <NoDataFound />
        </CenterThis>
      )}
    </>
  )
}

export { SourceTable, type SourceTableProps }
