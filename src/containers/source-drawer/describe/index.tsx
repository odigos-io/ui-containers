import React, { useEffect, useState, type FC } from 'react'
import { type DescribeSource, NOTIFICATION_TYPE, type Source, type WorkloadId } from '@odigos/ui-utils'
import { CenterThis, DATA_CARD_FIELD_TYPES, DataCard, DataCardProps, FadeLoader, FlexColumn, Status } from '@odigos/ui-components'

interface DescribeProps {
  source: Source
  fetchDescribeSource: (req: { variables: WorkloadId }) => Promise<{ data?: { describeSource: DescribeSource } }>
}

const Describe: FC<DescribeProps> = ({ source, fetchDescribeSource }) => {
  const [describe, setDescribe] = useState<DescribeSource | null>(null)

  useEffect(() => {
    if (!source) return

    fetchDescribeSource({
      variables: {
        namespace: source.namespace,
        name: source.name,
        kind: source.kind,
      },
    }).then(({ data }) => {
      setDescribe(data?.describeSource || null)
    })
  }, [fetchDescribeSource, source])

  if (!describe) {
    return (
      <CenterThis>
        <FadeLoader />
      </CenterThis>
    )
  }

  return (
    <FlexColumn $gap={12}>
      {describe.pods.map(({ podName, nodeName, phase, containers }) => {
        const podHasErrors =
          phase.status !== NOTIFICATION_TYPE.SUCCESS ||
          !!containers.find(
            ({ instrumentationInstances }) => !!instrumentationInstances.find(({ healthy }) => healthy.status !== NOTIFICATION_TYPE.SUCCESS)
          )

        return (
          <DataCard
            key={`pod-${podName.value}`}
            title={`Pod: ${podName.value}`}
            withExtend
            action={() => (
              <Status
                status={podHasErrors ? NOTIFICATION_TYPE.ERROR : NOTIFICATION_TYPE.SUCCESS}
                title={podHasErrors ? NOTIFICATION_TYPE.ERROR : NOTIFICATION_TYPE.SUCCESS}
                withIcon
                withBorder
              />
            )}
            data={
              [
                {
                  type: DATA_CARD_FIELD_TYPES.COPY_TEXT,
                  value: `kubectl get pod ${podName.value} -n ${describe?.namespace?.value || source.namespace}`,
                },
                {
                  type: DATA_CARD_FIELD_TYPES.DIVIDER,
                },
                {
                  type: DATA_CARD_FIELD_TYPES.DESCRIBE_ROW,
                  value: JSON.stringify({
                    title: nodeName.name,
                    tooltip: nodeName.explain,
                    value: {
                      text: nodeName.value,
                      status: undefined,
                    },
                  }),
                },
                {
                  type: DATA_CARD_FIELD_TYPES.DIVIDER,
                },
                {
                  type: DATA_CARD_FIELD_TYPES.DESCRIBE_ROW,
                  value: JSON.stringify({
                    title: phase.name,
                    tooltip: phase.explain,
                    value: {
                      text: phase.value,
                      status: phase.status,
                    },
                  }),
                },
                {
                  type: DATA_CARD_FIELD_TYPES.DIVIDER,
                },
                ...containers.map((container) => {
                  return {
                    type: DATA_CARD_FIELD_TYPES.POD_CONTAINER,
                    value: JSON.stringify({
                      containerName: container.containerName.value,
                      actualDevice: {
                        title: container.actualDevices.name,
                        subTitle: container.actualDevices.value,
                        tooltip: container.actualDevices.explain,
                      },
                      processes: container.instrumentationInstances.map((instance) => ({
                        health: instance.healthy.status,
                        message: instance.message?.value || '',
                        identifyingAttributes: instance.identifyingAttributes || [],
                      })),
                    }),
                  } as DataCardProps['data'][0]
                }),
              ] as DataCardProps['data']
            }
          />
        )
      })}
    </FlexColumn>
  )
}

export { Describe, type DescribeProps }
