export type VendorType = 'Material' | 'Contractor' | 'Service';

export interface Vendor {
  id?: number;
  projectId: number;
  name: string;
  phone: string;
  vendorType: VendorType;
  hasApp?: boolean;
  createdAt?: string;
}
