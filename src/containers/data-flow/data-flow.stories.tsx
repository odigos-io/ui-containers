import React from 'react'
import { DataFlow, type DataFlowProps } from '.'
import type { StoryFn, StoryObj } from '@storybook/react'
import {
  type Action,
  ACTION_TYPE,
  CONDITION_STATUS,
  type Destination,
  type InstrumentationRule,
  K8S_RESOURCE_KIND,
  PROGRAMMING_LANGUAGES,
  SIGNAL_TYPE,
  type Source,
} from '@odigos/ui-utils'

export default {
  title: 'Containers/DataFlow',
  component: DataFlow,
}

// Create a master template for mapping props to render
const Template: StoryFn<DataFlowProps> = (props) => {
  return <DataFlow {...props} />
}

// Reuse that template for creating different stories
export const Default: StoryObj<DataFlowProps> = Template.bind({})

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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.UNKNOWN,
        type: '',
        reason: '',
        message: 'Waiting to be instrumented...',
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.FALSE,
        type: '',
        reason: '',
        message: 'Odigos instrumentation is not ready',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
        type: 'AppliedInstrumentationDevice',
        reason: 'InstrumentationEnabled',
        message: 'Odigos instrumentation is enabled',
        lastTransitionTime: '2025-02-03T11:35:02Z',
      },
      {
        status: CONDITION_STATUS.TRUE,
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
        instrumented: true,
        instrumentationMessage: '',
        otelDistroName: 'otel-collector',
      },
    ],
    conditions: [
      {
        status: CONDITION_STATUS.TRUE,
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
        status: CONDITION_STATUS.TRUE,
        type: 'DestinationConfigured',
        reason: '',
        message: 'Destination successfully transformed to otelcol configuration',
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
        status: CONDITION_STATUS.TRUE,
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
  heightToRemove: '100px',
  sources,
  sourcesLoading: false,
  sourcesTotalCount: sources.length,
  destinations,
  destinationsLoading: false,
  destinationsTotalCount: destinations.length,
  actions,
  actionsLoading: false,
  actionsTotalCount: actions.length,
  instrumentationRules,
  instrumentationRulesLoading: true,
  instrumentationRulesTotalCount: instrumentationRules.length,
  metrics: {
    sources: [],
    destinations: [],
  },
}
