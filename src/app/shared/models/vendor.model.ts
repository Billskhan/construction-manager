export type VendorType = 'Material' | 'Contractor' | 'Service';

export interface Vendor {
  id: number;
  name: string;
  phone: string;
  vendorType: VendorType;
  createdBy?: number;
  createdAt?: string;
  isPublic?: 0 | 1;
}
