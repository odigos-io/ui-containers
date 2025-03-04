import React, { type FC } from 'react'
import { ExpiresAt } from './expires-at'
import { KeyIcon } from '@odigos/ui-icons'
import { TokenActions } from './token-actions'
import type { TokenPayload } from '@odigos/ui-utils'
import { DATA_CARD_FIELD_TYPES, DataCard, type RowCell } from '@odigos/ui-components'

interface TokensProps {
  tokens: TokenPayload[]
  saveToken: (newToken: string) => Promise<void>
}

const Tokens: FC<TokensProps> = ({ tokens, saveToken }) => {
  return (
    <DataCard
      title='Authorization Tokens'
      titleBadge={tokens.length}
      data={[
        {
          type: DATA_CARD_FIELD_TYPES.TABLE,
          value: {
            columns: [
              { key: 'icon', title: '' },
              { key: 'name', title: 'Name' },
              { key: 'expires_at', title: 'Expires' },
              { key: 'token', title: 'Token' },
              { key: 'actions', title: '' },
            ],
            rows: tokens.map(({ name, token, expiresAt }) => ({
              cells: [
                { columnKey: 'icon', icon: KeyIcon },
                { columnKey: 'name', value: name },
                { columnKey: 'token', value: `${new Array(15).fill('•').join('')}` },
                {
                  columnKey: 'expires_at',
                  component: () => <ExpiresAt expiresAt={expiresAt} />,
                },
                {
                  columnKey: 'actions',
                  component: () => <TokenActions token={token} saveToken={saveToken} />,
                },
              ] as RowCell[],
            })),
          },
        },
      ]}
    />
  )
}

export { Tokens, type TokensProps }
