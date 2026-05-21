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
        uri: media.url || media.thumbnailUrl || '',
        type: media.fileType,
        name: media.fileName,
      });
    });

    const documentIds: string[] = [];
    const tempDocumentFiles: { id: string; uri: string; type?: string; name?: string }[] = [];

    response.documents?.forEach((doc) => {
      documentIds.push(doc.id);
      tempDocumentFiles.push({
        id: doc.id,
        uri: doc.url || doc.thumbnailUrl || '',
        type: doc.fileType,
        name: doc.fileName,
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
        tempDocumentFiles,
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
        documentIds,
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

const makePropertyInfoApartmentsSchema = (t: TFunction) =>
  Yup.object().shape({
    property: Yup.object().shape({
      areaM2: Yup.number()
        .required(t('add_application.validation.area_required'))
        .typeError(t('add_application.validation.must_be_number')),
      attributes: Yup.object().shape({
        bedroomCount: Yup.number()
          .required(t('add_application.validation.bedrooms_required'))
          .typeError(t('add_application.validation.must_be_number')),
        bathroomCount: Yup.number()
          .required(t('add_application.validation.bathrooms_required'))
          .typeError(t('add_application.validation.must_be_number')),
      }),
    }),
  });

const makePropertyInfoCommercialSpacesSchema = (t: TFunction) =>
  Yup.object().shape({
    property: Yup.object().shape({
      areaM2: Yup.number()
        .required(t('add_application.validation.area_required'))
        .typeError(t('add_application.validation.must_be_number')),
      attributes: Yup.object().shape({
        usableAreaM2: Yup.number()
          .required(t('add_application.validation.usable_area_required'))
          .typeError(t('add_application.validation.must_be_number')),
        buildingType: Yup.string().required(
          t('add_application.validation.building_type_required')
        ),
      }),
    }),
  });

const makePropertyInfoGaragesSchema = (t: TFunction) =>
  Yup.object().shape({
    property: Yup.object().shape({
      areaM2: Yup.number()
        .required(t('add_application.validation.area_required'))
        .typeError(t('add_application.validation.must_be_number')),
      attributes: Yup.object().shape({
        spaceSize: Yup.string().required(
          t('add_application.validation.garage_space_size_required')
        ),
        garageType: Yup.string().required(t('add_application.validation.garage_type_required')),
      }),
    }),
  });

const makePropertyInfoHousesSchema = (t: TFunction) =>
  Yup.object().shape({
    property: Yup.object().shape({
      areaM2: Yup.number()
        .required(t('add_application.validation.area_required'))
        .typeError(t('add_application.validation.must_be_number')),
      attributes: Yup.object().shape({
        bedroomCount: Yup.number()
          .required(t('add_application.validation.bedrooms_required'))
          .typeError(t('add_application.validation.must_be_number')),
        bathroomCount: Yup.number()
          .required(t('add_application.validation.bathrooms_required'))
          .typeError(t('add_application.validation.must_be_number')),
        landAreaM2: Yup.number()
          .required(t('add_application.validation.land_area_required'))
          .typeError(t('add_application.validation.must_be_number')),
        houseAreaM2: Yup.number()
          .required(t('add_application.validation.house_area_required'))
          .typeError(t('add_application.validation.must_be_number')),
      }),
    }),
  });

const makePropertyInfoLandSchema = (t: TFunction) =>
  Yup.object().shape({
    property: Yup.object().shape({
      areaM2: Yup.number()
        .required(t('add_application.validation.area_required'))
        .typeError(t('add_application.validation.must_be_number')),
      attributes: Yup.object().shape({
        landType: Yup.string().required(t('add_application.validation.land_type_required')),
        permittedUse: Yup.string().required(
          t('add_application.validation.land_permitted_use_required')
        ),
      }),
    }),
  });

const makePropertyInfoParkingSpacesSchema = (t: TFunction) =>
  Yup.object().shape({
    property: Yup.object().shape({
      areaM2: Yup.number()
        .required(t('add_application.validation.area_required'))
        .typeError(t('add_application.validation.must_be_number')),
      attributes: Yup.object().shape({
        spaceSize: Yup.string().required(
          t('add_application.validation.parking_space_size_required')
        ),
        parkingType: Yup.string().required(t('add_application.validation.parking_type_required')),
      }),
    }),
  });

const makeCharacteristicsSchema = (t: TFunction) =>
  Yup.object().shape({
    building: Yup.object().shape({
      buildingType: Yup.string().required(t('add_application.validation.building_required')),
      yearBuilt: Yup.number()
        .required(t('add_application.validation.year_built_required'))
        .typeError(t('add_application.validation.must_be_number')),
    }),
    ownershipAndCondition: Yup.object().shape({
      condition: Yup.string().required(t('add_application.validation.condition_required')),
      ownershipType: Yup.string().required(t('add_application.validation.ownership_type_required')),
    }),
  });

const makeCommercialSpaceCharacteristicsSchema = (t: TFunction) =>
  Yup.object().shape({
    building: Yup.object().shape({
      buildingType: Yup.string().required(t('add_application.validation.building_required')),
      numberOfFloors: Yup.number()
        .required(t('add_application.validation.number_of_floors_required'))
        .typeError(t('add_application.validation.must_be_number')),
    }),
    facilities: Yup.object().shape({
      restroomsCount: Yup.number()
        .required(t('add_application.validation.restrooms_count_required'))
        .typeError(t('add_application.validation.must_be_number')),
    }),
  });

const makeLandCharacteristicsSchema = (t: TFunction) =>
  Yup.object().shape({
    roadAccess: Yup.object().shape({
      roadType: Yup.string().required(t('add_application.validation.road_type_required')),
    }),
  });

export const getSchemaForPropertyType = (type: Property | '', t: TFunction) => {
  if (type === 'APARTMENT') {
    return makePropertyInfoApartmentsSchema(t);
  }
  if (type === 'COMMERCIAL_SPACE') {
    return makePropertyInfoCommercialSpacesSchema(t);
  }
  if (type === 'GARAGE') {
    return makePropertyInfoGaragesSchema(t);
  }
  if (type === 'HOUSE') {
    return makePropertyInfoHousesSchema(t);
  }
  if (type === 'LAND') {
    return makePropertyInfoLandSchema(t);
  }
  if (type === 'PARKING_SPACE') {
    return makePropertyInfoParkingSpacesSchema(t);
  }
  return undefined;
};

export const getCharacteristicsSchemaForPropertyType = (type: Property | '', t: TFunction) => {
  if (type === 'APARTMENT' || type === 'HOUSE') {
    return makeCharacteristicsSchema(t);
  }

  if (type === 'COMMERCIAL_SPACE') {
    return makeCommercialSpaceCharacteristicsSchema(t);
  }

  if (type === 'LAND') {
    return makeLandCharacteristicsSchema(t);
  }

  return undefined;
};

export const getObjectCharacteristics = (t: TFunction): CharacteristicConfig[] => [
  {
    iconKey: 'number-of-floors',
    label: t('announcement.rent.floors'),
    getValue: (fd) => {
      const b = fd.property?.attributes?.building;
      if (b?.floorNo != null && b?.numberOfFloors != null) {
        return `${b.floorNo} of ${b.numberOfFloors}`;
      }
      if (b?.numberOfFloors != null) {
        return String(b.numberOfFloors);
      }
      return '—';
    },
  },
  {
    iconKey: 'size',
    label: t('announcement.rent.area'),
    getValue: (fd) => (fd.property?.areaM2 != null ? String(fd.property.areaM2) : '—'),
  },
  {
    iconKey: 'bed',
    label: t('announcement.rent.bedroom'),
    getValue: (fd) =>
      fd.property?.attributes?.bedroomCount != null
        ? String(fd.property.attributes.bedroomCount)
        : '—',
  },
  {
    iconKey: 'bath',
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
    iconKey: 'condition',
    label: t('announcement.rent.building_type'),
    getValue: (_, h) => h.buildingTypeLabel || '—',
  },
  {
    iconKey: 'year-built',
    label: t('announcement.rent.year_built'),
    getValue: (fd) =>
      fd.property?.attributes?.building?.yearBuilt != null
        ? String(fd.property.attributes.building.yearBuilt)
        : '—',
  },
  {
    iconKey: 'ownership-type',
    label: t('announcement.rent.ownership_type'),
    getValue: (_, h) => h.ownershipLabel || '—',
  },
  {
    iconKey: 'condition',
    label: t('announcement.rent.building_type_commercial'),
    getValue: (fd) =>
      fd.property?.attributes?.buildingType
        ? t(`building_options.${fd.property.attributes.buildingType.toLowerCase()}`)
        : '—',
  },
  {
    iconKey: 'cooling-heating',
    label: t('announcement.rent.hvac'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.hvac),
  },
  {
    iconKey: 'balcony',
    label: t('announcement.rent.balcony'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.balcony),
  },
  {
    iconKey: 'elevator',
    label: t('announcement.rent.elevator'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.elevator),
  },
  {
    iconKey: 'parking',
    label: t('announcement.rent.off_street_parking'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.offStreetParking),
  },
  {
    iconKey: 'attached-garage',
    label: t('announcement.rent.attached_garage'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.attachedGarage),
  },
  {
    iconKey: 'detached-garage',
    label: t('announcement.rent.detached_garage'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.detachedGarage),
  },
  {
    iconKey: 'laundry',
    label: t('announcement.rent.washer_and_laundry'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.washerLaundry),
  },
  {
    iconKey: 'disabled-access',
    label: t('announcement.rent.disabled_access'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.disabledAccess),
  },
  {
    iconKey: 'bicycle',
    label: t('announcement.rent.bicycle_storage'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.bicycleStorage),
  },
  {
    iconKey: 'ev-charging-station',
    label: t('announcement.rent.amenities_ev_charging_station'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.evChargingStation),
  },
  {
    iconKey: 'terrace',
    label: t('announcement.rent.terrace'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.terrace),
  },
  {
    iconKey: 'garden',
    label: t('announcement.rent.garden_yard'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.gardenYard),
  },
  {
    iconKey: 'parking',
    label: t('announcement.rent.parking'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.parking),
  },
  {
    iconKey: 'disabled-access',
    label: t('announcement.rent.attribute_disabled_access'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.disabledAccess),
  },
  {
    iconKey: 'ev-charging-station',
    label: t('announcement.rent.attribute_ev_charging_station'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.evChargingStation),
  },
  {
    iconKey: 'electricity',
    label: t('announcement.rent.electricity_available'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.electricityAvailable),
  },
  {
    iconKey: 'electricity',
    label: t('announcement.rent.infrastructure_electricity_available'),
    getValue: (fd, h) =>
      h.formatYesNo(fd.property?.attributes?.infrastructure?.electricityAvailable),
  },
  {
    iconKey: 'water-supply',
    label: t('announcement.rent.water_supply'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.infrastructure?.waterSupply),
  },
  {
    iconKey: 'gas',
    label: t('announcement.rent.gas'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.infrastructure?.gas),
  },
  {
    iconKey: 'sewage',
    label: t('announcement.rent.sewage'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.infrastructure?.sewage),
  },
  {
    iconKey: 'wifi',
    label: t('announcement.rent.internet_available'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.infrastructure?.internetAvailable),
  },
  {
    iconKey: 'road-access',
    label: t('announcement.rent.road_access'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.roadAccess?.roadAccess),
  },
  {
    iconKey: 'road-type',
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
    iconKey: 'remote-automatic-door',
    label: t('announcement.rent.remote_automatic_door'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.remoteAutomaticDoor),
  },
  {
    iconKey: 'motorcycle',
    label: t('announcement.rent.motorcycle_bicycle_allowed'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.motorcycleBicycleAllowed),
  },
  {
    iconKey: '24-clock',
    label: t('announcement.rent.security_access_24_7'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.securityAccess?.access247),
  },
  {
    iconKey: 'gated-entry',
    label: t('announcement.rent.security_gated_entry'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.securityAccess?.gatedEntry),
  },
  {
    iconKey: 'remote-control-access',
    label: t('announcement.rent.security_remote_control_access'),
    getValue: (fd, h) =>
      h.formatYesNo(fd.property?.attributes?.securityAccess?.remoteControlAccess),
  },
  {
    iconKey: 'security-guard',
    label: t('announcement.rent.security_guard'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.securityAccess?.securityGuard),
  },
  {
    iconKey: 'security-cctv',
    label: t('announcement.rent.security_cctv'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.securityAccess?.securityCctv),
  },
  {
    iconKey: 'ceiling-height',
    label: t('announcement.rent.ceiling_height'),
    getValue: (fd) =>
      fd.property?.attributes?.ceilingHeightM != null
        ? String(fd.property.attributes.ceilingHeightM)
        : '—',
  },
  {
    iconKey: 'car-height',
    label: t('announcement.rent.max_vehicle_height'),
    getValue: (fd) =>
      fd.property?.attributes?.vehicleRestrictions?.maxVehicleHeightCm != null
        ? String(fd.property.attributes.vehicleRestrictions.maxVehicleHeightCm)
        : '—',
  },
  {
    iconKey: 'car-length',
    label: t('announcement.rent.max_vehicle_length'),
    getValue: (fd) =>
      fd.property?.attributes?.vehicleRestrictions?.maxVehicleLengthCm != null
        ? String(fd.property.attributes.vehicleRestrictions.maxVehicleLengthCm)
        : '—',
  },
  {
    iconKey: 'cooling',
    label: t('announcement.rent.facilities_cooling_hvac'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.coolingHvac),
  },
  {
    iconKey: 'elevator',
    label: t('announcement.rent.facilities_elevator'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.elevator),
  },
  {
    iconKey: 'heating',
    label: t('announcement.rent.facilities_heating'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.heating),
  },
  {
    iconKey: 'ventilation',
    label: t('announcement.rent.facilities_ventilation_system'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.ventilationSystem),
  },
  {
    iconKey: 'fire-safety-system',
    label: t('announcement.rent.facilities_fire_safety_system'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.fireSafetySystem),
  },
  {
    iconKey: 'sprinkler',
    label: t('announcement.rent.facilities_sprinklers'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.sprinklers),
  },
  {
    iconKey: 'reception-concierge',
    label: t('announcement.rent.facilities_reception_concierge'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.receptionConcierge),
  },
  {
    iconKey: 'wifi',
    label: t('announcement.rent.facilities_internet_connectivity'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.internetConnectivity),
  },
  {
    iconKey: 'server-room',
    label: t('announcement.rent.facilities_server_room'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.serverRoom),
  },
  {
    iconKey: 'kitchenette',
    label: t('announcement.rent.facilities_kitchenette'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.facilities?.kitchenette),
  },
  {
    iconKey: 'restrooms-count',
    label: t('announcement.rent.facilities_restrooms_count'),
    getValue: (fd) =>
      fd.property?.attributes?.facilities?.restroomsCount != null
        ? String(fd.property.attributes.facilities.restroomsCount)
        : '—',
  },
  {
    iconKey: 'cat',
    label: t('announcement.rent.pet_cat'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.pets?.cat),
  },
  {
    iconKey: 'large-dog',
    label: t('announcement.rent.pet_large_dogs'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.pets?.largeDogs),
  },
  {
    iconKey: 'small-dog',
    label: t('announcement.rent.pet_small_dogs'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.pets?.smallDogs),
  },
  {
    iconKey: 'usable-area',
    label: t('announcement.rent.usable_area'),
    getValue: (fd) =>
      fd.property?.attributes?.usableAreaM2 != null
        ? String(fd.property.attributes.usableAreaM2)
        : '—',
  },
  {
    iconKey: 'land-area',
    label: t('announcement.rent.land_area'),
    getValue: (fd) =>
      fd.property?.attributes?.landAreaM2 != null ? String(fd.property.attributes.landAreaM2) : '—',
  },
  {
    iconKey: 'house-area',
    label: t('announcement.rent.house_area'),
    getValue: (fd) =>
      fd.property?.attributes?.houseAreaM2 != null
        ? String(fd.property.attributes.houseAreaM2)
        : '—',
  },
  {
    iconKey: 'land-area',
    label: t('announcement.rent.garage_type'),
    getValue: (fd) =>
      fd.property?.attributes?.garageType
        ? t(`garage_type.${fd.property.attributes.garageType.toLowerCase()}`)
        : '—',
  },
  {
    iconKey: 'space-size',
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
    iconKey: 'land-type',
    label: t('announcement.rent.land_type'),
    getValue: (fd) =>
      fd.property?.attributes?.landType
        ? t(`land_type.${fd.property.attributes.landType.toLowerCase()}`)
        : '—',
  },
  {
    iconKey: 'permitted-use',
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
    iconKey: 'parking',
    label: t('announcement.rent.parking_type'),
    getValue: (fd) =>
      fd.property?.attributes?.parkingType
        ? t(`parking_type.${fd.property.attributes.parkingType.toLowerCase()}`)
        : '—',
  },
];
