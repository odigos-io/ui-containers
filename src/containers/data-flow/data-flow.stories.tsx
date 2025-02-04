import React, { useEffect } from 'react'
import { type StoryFn, type StoryObj } from '@storybook/react'
import { ACTION_TYPE, K8S_RESOURCE_KIND, PROGRAMMING_LANGUAGES, SIGNAL_TYPE } from '@odigos/ui-utils'
import { Theme } from '@odigos/ui-theme'
import { DataFlow, type DataFlowProps } from '.'
import { type Action, type Destination, type InstrumentationRule, type Source } from '../../@types'

interface Props extends DataFlowProps {
  darkMode: boolean
}

export default {
  title: 'Components/DataFlow',
  component: DataFlow,
}

// Create a master template for mapping props to render
const Template: StoryFn<Props> = ({ darkMode, ...props }) => {
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#000' : '#fff'
  }, [darkMode])

  return (
    <Theme.Provider darkMode={darkMode}>
      <DataFlow {...props} />
    </Theme.Provider>
  )
}

// Reuse that template for creating different stories
export const Default: StoryObj<Props> = Template.bind({})

const sources: Source[] = [
  {
    namespace: 'default',
    name: 'ads',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'ads',
        language: PROGRAMMING_LANGUAGES.PYTHON,
        runtimeVersion: '3.11.9',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '2/2 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:05+02:00',
      },
    ],
  },
  {
    namespace: 'default',
    name: 'analytics',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'analytics',
        language: PROGRAMMING_LANGUAGES.GO,
        runtimeVersion: '1.21.2',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '1/1 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:06+02:00',
      },
    ],
  },
  {
    namespace: 'default',
    name: 'coupon',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'coupon',
        language: PROGRAMMING_LANGUAGES.JAVASCRIPT,
        runtimeVersion: '18.3.0',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '1/1 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:06+02:00',
      },
    ],
  },
  {
    namespace: 'default',
    name: 'frontend',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'frontend',
        language: PROGRAMMING_LANGUAGES.JAVA,
        runtimeVersion: '17.0.12+7',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '1/1 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:06+02:00',
      },
    ],
  },
  {
    namespace: 'default',
    name: 'inventory',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'inventory',
        language: PROGRAMMING_LANGUAGES.JAVA,
        runtimeVersion: '11.0.24+8',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '1/1 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:06+02:00',
      },
    ],
  },
  {
    namespace: 'default',
    name: 'load-generator',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'load-generator',
        language: PROGRAMMING_LANGUAGES.GO,
        runtimeVersion: '1.21.2',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '1/1 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:06+02:00',
      },
    ],
  },
  {
    namespace: 'default',
    name: 'mail',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'mail',
        language: PROGRAMMING_LANGUAGES.JAVASCRIPT,
        runtimeVersion: '22.11.0',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '1/1 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:06+02:00',
      },
    ],
  },
  {
    namespace: 'default',
    name: 'membership',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'membership',
        language: PROGRAMMING_LANGUAGES.GO,
        runtimeVersion: '1.22.1',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '1/1 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:06+02:00',
      },
    ],
  },
  {
    namespace: 'default',
    name: 'pricing',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'pricing',
        language: PROGRAMMING_LANGUAGES.JAVA,
        runtimeVersion: '',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '1/1 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:06+02:00',
      },
    ],
  },
  {
    namespace: 'default',
    name: 'warehouse',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'warehouse',
        language: PROGRAMMING_LANGUAGES.JAVA,
        runtimeVersion: '11.0.24+8',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '1/1 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:06+02:00',
      },
    ],
  },
  {
    namespace: 'kv-mall-infra',
    name: 'cassandra',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'cassandra',
        language: PROGRAMMING_LANGUAGES.JAVA,
        runtimeVersion: '',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '2/2 instances are healthy',
        lastTransitionTime: '2025-02-04T09:34:10+02:00',
      },
    ],
  },
  {
    namespace: 'kv-mall-infra',
    name: 'kafka',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'kafka',
        language: PROGRAMMING_LANGUAGES.JAVA,
        runtimeVersion: '',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '1/1 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:21+02:00',
      },
    ],
  },
  {
    namespace: 'kv-mall-infra',
    name: 'memcached',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'memcached',
        language: PROGRAMMING_LANGUAGES.UNKNOWN,
        runtimeVersion: '',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
    ],
  },
  {
    namespace: 'kv-mall-infra',
    name: 'mysql',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'mysql',
        language: PROGRAMMING_LANGUAGES.MYSQL,
        runtimeVersion: '',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: 'True',
        type: 'HealthyInstrumentationInstances',
        reason: '',
        message: '1/1 instances are healthy',
        lastTransitionTime: '2025-02-03T13:35:19+02:00',
      },
    ],
  },
  {
    namespace: 'kv-mall-infra',
    name: 'postgres',
    kind: K8S_RESOURCE_KIND.DEPLOYMENT,
    selected: true,
    otelServiceName: '',
    containers: [
      {
        containerName: 'postgres',
        language: PROGRAMMING_LANGUAGES.UNKNOWN,
        runtimeVersion: '',
        otherAgent: null,
      },
    ],
    conditions: [
      {
        status: 'True',
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
    ],
  },
]

const destinations: Destination[] = [
  {
    id: 'odigos.io.dest.jaeger-xlxhj',
    name: '',
    fields: '{"JAEGER_TLS_ENABLED":"false","JAEGER_URL":"jaeger.tracing:4317"}',
    exportedSignals: {
      logs: false,
      metrics: false,
      traces: true,
    },
    destinationType: {
      type: 'jaeger',
      imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/jaeger.svg',
      displayName: 'Jaeger',
      supportedSignals: {
        logs: {
          supported: false,
        },
        metrics: {
          supported: false,
        },
        traces: {
          supported: true,
        },
      },
    },
    conditions: [
      {
        type: 'DestinationConfigured',
        status: 'True',
        message: 'Destination successfully transformed to otelcol configuration',
        reason: '',
        lastTransitionTime: '',
      },
    ],
  },
]

const actions: Action[] = [
  {
    id: 'pi-ccnxt',
    type: ACTION_TYPE.PII_MASKING,
    spec: {
      actionName: '',
      notes: '',
      signals: [SIGNAL_TYPE.TRACES],
      piiCategories: ['CREDIT_CARD'],
    },
    conditions: [
      {
        status: 'True',
        type: 'TransformedToProcessor',
        reason: 'ProcessorCreated',
        message: 'The action has been reconciled to a processor resource.',
        lastTransitionTime: '2025-02-03T13:13:04+02:00',
      },
    ],
  },
]

const instrumentationRules: InstrumentationRule[] = []

Default.args = {
  darkMode: true,
  sources: {
    loading: false,
    entities: sources,
    unfilteredCount: sources.length,
  },
  destinations: {
    loading: false,
    entities: destinations,
    unfilteredCount: destinations.length,
  },
  actions: {
    loading: false,
    entities: actions,
    unfilteredCount: actions.length,
  },
  instrumentationRules: {
    loading: true,
    entities: instrumentationRules,
    unfilteredCount: instrumentationRules.length,
  },
  metrics: {
    sources: [],
    destinations: [],
  },
  onNodeClick: () => {},
}
