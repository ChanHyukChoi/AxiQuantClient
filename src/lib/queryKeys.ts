export const queryKeys = {
  scp: { all: ['scp'] as const },
  sio: { all: (scpId: number) => ['sio', scpId] as const },
  input: { all: (scpId: number) => ['input', scpId] as const },
  output: { all: (scpId: number) => ['output', scpId] as const },
  reader: { all: (scpId: number) => ['reader', scpId] as const },
  emps: { all: ['emps'] as const },
  card: {
    all: ['card'] as const,
    acclv: (cid: number) => ['card', cid, 'acclv'] as const,
  },
  acclv: {
    all: ['acclv'] as const,
    reader: (alvId: number) => ['acclv', alvId, 'reader'] as const,
  },
  area: { all: ['area'] as const },
  holiday: { all: ['holiday'] as const },
  timezone: { all: ['timezone'] as const },
  cardfmt: { all: ['cardfmt'] as const },
  modules: { all: ['modules'] as const },
}
