import React from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { type SVG } from '@odigos/ui-icons'
import { Badge, Button, Text } from '@odigos/ui-components'

interface Props {
  label: string
  onClick: () => void
  icon?: SVG
  iconSrc?: string
  badgeLabel?: string | number
  badgeFilled?: boolean
  isSelected?: boolean
  withBorder?: boolean
  color?: React.CSSProperties['backgroundColor']
  hoverColor?: React.CSSProperties['backgroundColor']
  style?: React.CSSProperties
}

const StyledButton = styled(Button)<{ $withBorder: Props['withBorder']; $color: Props['color']; $hoverColor: Props['hoverColor'] }>`
  gap: 8px;
  text-transform: none;
  text-decoration: none;
  border: ${({ theme, $withBorder }) => `1px solid ${$withBorder ? theme.colors.border : 'transparent'}`};
  &.not-selected {
    background-color: ${({ theme, $color }) => $color || theme.colors.dropdown_bg_2 + Theme.opacity.hex['060']};
    &:hover {
      background-color: ${({ theme, $hoverColor }) => $hoverColor || theme.colors.dropdown_bg_2};
    }
  }
  &.selected {
    background-color: ${({ theme }) => theme.colors.majestic_blue + Theme.opacity.hex['048']};
  }
`

export const SelectionButton = ({
  label,
  onClick,
  icon: Icon,
  iconSrc,
  badgeLabel,
  badgeFilled,
  isSelected,
  withBorder,
  color,
  hoverColor,
  style,
}: Props) => {
  return (
    <StyledButton
      onClick={onClick}
      className={isSelected ? 'selected' : 'not-selected'}
      $withBorder={withBorder}
      $color={color}
      $hoverColor={hoverColor}
      style={style}
    >
      {Icon && <Icon />}
      {iconSrc && <img src={iconSrc} alt='' width={16} height={16} />}
      <Text size={14} style={{ whiteSpace: 'nowrap' }}>
        {label}
      </Text>
      {badgeLabel !== undefined && <Badge label={badgeLabel} filled={badgeFilled || isSelected} />}
    </StyledButton>
  )
}
