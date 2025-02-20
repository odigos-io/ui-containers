import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from 'react'
import type { Namespace } from '@odigos/ui-utils'
import { useSetupStore, type AvailableSourcesByNamespace, type NamespaceSelectionFormData, type SourceSelectionFormData } from '../../../store'

type SelectedNamespace = string
type SelectedSource = AvailableSourcesByNamespace[0][0]

interface UseSourceFormDataParams {
  namespaces: Namespace[]
  namespace?: Namespace
  selectedNamespace: SelectedNamespace
  onSelectNamespace: (ns: SelectedNamespace) => void
}

export interface UseSourceSelectionFormData {
  recordedInitialSources: AvailableSourcesByNamespace
  filterNamespaces: (options?: { cancelSearch?: boolean }) => [SelectedNamespace, SelectedSource[]][]
  filterSources: (namespace?: SelectedNamespace, options?: { cancelSearch?: boolean; cancelSelected?: boolean }) => SelectedSource[]
  getApiSourcesPayload: () => SourceSelectionFormData
  getApiFutureAppsPayload: () => NamespaceSelectionFormData

  selectedSources: AvailableSourcesByNamespace
  onSelectSource: (source: SelectedSource, namespace?: SelectedNamespace) => void
  selectedFutureApps: NamespaceSelectionFormData
  onSelectFutureApps: (bool: boolean, namespace?: SelectedNamespace) => void
  onSelectAll: (bool: boolean, namespace?: SelectedNamespace, selectionsByNamespace?: AvailableSourcesByNamespace) => void

  searchText: string
  setSearchText: Dispatch<SetStateAction<string>>
  showSelectedOnly: boolean
  setShowSelectedOnly: Dispatch<SetStateAction<boolean>>
}

