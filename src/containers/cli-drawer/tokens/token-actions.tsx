import React, { type FC, useRef, useState } from 'react'
import Theme, { styled } from '@odigos/ui-theme'
import { CheckIcon, CopyIcon, CrossIcon, EditIcon } from '@odigos/ui-icons'
import { getStatusIcon, NOTIFICATION_TYPE, useCopy, useOnClickOutside } from '@odigos/ui-utils'
import { Button, Divider, FlexColumn, FlexRow, IconButton, Input, Text, Tooltip } from '@odigos/ui-components'

interface TokenActionsProps {
  token: string
  saveToken: (newToken: string) => Promise<void>
}

const Relative = styled.div`
  position: relative;
`

const TokenPopover = styled(FlexColumn)`
  position: absolute;
  top: 32px;
  right: 0;
  z-index: 1;
  gap: 8px;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.info};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
`

const PopoverFormWrapper = styled(FlexRow)`
  width: 100%;
`

const PopoverFormButton = styled(Button)`
  width: 36px;
  padding-left: 0;
  padding-right: 0;
`

const TokenActions: FC<TokenActionsProps> = ({ token, saveToken }) => {
  const theme = Theme.useTheme()
  const { isCopied, clickCopy } = useCopy()

  const [isEdit, setIsEdit] = useState(false)
  const [inputValue, setInputValue] = useState(token)
  const popupRef = useRef<HTMLDivElement>(null)

  const onSave = () => {
    saveToken(inputValue).then(onCloseEdit)
  }
  const onOpenEdit = () => {
    setIsEdit(true)
  }
  const onCloseEdit = () => {
    setIsEdit(false)
    setInputValue(token)
  }

  const SuccessIcon = getStatusIcon(NOTIFICATION_TYPE.SUCCESS, theme)

  useOnClickOutside(popupRef, onCloseEdit)

  return (
    <FlexRow $gap={0}>
      <IconButton size={32} onClick={() => clickCopy(token)}>
        {isCopied ? <SuccessIcon /> : <CopyIcon />}
      </IconButton>
      <Divider orientation='vertical' length='12px' />

      <Relative>
        <IconButton size={32} onClick={onOpenEdit}>
          <EditIcon />
        </IconButton>

        {isEdit && (
          <TokenPopover ref={popupRef}>
            <Tooltip text='Contact us to generate a new one' withIcon>
              <Text size={14} style={{ lineHeight: '20px', display: 'flex' }}>
                Enter a new API Token:
              </Text>
            </Tooltip>

            <PopoverFormWrapper>
              <Input placeholder='API Token' type='password' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />

              <PopoverFormButton variant='primary' onClick={onSave}>
                <CheckIcon fill={theme.text.primary} />
              </PopoverFormButton>

              <PopoverFormButton variant='secondary' onClick={onCloseEdit}>
                <CrossIcon />
              </PopoverFormButton>
            </PopoverFormWrapper>
          </TokenPopover>
        )}
      </Relative>
    </FlexRow>
  )
}

export { TokenActions, type TokenActionsProps }
