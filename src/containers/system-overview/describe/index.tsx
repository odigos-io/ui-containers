import React, { useEffect, useState, type FC } from 'react'
import type { DescribeOdigos } from '@odigos/ui-utils'
import { CenterThis, DATA_CARD_FIELD_TYPES, DataCard, FadeLoader } from '@odigos/ui-components'

interface DescribeProps {
  fetchDescribeOdigos: () => Promise<{ data?: { describeOdigos: DescribeOdigos } }>
}

const Describe: FC<DescribeProps> = ({ fetchDescribeOdigos }) => {
  const [describe, setDescribe] = useState<DescribeOdigos | null>(null)

  useEffect(() => {
    fetchDescribeOdigos().then(({ data }) => {
      setDescribe(data?.describeOdigos || null)
    })
  }, [fetchDescribeOdigos])

  if (!describe) {
    return (
      <CenterThis>
        <FadeLoader />
      </CenterThis>
    )
  }

  const mapObjectToCardFields = (obj: DescribeOdigos['odigosVersion']) =>
    !!obj?.name
      ? [
          {
            type: DATA_CARD_FIELD_TYPES.DIVIDER,
          },
          {
            type: DATA_CARD_FIELD_TYPES.DESCRIBE_ROW,
            value: JSON.stringify({
              title: obj.name,
              subTitle: obj.explain,
              value: { text: obj.value, status: obj.status },
            }),
          },
        ]
      : []

  return (
    <>
      <DataCard
        title='General Information'
        withExtend
        data={[
          { title: describe?.odigosVersion?.name, value: describe?.odigosVersion?.value },
          { title: describe?.kubernetesVersion?.name, value: describe?.kubernetesVersion?.value },
          { title: describe?.installationMethod?.name, value: describe?.installationMethod?.value },
          { title: describe?.tier?.name, value: describe?.tier?.value },
          { title: '# of sources', value: describe?.numberOfSources?.toString() },
          { title: '# of destinations', value: describe?.numberOfDestinations?.toString() },
        ]}
      />
      <DataCard
        title='Cluster Collector'
        withExtend
        data={Object.values(describe?.clusterCollector || {})
          .map(mapObjectToCardFields)
          .flat()}
      />
      <DataCard
        title='Node Collector'
        withExtend
        data={Object.values(describe?.nodeCollector || {})
          .map(mapObjectToCardFields)
          .flat()}
      />
    </>
  )
}

export { Describe, type DescribeProps }