export const useSourceSelectionFormData = (params?: UseSourceFormDataParams): UseSourceSelectionFormData => {
  const { namespaces, namespace, selectedNamespace, onSelectNamespace } = params || {}

  // only for "onboarding" - get unsaved values and set to state
  // (this is to persist the values when user navigates back to this page)
  const { configuredSources, configuredFutureApps, availableSources } = useSetupStore()

  // Keeps intial values fetched from API, so we can later filter the user-specific-selections, therebey minimizing the amount of data sent to the API on "persist sources".
  const [recordedInitialSources, setRecordedInitialSources] = useState<UseSourceSelectionFormData['selectedSources']>(availableSources)

  const [selectAllForNamespace, setSelectAllForNamespace] = useState<SelectedNamespace>('')
  const [selectedSources, setSelectedSources] = useState<UseSourceSelectionFormData['selectedSources']>(configuredSources)
  const [selectedFutureApps, setSelectedFutureApps] = useState<UseSourceSelectionFormData['selectedFutureApps']>(configuredFutureApps)

  useEffect(() => {
    if (!!namespaces?.length) {
      // initialize all states (to avoid undefined errors)
      setRecordedInitialSources((prev) => {
        const payload = { ...prev }
        namespaces.forEach(({ name }) => (payload[name] = payload[name] || []))
        return payload
      })
      setSelectedSources((prev) => {
        const payload = { ...prev }
        namespaces.forEach(({ name }) => (payload[name] = payload[name] || []))
        return payload
      })
      setSelectedFutureApps((prev) => {
        const payload = { ...prev }
        namespaces.forEach(({ name, selected }) => (payload[name] = payload[name] || selected || false))
        return payload
      })
    }
  }, [namespaces])

  useEffect(() => {
    if (!!namespace) {
      // initialize sources for this namespace
      const { name, sources = [] } = namespace

      setRecordedInitialSources((prev) => ({
        ...prev,
        [name]: sources.map(({ name, kind, selected, numberOfInstances }) => ({
          name,
          kind,
          selected,
          numberOfInstances,
        })),
      }))
      setSelectedSources((prev) => ({
        ...prev,
        [name]: !!prev[name].length
          ? prev[name]
          : sources.map(({ name, kind, selected }) => ({
              name,
              kind,
              selected,
            })),
      }))
    }
  }, [namespace])

  // form filters
  const [searchText, setSearchText] = useState('')
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)

  const onSelectAll: UseSourceSelectionFormData['onSelectAll'] = useCallback(
    (selected, ns, selectionsByNamespace) => {
      // When clicking "select all" on a single namespace
      if (!!ns) {
        if (!selectionsByNamespace) {
          // If the sources are not loaded yet, call the onSelectNamespace to load the sources
          onSelectNamespace?.(selected ? ns : '')
          // Set the state, so the interval would be able to use the namespace
          setSelectAllForNamespace(selected ? ns : '')
        } else if (!!selectionsByNamespace?.[ns]?.length) {
          // Clear the state, so the interval would stop
          setSelectAllForNamespace('')
        }

        // Set the selected sources
        setSelectedSources((prev) => ({
          ...prev,
          [ns]:
            selectionsByNamespace?.[ns]?.map((source) => ({
              ...source,
              selected,
            })) || [],
        }))
        setSelectedFutureApps((prev) => ({
          ...prev,
          [ns]: !!selectionsByNamespace?.[ns]?.length ? selected : false,
        }))
      }

      // When clicking "select all" on all namespaces
      else {
        setSelectedSources((prev) => {
          const payload = { ...prev }

          Object.entries(payload).forEach(([key, sources]) => {
            payload[key] = sources.map((source) => ({ ...source, selected }))
          })

          return payload
        })
      }
    },
    [selectedSources]
  )

  // This is to keep trying "select all" per namespace, until the sources are loaded (allows for 1-click, better UX).
  useEffect(() => {
    if (!!selectAllForNamespace) {
      const interval = setInterval(() => onSelectAll(true, selectAllForNamespace, selectedSources), 100)
      return () => clearInterval(interval)
    }
  }, [selectAllForNamespace, onSelectAll])

  const onSelectSource: UseSourceSelectionFormData['onSelectSource'] = (source, namespace) => {
    const id = namespace || selectedNamespace

    if (!id) return

    const arr = [...(selectedSources[id] || [])]
    const foundIdx = arr.findIndex(({ name, kind }) => name === source.name && kind === source.kind)

    if (foundIdx !== -1) {
      // Replace the item with a new object to avoid mutating a possibly read-only object
      const updatedItem = { ...arr[foundIdx], selected: !arr[foundIdx].selected }
      arr[foundIdx] = updatedItem
    } else {
      arr.push({ ...source, selected: true })
    }

    setSelectedSources((prev) => ({ ...prev, [id]: arr }))
  }

  const onSelectFutureApps: UseSourceSelectionFormData['onSelectFutureApps'] = (bool, namespace) => {
    const id = namespace || selectedNamespace

    if (!id) return

    setSelectedFutureApps((prev) => ({ ...prev, [id]: bool }))
  }

  const filterNamespaces: UseSourceSelectionFormData['filterNamespaces'] = (options) => {
    const { cancelSearch } = options || {}
    const namespaces = Object.entries(selectedSources)

    const isSearchOk = (targetText: string) => cancelSearch || !searchText || targetText.toLowerCase().includes(searchText)

    return namespaces.filter(([namespace]) => isSearchOk(namespace))
  }

  const filterSources: UseSourceSelectionFormData['filterSources'] = (namespace, options) => {
    const { cancelSearch, cancelSelected } = options || {}
    const id = namespace || selectedNamespace

    if (!id) return []

    const isSearchOk = (targetText: string) => cancelSearch || !searchText || targetText.toLowerCase().includes(searchText)
    const isOnlySelectedOk = (sources: Record<string, any>[], compareKey: string, target: string) =>
      cancelSelected || !showSelectedOnly || !!sources.find((item) => item[compareKey] === target && item.selected)

    return selectedSources[id].filter((source) => isSearchOk(source.name) && isOnlySelectedOk(selectedSources[id], 'name', source.name))
  }

  // This is to filter the user-specific-selections, therebey minimizing the amount of data sent to the API on "persist sources".
  const getApiSourcesPayload: UseSourceSelectionFormData['getApiSourcesPayload'] = () => {
    const payload: UseSourceSelectionFormData['selectedSources'] = {}

    Object.entries(selectedSources).forEach(([namespace, sources]) => {
      sources.forEach((source) => {
        const foundInitial = recordedInitialSources[namespace]?.find(
          (initialSource) => initialSource.name === source.name && initialSource.kind === source.kind
        )

        if (foundInitial?.selected !== source.selected) {
          if (!payload[namespace]) payload[namespace] = []
          payload[namespace].push({
            name: source.name,
            kind: source.kind,
            selected: source.selected,
          })
        }
      })
    })

    return payload
  }

  // This is to filter the user-specific-selections, therebey minimizing the amount of data sent to the API on "persist namespaces".
  const getApiFutureAppsPayload: UseSourceSelectionFormData['getApiFutureAppsPayload'] = () => {
    const payload: UseSourceSelectionFormData['selectedFutureApps'] = {}

    Object.entries(selectedFutureApps).forEach(([namespace, selected]) => {
      const foundInitial = namespaces?.find((ns) => ns.name === namespace)

      if (foundInitial?.selected !== selected) {
        payload[namespace] = selected
      }
    })

    return payload
  }

  return {
    recordedInitialSources,
    filterNamespaces,
    filterSources,
    getApiSourcesPayload,
    getApiFutureAppsPayload,

    selectedSources,
    onSelectSource,
    selectedFutureApps,
    onSelectFutureApps,
    onSelectAll,

    searchText,
    setSearchText,
    showSelectedOnly,
    setShowSelectedOnly,
  }
}
