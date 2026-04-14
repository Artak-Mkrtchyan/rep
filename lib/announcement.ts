import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { MetaData, Property, RentForApartmentsForm } from '@/types/announcement';
import * as Yup from 'yup';
import { AnnouncementPublicationResponse } from './api/applications';

export type AnnouncementRoutePath =
  (typeof ANNOUNCEMENT_ROUTES)[keyof typeof ANNOUNCEMENT_ROUTES]['path'];

const ROUTES = Object.values(ANNOUNCEMENT_ROUTES);

export const getTargetRoute = (step: number): AnnouncementRoutePath => {
  const route = ROUTES.find((r) => r.completedStep === step);
  return (route?.path ?? ANNOUNCEMENT_ROUTES.RENT_BASIC_INFO.path) as AnnouncementRoutePath;
};

export const getTargetRouteByName = (step: number, routeName?: string): AnnouncementRoutePath => {
  const routes = ROUTES.filter((route) => route.completedStep === step);

  if (routes.length === 0) {
    return ANNOUNCEMENT_ROUTES.RENT_BASIC_INFO.path;
  }

  const found = routes.find((route) => route.name === routeName);

  return found ? found.path : routes[0].path;
};

export const getCurrentStep = (path: string): number | undefined => {
  const route = ROUTES.find((r) => r.path === path);
  return route?.completedStep;
};

export const getParsedAnnouncementData = (
  response: AnnouncementPublicationResponse
): { formData: RentForApartmentsForm; metaData: MetaData } => {
  try {
    const mediaFileIds: string[] = [];
    const tempMediaFiles: { id: string; uri: string; type?: string; name?: string }[] = [];

    response.mediaFiles.forEach((media) => {
      mediaFileIds.push(media.id);
      tempMediaFiles.push({
        id: media.id,
        uri: media.url,
        type: media.fileType,
        name: media.fileName,
      });
    });

    return {
      metaData: {
        response: {
          id: response.id,
          publicId: response.publicId,
          status: response.status,
          createdAt: response.createdAt,
          createdBy: response.createdBy,
          applicantEmail: response.applicantEmail,
        },
        tempMediaFiles,
        brokerId: response.assignedBrokerId,
      },
      formData: {
        stepNumber: response.stepNumber,
        listingType: response.listingType,
        geo: response.geo,
        propertyType: response.propertyType,
        processType: response.processType,
        needPhotographer: response.needPhotographer,
        needAssessmentExpert: response.needAssessmentExpert,
        infrastructureObjects: response.infrastructureObjects,
        property: response.property,
        description: response.description,
        rentDetails: response.rentDetails,
        saleDetails: response.saleDetails,
        mediaFileIds,
        documentIds: response.documentIds,
        title: response.title,
        brokerAssignmentNeeded: response.brokerAssignmentNeeded,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getPropertyTypeInfo = (type: Property | '') => ({
  isApartment: type === 'APARTMENT',
  isCommercialSpace: type === 'COMMERCIAL_SPACE',
  isGarage: type === 'GARAGE',
  isHouse: type === 'HOUSE',
  isLand: type === 'LAND',
  isParkingSpace: type === 'PARKING_SPACE',
});

const PropertyInfoApartmentsSchema = Yup.object().shape({
  property: Yup.object().shape({
    areaM2: Yup.number().required('Required').typeError('Must be a number'),
    attributes: Yup.object().shape({
      bedroomCount: Yup.number().required('Required').typeError('Must be a number'),
      bathroomCount: Yup.number().required('Required').typeError('Must be a number'),
    }),
  }),
});

const PropertyInfoCommercialSpacesSchema = Yup.object().shape({
  property: Yup.object().shape({
    areaM2: Yup.number().required('Required').typeError('Must be a number'),
    attributes: Yup.object().shape({
      usableAreaM2: Yup.number().required('Required').typeError('Must be a number'),
      buildingType: Yup.string().required('Required'),
    }),
  }),
});

const PropertyInfoGaragesSchema = Yup.object().shape({
  property: Yup.object().shape({
    areaM2: Yup.number().required('Required').typeError('Must be a number'),
    attributes: Yup.object().shape({
      spaceSize: Yup.string().required('Required'),
      garageType: Yup.string().required('Required'),
    }),
  }),
});

const PropertyInfoHousesSchema = Yup.object().shape({
  property: Yup.object().shape({
    areaM2: Yup.number().required('Required').typeError('Must be a number'),
    attributes: Yup.object().shape({
      bedroomCount: Yup.number().required('Required').typeError('Must be a number'),
      bathroomCount: Yup.number().required('Required').typeError('Must be a number'),
      landAreaM2: Yup.number().required('Required').typeError('Must be a number'),
      houseAreaM2: Yup.number().required('Required').typeError('Must be a number'),
    }),
  }),
});

const PropertyInfoLandSchema = Yup.object().shape({
  property: Yup.object().shape({
    areaM2: Yup.number().required('Required').typeError('Must be a number'),
    attributes: Yup.object().shape({
      landType: Yup.string().required('Required'),
      landAreaM2: Yup.number().required('Required').typeError('Must be a number'),
      permittedUse: Yup.string().required('Required'),
    }),
  }),
});

const PropertyInfoParkingSpacesSchema = Yup.object().shape({
  property: Yup.object().shape({
    areaM2: Yup.number().required('Required').typeError('Must be a number'),
    attributes: Yup.object().shape({
      spaceSize: Yup.string().required('Required'),
      parkingType: Yup.string().required('Required'),
    }),
  }),
});

const CharacteristicsSchema = Yup.object().shape({
  building: Yup.object().shape({
    buildingType: Yup.string().required('Required'),
    yearBuilt: Yup.number().required('Required').typeError('Must be a number'),
  }),
  ownershipAndCondition: Yup.object().shape({
    condition: Yup.string().required('Required'),
    ownershipType: Yup.string().required('Required'),
  }),
});

const CommercialSpaceCharacteristicsSchema = Yup.object().shape({
  building: Yup.object().shape({
    buildingType: Yup.string().required('Required'),
  }),
  facilities: Yup.object().shape({
    restroomsCount: Yup.number().required('Required').typeError('Must be a number'),
  }),
});

const LandCharacteristicsSchema = Yup.object().shape({
  roadAccess: Yup.object().shape({
    roadType: Yup.string().required('Required'),
  }),
});

export const getSchemaForPropertyType = (type: Property | '') => {
  if (type === 'APARTMENT') {
    return PropertyInfoApartmentsSchema;
  }
  if (type === 'COMMERCIAL_SPACE') {
    return PropertyInfoCommercialSpacesSchema;
  }
  if (type === 'GARAGE') {
    return PropertyInfoGaragesSchema;
  }
  if (type === 'HOUSE') {
    return PropertyInfoHousesSchema;
  }
  if (type === 'LAND') {
    return PropertyInfoLandSchema;
  }
  if (type === 'PARKING_SPACE') {
    return PropertyInfoParkingSpacesSchema;
  }
  return undefined;
};

export const getCharacteristicsSchemaForPropertyType = (type: Property | '') => {
  if (type === 'APARTMENT' || type === 'HOUSE') {
    return CharacteristicsSchema;
  }

  if (type === 'COMMERCIAL_SPACE') {
    return CommercialSpaceCharacteristicsSchema;
  }

  if (type === 'LAND') {
    return LandCharacteristicsSchema;
  }

  return undefined;
};
