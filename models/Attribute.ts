// types/attribute.ts

export type LocalizedText = {
  [lang: string]: string; // e.g. { en: "Color", fr: "Couleur" }
};

export interface AttributeVariant {
  name: LocalizedText;
  status: 'show' | 'hide';
}

export interface Attribute {
  _id: string;
  title: LocalizedText;
  name: LocalizedText;
  variants: AttributeVariant[];
  option: 'dropdown' | 'radio' | 'checkbox';
  type: 'attribute' | 'extra';
  status: 'show' | 'hide';
  createdAt: string;
  updatedAt: string;
}
