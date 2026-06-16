import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { controlOutput, controlReader } from '@/api/deviceControl'
import { createInput, deleteInput, getInputList, updateInput } from '@/api/input'
import { getModuleList } from '@/api/modules'
import { createOutput, deleteOutput, getOutputList, updateOutput } from '@/api/output'
import { createReader, deleteReader, getReaderList, updateReader } from '@/api/reader'
import { createScp, deleteScp, getScpList, resetScp, updateScp } from '@/api/scp'
import { createSio, deleteSio, getSioList, updateSio } from '@/api/sio'
import { queryKeys } from '@/lib/query/queryKeys'
import type {
  CreateInputRequest,
  CreateOutputRequest,
  CreateReaderRequest,
  CreateScpRequest,
  CreateSioRequest,
  OutputControlAction,
  ReaderControlAction,
  UpdateInputRequest,
  UpdateOutputRequest,
  UpdateReaderRequest,
  UpdateScpRequest,
  UpdateSioRequest,
} from '@/types/api'

export const useScps = () =>
  useQuery({
    queryKey: queryKeys.deviceControl.scps(),
    queryFn: getScpList,
  })

export const useSios = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.deviceControl.sios(scpId),
    queryFn: () => getSioList(scpId),
    enabled: scpId > 0,
  })

export const useReaders = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.deviceControl.readers(scpId),
    queryFn: () => getReaderList(scpId),
    enabled: scpId > 0,
  })

export const useInputs = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.deviceControl.inputs(scpId),
    queryFn: () => getInputList(scpId),
    enabled: scpId > 0,
  })

export const useOutputs = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.deviceControl.outputs(scpId),
    queryFn: () => getOutputList(scpId),
    enabled: scpId > 0,
  })

export const useReaderListsForScps = (scps: { id: number }[]) =>
  useQueries({
    queries: scps.map((scp) => ({
      queryKey: queryKeys.deviceControl.readers(scp.id),
      queryFn: () => getReaderList(scp.id),
      enabled: scp.id > 0,
    })),
  })

export const useInputListsForScps = (scps: { id: number }[]) =>
  useQueries({
    queries: scps.map((scp) => ({
      queryKey: queryKeys.deviceControl.inputs(scp.id),
      queryFn: () => getInputList(scp.id),
      enabled: scp.id > 0,
    })),
  })

export const useOutputListsForScps = (scps: { id: number }[]) =>
  useQueries({
    queries: scps.map((scp) => ({
      queryKey: queryKeys.deviceControl.outputs(scp.id),
      queryFn: () => getOutputList(scp.id),
      enabled: scp.id > 0,
    })),
  })

export const useModules = () =>
  useQuery({
    queryKey: queryKeys.deviceControl.modules(),
    queryFn: async () => (await getModuleList()) ?? [],
  })

export const useCreateScp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateScpRequest) => createScp(data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.scps() }),
  })
}

export const useUpdateScp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScpRequest }) => updateScp(id, data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.scps() }),
  })
}

export const useDeleteScp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteScp(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.scps() }),
  })
}

export const useResetScp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => resetScp(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.scps() }),
  })
}

export const useCreateSio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, data }: { scpId: number; data: CreateSioRequest }) => createSio(scpId, data),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.sios(scpId) }),
  })
}

export const useUpdateSio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id, data }: { scpId: number; id: number; data: UpdateSioRequest }) =>
      updateSio(scpId, id, data),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.sios(scpId) }),
  })
}

export const useDeleteSio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id }: { scpId: number; id: number }) => deleteSio(scpId, id),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.sios(scpId) }),
  })
}

export const useCreateReader = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, data }: { scpId: number; data: CreateReaderRequest }) =>
      createReader(scpId, data),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.readers(scpId) }),
  })
}

export const useUpdateReader = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id, data }: { scpId: number; id: number; data: UpdateReaderRequest }) =>
      updateReader(scpId, id, data),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.readers(scpId) }),
  })
}

export const useDeleteReader = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id }: { scpId: number; id: number }) => deleteReader(scpId, id),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.readers(scpId) }),
  })
}

export const useCreateInput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, data }: { scpId: number; data: CreateInputRequest }) => createInput(scpId, data),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.inputs(scpId) }),
  })
}

export const useUpdateInput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id, data }: { scpId: number; id: number; data: UpdateInputRequest }) =>
      updateInput(scpId, id, data),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.inputs(scpId) }),
  })
}

export const useDeleteInput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id }: { scpId: number; id: number }) => deleteInput(scpId, id),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.inputs(scpId) }),
  })
}

export const useCreateOutput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, data }: { scpId: number; data: CreateOutputRequest }) =>
      createOutput(scpId, data),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.outputs(scpId) }),
  })
}

export const useUpdateOutput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id, data }: { scpId: number; id: number; data: UpdateOutputRequest }) =>
      updateOutput(scpId, id, data),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.outputs(scpId) }),
  })
}

export const useDeleteOutput = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, id }: { scpId: number; id: number }) => deleteOutput(scpId, id),
    onSuccess: (_r, { scpId }) =>
      void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.outputs(scpId) }),
  })
}

export const useControlReader = (scpId: number, readerId: number) =>
  useMutation({
    mutationFn: (action: ReaderControlAction) => controlReader(scpId, readerId, action),
  })

export const useControlOutput = (scpId: number, outputId: number) =>
  useMutation({
    mutationFn: (action: OutputControlAction) => controlOutput(scpId, outputId, action),
  })
