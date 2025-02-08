import React, { type FC } from 'react'
import { InputTable } from '@odigos/ui-components'
import type { ActionFormData, CustomFieldProps } from '../../../@types'

type LatencySamplerProps = CustomFieldProps<ActionFormData>

const KEY = 'endpointsFilters'

const LatencySampler: FC<LatencySamplerProps> = ({ value, setValue, formErrors }) => {
  const errorMessage = formErrors[KEY]
  const mappedValue = value[KEY] || []
  const handleChange = (arr: { [key: string]: any }[]) => setValue(KEY, arr)

  return (
    <InputTable
      columns={[
        {
          title: 'Service',
          keyName: 'service_name',
          placeholder: 'Choose service',
          required: true,
          tooltip:
            'Service name: The rule applies to a specific service name. Only traces originating from this service’s root span will be considered.',
        },
        {
          title: 'HTTP route',
          keyName: 'http_route',
          placeholder: 'e.g. /api/v1/users',
          required: true,
          tooltip:
            'HTTP route: The specific HTTP route prefix to match for sampling. Only traces with routes beginning with this prefix will be considered. For instance, configuring /buy will also match /buy/product.',
        },
        {
          title: 'Threshold',
          keyName: 'minimum_latency_threshold',
          placeholder: 'e.g. 1000',
          required: true,
          type: 'number',
          tooltip:
            'Minimum latency threshold (ms): Specifies the minimum latency in milliseconds; traces with latency below this threshold are ignored.',
        },
        {
          title: 'Fallback',
          keyName: 'fallback_sampling_ratio',
          placeholder: 'e.g. 20',
          required: true,
          type: 'number',
          tooltip:
            'Fallback sampling ratio: Specifies the percentage of traces that meet the service/http_route filter but fall below the threshold that you still want to retain. For example, if a rule is set for service A and http_route B with a minimum latency threshold of 1 second, you might still want to keep some traces below this threshold. Setting the ratio to 20% ensures that 20% of these traces will be retained.',
        },
      ]}
      value={mappedValue}
      onChange={handleChange}
      errorMessage={errorMessage}
    />
  )
}

export { LatencySampler, type LatencySamplerProps }
