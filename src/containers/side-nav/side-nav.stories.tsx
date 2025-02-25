import React from 'react'
import type { StoryFn } from '@storybook/react'
import { NAV_ICON_IDS, SideNav, type SideNavProps } from '.'
import { ServiceMapIcon, TraceViewIcon } from '@odigos/ui-icons'

export default {
  title: 'Containers/SideNav',
  component: SideNav,
}

export const Default: StoryFn<SideNavProps> = (props) => {
  return <SideNav {...props} />
}

Default.args = {
  defaultSelectedId: NAV_ICON_IDS.SOURCES,
  onClickOverview: () => alert('clicked: overview'),
  onClickRules: () => alert('clicked: rules'),
  onClickSources: () => alert('clicked: sources'),
  onClickActions: () => alert('clicked: actions'),
  onClickDestinations: () => alert('clicked: destinations'),
  extendedNavIcons: [
    {
      id: 'service-map',
      icon: ServiceMapIcon,
      selected: false,
      onClick: () => alert('clicked: service-map'),
    },
    {
      id: 'trace-view',
      icon: TraceViewIcon,
      selected: false,
      onClick: () => alert('clicked: trace-view'),
    },
  ],
}
