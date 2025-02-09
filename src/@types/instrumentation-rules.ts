import type { InstrumentationRule } from '@odigos/ui-utils'

export type InstrumentationRuleFormData = Omit<InstrumentationRule, 'ruleId' | 'type' | 'mutable' | 'profileName'>
