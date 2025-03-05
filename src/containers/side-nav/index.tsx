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
  onClickId: (id: NAV_ICON_IDS) => void
  defaultSelectedId?: string
  extendedNavIcons?: NavIcon[]
}

const SideNav: FC<SideNavProps> = ({ onClickId, defaultSelectedId, extendedNavIcons }) => {
  const [selectedId, setSelectedId] = useState(defaultSelectedId || '')

  const mainIcons = useMemo(
    () => [
      {
        id: NAV_ICON_IDS.OVERVIEW,
        icon: OverviewIcon,
        selected: selectedId === NAV_ICON_IDS.OVERVIEW,
        onClick: () => {
          setSelectedId(NAV_ICON_IDS.OVERVIEW)
          onClickId(NAV_ICON_IDS.OVERVIEW)
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
                onClickId(NAV_ICON_IDS.INSTRUMENTATION_RULES)
              },
              tooltip: 'Instrumentation Rules',
            },
            {
              id: NAV_ICON_IDS.SOURCES,
              icon: SourcesIcon,
              selected: selectedId === NAV_ICON_IDS.SOURCES,
              onClick: () => {
                setSelectedId(NAV_ICON_IDS.SOURCES)
                onClickId(NAV_ICON_IDS.SOURCES)
              },
              tooltip: 'Sources',
            },
            {
              id: NAV_ICON_IDS.ACTIONS,
              icon: ActionsIcon,
              selected: selectedId === NAV_ICON_IDS.ACTIONS,
              onClick: () => {
                setSelectedId(NAV_ICON_IDS.ACTIONS)
                onClickId(NAV_ICON_IDS.ACTIONS)
              },
              tooltip: 'Actions',
            },
            {
              id: NAV_ICON_IDS.DESTINATIONS,
              icon: DestinationsIcon,
              selected: selectedId === NAV_ICON_IDS.DESTINATIONS,
              onClick: () => {
                setSelectedId(NAV_ICON_IDS.DESTINATIONS)
                onClickId(NAV_ICON_IDS.DESTINATIONS)
              },
              tooltip: 'Destinations',
            },
          ]
        : [],
    [selectedId]
  )

  return <IconsNav orientation='vertical' mainIcons={mainIcons} subIcons={subIcons} />
}

export { SideNav, type SideNavProps, NAV_ICON_IDS }
