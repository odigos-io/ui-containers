import { INSTRUMENTATION_RULE_TYPE, type WorkloadId } from '@odigos/ui-utils'

interface InstrumentationLibraryGlobalId {
  language: string
  library: string
}
export interface InstrumentationRule {
  ruleId: string
  ruleName: string
  type: INSTRUMENTATION_RULE_TYPE // does not come from backend, it's derived during GET
  notes: string
  disabled: boolean
  mutable: boolean
  profileName: string
  workloads?: WorkloadId[]
  instrumentationLibraries?: InstrumentationLibraryGlobalId[]
  payloadCollection?: PayloadCollection
  codeAttributes?: CodeAttributes
}

// Payload Collection for Instrumentation Rules
interface HttpPayloadCollection {
  mimeTypes?: string[]
  maxPayloadLength?: number
  dropPartialPayloads?: boolean
}
interface DbQueryPayloadCollection {
  maxPayloadLength?: number
  dropPartialPayloads?: boolean
}
interface MessagingPayloadCollection {
  maxPayloadLength?: number
  dropPartialPayloads?: boolean
}
export interface PayloadCollection {
  httpRequest?: HttpPayloadCollection
  httpResponse?: HttpPayloadCollection
  dbQuery?: DbQueryPayloadCollection
  messaging?: MessagingPayloadCollection
}

// Code Attributes for Instrumentation Rules
export interface CodeAttributes {
  column?: boolean
  filePath?: boolean
  function?: boolean
  lineNumber?: boolean
  namespace?: boolean
  stacktrace?: boolean
}
