export interface glossaryData {
  docs: {
    glossaryTerms: {
      data: [{
        attributes: {
          termName: string,
          termDescription: string
        }
      }]
    }
  }
}

export interface glossaryItem {
  termName: string,
  termDescription: string,
  wcagRelated?: boolean
}
