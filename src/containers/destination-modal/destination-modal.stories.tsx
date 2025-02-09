import React, { useEffect, useState } from 'react'
import { useModalStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { ENTITY_TYPES, FIELD_TYPES, sleep } from '@odigos/ui-utils'
import { DestinationModal, type DestinationModalProps } from '.'

export default {
  title: 'Containers/DestinationModal',
  component: DestinationModal,
}

export const Default: StoryFn<DestinationModalProps> = (props) => {
  const { setCurrentModal } = useModalStore()

  useEffect(() => {
    setCurrentModal(ENTITY_TYPES.DESTINATION)
  }, [])

  const [testLoading, setTestLoading] = useState(props.testLoading || false)
  const [testResult, setTestResult] = useState(props.testResult || undefined)

  return (
    <DestinationModal
      {...props}
      testLoading={testLoading}
      testResult={testResult}
      testConnection={async () => {
        setTestLoading(true)
        await sleep(1000)
        setTestResult({ succeeded: true })
        setTestLoading(false)
      }}
    />
  )
}

Default.args = {
  isOnboarding: false,
  addConfiguredDestination: () => {},
  createDestination: () => {},

  potentialDestinations: [
    {
      type: 'jaeger',
      testConnectionSupported: true,
      displayName: 'Jaeger',
      imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/jaeger.svg',
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
      fields: [
        {
          name: 'JAEGER_URL',
          displayName: 'Jaeger OTLP gRPC Endpoint',
          componentType: FIELD_TYPES.INPUT,
          componentProperties:
            '{"required":true,"tooltip":"The format is `host:port`, host is required, port is optional and defaults to the default OTLP gRPC port `4317`"}',
          secret: false,
          initialValue: 'jaeger.tracing:4317',
          renderCondition: undefined,
          hideFromReadData: undefined,
          customReadDataLabels: [],
        },
        {
          name: 'JAEGER_TLS_ENABLED',
          displayName: 'Enable TLS',
          componentType: FIELD_TYPES.CHECKBOX,
          componentProperties: '{"required":false,"tooltip":"Secure connection"}',
          secret: false,
          initialValue: 'false',
          renderCondition: undefined,
          hideFromReadData: undefined,
          customReadDataLabels: [
            {
              condition: 'true',
              title: 'TLS',
              value: 'Encrypted',
            },
            {
              condition: 'false',
              title: 'TLS',
              value: 'Unencrypted',
            },
          ],
        },
        {
          name: 'JAEGER_CA_PEM',
          displayName: 'Certificate Authority',
          componentType: FIELD_TYPES.TEXTAREA,
          componentProperties:
            '{"placeholder":"-----BEGIN CERTIFICATE-----","required":false,"tooltip":"When using TLS, provide the CA certificate in PEM format to verify the server. If empty uses system root CA"}',
          secret: false,
          initialValue: '',
          renderCondition: ['JAEGER_TLS_ENABLED', '==', 'true'],
          hideFromReadData: ['true'],
          customReadDataLabels: [],
        },
      ],
    },
  ],
  categories: [
    {
      name: 'managed',
      description: 'Effortless Monitoring with Scalable Performance Management',
      items: [
        {
          type: 'appdynamics',
          testConnectionSupported: false,
          displayName: 'AppDynamics',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/appdynamics.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'APPDYNAMICS_APPLICATION_NAME',
              displayName: 'Application Name',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":false,"tooltip":"Will define a namespace in AppDynamics","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'APPDYNAMICS_ACCOUNT_NAME',
              displayName: 'Account Name',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'APPDYNAMICS_ENDPOINT_URL',
              displayName: 'Endpoint URL',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'APPDYNAMICS_API_KEY',
              displayName: 'API Key',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 's3',
          testConnectionSupported: false,
          displayName: 'AWS S3',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/s3.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'S3_BUCKET',
              displayName: 'Bucket Name',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"tooltip":"The name of the bucket where the data will be stored","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'S3_REGION',
              displayName: 'Bucket Region',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"tooltip":"The AWS region where the bucket is located","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'S3_PARTITION',
              displayName: 'Time granularity of S3 Bucket',
              componentType: FIELD_TYPES.DROPDOWN,
              componentProperties:
                '{"required":true,"tooltip":"Wether a new subdirectory should be created every minute or every hour","values":["minute","hour"]}',
              secret: false,
              initialValue: 'minute',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'S3_MARSHALER',
              displayName: 'Marshaller (Data Format)',
              componentType: FIELD_TYPES.DROPDOWN,
              componentProperties:
                '{"required":true,"tooltip":"The format in which the data will be encoded. It can be either `otlp_json` or `otlp_proto`. Default is `otlp_json`","values":["otlp_json","otlp_proto"]}',
              secret: false,
              initialValue: 'otlp_json',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'axiom',
          testConnectionSupported: false,
          displayName: 'Axiom',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/axiom.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: false,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'AXIOM_DATASET',
              displayName: 'Dataset',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'AXIOM_API_TOKEN',
              displayName: 'Axiom API token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'azureblob',
          testConnectionSupported: false,
          displayName: 'Azure Blob Storage',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/blobstorage.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: false,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'AZURE_BLOB_ACCOUNT_NAME',
              displayName: 'Account Name',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'AZURE_BLOB_CONTAINER_NAME',
              displayName: 'Container Name',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'betterstack',
          testConnectionSupported: false,
          displayName: 'Better Stack',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/betterstack.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: false,
            },
          },
          fields: [
            {
              name: 'BETTERSTACK_TOKEN',
              displayName: 'Better Stack Source Token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'causely',
          testConnectionSupported: false,
          displayName: 'Causely',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/causely.svg',
          supportedSignals: {
            logs: {
              supported: false,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'CAUSELY_URL',
              displayName: 'Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"http://mediator.causely:4317","required":true,"tooltip":"The endpoint URL is the combined `\\u003cprotocol\\u003e://\\u003chostname\\u003e:\\u003cport\\u003e` to access your Causely Mediator service. Protocol should be `http`; using `https` or omitting it will automatically be converted to `http`. Hostname should typically follow the format: `mediator.\\u003cnamespace\\u003e`. Namespace is the k8s namespace where the Causely Mediator service is deployed. Port is optional and defaults to the default OTLP gRPC port `4317`","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'chronosphere',
          testConnectionSupported: false,
          displayName: 'Chronosphere',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/chronosphere.svg',
          supportedSignals: {
            logs: {
              supported: false,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'CHRONOSPHERE_DOMAIN',
              displayName: 'Chronosphere Company Domain',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"Company domain in Chronosphere, can be found in the URL of the Chronosphere UI. For example, if your URL is `https://demo-sandbox.chronosphere.io/`, then your company domain is `demo-sandbox`","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'CHRONOSPHERE_API_TOKEN',
              displayName: 'API Token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"API token generated from your Chronosphere service account in the Chronosphere UI, you should login to your Chronosphere admin account click the `Platform` menu on the left side of the screen, then click `Service Accounts` and create a new service account","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'coralogix',
          testConnectionSupported: false,
          displayName: 'Coralogix',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/coralogix.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'CORALOGIX_PRIVATE_KEY',
              displayName: 'Send-Your-Data API Key',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"The Send-Your-Data API Key is used to authenticate the data sent to Coralogix.","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'CORALOGIX_DOMAIN',
              displayName: 'Domain',
              componentType: FIELD_TYPES.DROPDOWN,
              componentProperties:
                '{"required":true,"tooltip":"The Coralogix domain to which you want to send the data.","values":["coralogix.com","eu2.coralogix.com","coralogix.us","cx498.coralogix.com","coralogix.in","coralogixsg.com"]}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'CORALOGIX_APPLICATION_NAME',
              displayName: 'Application Name',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"tooltip":"The name of the application that sends the data to Coralogix.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'CORALOGIX_SUBSYSTEM_NAME',
              displayName: 'Subsystem Name',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"tooltip":"The name of the subsystem that sends the data to Coralogix.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'dash0',
          testConnectionSupported: false,
          displayName: 'Dash0',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/dash0.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'DASH0_ENDPOINT',
              displayName: 'Dash0 OTLP gRPC Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"The format is `host:port`. Host is required, located in Dash0 UI (OpenTelemetry Collector). Port is optional and defaults to the default OTLP gRPC port `4317`.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'DASH0_TOKEN',
              displayName: 'Dash0 Bearer Token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"tooltip":"Located in Dash0 UI (OpenTelemetry Collector).","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'datadog',
          testConnectionSupported: false,
          displayName: 'Datadog',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/datadog.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'DATADOG_API_KEY',
              displayName: 'API Key',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"tooltip":"The API key for your Datadog account.","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'DATADOG_SITE',
              displayName: 'Site',
              componentType: FIELD_TYPES.DROPDOWN,
              componentProperties:
                '{"required":true,"tooltip":"The datadog site you are using (the url of the datadog site you are using).","values":["us3.datadoghq.com","datadoghq.com","us5.datadoghq.com","datadoghq.eu","ddog-gov.com","ap1.datadoghq.com"]}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'dynatrace',
          testConnectionSupported: true,
          displayName: 'Dynatrace',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/dynatrace.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'DYNATRACE_URL',
              displayName: 'Tenant URL',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"placeholder":"https://{your-environment-id}.live.dynatrace.com","required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'DYNATRACE_API_TOKEN',
              displayName: 'API Access Token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'elasticapm',
          testConnectionSupported: true,
          displayName: 'Elastic APM',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/elasticapm.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'ELASTIC_APM_SERVER_ENDPOINT',
              displayName: 'elastic APM server endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'ELASTIC_APM_SECRET_TOKEN',
              displayName: 'elastic APM server token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'qryn',
          testConnectionSupported: false,
          displayName: 'Gigapipe',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/gigapipe.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'QRYN_API_SECRET',
              displayName: 'API Secret',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"tooltip":"The API Secret for your Gigapipe Account","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'QRYN_API_KEY',
              displayName: 'API Key',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"tooltip":"The API Token for your Gigapipe Account","type":"password"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'QRYN_URL',
              displayName: 'API Url',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"https://your-account.gigapipe.com","required":true,"tooltip":"The API Endpoint for your Gigapipe Account","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'QRYN_RESOURCE_TO_TELEMETRY_CONVERSION',
              displayName: 'Convert container attributes to labels',
              componentType: FIELD_TYPES.CHECKBOX,
              componentProperties: '{"required":false}',
              secret: false,
              initialValue: 'true',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'QRYN_ADD_EXPORTER_NAME',
              displayName: 'Add exporter name to labels',
              componentType: FIELD_TYPES.CHECKBOX,
              componentProperties: '{"required":false}',
              secret: false,
              initialValue: 'true',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'googlecloud',
          testConnectionSupported: false,
          displayName: 'Google Cloud Monitoring',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/gcp.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: false,
            },
            traces: {
              supported: true,
            },
          },
          fields: [],
        },
        {
          type: 'grafanacloudloki',
          testConnectionSupported: false,
          displayName: 'Grafana Cloud Loki',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/grafana.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: false,
            },
            traces: {
              supported: false,
            },
          },
          fields: [
            {
              name: 'GRAFANA_CLOUD_LOKI_ENDPOINT',
              displayName: 'Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"https://logs-prod-{REGION/SHARD}.grafana.net/loki/api/v1/push","required":true,"tooltip":"The endpoint of your Grafana Cloud Loki instance","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'GRAFANA_CLOUD_LOKI_USERNAME',
              displayName: 'Username',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":1234567,"required":true,"tooltip":"You can find the loki username in the \\"Grafana Data Source settings\\" section as \\"User\\" value. The username is a number.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'GRAFANA_CLOUD_LOKI_PASSWORD',
              displayName: 'Password (Api Token)',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"glc_eyJvIj...","required":true,"tooltip":"This field is refered to as \\"password\\" or \\"Grafana.com API Token\\" in the Grafana Cloud UI. You can manage tokens in your \\"Account Settings\\" page under the \\"SECURITY\\" section in the \\"Access Policies\\" page. Make sure your token scope includes `logs:write` scope","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'GRAFANA_CLOUD_LOKI_LABELS',
              displayName: 'Labels',
              componentType: FIELD_TYPES.MULTI_INPUT,
              componentProperties: '{"tooltip":"Use these OpenTelemetry resource attributes as Loki labels for each log record","type":"text"}',
              secret: false,
              initialValue: '["k8s.container.name", "k8s.pod.name", "k8s.namespace.name"]',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'grafanacloudprometheus',
          testConnectionSupported: false,
          displayName: 'Grafana Cloud Prometheus',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/grafana.svg',
          supportedSignals: {
            logs: {
              supported: false,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: false,
            },
          },
          fields: [
            {
              name: 'GRAFANA_CLOUD_PROMETHEUS_RW_ENDPOINT',
              displayName: 'Prometheus Remote Write Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"https://{hostname}.grafana.net/api/prom/push","required":true,"tooltip":"This is the URL of the Prometheus service. From the grafana cloud UI, Prometheus page, make sure you copy the URL from “Remote Write Endpoint” section, and not the first Endpoint which is used for queries","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'GRAFANA_CLOUD_PROMETHEUS_USERNAME',
              displayName: 'Username / Instance ID',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"12345678","required":true,"tooltip":"You can find the Username / Instance ID on the Prometheus page. Value is a number.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'GRAFANA_CLOUD_PROMETHEUS_PASSWORD',
              displayName: 'Password / Api Token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"glc_eyJvIj...","required":true,"tooltip":"This field is refered to as \\"password\\" or \\"Grafana.com API Token\\" in the Grafana Cloud UI. You can manage tokens in your \\"Account Settings\\" page under the \\"SECURITY\\" section in the \\"Access Policies\\" page. Make sure your token scope includes `metrics:write` scope.","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'PROMETHEUS_RESOURCE_ATTRIBUTES_LABELS',
              displayName: 'Resource Attributes Labels',
              componentType: FIELD_TYPES.MULTI_INPUT,
              componentProperties: '{"tooltip":"use these OpenTelemetry resource attributes as prometheus labels for each metric data point"}',
              secret: false,
              initialValue: '["k8s.container.name", "k8s.pod.name", "k8s.namespace.name"]',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'PROMETHEUS_RESOURCE_EXTERNAL_LABELS',
              displayName: 'External Labels',
              componentType: FIELD_TYPES.KEY_VALUE_PAIR,
              componentProperties:
                '{"titleButton":"Add Label","titleKey":"Label Name","titleValue":"Value","tooltip":"map of labels names and values to be attached to each metric data point"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'grafanacloudtempo',
          testConnectionSupported: false,
          displayName: 'Grafana Cloud Tempo',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/grafana.svg',
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
          fields: [
            {
              name: 'GRAFANA_CLOUD_TEMPO_ENDPOINT',
              displayName: 'Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"tempo-us-central1.grafana.net:443","required":true,"tooltip":"This is the URL of the Tempo service, in the form of `host:port`. You can find the endpoint under the \\"Sending data to Tempo\\" section.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'GRAFANA_CLOUD_TEMPO_USERNAME',
              displayName: 'Username',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"You can find the username in the \\"Sending data to Tempo\\" section under the \\"basic_auth\\" yaml field. The username is a number.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'GRAFANA_CLOUD_TEMPO_PASSWORD',
              displayName: 'Password (Api Token)',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"glc_eyJvIj...","required":true,"tooltip":"This field is refered to as \\"password\\" or \\"Grafana.com API Token\\" in the Grafana Cloud UI. You can manage tokens in your \\"Account Settings\\" page under the \\"SECURITY\\" section in the \\"Access Policies\\" page. Make sure your token scope includes `traces:write` scope.","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'groundcover',
          testConnectionSupported: false,
          displayName: 'Groundcover inCloud',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/groundcover.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'GROUNDCOVER_ENDPOINT',
              displayName: 'Groundcover inCloud Site',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"The format is `host:port`. Host is required, also known as your `inCloud_Site`, it is part of the configuration provided to you by Groundcover when setting up inCloud Managed. Port is optional, and defaults to the default OpenTelemetry gRPC port `4317`.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'GROUNDCOVER_API_KEY',
              displayName: 'Groundcover API Key',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'honeycomb',
          testConnectionSupported: false,
          displayName: 'Honeycomb',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/honeycomb.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'HONEYCOMB_API_KEY',
              displayName: 'API Key',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'HONEYCOMB_ENDPOINT',
              displayName: 'Endpoint',
              componentType: FIELD_TYPES.DROPDOWN,
              componentProperties:
                '{"required":true,"tooltip":"Choose one of the endpoints in the dropdown (`api.honeycomb.io` is the US instance, `api.eu1.honeycomb.io` is EU instance)","values":["api.honeycomb.io","api.eu1.honeycomb.io"]}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'hyperdx',
          testConnectionSupported: false,
          displayName: 'HyperDX',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/hyperdx.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'HYPERDX_API_KEY',
              displayName: 'HyperDX API Key',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'kloudmate',
          testConnectionSupported: false,
          displayName: 'KloudMate',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/kloudmate.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'KLOUDMATE_API_KEY',
              displayName: 'KloudMate API Key',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'last9',
          testConnectionSupported: false,
          displayName: 'Last9',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/last9.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'LAST9_OTLP_ENDPOINT',
              displayName: 'Last9 OpenTelemetry Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'LAST9_OTLP_BASIC_AUTH_HEADER',
              displayName: 'Basic Auth Header',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"placeholder":"Basic ...","required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'lightstep',
          testConnectionSupported: false,
          displayName: 'Lightstep',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/lightstep.svg',
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
          fields: [
            {
              name: 'LIGHTSTEP_ACCESS_TOKEN',
              displayName: 'Access Token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'logzio',
          testConnectionSupported: false,
          displayName: 'Logz.io',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/logzio.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'LOGZIO_REGION',
              displayName: 'Region',
              componentType: FIELD_TYPES.DROPDOWN,
              componentProperties:
                '{"required":true,"tooltip":"The region of your Logz.io account","values":["listener.logz.io","listener-au.logz.io","listener-ca.logz.io","listener-eu.logz.io","listener-nl.logz.io","listener-uk.logz.io","listener-wa.logz.io"]}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'LOGZIO_TRACING_TOKEN',
              displayName: 'Tracing token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"tooltip":"The token you obtained from Logz.io","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'LOGZIO_METRICS_TOKEN',
              displayName: 'Metrics token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"tooltip":"The token you obtained from Logz.io","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'LOGZIO_LOGS_TOKEN',
              displayName: 'Logs token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"tooltip":"The token you obtained from Logz.io","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'lumigo',
          testConnectionSupported: false,
          displayName: 'Lumigo',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/lumigo.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'LUMIGO_ENDPOINT',
              displayName: 'Lumigo OTLP HTTP Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: 'https://ga-otlp.lumigo-tracer-edge.golumigo.com',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'LUMIGO_TOKEN',
              displayName: 'Lumigo Authorization Token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'middleware',
          testConnectionSupported: false,
          displayName: 'Middleware',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/middleware.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'MW_TARGET',
              displayName: 'Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'MW_API_KEY',
              displayName: 'API Key',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'newrelic',
          testConnectionSupported: true,
          displayName: 'New Relic',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/newrelic.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'NEWRELIC_API_KEY',
              displayName: 'License Key',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'NEWRELIC_ENDPOINT',
              displayName: 'Endpoint',
              componentType: FIELD_TYPES.DROPDOWN,
              componentProperties: '{"required":true,"values":["https://otlp.nr-data.net","https://otlp.eu01.nr-data.net"]}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'opsverse',
          testConnectionSupported: false,
          displayName: 'OpsVerse',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/opsverse.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'OPSVERSE_USERNAME',
              displayName: 'User',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'OPSVERSE_PASSWORD',
              displayName: 'Password',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'OPSVERSE_LOGS_URL',
              displayName: 'Logs Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'OPSVERSE_METRICS_URL',
              displayName: 'Metrics Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'OPSVERSE_TRACES_URL',
              displayName: 'Traces Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'splunk',
          testConnectionSupported: false,
          displayName: 'Splunk',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/splunk.svg',
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
          fields: [
            {
              name: 'SPLUNK_ACCESS_TOKEN',
              displayName: 'Access Token',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'SPLUNK_REALM',
              displayName: 'Realm',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"The Splunk ream in use. This is the second part of the URL you use to access Splunk/SignalFX. For example, if you access Splunk at `https://app.us1.signalfx.com`, then the realm is `us1`.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'sumologic',
          testConnectionSupported: false,
          displayName: 'Sumo Logic',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/sumologic.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'SUMOLOGIC_COLLECTION_URL',
              displayName: 'Source URL',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'traceloop',
          testConnectionSupported: false,
          displayName: 'Traceloop',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/traceloop.svg',
          supportedSignals: {
            logs: {
              supported: false,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'TRACELOOP_ENDPOINT',
              displayName: 'Traceloop OTLP HTTP Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: 'https://api.traceloop.com',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'TRACELOOP_API_KEY',
              displayName: 'Traceloop API Key',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'uptrace',
          testConnectionSupported: false,
          displayName: 'Uptrace',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/uptrace.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'UPTRACE_DSN',
              displayName: 'Data Source Name (DSN)',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'UPTRACE_ENDPOINT',
              displayName: 'Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":false,"tooltip":"Overwrite Uptrace endpoint when self-hosting","type":"text"}',
              secret: false,
              initialValue: 'https://otlp.uptrace.dev:4317',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
      ],
    },
    {
      name: 'self hosted',
      description: 'Full Control and Customization for Advanced Application Monitoring',
      items: [
        {
          type: 'clickhouse',
          testConnectionSupported: false,
          displayName: 'Clickhouse',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/clickhouse.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'CLICKHOUSE_ENDPOINT',
              displayName: 'Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"http://host:port","required":true,"tooltip":"The ClickHouse endpoint is the URL where the ClickHouse server is listening for incoming connections.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'CLICKHOUSE_USERNAME',
              displayName: 'Username',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":false,"tooltip":"If Clickhouse Authentication is used, provide the username","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'CLICKHOUSE_PASSWORD',
              displayName: 'Password',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":false,"tooltip":"If Clickhouse Authentication is used, provide the password","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'CLICKHOUSE_CREATE_SCHEME',
              displayName: 'Create Scheme',
              componentType: FIELD_TYPES.CHECKBOX,
              componentProperties:
                '{"required":true,"tooltip":"Should the destination create the schema for you? Set to `false` if you manage your own schema, or `true` to have Odigos create the schema for you"}',
              secret: false,
              initialValue: 'true',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'CLICKHOUSE_DATABASE_NAME',
              displayName: 'Database Name',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"The name of the Clickhouse Database where the telemetry data will be stored. The Database will not be created when not exists, so make sure you have created it before","type":"text"}',
              secret: false,
              initialValue: 'otel',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'CLICKHOUSE_TRACES_TABLE',
              displayName: 'Traces Table',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"Name of the ClickHouse Table to use for storing trace spans. This name should be used in span queries","type":"text"}',
              secret: false,
              initialValue: 'otel_traces',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'CLICKHOUSE_METRICS_TABLE',
              displayName: 'Metrics Table',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"Name of the ClickHouse Table to use for storing metrics. This name should be used in metric queries","type":"text"}',
              secret: false,
              initialValue: 'otel_metrics',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'CLICKHOUSE_LOGS_TABLE',
              displayName: 'Logs Table',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"Name of the ClickHouse Table to use for storing logs. This name should be used in log queries","type":"text"}',
              secret: false,
              initialValue: 'otel_logs',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'elasticsearch',
          testConnectionSupported: false,
          displayName: 'Elasticsearch',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/elasticsearch.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: false,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'ELASTICSEARCH_URL',
              displayName: 'Elasticsearch URL',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"http://host:port","required":true,"tooltip":"Elasticsearch endpoint. Port defaults to `9200` if not specified","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'ES_TRACES_INDEX',
              displayName: 'Traces Index',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"tooltip":"The name of the index where traces will be stored","type":"text"}',
              secret: false,
              initialValue: 'trace_index',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'ES_LOGS_INDEX',
              displayName: 'Logs Index',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"tooltip":"The name of the index where logs will be stored.","type":"text"}',
              secret: false,
              initialValue: 'log_index',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'ELASTICSEARCH_BASIC_AUTH_ENABLED',
              displayName: 'Enable HTTP Basic Authentication',
              componentType: FIELD_TYPES.CHECKBOX,
              componentProperties: '{"required":false}',
              secret: false,
              initialValue: 'false',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [
                {
                  condition: 'true',
                  title: 'Basic Auth',
                  value: 'Enabled',
                },
                {
                  condition: 'false',
                  title: 'Basic Auth',
                  value: 'Disabled',
                },
              ],
            },
            {
              name: 'ELASTICSEARCH_USERNAME',
              displayName: 'Username',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":false,"tooltip":"Username used for HTTP Basic Authentication","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: ['ELASTICSEARCH_BASIC_AUTH_ENABLED', '==', 'true'],
              hideFromReadData: ['ELASTICSEARCH_BASIC_AUTH_ENABLED', '==', 'false'],
              customReadDataLabels: [],
            },
            {
              name: 'ELASTICSEARCH_PASSWORD',
              displayName: 'Password',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":false,"tooltip":"Password used for HTTP Basic Authentication","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: ['ELASTICSEARCH_BASIC_AUTH_ENABLED', '==', 'true'],
              hideFromReadData: ['ELASTICSEARCH_BASIC_AUTH_ENABLED', '==', 'false'],
              customReadDataLabels: [],
            },
            {
              name: 'ELASTICSEARCH_TLS_ENABLED',
              displayName: 'Enable TLS',
              componentType: FIELD_TYPES.CHECKBOX,
              componentProperties: '{"required":false,"tooltip":"Secure connection (Transport Layer Security)"}',
              secret: false,
              initialValue: 'false',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [
                {
                  condition: 'true',
                  title: 'TLS',
                  value: 'Encrypted',
                },
                {
                  condition: 'false',
                  title: 'TLS',
                  value: 'Unencrypted',
                },
              ],
            },
            {
              name: 'ELASTICSEARCH_CA_PEM',
              displayName: 'CA Certificate',
              componentType: FIELD_TYPES.TEXTAREA,
              componentProperties:
                '{"placeholder":"-----BEGIN CERTIFICATE-----","required":false,"tooltip":"When using TLS, provide the CA certificate to verify the server. If empty uses system root CA","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: ['ELASTICSEARCH_TLS_ENABLED', '==', 'true'],
              hideFromReadData: ['true'],
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'jaeger',
          testConnectionSupported: true,
          displayName: 'Jaeger',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/jaeger.svg',
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
          fields: [
            {
              name: 'JAEGER_URL',
              displayName: 'Jaeger OTLP gRPC Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"required":true,"tooltip":"The format is `host:port`, host is required, port is optional and defaults to the default OTLP gRPC port `4317`"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'JAEGER_TLS_ENABLED',
              displayName: 'Enable TLS',
              componentType: FIELD_TYPES.CHECKBOX,
              componentProperties: '{"required":false,"tooltip":"Secure connection"}',
              secret: false,
              initialValue: 'false',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [
                {
                  condition: 'true',
                  title: 'TLS',
                  value: 'Encrypted',
                },
                {
                  condition: 'false',
                  title: 'TLS',
                  value: 'Unencrypted',
                },
              ],
            },
            {
              name: 'JAEGER_CA_PEM',
              displayName: 'Certificate Authority',
              componentType: FIELD_TYPES.TEXTAREA,
              componentProperties:
                '{"placeholder":"-----BEGIN CERTIFICATE-----","required":false,"tooltip":"When using TLS, provide the CA certificate in PEM format to verify the server. If empty uses system root CA"}',
              secret: false,
              initialValue: '',
              renderCondition: ['JAEGER_TLS_ENABLED', '==', 'true'],
              hideFromReadData: ['true'],
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'loki',
          testConnectionSupported: false,
          displayName: 'Loki',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/loki.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: false,
            },
            traces: {
              supported: false,
            },
          },
          fields: [
            {
              name: 'LOKI_URL',
              displayName: 'Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"http://\\u003cloki-host\\u003e:\\u003cloki-port\\u003e/loki/api/v1/push","required":true,"tooltip":"If scheme is not provided, it defaults to `http`. If port is not provided, it defaults to `3100`. If path is not provided, it defaults to `/loki/api/v1/push`.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'LOKI_LABELS',
              displayName: 'Labels',
              componentType: FIELD_TYPES.MULTI_INPUT,
              componentProperties:
                '{"required":true,"tooltip":"use these OpenTelemetry resource attributes as loki labels for each log record","type":"text"}',
              secret: false,
              initialValue: '["k8s.container.name", "k8s.pod.name", "k8s.namespace.name"]',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'otlp',
          testConnectionSupported: false,
          displayName: 'OTLP gRPC',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/opentelemetry.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'OTLP_GRPC_ENDPOINT',
              displayName: 'OTLP gRPC Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"host:port","required":true,"tooltip":"The format is `host:port`, host is required, port is optional and defaults to the default OTLP gRPC port `4317`.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'otlphttp',
          testConnectionSupported: false,
          displayName: 'OTLP http',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/opentelemetry.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'OTLP_HTTP_ENDPOINT',
              displayName: 'OTLP http Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"http://host:port","required":true,"tooltip":"The format is `host:port`, host is required, port is optional and defaults to the default OTLP gRPC port `4317`.","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'OTLP_HTTP_BASIC_AUTH_USERNAME',
              displayName: 'Basic Auth Username',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"username","required":false,"tooltip":"in case the otlp receiver requires basic auth, this is the username","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'OTLP_HTTP_BASIC_AUTH_PASSWORD',
              displayName: 'Basic Auth Password',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"password","required":false,"tooltip":"in case the otlp receiver requires basic auth, this is the password","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'prometheus',
          testConnectionSupported: false,
          displayName: 'Prometheus',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/prometheus.svg',
          supportedSignals: {
            logs: {
              supported: false,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: false,
            },
          },
          fields: [
            {
              name: 'PROMETHEUS_REMOTEWRITE_URL',
              displayName: 'Remote Write URL',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'qryn-oss',
          testConnectionSupported: false,
          displayName: 'qryn',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/qryn.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'QRYN_OSS_URL',
              displayName: 'API Url',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"http://qryn.local:3100","required":true,"tooltip":"The API Endpoint for for your qryn instance","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'QRYN_OSS_PASSWORD',
              displayName: 'Basic auth password',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"tooltip":"The HTTP Basic Auth password for your qryn instance","type":"password"}',
              secret: true,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'QRYN_OSS_USERNAME',
              displayName: 'Basic auth username',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"tooltip":"The HTTP Basic Auth username for your qryn instance","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'QRYN_OSS_RESOURCE_TO_TELEMETRY_CONVERSION',
              displayName: 'Convert container attributes to labels',
              componentType: FIELD_TYPES.CHECKBOX,
              componentProperties: '{"required":false}',
              secret: false,
              initialValue: 'Yes',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
            {
              name: 'QRYN_OSS_ADD_EXPORTER_NAME',
              displayName: 'Add exporter name to labels',
              componentType: FIELD_TYPES.CHECKBOX,
              componentProperties: '{"required":false}',
              secret: false,
              initialValue: 'Yes',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'quickwit',
          testConnectionSupported: false,
          displayName: 'Quickwit',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/quickwit.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: false,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'QUICKWIT_URL',
              displayName: 'Quickwit OTLP gRPC Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties:
                '{"placeholder":"quickwit.example.com:7281","required":true,"tooltip":"The unencrypted gRPC endpoint of the Quickwit OTLP receiver (indexer component). The default Quickwit gRPC port if not changed is `7281`","type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'signoz',
          testConnectionSupported: false,
          displayName: 'SigNoz',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/signoz.svg',
          supportedSignals: {
            logs: {
              supported: true,
            },
            metrics: {
              supported: true,
            },
            traces: {
              supported: true,
            },
          },
          fields: [
            {
              name: 'SIGNOZ_URL',
              displayName: 'Collector Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
        {
          type: 'tempo',
          testConnectionSupported: false,
          displayName: 'Tempo',
          imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/tempo.svg',
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
          fields: [
            {
              name: 'TEMPO_URL',
              displayName: 'Endpoint',
              componentType: FIELD_TYPES.INPUT,
              componentProperties: '{"required":true,"type":"text"}',
              secret: false,
              initialValue: '',
              renderCondition: undefined,
              hideFromReadData: undefined,
              customReadDataLabels: [],
            },
          ],
        },
      ],
    },
  ],
}
