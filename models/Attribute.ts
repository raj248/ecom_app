// types/attribute.ts

export type LocalizedText = {
  [lang: string]: string; // e.g. { en: "Color", fr: "Couleur" }
};

export interface AttributeVariant {
  _id: string;
  name: LocalizedText;
  status: 'show' | 'hide';
}

export type AttributeOption = 'dropdown' | 'radio' | 'checkbox';
export interface Attribute {
  _id: string;
  title: LocalizedText;
  name: LocalizedText;
  variants: AttributeVariant[];
  option: AttributeOption;
  values: LocalizedText[];
  type: 'attribute' | 'extra';
  status: 'show' | 'hide';
  createdAt: string;
  updatedAt: string;
}
