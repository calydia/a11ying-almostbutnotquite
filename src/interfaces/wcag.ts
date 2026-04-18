import type { RichTextNode } from 'a11ying-ui';

export type LocalizedField = {
  fi: string;
  en: string;
};

export type LocalizedRelation<T> = T & {
  fi: T;
  en: T;
};

export type RichTextContent = { root: { children: RichTextNode[] } };

export type RichTextField = {
  fi: RichTextContent | null;
  en: RichTextContent | null;
  root: { children: RichTextNode[] };
};
export interface Principle {
  slug: LocalizedField,
  pageUrl: LocalizedField,
  title: LocalizedField,
  metaDescription: LocalizedField,
  content: RichTextField,
  principleNumber: string
}

export interface Guideline {
  slug: LocalizedField, 
  pageUrl: LocalizedField,
  title: LocalizedField,
  metaDescription: LocalizedField,
  content: RichTextField,
  Principle: LocalizedRelation<Principle>,
  guidelineNumber: string
}

export interface Criterion {
  criterionNumber: string,
  criterionLevel: string,
  criterionSort: number,
  wcagVersion: string,
  slug: LocalizedField, 
  pageUrl: LocalizedField,
  title: LocalizedField,
  metaDescription: LocalizedField,
  cardContent: LocalizedField,
  content: RichTextField,
  Principle: LocalizedRelation<Principle>,
  Guideline: LocalizedRelation<Guideline>
}
