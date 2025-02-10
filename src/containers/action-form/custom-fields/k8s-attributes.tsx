import React, { useEffect, type FC } from 'react'
import { Checkbox, InputTable } from '@odigos/ui-components'
import type { ActionFormData, CustomFieldProps } from '../../../@types'

type K8sAttributesProps = CustomFieldProps<ActionFormData>

const K8sAttributes: FC<K8sAttributesProps> = ({ value, setValue, formErrors }) => {
  useEffect(() => {
    if (
      !value.collectContainerAttributes &&
      !value.collectWorkloadId &&
      !value.collectClusterId &&
      !value.labelsAttributes?.length &&
      !value.annotationsAttributes?.length
    ) {
      setValue('collectContainerAttributes', true)
      setValue('collectWorkloadId', true)
      setValue('collectClusterId', true)
      setValue('labelsAttributes', [])
      setValue('annotationsAttributes', [])
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Checkbox
        title='Collect Container Attributes'
        value={value['collectContainerAttributes'] || false}
        onChange={(bool) => setValue('collectContainerAttributes', bool)}
        errorMessage={formErrors['collectContainerAttributes']}
      />
      <Checkbox
        title='Collect Workload ID'
        value={value['collectWorkloadId'] || false}
        onChange={(bool) => setValue('collectWorkloadId', bool)}
        errorMessage={formErrors['collectWorkloadId']}
      />
      <Checkbox
        title='Collect Cluster ID'
        value={value['collectClusterId'] || false}
        onChange={(bool) => setValue('collectClusterId', bool)}
        errorMessage={formErrors['collectClusterId']}
      />
      <InputTable
        columns={[
          {
            title: 'Label Key',
            keyName: 'labelKey',
            placeholder: 'app.kubernetes.io/name',
            required: true,
          },
          {
            title: 'Attribute Key',
            keyName: 'attributeKey',
            placeholder: 'app.kubernetes.name',
            required: true,
          },
        ]}
        value={value['labelsAttributes'] || []}
        onChange={(arr) => setValue('labelsAttributes', arr)}
        errorMessage={formErrors['labelsAttributes']}
      />
      <InputTable
        columns={[
          {
            title: 'Annotation Key',
            keyName: 'annotationKey',
            placeholder: 'kubectl.kubernetes.io/restartedAt',
            required: true,
          },
          {
            title: 'Attribute Key',
            keyName: 'attributeKey',
            placeholder: 'kubectl.kubernetes.restartedAt',
            required: true,
          },
        ]}
        value={value['annotationsAttributes'] || []}
        onChange={(arr) => setValue('annotationsAttributes', arr)}
        errorMessage={formErrors['annotationsAttributes']}
      />
    </>
  )
}

export { K8sAttributes, type K8sAttributesProps }
