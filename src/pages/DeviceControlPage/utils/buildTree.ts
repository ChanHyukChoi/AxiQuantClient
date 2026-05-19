import type { InputInfo, ModuleInfo, OutputInfo, ReaderInfo, ScpInfo, SioInfo } from '@/types/api'
import {
  entityLabel,
  isStandaloneReader,
  moduleLabel,
  type DeviceTypeFilter,
} from '@/pages/DeviceControlPage/utils/deviceHelpers'

export type DeviceTreeNodeKind =
  | 'group'
  | 'scp'
  | 'sio'
  | 'reader'
  | 'input'
  | 'output'
  | 'module'

export interface DeviceTreeNode {
  key: string
  kind: DeviceTreeNodeKind
  label: string
  active: number
  scpId: number
  entityId: number
  children?: DeviceTreeNode[]
}

export interface ScpChildData {
  sios: SioInfo[]
  readers: ReaderInfo[]
  inputs: InputInfo[]
  outputs: OutputInfo[]
}

export interface BuildTreeInput {
  scps: ScpInfo[]
  childDataByScp: Map<number, ScpChildData>
  modules: ModuleInfo[]
  searchQuery: string
  typeFilter: DeviceTypeFilter
}

const GROUP_CONTROLLERS = 'group:controllers'
const GROUP_STANDALONE = 'group:standalone'
const GROUP_MODULES = 'group:modules'

export const matchesSearch = (label: string, query: string, entityId?: number): boolean => {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  if (label.toLowerCase().includes(q)) return true
  if (entityId != null && String(entityId).includes(q)) return true
  return false
}

const kindMatchesFilter = (kind: DeviceTreeNodeKind, filter: DeviceTypeFilter): boolean => {
  if (filter === 'all') return true
  if (kind === 'group' || kind === 'scp' || kind === 'sio' || kind === 'module') return true
  return kind === filter
}

const filterTree = (nodes: DeviceTreeNode[], query: string, typeFilter: DeviceTypeFilter): DeviceTreeNode[] => {
  const out: DeviceTreeNode[] = []
  for (const node of nodes) {
    if (node.kind === 'group') {
      const kids = node.children ? filterTree(node.children, query, typeFilter) : []
      if (kids.length > 0) out.push({ ...node, children: kids })
      continue
    }
    if (!kindMatchesFilter(node.kind, typeFilter)) continue
    const kids = node.children ? filterTree(node.children, query, typeFilter) : []
    if (
      matchesSearch(node.label, query, node.entityId) ||
      kids.length > 0
    ) {
      out.push({ ...node, children: kids.length > 0 ? kids : undefined })
    }
  }
  return out
}

const attachPeripherals = (
  sioNode: DeviceTreeNode,
  sioId: number,
  readers: ReaderInfo[],
  inputs: InputInfo[],
  outputs: OutputInfo[],
  typeFilter: DeviceTypeFilter,
): DeviceTreeNode => {
  const children: DeviceTreeNode[] = []

  for (const r of readers.filter((x) => x.sio === sioId && !isStandaloneReader(x))) {
    if (typeFilter !== 'all' && typeFilter !== 'reader') continue
    children.push({
      key: `reader:${r.scp}:${r.id}`,
      kind: 'reader',
      label: entityLabel('reader', r),
      active: r.active,
      scpId: r.scp,
      entityId: r.id,
    })
  }
  for (const i of inputs.filter((x) => x.sio === sioId)) {
    if (typeFilter !== 'all' && typeFilter !== 'input') continue
    children.push({
      key: `input:${i.scp}:${i.id}`,
      kind: 'input',
      label: entityLabel('input', i),
      active: i.active,
      scpId: i.scp,
      entityId: i.id,
    })
  }
  for (const o of outputs.filter((x) => x.sio === sioId)) {
    if (typeFilter !== 'all' && typeFilter !== 'output') continue
    children.push({
      key: `output:${o.scp}:${o.id}`,
      kind: 'output',
      label: entityLabel('output', o),
      active: o.active,
      scpId: o.scp,
      entityId: o.id,
    })
  }

  return { ...sioNode, children: children.length > 0 ? children : undefined }
}

const buildScpSubtree = (
  scp: ScpInfo,
  data: ScpChildData | undefined,
  typeFilter: DeviceTypeFilter,
): DeviceTreeNode => {
  const sios = data?.sios ?? []
  const readers = data?.readers ?? []
  const inputs = data?.inputs ?? []
  const outputs = data?.outputs ?? []

  const sioChildren = sios.map((sio) => {
    const base: DeviceTreeNode = {
      key: `sio:${scp.id}:${sio.id}`,
      kind: 'sio',
      label: entityLabel('sio', sio),
      active: sio.active,
      scpId: scp.id,
      entityId: sio.id,
    }
    return attachPeripherals(base, sio.id, readers, inputs, outputs, typeFilter)
  })

  const directChildren: DeviceTreeNode[] = []

  if (typeFilter === 'all' || typeFilter === 'reader') {
    for (const r of readers.filter((x) => x.sio <= 0 && !isStandaloneReader(x))) {
      directChildren.push({
        key: `reader:${r.scp}:${r.id}`,
        kind: 'reader',
        label: entityLabel('reader', r),
        active: r.active,
        scpId: r.scp,
        entityId: r.id,
      })
    }
  }
  if (typeFilter === 'all' || typeFilter === 'input') {
    for (const i of inputs.filter((x) => x.sio <= 0)) {
      directChildren.push({
        key: `input:${i.scp}:${i.id}`,
        kind: 'input',
        label: entityLabel('input', i),
        active: i.active,
        scpId: i.scp,
        entityId: i.id,
      })
    }
  }
  if (typeFilter === 'all' || typeFilter === 'output') {
    for (const o of outputs.filter((x) => x.sio <= 0)) {
      directChildren.push({
        key: `output:${o.scp}:${o.id}`,
        kind: 'output',
        label: entityLabel('output', o),
        active: o.active,
        scpId: o.scp,
        entityId: o.id,
      })
    }
  }

  const children = [...sioChildren, ...directChildren]

  return {
    key: `scp:${scp.id}`,
    kind: 'scp',
    label: entityLabel('scp', scp),
    active: scp.active,
    scpId: scp.id,
    entityId: scp.id,
    children: children.length > 0 ? children : undefined,
  }
}

