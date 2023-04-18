export namespace ChatGPT {
  export interface Language {
    language: string
    language_code: string
  }

  export type LanguageList = Array<Language>

  export interface Languages {
    languages: LanguageList
  }

  export interface LanguageState {
    language: string
    language_code: string
    state: 'pending' | 'done' | 'failed' | 'translating'
  }

  export const OriginalLanguage = 'Original language'
}
