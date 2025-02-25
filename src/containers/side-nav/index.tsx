import React, { useMemo, useState, type FC } from 'react'
import { IconsNav, type NavIcon } from '@odigos/ui-components'
import { ActionsIcon, DestinationsIcon, OverviewIcon, RulesIcon, SourcesIcon } from '@odigos/ui-icons'

enum NAV_ICON_IDS {
  OVERVIEW = 'overview',
  INSTRUMENTATION_RULES = 'instrumentation-rules',
  SOURCES = 'sources',
  ACTIONS = 'actions',
  DESTINATIONS = 'destinations',
}

interface SideNavProps {
  defaultSelectedId?: string
  onClickOverview: () => void
  onClickRules: () => void
  onClickSources: () => void
  onClickActions: () => void
  onClickDestinations: () => void
  extendedNavIcons?: NavIcon[]
}

const SideNav: FC<SideNavProps> = ({
  defaultSelectedId,
  onClickOverview,
  onClickRules,
  onClickSources,
  onClickActions,
  onClickDestinations,
  extendedNavIcons,
}) => {
  const [selectedId, setSelectedId] = useState(defaultSelectedId || '')

  const mainIcons = useMemo(
    () => [
      {
        id: NAV_ICON_IDS.OVERVIEW,
        icon: OverviewIcon,
        selected: selectedId === NAV_ICON_IDS.OVERVIEW,
        onClick: () => {
          setSelectedId(NAV_ICON_IDS.OVERVIEW)
          onClickOverview()
        },
        tooltip: 'Overview',
      },
      ...(extendedNavIcons || []).map((item) => ({
        ...item,
        selected: selectedId === item.id,
        onClick: () => {
          setSelectedId(item.id)
          item.onClick()
        },
      })),
    ],
    [selectedId]
  )

  const subIcons = useMemo(
    () =>
      [
        NAV_ICON_IDS.OVERVIEW as string,
        NAV_ICON_IDS.INSTRUMENTATION_RULES as string,
        NAV_ICON_IDS.SOURCES as string,
        NAV_ICON_IDS.ACTIONS as string,
        NAV_ICON_IDS.DESTINATIONS as string,
      ].includes(selectedId)
        ? [
            {
              id: NAV_ICON_IDS.INSTRUMENTATION_RULES,
              icon: RulesIcon,
              selected: selectedId === NAV_ICON_IDS.INSTRUMENTATION_RULES,
              onClick: () => {
                setSelectedId(NAV_ICON_IDS.INSTRUMENTATION_RULES)
                onClickRules()
              },
              tooltip: 'Only instrumentation rules',
            },
            {
              id: NAV_ICON_IDS.SOURCES,
              icon: SourcesIcon,
              selected: selectedId === NAV_ICON_IDS.SOURCES,
              onClick: () => {
                setSelectedId(NAV_ICON_IDS.SOURCES)
                onClickSources()
              },
              tooltip: 'Only sources',
            },
            {
              id: NAV_ICON_IDS.ACTIONS,
              icon: ActionsIcon,
              selected: selectedId === NAV_ICON_IDS.ACTIONS,
              onClick: () => {
                setSelectedId(NAV_ICON_IDS.ACTIONS)
                onClickActions()
              },
              tooltip: 'Only actions',
            },
            {
              id: NAV_ICON_IDS.DESTINATIONS,
              icon: DestinationsIcon,
              selected: selectedId === NAV_ICON_IDS.DESTINATIONS,
              onClick: () => {
                setSelectedId(NAV_ICON_IDS.DESTINATIONS)
                onClickDestinations()
              },
              tooltip: 'Only destinations',
            },
          ]
        : [],
    [selectedId]
  )

  return <IconsNav orientation='vertical' mainIcons={mainIcons} subIcons={subIcons} />
}

export { SideNav, type SideNavProps, NAV_ICON_IDS }
