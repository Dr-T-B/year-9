export type Difficulty = 'foundation' | 'standard' | 'stretch'
export type MathsDifficulty = 'easy' | 'medium' | 'hard'

export interface GenerateRequest {
  skill_ref: string                      // e.g. 'T3-08' or 'MA1-01'
  difficulty: Difficulty | MathsDifficulty
  count: number                          // 1–10
  subject?: 'chemistry' | 'maths'       // defaults to 'chemistry'
}

export interface Problem {
  question: string
  hint: string
  answer: string
}

export interface GenerateResponse {
  problems: Problem[]
  source: 'cache' | 'generated'
  skill_ref: string
  difficulty: Difficulty | MathsDifficulty
}

export interface ErrorResponse {
  error: string
  detail?: string
}

export interface SkillTipResponse {
  common_error: string
  concept: string
}
