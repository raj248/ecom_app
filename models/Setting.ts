export interface Setting {
  _id: string;
  name: string;
  setting: Record<string, any>; // since schema allows anything
  createdAt: string;
  updatedAt: string;
}

// types/StoreCustomizationSetting.ts

export interface LocalizedString {
  en: string;
  de: string;
}

export interface NavbarSetting {
  categories_menu_status: boolean;
  about_menu_status: boolean;
  contact_menu_status: boolean;
  offers_menu_status: boolean;
  term_and_condition_status: boolean;
  privacy_policy_status: boolean;
  faq_status: boolean;
  help_text: LocalizedString;
  categories: LocalizedString;
  about_us: LocalizedString;
  contact_us: LocalizedString;
  offers: LocalizedString;
  faq: LocalizedString;
  privacy_policy: LocalizedString;
  term_and_condition: LocalizedString;
  pages: LocalizedString;
  my_account: LocalizedString;
  login: LocalizedString;
  logout: LocalizedString;
  checkout: LocalizedString;
  phone: string;
  logo: string;
}

export interface SliderSetting {
  left_right_arrow: boolean;
  bottom_dots: boolean;
  both_slider: boolean;
  first_img?: string;
  first_title?: LocalizedString;
  first_description?: LocalizedString;
  first_button?: LocalizedString;
  first_link?: string;
  second_img?: string;
  second_title?: LocalizedString;
  second_description?: LocalizedString;
  second_button?: LocalizedString;
  second_link?: string;
  third_img?: string;
  third_title?: LocalizedString;
  third_description?: LocalizedString;
  third_button?: LocalizedString;
  third_link?: string;
  four_img?: string;
  four_title?: LocalizedString;
  four_description?: LocalizedString;
  four_button?: LocalizedString;
  four_link?: string;
  five_img?: string;
  five_title?: LocalizedString;
  five_description?: LocalizedString;
  five_button?: LocalizedString;
  five_link?: string;
}

export interface SeoSetting {
  favicon: string;
  meta_description: string;
  meta_img: string;
  meta_keywords: string;
  meta_title: string;
  meta_url: string;
}

export interface StoreCustomizationSetting {
  navbar: NavbarSetting;
  home: Record<string, any>; // you can expand similar to Navbar/Slider if you need strong typing
  about_us: Record<string, any>;
  contact_us: Record<string, any>;
  offers: Record<string, any>;
  privacy_policy: Record<string, any>;
  term_and_condition: Record<string, any>;
  faq: Record<string, any>;
  slider: SliderSetting;
  checkout: Record<string, any>;
  dashboard: Record<string, any>;
  footer: Record<string, any>;
  slug: Record<string, any>;
  seo: SeoSetting;
}
