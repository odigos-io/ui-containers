import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { sleep } from '@odigos/ui-utils'
import { OdigosLogoText } from '@odigos/ui-icons'
import { Badge, FlexColumn, FlexRow, Text, TraceLoader } from '@odigos/ui-components'

interface AwaitPipelineProps {}

const Container = styled(FlexColumn)`
  // width: 100vw;
  // height: 100vh;
  gap: 64px;
  align-items: center;
  justify-content: center;
`

const TextWrap = styled(FlexColumn)`
  max-width: 400px;
  gap: 12px;
  align-items: center;
  justify-content: center;
`

const Title = styled(Text)`
  text-align: center;
  font-size: 24px;
`

const Description = styled(Text)`
  text-align: center;
  line-height: 26px;
  color: ${({ theme }) => theme.text.info};
`

const AwaitPipeline: FC<AwaitPipelineProps> = () => {
  const [progress, setProgress] = useState(0)

  // TODO: await pipeline completion, right now we fake it
  const awaitPipeline = async () => {
    for (let i = 0; i <= 100; i += 5) {
      await sleep(500)
      setProgress(i)
    }
  }

  useEffect(() => {
    awaitPipeline()
  }, [])

  return (
    <Container>
      <OdigosLogoText size={100} />
      <TraceLoader width={400} />

      <TextWrap>
        <FlexRow $gap={16}>
          <Title>Preparing your workspace...</Title>
          <Badge label={`${progress}%`} />
        </FlexRow>

        <Description>It can take up to a few minutes. Grab a cup of coffee, look out a window, and enjoy your free moment!</Description>
      </TextWrap>
    </Container>
  )
}

export { AwaitPipeline, type AwaitPipelineProps }
