import React from 'react'
import { sleep } from '@odigos/ui-utils'
import type { StoryFn } from '@storybook/react'
import { CliDrawer, type CliDrawerProps } from '.'

export default {
  title: 'Containers/CliDrawer',
  component: CliDrawer,
}

export const Default: StoryFn<CliDrawerProps> = (props) => {
  return <CliDrawer {...props} />
}

Default.args = {
  tokens: [
    {
      name: 'Fake 1',
      token: '-',
      issuedAt: 0,
      expiresAt: new Date().getTime() + 1000 * 60 * 60 * 24 * 30, // 30 days
    },
    {
      name: 'Fake 2',
      token: '-',
      issuedAt: 0,
      expiresAt: new Date().getTime() + 1000 * 60 * 60 * 24, // 24 hours
    },
    {
      name: 'Fake 3',
      token: '-',
      issuedAt: 0,
      expiresAt: new Date().getTime() - 1000 * 60 * 60 * 24, // 24 hours ago
    },
  ],
  saveToken: async () => {
    sleep(1000)
    return Promise.resolve()
  },
  describe: {
    odigosVersion: {
      name: 'Odigos Version',
      value: 'v1.0.149',
      status: null,
      explain: 'the version of odigos deployment currently installed in the cluster',
    },
    kubernetesVersion: {
      name: 'Kubernetes Version',
      value: 'v1.32.0',
      status: null,
      explain: 'the version of kubernetes cluster where odigos is deployed',
    },
    tier: {
      name: 'Tier',
      value: 'onprem',
      status: null,
      explain: 'the tier of odigos deployment (community, enterprise, cloud)',
    },
    installationMethod: {
      name: 'Installation Method',
      value: 'odigos-cli',
      status: null,
      explain: 'the method used to deploy odigos in the cluster (helm or odigos cli)',
    },
    numberOfDestinations: 1,
    numberOfSources: 15,
    clusterCollector: {
      enabled: {
        name: 'Enabled',
        value: 'true',
        status: null,
        explain: 'should odigos create a cluster collector in the cluster',
      },
      collectorGroup: {
        name: 'Collector Group',
        value: 'created',
        status: 'success',
        explain: 'is the k8s collectors group object for cluster collector exists in the cluster',
      },
      deployed: {
        name: 'Deployed',
        value: 'true',
        status: 'success',
        explain:
          'deployed means the relevant k8s objects (deployment, configmap, secret, daemonset, etc) were created successfully and are expected to start. It does not mean the relevant pods were actually created, started, or are healthy.',
      },
      deployedError: null,
      collectorReady: {
        name: 'Ready',
        value: 'true',
        status: 'success',
        explain: 'ready means that odigos has detected the collectors group as ready to start collecting/receiving data',
      },
      deploymentCreated: {
        name: 'Deployment',
        value: 'created',
        status: 'success',
        explain: 'is the k8s deployment object for cluster collector exists in the cluster',
      },
      expectedReplicas: {
        name: 'Expected Replicas',
        value: '1',
        status: null,
        explain: 'the number of pods that should be scheduled to run the cluster collector',
      },
      healthyReplicas: {
        name: 'Healthy Replicas',
        value: '1',
        status: 'success',
        explain: 'the number of k8s pods running the updated revision of the cluster collector and are healthy',
      },
      failedReplicas: {
        name: 'Failed Replicas',
        value: '0',
        status: 'success',
        explain: 'the number of k8s pods running the updated revision of the cluster collector and are not healthy',
      },
      failedReplicasReason: null,
    },
    nodeCollector: {
      enabled: {
        name: 'Enabled',
        value: 'true',
        status: null,
        explain: 'should odigos deploy node collector daemonset in the cluster',
      },
      collectorGroup: {
        name: 'Collector Group',
        value: 'created',
        status: 'success',
        explain: 'is the k8s collectors group object for node collector exists in the cluster',
      },
      deployed: {
        name: 'Deployed',
        value: 'true',
        status: 'success',
        explain:
          'deployed means the relevant k8s objects (deployment, configmap, secret, daemonset, etc) were created successfully and are expected to start. It does not mean the relevant pods were actually created, started, or are healthy.',
      },
      deployedError: null,
      collectorReady: {
        name: 'Ready',
        value: 'true',
        status: 'success',
        explain: 'ready means that odigos has detected the collectors group as ready to start collecting/receiving data',
      },
      daemonSet: {
        name: 'DaemonSet',
        value: 'created',
        status: 'success',
        explain: 'is the k8s daemonset object for node collector exists in the cluster',
      },
      desiredNodes: {
        name: 'Desired Nodes',
        value: '1',
        status: null,
        explain: 'the number of k8s nodes that should be running the node collector daemonset',
      },
      currentNodes: {
        name: 'Current Nodes',
        value: '1',
        status: 'success',
        explain:
          'the number of k8s nodes that have at least one pod of the node collector daemonset. this number counts the pod objects that were created on this node, regardless of the pod status or revision.',
      },
      updatedNodes: {
        name: 'Updated Nodes',
        value: '1',
        status: 'success',
        explain:
          'the number of k8s nodes that have only the latest version of the node collector daemonset pods. this number counts the pod objects that were created on this node with the latest revision, regardless of the pod status or readiness',
      },
      availableNodes: {
        name: 'Available Nodes',
        value: '0',
        status: 'transitioning',
        explain:
          'the number of k8s nodes that have at least one pod of the node collector daemonset that is ready and available. this number counts the pod objects that were created on this node, regardless of the pod status or revision.',
      },
    },
    isSettled: false,
    hasErrors: false,
  },
}
