import React, { type FC } from 'react'
import { PiiMasking } from './pii-masking'
import { ACTION_TYPE } from '@odigos/ui-utils'
import { ErrorSampler } from './error-sampler'
import { LatencySampler } from './latency-sampler'
import { AddClusterInfo } from './add-cluster-info'
import { DeleteAttributes } from './delete-attributes'
import { RenameAttributes } from './rename-attributes'
import { ProbabilisticSampler } from './probabilistic-sampler'
import type { ActionFormData, CustomFieldProps } from '../../../@types'

interface CustomFieldsProps extends CustomFieldProps<ActionFormData> {
  actionType?: ACTION_TYPE
}

type ComponentType = FC<CustomFieldProps<ActionFormData>> | null

const componentsMap: Record<ACTION_TYPE, ComponentType> = {
  [ACTION_TYPE.ADD_CLUSTER_INFO]: AddClusterInfo,
  [ACTION_TYPE.DELETE_ATTRIBUTES]: DeleteAttributes,
  [ACTION_TYPE.RENAME_ATTRIBUTES]: RenameAttributes,
  [ACTION_TYPE.PII_MASKING]: PiiMasking,
  [ACTION_TYPE.ERROR_SAMPLER]: ErrorSampler,
  [ACTION_TYPE.PROBABILISTIC_SAMPLER]: ProbabilisticSampler,
  [ACTION_TYPE.LATENCY_SAMPLER]: LatencySampler,
}

const CustomFields: React.FC<CustomFieldsProps> = ({ actionType, value, setValue, formErrors }) => {
  if (!actionType) return null

  const Component = componentsMap[actionType]

  return Component ? <Component value={value} setValue={setValue} formErrors={formErrors} /> : null
}

export { CustomFields, type CustomFieldsProps }
