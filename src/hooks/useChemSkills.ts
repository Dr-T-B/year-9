import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface ChemSkill {
  id: string
  topic_num: number
  topic_name: string
  skill_ref: string
  skill_text: string
  question_type: string
  diagram_req: boolean
  ao_tag: string
}

export interface TopicGroup {
  topic_num: number
  topic_name: string
  skills: ChemSkill[]
}

export function useChemSkills() {
  const [topics, setTopics] = useState<TopicGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('chem_skills')
        .select('*')
        .order('topic_num', { ascending: true })
        .order('skill_ref', { ascending: true })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // Group by topic
      const grouped = (data as ChemSkill[]).reduce<TopicGroup[]>((acc, skill) => {
        let group = acc.find(g => g.topic_num === skill.topic_num)
        if (!group) {
          group = {
            topic_num: skill.topic_num,
            topic_name: skill.topic_name,
            skills: [],
          }
          acc.push(group)
        }
        group.skills.push(skill)
        return acc
      }, [])

      setTopics(grouped)
      setLoading(false)
    }

    fetch()
  }, [])

  return { topics, loading, error }
}
