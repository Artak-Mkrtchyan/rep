import type { TFunction } from 'i18next';

import type { SelectOption } from '@/components/ui/select';
import { CharacteristicConfig, RentForApartmentsForm } from '@/types/announcement';

export const getListingTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('announcement.listing_type.for_rent'), value: 'FOR_RENT' },
  { label: t('announcement.listing_type.for_sale'), value: 'FOR_SALE' },
];

export const getPropertyTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('announcement.property_type.apartment'), value: 'APARTMENT' },
  { label: t('announcement.property_type.commercial_space'), value: 'COMMERCIAL_SPACE' },
  { label: t('announcement.property_type.garage'), value: 'GARAGE' },
  { label: t('announcement.property_type.house'), value: 'HOUSE' },
  { label: t('announcement.property_type.land'), value: 'LAND' },
  { label: t('announcement.property_type.parking_space'), value: 'PARKING_SPACE' },
];
export const BATHROOMS_OPTIONS: SelectOption<string>[] = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
];

export const getBuildingTypeOptionsCommercial = (t: TFunction): SelectOption<string>[] => [
  { label: t('building_options.office'), value: 'OFFICE' },
  { label: t('building_options.retail'), value: 'RETAIL' },
  { label: t('building_options.business_center'), value: 'BUSINESS_CENTER' },
  { label: t('building_options.industrial'), value: 'INDUSTRIAL' },
  { label: t('building_options.residential_building'), value: 'RESIDENTIAL_BUILDING' },
];

export const getGarageTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('garage_type.enclosed'), value: 'ENCLOSED' },
  { label: t('garage_type.open_air'), value: 'OPEN_AIR' },
  { label: t('garage_type.underground'), value: 'UNDERGROUND' },
  { label: t('garage_type.covered_carport'), value: 'COVERED_CARPORT' },
];

export const getSpaceSizeParkingOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('space_size_parking.motorcycle'), value: 'MOTORCYCLE' },
  { label: t('space_size_parking.small_car'), value: 'SMALL_CAR' },
  { label: t('space_size_parking.standard_car'), value: 'STANDARD_CAR' },
  { label: t('space_size_parking.suv'), value: 'SUV' },
  { label: t('space_size_parking.van'), value: 'VAN' },
];

export const getSpaceSizeGarageOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('space_size_garage.single'), value: 'SINGLE' },
  { label: t('space_size_garage.double'), value: 'DOUBLE' },
  { label: t('space_size_garage.triple'), value: 'TRIPLE' },
  { label: t('space_size_garage.multiple'), value: 'MULTIPLE' },
];

export const getLandTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('land_type.residential'), value: 'RESIDENTIAL' },
  { label: t('land_type.agricultural'), value: 'AGRICULTURAL' },
  { label: t('land_type.industrial'), value: 'INDUSTRIAL' },
  { label: t('land_type.commercial'), value: 'COMMERCIAL' },
  { label: t('land_type.mixed_use'), value: 'MIXED_USE' },
];

export const getParkingTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('parking_type.outdoor'), value: 'OUTDOOR' },
  { label: t('parking_type.indoor'), value: 'INDOOR' },
  { label: t('parking_type.underground'), value: 'UNDERGROUND' },
  { label: t('parking_type.covered'), value: 'COVERED' },
];

export const getPermittedUseOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('permitted_use.construction'), value: 'CONSTRUCTION' },
  { label: t('permitted_use.farming'), value: 'FARMING' },
  { label: t('permitted_use.storage'), value: 'STORAGE' },
  { label: t('permitted_use.parking'), value: 'PARKING' },
  { label: t('permitted_use.events'), value: 'EVENTS' },
  { label: t('permitted_use.gardening'), value: 'GARDENING' },
  { label: t('permitted_use.other'), value: 'OTHER' },
];
export const BEDROOMS_OPTIONS: SelectOption<string>[] = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
];

export const getProcessOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('announcement.process_type.as_individual'), value: 'AS_INDIVIDUAL' },
  { label: t('announcement.process_type.as_broker'), value: 'AS_BROKER' },
];

export const FLOORS_OPTIONS: SelectOption<string>[] = Array.from({ length: 20 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

export const getBuildingTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('building_options.panel'), value: 'PANEL' },
  { label: t('building_options.brick'), value: 'BRICK' },
  { label: t('building_options.monolith'), value: 'MONOLITH' },
  { label: t('building_options.frame'), value: 'FRAME' },
  { label: t('building_options.other'), value: 'OTHER' },
];

export const getConditionOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('condition_options.excellent'), value: 'EXCELLENT' },
  { label: t('condition_options.renovated'), value: 'RENOVATED' },
  { label: t('condition_options.needs_renovation'), value: 'NEEDS_RENOVATION' },
  { label: t('condition_options.under_construction'), value: 'UNDER_CONSTRUCTION' },
];

export const getOwnershipTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('ownership_type_options.full'), value: 'full' },
  { label: t('ownership_type_options.shared'), value: 'shared' },
  { label: t('ownership_type_options.joint'), value: 'joint' },
];

const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_BUILT_OPTIONS: SelectOption<string>[] = Array.from(
  { length: CURRENT_YEAR - 1900 + 1 },
  (_, i) => {
    const year = CURRENT_YEAR - i;
    return { label: String(year), value: String(year) };
  }
);

