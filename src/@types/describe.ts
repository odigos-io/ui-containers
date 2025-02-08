interface EntityProperty {
  name: string
  value: string
  status?: string | null
  explain?: string | null
}

interface ClusterCollectorAnalyze {
  enabled: EntityProperty
  collectorGroup: EntityProperty
  deployed?: EntityProperty | null
  deployedError?: EntityProperty | null
  collectorReady?: EntityProperty | null
  deploymentCreated: EntityProperty
  expectedReplicas?: EntityProperty | null
  healthyReplicas?: EntityProperty | null
  failedReplicas?: EntityProperty | null
  failedReplicasReason?: EntityProperty | null
}

interface NodeCollectorAnalyze {
  enabled: EntityProperty
  collectorGroup: EntityProperty
  deployed?: EntityProperty | null
  deployedError?: EntityProperty | null
  collectorReady?: EntityProperty | null
  daemonSet: EntityProperty
  desiredNodes?: EntityProperty | null
  currentNodes?: EntityProperty | null
  updatedNodes?: EntityProperty | null
  availableNodes?: EntityProperty | null
}

export interface DescribeOdigos {
  odigosVersion: EntityProperty
  kubernetesVersion: EntityProperty
  tier: EntityProperty
  installationMethod: EntityProperty
  numberOfDestinations: number
  numberOfSources: number
  clusterCollector: ClusterCollectorAnalyze
  nodeCollector: NodeCollectorAnalyze
  isSettled: boolean
  hasErrors: boolean
}

interface InstrumentationSourcesAnalyze {
  instrumented: EntityProperty
  workload?: EntityProperty | null
  namespace?: EntityProperty | null
  instrumentedText?: EntityProperty | null
}

interface ContainerRuntimeInfoAnalyze {
  containerName: EntityProperty
  language: EntityProperty
  runtimeVersion: EntityProperty
  envVars: EntityProperty[]
}

interface RuntimeInfoAnalyze {
  generation: EntityProperty
  containers: ContainerRuntimeInfoAnalyze[]
}

interface ContainerAgentConfigAnalyze {
  containerName: EntityProperty
  agentEnabled: EntityProperty
  reason?: EntityProperty | null
  message?: EntityProperty | null
  otelDistroName?: EntityProperty | null
}

interface OtelAgentsAnalyze {
  created: EntityProperty
  createTime?: EntityProperty | null
  containers: ContainerAgentConfigAnalyze[]
}

interface InstrumentationInstanceAnalyze {
  healthy: EntityProperty
  message?: EntityProperty | null
  identifyingAttributes: EntityProperty[]
}

interface PodContainerAnalyze {
  containerName: EntityProperty
  actualDevices: EntityProperty
  instrumentationInstances: InstrumentationInstanceAnalyze[]
}

interface PodAnalyze {
  podName: EntityProperty
  nodeName: EntityProperty
  phase: EntityProperty
  containers: PodContainerAnalyze[]
}

export interface DescribeSource {
  name: EntityProperty
  kind: EntityProperty
  namespace: EntityProperty

  sourceObjects?: InstrumentationSourcesAnalyze | null
  runtimeInfo?: RuntimeInfoAnalyze | null
  otelAgents?: OtelAgentsAnalyze | null

  totalPods: number
  podsPhasesCount: string
  pods: PodAnalyze[]
}
