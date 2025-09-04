export interface Principle {
  slug: {
    en: string,
    fi: string
  }, 
  pageUrl: {
    en: string,
    fi: string,
  },
  title: {
    en: string,
    fi: string,
  },
  metaDescription: {
    en: string,
    fi: string,
  },
  principleNumber: string
}

export interface Guideline {
  slug: {
    en: string,
    fi: string
  }, 
  pageUrl: {
    en: string,
    fi: string,
  },
  title: {
    en: string,
    fi: string,
  },
  metaDescription: {
    en: string,
    fi: string,
  },
  guidelineNumber: string
}

export default interface Criterion {
  criterionNumber: string,
  criterionLevel: string,
  criterionSort: number,
  wcagVersion: string,
  slug: {
    en: string,
    fi: string
  }, 
  pageUrl: {
    en: string,
    fi: string,
  },
  title: {
    en: string,
    fi: string,
  },
  metaDescription: {
    en: string,
    fi: string,
  },
  cardContent: {
    en: string,
    fi: string,
  },
  Principle: Principle[],
  Guideline: Guideline[]
}