export const CHARACTERISTIC_ICONS: Record<string, string> = {
  floors: require('@/assets/images/announcement-icons/floors-icon.svg'),
  area: require('@/assets/images/announcement-icons/size-icon.svg'),
  bedroom: require('@/assets/images/announcement-icons/bed-icon.svg'),
  bathroom: require('@/assets/images/announcement-icons/bath-icon.svg'),
  condition: require('@/assets/images/announcement-icons/condition-icon.svg'),
  buildingType: require('@/assets/images/announcement-icons/buildingType-icon.svg'),
  yearBuilt: require('@/assets/images/announcement-icons/yearBuilt-icon.svg'),
  ownershipType: require('@/assets/images/announcement-icons/ownershipType-icon.svg'),
  offStreetParking: require('@/assets/images/announcement-icons/parking-icon.svg'),
  attachedGarage: require('@/assets/images/announcement-icons/garage-icon.svg'),
  detachedGarage: require('@/assets/images/announcement-icons/garage-icon.svg'),
  washerAndLaundry: require('@/assets/images/announcement-icons/washer-icon.svg'),
  disabledAccess: require('@/assets/images/announcement-icons/disabledAccess-icon.svg'),
  bicycleStorage: require('@/assets/images/announcement-icons/bike-icon.svg'),
};

export const INFRASTRUCTURE_ICONS: Record<string, string> = {
  metro: require('@/assets/images/announcement-icons/metro-icon.svg'),
  hospital: require('@/assets/images/announcement-icons/hospital-icon.svg'),
  school: require('@/assets/images/announcement-icons/school-icon.svg'),
  supermarket: require('@/assets/images/announcement-icons/supermarket-icon.svg'),
};

export const getPetItemsConfig = (
  t: TFunction
): {
  key: string;
  icon: string;
  label: string;
  getAllowed: (formData: RentForApartmentsForm) => boolean;
}[] => [
  {
    key: 'cat',
    icon: require('@/assets/images/announcement-icons/cat-icon.svg'),
    label: t('announcement.rent.pet_cat'),
    getAllowed: (f) => !!f.property?.attributes?.pets?.cat,
  },
  {
    key: 'smallDogs',
    icon: require('@/assets/images/announcement-icons/small-dog-icon.svg'),
    label: t('announcement.rent.pet_small_dogs'),
    getAllowed: (f) => !!f.property?.attributes?.pets?.smallDogs,
  },
  {
    key: 'largeDogs',
    icon: require('@/assets/images/announcement-icons/large-dog-icon.svg'),
    label: t('announcement.rent.pet_large_dogs'),
    getAllowed: (f) => !!f.property?.attributes?.pets?.largeDogs,
  },
];

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
      fd.property?.attributes?.buildingType ? String(fd.property.attributes.buildingType) : '—',
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
    getValue: (fd) =>
      fd.property?.attributes?.roadAccess?.roadType
        ? String(fd.property.attributes.roadAccess.roadType)
        : '—',
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
      fd.property?.attributes?.garageType ? String(fd.property.attributes.garageType) : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.space_size'),
    getValue: (fd) =>
      fd.property?.attributes?.spaceSize ? String(fd.property.attributes.spaceSize) : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.land_type'),
    getValue: (fd) =>
      fd.property?.attributes?.landType ? String(fd.property.attributes.landType) : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.permitted_use'),
    getValue: (fd) =>
      fd.property?.attributes?.permittedUse ? String(fd.property.attributes.permittedUse) : '—',
  },
  {
    iconKey: 'undefined',
    label: t('announcement.rent.parking_type'),
    getValue: (fd) =>
      fd.property?.attributes?.parkingType ? String(fd.property.attributes.parkingType) : '—',
  },
];

export const ANNOUNCEMENT_ROUTES = {
  RENT_BASIC_INFO: {
    name: 'basic-info',
    labelKey: 'announcement.steps.list',
    completedStep: 1,
    path: '/announcement/form/basic-info',
  },
  RENT_BROKER_LIST: {
    name: 'broker-list',
    labelKey: 'announcement.steps.list',
    completedStep: 1,
    path: '/announcement/form/broker-list',
  },
  RENT_ANNOUNCEMENT_TITLE: {
    name: 'announcement-title',
    labelKey: 'announcement.steps.announcement_title',
    completedStep: 2,
    path: '/announcement/form/announcement-title',
  },
  RENT_PROPERTY_INFO_FIRST: {
    name: 'property-info-first',
    labelKey: 'announcement.steps.property_info_1',
    completedStep: 3,
    path: '/announcement/form/property-info-first',
  },
  RENT_PROPERTY_INFO_SECOND: {
    name: 'property-info-second',
    labelKey: 'announcement.steps.property_info_2',
    completedStep: 3,
    path: '/announcement/form/property-info-second',
  },
  RENT_RENT_DETAILS: {
    name: 'rent-details',
    labelKey: 'announcement.steps.rent_details',
    completedStep: 4,
    path: '/announcement/form/rent-details',
  },
  RENT_SALE_DETAILS: {
    name: 'sale-details',
    labelKey: 'announcement.steps.sale_details',
    completedStep: 4,
    path: '/announcement/form/sale-details',
  },
  RENT_MEDIA_FIRST: {
    name: 'media-first',
    labelKey: 'announcement.steps.media_1',
    completedStep: 5,
    path: '/announcement/form/media-first',
  },
  RENT_MEDIA_SECOND: {
    name: 'media-second',
    labelKey: 'announcement.steps.media_2',
    completedStep: 5,
    path: '/announcement/form/media-second',
  },
  RENT_CHARACTERISTICS: {
    name: 'characteristics',
    labelKey: 'announcement.steps.characteristics',
    completedStep: 6,
    path: '/announcement/form/characteristics',
  },
  RENT_FINAL: {
    name: 'final',
    labelKey: 'announcement.steps.review_and_publish',
    completedStep: 7,
    path: '/announcement/form/final',
  },
} as const;
