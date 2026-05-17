import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ChemSkill, TopicGroup } from './useChemSkills'
import { mathsTerms, type SubjectGroup } from '../lib/topics'

interface MathsSkillRow {
  id: string
  skill_ref: string
  term: string
  skill_name: string
  sort_order: number
}

const TERM_TO_TOPIC_NUM: Record<string, number> = {
  'Michaelmas 1': 101,
  'Michaelmas 2': 102,
  'Lent 1':       103,
  'Lent 2':       104,
  'Trinity 1':    105,
  'Trinity 2':    106,
}

function rowToChemSkill(row: MathsSkillRow): ChemSkill {
  return {
    id: row.id,
    skill_ref: row.skill_ref,
    skill_text: row.skill_name,
    topic_num: TERM_TO_TOPIC_NUM[row.term] ?? 101,
    topic_name: row.term,
    question_type: '',
    diagram_req: false,
    ao_tag: '',
  }
}

export function useMathsSkills() {
  const [topics, setTopics] = useState<TopicGroup[]>([])
  const [groups, setGroups] = useState<SubjectGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('maths_skills')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const rows = data as MathsSkillRow[]

      // Group by term into TopicGroup[] for SkillSelector compatibility
      const grouped = rows.reduce<TopicGroup[]>((acc, row) => {
        const topicNum = TERM_TO_TOPIC_NUM[row.term] ?? 101
        let group = acc.find(g => g.topic_num === topicNum)
        if (!group) {
          group = {
            topic_num: topicNum,
            topic_name: row.term,
            skills: [],
          }
          acc.push(group)
        }
        group.skills.push(rowToChemSkill(row))
        return acc
      }, [])

      setTopics(grouped)

      // Build SubjectGroup[] for TopicSelector — use mathsTerms as template,
      // replacing skillCount with actual counts from fetched data
      const skillCountByTerm = rows.reduce<Record<string, number>>((acc, row) => {
        acc[row.term] = (acc[row.term] ?? 0) + 1
        return acc
      }, {})
      const actualGroups: SubjectGroup[] = mathsTerms.map(t => ({
        ...t,
        skillCount: skillCountByTerm[t.id] ?? t.skillCount,
      }))

      setGroups(actualGroups)
      setLoading(false)
    }

    fetch()
  }, [])

  return { topics, groups, loading, error }
}
