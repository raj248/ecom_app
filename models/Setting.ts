export interface Setting {
  _id: string;
  name: string;
  setting: Record<string, any>; // since schema allows anything
  createdAt: string;
  updatedAt: string;
}
