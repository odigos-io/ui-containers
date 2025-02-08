import React, { useState, type FC } from 'react'
import { safeJsonStringify } from '@odigos/ui-utils'
import { CodeIcon, ListIcon } from '@odigos/ui-icons'
import { type DescribeOdigos as DescribeOdigosType } from '../../../@types'
import { DATA_CARD_FIELD_TYPES, DataCard, Segment } from '@odigos/ui-components'

interface DescribeProps {
  describe?: DescribeOdigosType
}

const Describe: FC<DescribeProps> = ({ describe }) => {
  const [isPrettyMode, setIsPrettyMode] = useState(true)

  if (!describe) return null

  // This function is used to restructure the data, so that it reflects the output given by "odigos describe" command in the CLI.
  // This is not really needed, but it's a nice-to-have feature to make the data more readable.
  const restructureForPrettyMode = () => {
    if (!describe) return {}

    const payload: Record<string, any> = {
      [`${describe.odigosVersion.name}@tooltip=${describe.odigosVersion.explain}`]: describe.odigosVersion.value,
      [`${describe.kubernetesVersion.name}@tooltip=${describe.kubernetesVersion.explain}`]: describe.kubernetesVersion.value,
      [`${describe.tier.name}@tooltip=${describe.tier.explain}`]: describe.tier.value,
      [`${describe.installationMethod.name}@tooltip=${describe.installationMethod.explain}`]: describe.installationMethod.value,
      'Number Of Sources': describe.numberOfSources,
      'Number Of Destinations': describe.numberOfDestinations,
    }

    const mapObjects = (obj: any, objectName: string) => {
      if (typeof obj === 'object' && !!obj?.name) {
        let key = obj.name
        let val = obj.value

        if (obj.explain) key += `@tooltip=${obj.explain}`
        if (obj.status) val += `@status=${obj.status}`
        else val += '@status=none'

        if (!payload[objectName]) payload[objectName] = {}
        payload[objectName][key] = val
      }
    }

    Object.values(describe.clusterCollector).forEach((val) => mapObjects(val, 'Cluster Collector'))
    Object.values(describe.nodeCollector).forEach((val) => mapObjects(val, 'Node Collector'))

    return payload
  }

  return (
    <DataCard
      title='Describe Odigos'
      action={
        <Segment
          options={[
            { icon: ListIcon, value: true },
            { icon: CodeIcon, value: false },
          ]}
          selected={isPrettyMode}
          setSelected={setIsPrettyMode}
        />
      }
      data={[
        {
          type: DATA_CARD_FIELD_TYPES.CODE,
          value: JSON.stringify({
            language: 'json',
            code: safeJsonStringify(isPrettyMode ? restructureForPrettyMode() : describe),
            pretty: isPrettyMode,
          }),
          width: 'inherit',
        },
      ]}
    />
  )
}

export { Describe, type DescribeProps }
