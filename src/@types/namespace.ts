import type { K8sActualSource } from './sources'

export interface K8sActualNamespace {
  name: string
  selected: boolean
  k8sActualSources?: K8sActualSource[]
}

export interface PersistNamespaceItemInput {
  name: string
  futureSelected: boolean
}
