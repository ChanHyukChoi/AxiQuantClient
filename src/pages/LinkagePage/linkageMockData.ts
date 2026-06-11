import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

export const LINKAGE_MOCK_RULES: LinkageRule[] = [
  {
    id: 1,
    name: 'ADAM-01 INPUT-1 Invert - ADAM-01 OUTPUT-1 Normal',
    active: true,
    when: [
      {
        id: 1,
        event: 'ADAM Input Active',
        controller: 'ADAM-01',
        device: 'INPUT 1',
        formula: '',
        invert: true,
      },
    ],
    then: [
      {
        id: 1,
        function: 'ADAM Output Active',
        controller: 'ADAM-01',
        device: 'OUTPUT 1',
        mode: 'SYNC',
      },
    ],
  },
  {
    id: 2,
    name: 'ADAM-01 INPUT-2 Normal - ADAM-01 OUTPUT-2 Normal',
    active: true,
    when: [
      {
        id: 1,
        event: 'ADAM Input Active',
        controller: 'ADAM-01',
        device: 'INPUT 2',
        formula: '',
        invert: false,
      },
    ],
    then: [
      {
        id: 1,
        function: 'ADAM Output Active',
        controller: 'ADAM-01',
        device: 'OUTPUT 2',
        mode: 'SYNC',
      },
    ],
  },
  {
    id: 3,
    name: 'ADAM-01 INPUT-3 Normal OR ADAM-01 INPUT-4 Normal - ADAM-01 OUTPUT-3 Normal',
    active: true,
    when: [
      {
        id: 1,
        event: 'ADAM Input Active',
        controller: 'ADAM-01',
        device: 'INPUT 3',
        formula: 'OR',
        invert: false,
      },
      {
        id: 2,
        event: 'ADAM Input Active',
        controller: 'ADAM-01',
        device: 'INPUT 4',
        formula: '',
        invert: false,
      },
    ],
    then: [
      {
        id: 1,
        function: 'ADAM Output Active',
        controller: 'ADAM-01',
        device: 'OUTPUT 3',
        mode: 'SYNC',
      },
    ],
  },
  {
    id: 4,
    name: 'ADAM-02 INPUT-1 Normal - ADAM-02 OUTPUT-1 Normal',
    active: false,
    when: [
      {
        id: 1,
        event: 'ADAM Input Active',
        controller: 'ADAM-02',
        device: 'INPUT 1',
        formula: '',
        invert: false,
      },
    ],
    then: [
      {
        id: 1,
        function: 'ADAM Output Active',
        controller: 'ADAM-02',
        device: 'OUTPUT 1',
        mode: 'SYNC',
      },
    ],
  },
]
