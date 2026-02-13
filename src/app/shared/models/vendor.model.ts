export type VendorType = 'Material' | 'Contractor' | 'Service';

// export interface Vendor {
//   id: number;
//   name: string;
//   phone: string;
//   vendorType: VendorType;
//   createdBy?: number;
//   createdAt?: string;
//   isPublic?: 0 | 1;
// }

export type CreateVendorDto = Omit<Vendor, 'id'>;
export interface Vendor {
  id: number;
  name: string;

  addressLine1?: string;
  addressLine2?: string;
  city?: string;

  contactPerson1?: string;
  contactNumber1?: string;
  contactPerson2?: string;
  contactNumber2?: string;

  dealsIn?: string;

  vendorType: VendorType;
  isPublic?: 0 | 1;
  createdBy?: number;
  createdAt?: string;
}