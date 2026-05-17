export type Difficulty = 'foundation' | 'standard' | 'stretch'

export interface GenerateRequest {
  skill_ref: string     // e.g. 'T3-08'
  difficulty: Difficulty
  count: number         // 1–10
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
  difficulty: Difficulty
}

export interface ErrorResponse {
  error: string
  detail?: string
}
