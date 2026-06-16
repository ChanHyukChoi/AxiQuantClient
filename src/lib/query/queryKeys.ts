import type { AuditLogParams } from '@/types/api/audit'
import type { AccessLogParams, AlarmLogParams } from '@/types/api/eventMonitor'

export const queryKeys = {
  deviceControl: {
    scps: () => ['deviceControl', 'scps'] as const,
    sios: (scpId: number) => ['deviceControl', 'sios', scpId] as const,
    readers: (scpId: number) => ['deviceControl', 'readers', scpId] as const,
    inputs: (scpId: number) => ['deviceControl', 'inputs', scpId] as const,
    outputs: (scpId: number) => ['deviceControl', 'outputs', scpId] as const,
    modules: () => ['deviceControl', 'modules'] as const,
  },
  emps: { all: ['emps'] as const },
  card: {
    all: ['card'] as const,
    acclv: (cid: number) => ['card', cid, 'acclv'] as const,
  },
  acclv: {
    all: ['acclv'] as const,
    reader: (alvId: number) => ['acclv', alvId, 'reader'] as const,
  },
  areas: {
    all: () => ['areas'] as const,
    detail: (id: number) => ['areas', id] as const,
  },
  holiday: { all: ['holiday'] as const },
  timezone: { all: ['timezone'] as const },
  cardFmts: {
    all: () => ['cardFmts'] as const,
    detail: (id: number) => ['cardFmts', id] as const,
  },
  modules: { all: ['modules'] as const },
  eventMonitor: {
    accessLog: (params: AccessLogParams) => ['eventMonitor', 'access', params] as const,
    alarmLog: (params: AlarmLogParams) => ['eventMonitor', 'alarm', params] as const,
  },
  users: {
    all: () => ['users'] as const,
    detail: (id: number) => ['users', id] as const,
  },
  auditLog: {
    list: (params: AuditLogParams) => ['auditLog', params] as const,
  },
  alarmSettings: {
    alarms: () => ['alarmSettings', 'alarms'] as const,
    priorities: () => ['alarmSettings', 'priorities'] as const,
    mails: () => ['alarmSettings', 'mails'] as const,
  },
  linkage: {
    all: () => ['linkage'] as const,
  },
}
