import type { InputInfo, OutputInfo, ReaderInfo, ScpInfo, SioInfo } from '@/types/api'
import { entityLabel, isStandaloneReader } from '@/pages/DevicesPage/utils/deviceHelpers'

export type DeviceTreeNodeKind =
  | 'group'
  | 'scp'
  | 'sio'
  | 'reader'
  | 'input'
  | 'output'

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
  searchQuery: string
}

const GROUP_CONTROLLERS = 'group:controllers'
const GROUP_STANDALONE = 'group:standalone'

export const matchesSearch = (label: string, query: string): boolean => {
  if (!query.trim()) return true
  return label.toLowerCase().includes(query.trim().toLowerCase())
}

const filterTree = (nodes: DeviceTreeNode[], query: string): DeviceTreeNode[] => {
  if (!query.trim()) return nodes
  const out: DeviceTreeNode[] = []
  for (const node of nodes) {
    if (node.kind === 'group') {
      const kids = node.children ? filterTree(node.children, query) : []
      if (kids.length > 0) out.push({ ...node, children: kids })
      continue
    }
    const kids = node.children ? filterTree(node.children, query) : []
    if (matchesSearch(node.label, query) || kids.length > 0) {
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
): DeviceTreeNode => {
  const children: DeviceTreeNode[] = []

  for (const r of readers.filter((x) => x.sio === sioId && !isStandaloneReader(x))) {
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

const buildScpSubtree = (scp: ScpInfo, data: ScpChildData | undefined): DeviceTreeNode => {
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
    return attachPeripherals(base, sio.id, readers, inputs, outputs)
  })

  const directChildren: DeviceTreeNode[] = []

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
  searchQuery,
}: BuildTreeInput): DeviceTreeNode[] => {
  const controllerChildren = scps.map((scp) =>
    buildScpSubtree(scp, childDataByScp.get(scp.id)),
  )

  const standaloneReaders: ReaderInfo[] = []
  childDataByScp.forEach((data) => {
    data.readers.forEach((r) => {
      if (isStandaloneReader(r)) standaloneReaders.push(r)
    })
  })

  const standaloneChildren: DeviceTreeNode[] = standaloneReaders.map((r) => ({
    key: `reader:standalone:${r.id}`,
    kind: 'reader',
    label: entityLabel('reader', r),
    active: r.active,
    scpId: r.scp > 0 ? r.scp : 0,
    entityId: r.id,
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
  ]

  return filterTree(roots, searchQuery)
}

export type ParsedDeviceNode =
  | { kind: 'scp'; scpId: number; entityId: number }
  | { kind: 'sio'; scpId: number; entityId: number }
  | { kind: 'reader'; scpId: number; entityId: number; standalone: boolean }
  | { kind: 'input'; scpId: number; entityId: number }
  | { kind: 'output'; scpId: number; entityId: number }

export const parseDeviceNodeKey = (key: string): ParsedDeviceNode | null => {
  if (key.startsWith('group:')) return null
  const parts = key.split(':')
  if (parts.length < 2) return null
  const [kind, ...rest] = parts
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

/** 트리 노드·자손에서 SCP ID 수집 (하위 데이터 로드용) */
export const collectScpIdsFromKeys = (keys: Iterable<string>): Set<number> => {
  const ids = new Set<number>()
  for (const key of keys) {
    const parsed = parseDeviceNodeKey(key)
    if (!parsed) continue
    if (parsed.kind === 'reader' && parsed.standalone) continue
    if (parsed.scpId > 0) ids.add(parsed.scpId)
  }
  return ids
}

export const ancestorKeys = (key: string): string[] => {
  const parts = key.split(':')
  if (parts[0] === 'group') return [key]
  if (parts[0] === 'scp') return [`group:controllers`, key]
  if (parts.length >= 3) {
    const scpId = parts[1]
    return [`group:controllers`, `scp:${scpId}`, key]
  }
  if (parts[0] === 'reader' && parts[1] === 'standalone') {
    return [GROUP_STANDALONE, key]
  }
  return [key]
}
