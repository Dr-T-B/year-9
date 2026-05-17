export interface SubjectGroup {
  id: string
  name: string
  colour: string
  icon: string
  skillCount: number
}

export const TOPIC_META: Record<number, { colour: string; icon: string }> = {
  // Chemistry topics
  1: { colour: 'bg-blue-500',   icon: '🧊' },
  2: { colour: 'bg-purple-500', icon: '⚛️'  },
  3: { colour: 'bg-green-500',  icon: '⚡'  },
  4: { colour: 'bg-orange-500', icon: '🧪'  },
  5: { colour: 'bg-red-500',    icon: '🔩'  },
  // Maths terms (101–106)
  101: { colour: 'bg-indigo-500', icon: '🔢' },  // Michaelmas 1
  102: { colour: 'bg-violet-500', icon: '📐' },  // Michaelmas 2
  103: { colour: 'bg-teal-500',   icon: '📊' },  // Lent 1
  104: { colour: 'bg-cyan-500',   icon: '⚖️'  },  // Lent 2
  105: { colour: 'bg-rose-500',   icon: '🔣' },  // Trinity 1
  106: { colour: 'bg-orange-500', icon: '🔵' },  // Trinity 2
}

export const mathsTerms: SubjectGroup[] = [
  { id: 'Michaelmas 1', name: 'Michaelmas 1', colour: 'bg-indigo-500', icon: '🔢', skillCount: 8 },
  { id: 'Michaelmas 2', name: 'Michaelmas 2', colour: 'bg-violet-500', icon: '📐', skillCount: 8 },
  { id: 'Lent 1',       name: 'Lent 1',       colour: 'bg-teal-500',   icon: '📊', skillCount: 12 },
  { id: 'Lent 2',       name: 'Lent 2',       colour: 'bg-cyan-500',   icon: '⚖️',  skillCount: 5 },
  { id: 'Trinity 1',    name: 'Trinity 1',    colour: 'bg-rose-500',   icon: '🔣', skillCount: 3 },
  { id: 'Trinity 2',    name: 'Trinity 2',    colour: 'bg-orange-500', icon: '🔵', skillCount: 2 },
]
