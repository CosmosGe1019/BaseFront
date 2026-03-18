export interface AISettings {
  AIs: AISetting[] // AI 设定列表
}

export interface AISetting {
  id: number
  name: string
  desc: string
  personality: string
  knowledge: string[]
}

export interface AINameAndDesc {
  desc: string
  personality: string
}
