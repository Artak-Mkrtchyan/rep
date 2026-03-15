import { ApiResponse } from '@/lib/api/auth.types';
import { httpClient } from '@/lib/api/http/client';
import { announcementsService } from '@/lib/api/announcements';

interface ApplicationResponse {
  id: string;
  publishedAnnouncementId?: string;
  status: { code: string; name: string };
}

const createAndSubmit = async (data: Record<string, unknown>): Promise<ApplicationResponse> => {
  const created = await httpClient.post<ApiResponse<ApplicationResponse>>(
    '/v1/applications/announcement-publication',
    data
  );
  const application = created.data || (created as unknown as ApplicationResponse);

  const submitted = await httpClient.patch<ApiResponse<ApplicationResponse>>(
    `/v1/applications/announcement-publication/${application.id}/submit`,
    {},
    { requiresAuth: true }
  );
  return submitted.data || (submitted as unknown as ApplicationResponse);
};

export async function createRentApartment(): Promise<ApplicationResponse> {
  console.log('[DEV] Creating rent apartment...');
  const result = await createAndSubmit({
    stepNumber: 5,
    listingType: 'FOR_RENT',
    propertyType: 'APARTMENT',
    processType: 'AS_INDIVIDUAL',
    title: 'Modern 2-bedroom apartment in city center',
    description: 'Bright and spacious apartment with balcony and city views',
    geo: {
      country: 'Armenia',
      formattedAddress: '15 Tumanyan St, Yerevan',
      locality: 'Yerevan',
      province: 'Yerevan',
      street: 'Tumanyan',
      house: '15',
      latitude: 40.1853,
      longitude: 44.5153,
    },
    property: {
      areaM2: 85,
      propertyType: 'APARTMENT',
      description: 'Renovated apartment with modern furniture',
      attributes: {
        type: 'APARTMENT',
        bedroomCount: 2,
        bathroomCount: 1,
        building: {
          buildingType: 'MONOLITH',
          floorNo: '5',
          numberOfFloors: 12,
          yearBuilt: 2020,
        },
        amenities: { balcony: true, elevator: true, hvac: true },
        ownershipAndCondition: { condition: 'EXCELLENT', ownershipType: 'FULL' },
      },
    },
    rentDetails: { monthlyRent: 350000, securityDeposit: 350000 },
  });
  console.log('[DEV] Rent apartment created:', result.id, 'status:', result.status.code);
  return result;
}

export async function createSaleHouse(): Promise<ApplicationResponse> {
  console.log('[DEV] Creating sale house...');
  const result = await createAndSubmit({
    stepNumber: 5,
    listingType: 'FOR_SALE',
    propertyType: 'HOUSE',
    processType: 'AS_INDIVIDUAL',
    title: 'Spacious family house with garden',
    description: 'Beautiful 4-bedroom house with large garden and garage',
    geo: {
      country: 'Armenia',
      formattedAddress: '42 Baghramyan Ave, Yerevan',
      locality: 'Yerevan',
      province: 'Yerevan',
      street: 'Baghramyan',
      house: '42',
      latitude: 40.1932,
      longitude: 44.5048,
    },
    property: {
      areaM2: 220,
      propertyType: 'HOUSE',
      description: 'Renovated house with modern amenities',
      attributes: {
        type: 'HOUSE',
        bedroomCount: 4,
        bathroomCount: 2,
        gardenYard: true,
        landAreaM2: 500,
        houseAreaM2: 220,
        building: { buildingType: 'BRICK', numberOfFloors: 2, yearBuilt: 2018 },
        amenities: { balcony: true, attachedGarage: true, hvac: true },
        ownershipAndCondition: { condition: 'EXCELLENT', ownershipType: 'FULL' },
      },
    },
    saleDetails: { price: 95000000 },
  });
  console.log('[DEV] Sale house created:', result.id, 'status:', result.status.code);
  return result;
}

export async function createCommercialSpace(): Promise<ApplicationResponse> {
  console.log('[DEV] Creating commercial space...');
  const result = await createAndSubmit({
    stepNumber: 5,
    listingType: 'FOR_RENT',
    propertyType: 'COMMERCIAL_SPACE',
    processType: 'AS_INDIVIDUAL',
    title: 'Office space in business district',
    description: 'Open-plan office with meeting rooms and parking',
    geo: {
      country: 'Armenia',
      formattedAddress: '8 Northern Ave, Yerevan',
      locality: 'Yerevan',
      province: 'Yerevan',
      street: 'Northern Avenue',
      house: '8',
      latitude: 40.1856,
      longitude: 44.5131,
    },
    property: {
      areaM2: 150,
      propertyType: 'COMMERCIAL_SPACE',
      description: 'Modern office with all facilities',
      attributes: {
        type: 'COMMERCIAL_SPACE',
        buildingType: 'OFFICE',
        building: { buildingType: 'MONOLITH', floorNo: '3', numberOfFloors: 8, yearBuilt: 2022 },
        facilities: {
          heating: true,
          coolingHvac: true,
          internetConnectivity: true,
          elevator: true,
        },
      },
    },
    rentDetails: { monthlyRent: 500000, securityDeposit: 1000000 },
  });
  console.log('[DEV] Commercial space created:', result.id, 'status:', result.status.code);
  return result;
}

export async function favouriteExistingAnnouncements(count = 3): Promise<string[]> {
  console.log(`[DEV] Favouriting ${count} existing announcements...`);
  const list = await announcementsService.searchAnnouncements({
    pagination: { pageNumber: 0, pageSize: count },
    sorts: [{ sort: 'CREATED_AT', direction: 'DESC' }],
  });

  const ids: string[] = [];
  for (const announcement of list.content) {
    if (!announcement.favourite) {
      try {
        await announcementsService.addToFavourites(announcement.id);
        ids.push(announcement.id);
        console.log('[DEV] Favourited:', announcement.id, '-', announcement.title);
      } catch (err) {
        console.warn('[DEV] Failed to favourite:', announcement.id, err);
      }
    }
  }
  return ids;
}

export async function seedAll(): Promise<void> {
  console.log('[DEV] === Starting seed ===');
  try {
    await Promise.allSettled([createRentApartment(), createSaleHouse(), createCommercialSpace()]);
    await favouriteExistingAnnouncements(3);
    console.log('[DEV] === Seed complete ===');
  } catch (err) {
    console.error('[DEV] Seed failed:', err);
  }
}