export const buildDeviceTree = ({
  scps,
  childDataByScp,
  modules,
  searchQuery,
  typeFilter,
}: BuildTreeInput): DeviceTreeNode[] => {
  const controllerChildren = scps.map((scp) =>
    buildScpSubtree(scp, childDataByScp.get(scp.id), typeFilter),
  )

  const standaloneReaders: ReaderInfo[] = []
  if (typeFilter === 'all' || typeFilter === 'reader') {
    childDataByScp.forEach((data) => {
      data.readers.forEach((r) => {
        if (isStandaloneReader(r)) standaloneReaders.push(r)
      })
    })
  }

  const standaloneChildren: DeviceTreeNode[] = standaloneReaders.map((r) => ({
    key: `reader:standalone:${r.id}`,
    kind: 'reader',
    label: entityLabel('reader', r),
    active: r.active,
    scpId: r.scp > 0 ? r.scp : 0,
    entityId: r.id,
  }))

  const moduleChildren: DeviceTreeNode[] = modules.map((m) => ({
    key: `module:${m.moduleType}`,
    kind: 'module',
    label: moduleLabel(m),
    active: m.connectedAt ? 1 : 0,
    scpId: 0,
    entityId: 0,
  }))

  const roots: DeviceTreeNode[] = [
    {
      key: GROUP_CONTROLLERS,
      kind: 'group',
      label: '제어기',
      active: 1,
      scpId: 0,
      entityId: 0,
      children: controllerChildren,
    },
    {
      key: GROUP_STANDALONE,
      kind: 'group',
      label: '단독 리더',
      active: 1,
      scpId: 0,
      entityId: 0,
      children: standaloneChildren.length > 0 ? standaloneChildren : undefined,
    },
    {
      key: GROUP_MODULES,
      kind: 'group',
      label: '진단 모니터',
      active: 1,
      scpId: 0,
      entityId: 0,
      children: moduleChildren.length > 0 ? moduleChildren : undefined,
    },
  ]

  return filterTree(roots, searchQuery, typeFilter)
}

export type ParsedDeviceNode =
  | { kind: 'scp'; scpId: number; entityId: number }
  | { kind: 'sio'; scpId: number; entityId: number }
  | { kind: 'reader'; scpId: number; entityId: number; standalone: boolean }
  | { kind: 'input'; scpId: number; entityId: number }
  | { kind: 'output'; scpId: number; entityId: number }
  | { kind: 'module'; moduleType: string }

export const parseDeviceNodeKey = (key: string): ParsedDeviceNode | null => {
  if (key.startsWith('group:')) return null
  const parts = key.split(':')
  if (parts.length < 2) return null
  const [kind, ...rest] = parts
  if (kind === 'module' && rest.length >= 1) {
    return { kind: 'module', moduleType: rest.join(':') }
  }
  if (kind === 'scp' && rest.length === 1) {
    const scpId = Number(rest[0])
    if (!Number.isFinite(scpId)) return null
    return { kind: 'scp', scpId, entityId: scpId }
  }
  if (kind === 'sio' && rest.length === 2) {
    const scpId = Number(rest[0])
    const entityId = Number(rest[1])
    if (!Number.isFinite(scpId) || !Number.isFinite(entityId)) return null
    return { kind: 'sio', scpId, entityId }
  }
  if (kind === 'reader') {
    if (rest[0] === 'standalone' && rest.length === 2) {
      const entityId = Number(rest[1])
      if (!Number.isFinite(entityId)) return null
      return { kind: 'reader', scpId: 0, entityId, standalone: true }
    }
    if (rest.length === 2) {
      const scpId = Number(rest[0])
      const entityId = Number(rest[1])
      if (!Number.isFinite(scpId) || !Number.isFinite(entityId)) return null
      return { kind: 'reader', scpId, entityId, standalone: false }
    }
  }
  if ((kind === 'input' || kind === 'output') && rest.length === 2) {
    const scpId = Number(rest[0])
    const entityId = Number(rest[1])
    if (!Number.isFinite(scpId) || !Number.isFinite(entityId)) return null
    return { kind, scpId, entityId }
  }
  return null
}

export const collectScpIdsFromKeys = (keys: Iterable<string>): Set<number> => {
  const ids = new Set<number>()
  for (const key of keys) {
    const parsed = parseDeviceNodeKey(key)
    if (!parsed) continue
    if (parsed.kind === 'reader' && parsed.standalone) continue
    if (parsed.kind === 'module') continue
    if (parsed.scpId > 0) ids.add(parsed.scpId)
  }
  return ids
}

export const ancestorKeys = (key: string): string[] => {
  const parts = key.split(':')
  if (parts[0] === 'group') return [key]
  if (parts[0] === 'module') return [GROUP_MODULES, key]
  if (parts[0] === 'scp') return [GROUP_CONTROLLERS, key]
  if (parts.length >= 3) {
    const scpId = parts[1]
    return [GROUP_CONTROLLERS, `scp:${scpId}`, key]
  }
  if (parts[0] === 'reader' && parts[1] === 'standalone') {
    return [GROUP_STANDALONE, key]
  }
  return [key]
}
