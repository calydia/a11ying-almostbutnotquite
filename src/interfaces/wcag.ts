import type RichTextNode from './RichText';

export type LocalizedField = {
  fi: string;
  en: string;
};

export type RichTextField = {
  fi: { root: { children: RichTextNode[] } } | null;
  en: { root: { children: RichTextNode[] } } | null;
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
  Principle: Principle,
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
  Principle: Principle,
  Guideline: Guideline
}