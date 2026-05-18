import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createInput, deleteInput, getInputList, updateInput } from '@/api/input'
import { createOutput, deleteOutput, getOutputList, updateOutput } from '@/api/output'
import { createReader, deleteReader, getReaderList, updateReader } from '@/api/reader'
import { createScp, deleteScp, getScpList, updateScp } from '@/api/scp'
import { createSio, deleteSio, getSioList, updateSio } from '@/api/sio'
import { queryKeys } from '@/lib/query/queryKeys'
import type {
  CreateInputRequest,
  CreateOutputRequest,
  CreateReaderRequest,
  CreateScpRequest,
  CreateSioRequest,
  UpdateInputRequest,
  UpdateOutputRequest,
  UpdateReaderRequest,
  UpdateScpRequest,
  UpdateSioRequest,
} from '@/types/api'

export const useScps = () =>
  useQuery({ queryKey: queryKeys.devices.scps(), queryFn: getScpList })

export const useSios = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.devices.sios(scpId),
    queryFn: () => getSioList(scpId),
    enabled: scpId > 0,
  })

export const useReaders = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.devices.readers(scpId),
    queryFn: () => getReaderList(scpId),
    enabled: scpId > 0,
  })

export const useInputs = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.devices.inputs(scpId),
    queryFn: () => getInputList(scpId),
    enabled: scpId > 0,
  })

export const useOutputs = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.devices.outputs(scpId),
    queryFn: () => getOutputList(scpId),
    enabled: scpId > 0,
  })

export const useCreateScp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateScpRequest) => createScp(data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.devices.scps() }),
  })
}

export const useUpdateScp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScpRequest }) => updateScp(id, data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.devices.scps() }),
  })
}

export const useDeleteScp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteScp(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.devices.scps() }),
  })
}

export const useCreateSio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, data }: { scpId: number; data: CreateSioRequest }) => createSio(scpId, data),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.sios(scpId) }),
  })
}

export const useUpdateSio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id, data }: { scpId: number; id: number; data: UpdateSioRequest }) =>
      updateSio(scpId, id, data),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.sios(scpId) }),
  })
}

export const useDeleteSio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id }: { scpId: number; id: number }) => deleteSio(scpId, id),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.sios(scpId) }),
  })
}

export const useCreateReader = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, data }: { scpId: number; data: CreateReaderRequest }) =>
      createReader(scpId, data),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.readers(scpId) }),
  })
}

export const useUpdateReader = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id, data }: { scpId: number; id: number; data: UpdateReaderRequest }) =>
      updateReader(scpId, id, data),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.readers(scpId) }),
  })
}

export const useDeleteReader = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id }: { scpId: number; id: number }) => deleteReader(scpId, id),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.readers(scpId) }),
  })
}

export const useCreateInput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, data }: { scpId: number; data: CreateInputRequest }) => createInput(scpId, data),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.inputs(scpId) }),
  })
}

export const useUpdateInput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id, data }: { scpId: number; id: number; data: UpdateInputRequest }) =>
      updateInput(scpId, id, data),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.inputs(scpId) }),
  })
}

export const useDeleteInput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id }: { scpId: number; id: number }) => deleteInput(scpId, id),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.inputs(scpId) }),
  })
}

export const useCreateOutput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, data }: { scpId: number; data: CreateOutputRequest }) =>
      createOutput(scpId, data),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.outputs(scpId) }),
  })
}

export const useUpdateOutput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id, data }: { scpId: number; id: number; data: UpdateOutputRequest }) =>
      updateOutput(scpId, id, data),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.outputs(scpId) }),
  })
}

export const useDeleteOutput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id }: { scpId: number; id: number }) => deleteOutput(scpId, id),
    onSuccess: (_r, { scpId }) => void qc.invalidateQueries({ queryKey: queryKeys.devices.outputs(scpId) }),
  })
}

/** @deprecated useScps */
export const useScpList = useScps
