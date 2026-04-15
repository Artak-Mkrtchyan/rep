import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import {
  CharacteristicConfig,
  MetaData,
  Property,
  RentForApartmentsForm,
} from '@/types/announcement';
import { TFunction } from 'i18next';
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

export const getObjectCharacteristics = (t: TFunction): CharacteristicConfig[] => [
  {
    iconKey: 'floors',
    label: t('announcement.rent.floors'),
    getValue: (fd) => {
      const b = fd.property?.attributes?.building;
      return b?.floorNo != null && b?.numberOfFloors != null
        ? `${b.floorNo} of ${b.numberOfFloors}`
        : '—';
    },
  },
  {
    iconKey: 'area',
    label: t('announcement.rent.area'),
    getValue: (fd) => (fd.property?.areaM2 != null ? String(fd.property.areaM2) : '—'),
  },
  {
    iconKey: 'bedroom',
    label: t('announcement.rent.bedroom'),
    getValue: (fd) =>
      fd.property?.attributes?.bedroomCount != null
        ? String(fd.property.attributes.bedroomCount)
        : '—',
  },
  {
    iconKey: 'bathroom',
    label: t('announcement.rent.bathroom'),
    getValue: (fd) =>
      fd.property?.attributes?.bathroomCount != null
        ? String(fd.property.attributes.bathroomCount)
        : '—',
  },
  {
    iconKey: 'condition',
    label: t('announcement.rent.condition'),
    getValue: (_, h) => h.conditionLabel,
  },
  {
    iconKey: 'buildingType',
    label: t('announcement.rent.building_type'),
    getValue: (_, h) => h.buildingTypeLabel || '—',
  },
  {
    iconKey: 'yearBuilt',
    label: t('announcement.rent.year_built'),
    getValue: (fd) =>
      fd.property?.attributes?.building?.yearBuilt != null
        ? String(fd.property.attributes.building.yearBuilt)
        : '—',
  },
  {
    iconKey: 'ownershipType',
    label: t('announcement.rent.ownership_type'),
    getValue: (_, h) => h.ownershipLabel || '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.building_type_commercial'),
    getValue: (fd) =>
      fd.property?.attributes?.buildingType
        ? t(`building_options.${fd.property.attributes.buildingType.toLowerCase()}`)
        : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.hvac'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.hvac),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.balcony'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.balcony),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.elevator'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.elevator),
  },
  {
    iconKey: 'offStreetParking',
    label: t('announcement.rent.off_street_parking'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.offStreetParking),
  },
  {
    iconKey: 'attachedGarage',
    label: t('announcement.rent.attached_garage'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.attachedGarage),
  },
  {
    iconKey: 'detachedGarage',
    label: t('announcement.rent.detached_garage'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.detachedGarage),
  },
  {
    iconKey: 'washerAndLaundry',
    label: t('announcement.rent.washer_and_laundry'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.washerLaundry),
  },
  {
    iconKey: 'disabledAccess',
    label: t('announcement.rent.disabled_access'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.disabledAccess),
  },
  {
    iconKey: 'bicycleStorage',
    label: t('announcement.rent.bicycle_storage'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.bicycleStorage),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.amenities_ev_charging_station'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.evChargingStation),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.terrace'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.terrace),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.garden_yard'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.gardenYard),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.parking'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.parking),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.attribute_disabled_access'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.disabledAccess),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.attribute_ev_charging_station'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.evChargingStation),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.electricity_available'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.electricityAvailable),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.infrastructure_electricity_available'),
    getValue: (fd, h) =>
      h.formatYesNo(fd.property?.attributes?.infrastructure?.electricityAvailable),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.water_supply'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.infrastructure?.waterSupply),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.gas'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.infrastructure?.gas),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.sewage'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.infrastructure?.sewage),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.internet_available'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.infrastructure?.internetAvailable),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.road_access'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.roadAccess?.roadAccess),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.road_type'),
    getValue: (fd) => {
      const roadType = fd.property?.attributes?.roadAccess?.roadType;

      if (!roadType) {
        return '—';
      }

      return roadType === 'DIRT_ROAD'
        ? t('road_type_options.dirtRoad')
        : t(`road_type_options.${roadType.toLowerCase()}`);
    },
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.remote_automatic_door'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.remoteAutomaticDoor),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.motorcycle_bicycle_allowed'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.motorcycleBicycleAllowed),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.security_access_24_7'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.securityAccess?.access247),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.security_gated_entry'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.securityAccess?.gatedEntry),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.security_remote_control_access'),
    getValue: (fd, h) =>
      h.formatYesNo(fd.property?.attributes?.securityAccess?.remoteControlAccess),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.security_guard'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.securityAccess?.securityGuard),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.security_cctv'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.securityAccess?.securityCctv),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.ceiling_height'),
    getValue: (fd) =>
      fd.property?.attributes?.ceilingHeightM != null
        ? String(fd.property.attributes.ceilingHeightM)
        : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.max_vehicle_height'),
    getValue: (fd) =>
      fd.property?.attributes?.vehicleRestrictions?.maxVehicleHeightCm != null
        ? String(fd.property.attributes.vehicleRestrictions.maxVehicleHeightCm)
        : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.max_vehicle_length'),
    getValue: (fd) =>
      fd.property?.attributes?.vehicleRestrictions?.maxVehicleLengthCm != null
        ? String(fd.property.attributes.vehicleRestrictions.maxVehicleLengthCm)
        : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.facilities_cooling_hvac'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.coolingHvac),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.facilities_elevator'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.elevator),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.facilities_heating'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.heating),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.facilities_ventilation_system'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.ventilationSystem),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.facilities_fire_safety_system'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.fireSafetySystem),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.facilities_sprinklers'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.sprinklers),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.facilities_reception_concierge'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.receptionConcierge),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.facilities_internet_connectivity'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.internetConnectivity),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.facilities_server_room'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.serverRoom),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.facilities_kitchenette'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.kitchenette),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.facilities_restrooms_count'),
    getValue: (fd) =>
      fd.property?.attributes?.facilities?.restroomsCount != null
        ? String(fd.property.attributes.facilities.restroomsCount)
        : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.pet_cat'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.pets?.cat),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.pet_large_dogs'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.pets?.largeDogs),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.pet_small_dogs'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.pets?.smallDogs),
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.usable_area'),
    getValue: (fd) =>
      fd.property?.attributes?.usableAreaM2 != null
        ? String(fd.property.attributes.usableAreaM2)
        : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.land_area'),
    getValue: (fd) =>
      fd.property?.attributes?.landAreaM2 != null ? String(fd.property.attributes.landAreaM2) : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.house_area'),
    getValue: (fd) =>
      fd.property?.attributes?.houseAreaM2 != null
        ? String(fd.property.attributes.houseAreaM2)
        : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.garage_type'),
    getValue: (fd) =>
      fd.property?.attributes?.garageType
        ? t(`garage_type.${fd.property.attributes.garageType.toLowerCase()}`)
        : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.space_size'),
    getValue: (fd) => {
      const spaceSize = fd.property?.attributes?.spaceSize;

      if (!spaceSize) {
        return '—';
      }

      const garageSpaceSizeMap: Record<'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'MULTIPLE', string> = {
        SINGLE: 'single',
        DOUBLE: 'double',
        TRIPLE: 'triple',
        MULTIPLE: 'multiple',
      };

      const parkingSpaceSizeMap: Record<
        'MOTORCYCLE' | 'SMALL_CAR' | 'STANDARD_CAR' | 'SUV' | 'VAN',
        string
      > = {
        MOTORCYCLE: 'motorcycle',
        SMALL_CAR: 'small_car',
        STANDARD_CAR: 'standard_car',
        SUV: 'suv',
        VAN: 'van',
      };

      if (spaceSize in garageSpaceSizeMap) {
        return t(
          `space_size_garage.${garageSpaceSizeMap[spaceSize as keyof typeof garageSpaceSizeMap]}`
        );
      }

      if (spaceSize in parkingSpaceSizeMap) {
        return t(
          `space_size_parking.${parkingSpaceSizeMap[spaceSize as keyof typeof parkingSpaceSizeMap]}`
        );
      }

      return '—';
    },
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.land_type'),
    getValue: (fd) =>
      fd.property?.attributes?.landType
        ? t(`land_type.${fd.property.attributes.landType.toLowerCase()}`)
        : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.permitted_use'),
    getValue: (fd) => {
      const permittedUse = fd.property?.attributes?.permittedUse;

      if (!permittedUse) {
        return '—';
      }

      return permittedUse === 'OTHER'
        ? t('permitted_use.other')
        : t(`permitted_use.${permittedUse.toLowerCase()}`);
    },
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.parking_type'),
    getValue: (fd) =>
      fd.property?.attributes?.parkingType
        ? t(`parking_type.${fd.property.attributes.parkingType.toLowerCase()}`)
        : '—',
  },
];
