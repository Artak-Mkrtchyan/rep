import type { ImageSourcePropType } from 'react-native';
import type { SearchFilters } from '@/types/search';

export type ActionCardAction =
  | { type: 'search'; filters: SearchFilters }
  | { type: 'auth-gated'; authenticatedRoute: string };

export type ActionCardConfig = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  buttonTextKey: string;
  image: ImageSourcePropType;
  action: ActionCardAction;
};

export const HOME_ACTION_CARDS: ActionCardConfig[] = [
  {
    id: 'buy',
    titleKey: 'home.action_buy_title',
    descriptionKey: 'home.action_buy_desc',
    buttonTextKey: 'home.action_buy_button',
    image: require('@/assets/images/categories/buy.png'),
    action: {
      type: 'search',
      filters: {
        query: '',
        address: '',
        listingType: 'BUY',
        propertyTypes: ['HOUSE'],
        priceMin: '',
        priceMax: '',
        sortOption: 'NEWEST_FIRST',
      },
    },
  },
  {
    id: 'sell',
    titleKey: 'home.action_sell_title',
    descriptionKey: 'home.action_sell_desc',
    buttonTextKey: 'home.action_sell_button',
    image: require('@/assets/images/categories/sell.png'),
    action: {
      type: 'auth-gated',
      authenticatedRoute: '/announcement/form/new',
    },
  },
  {
    id: 'rent',
    titleKey: 'home.action_rent_title',
    descriptionKey: 'home.action_rent_desc',
    buttonTextKey: 'home.action_rent_button',
    image: require('@/assets/images/categories/rent.png'),
    action: {
      type: 'search',
      filters: {
        query: '',
        address: '',
        listingType: 'RENT',
        propertyTypes: ['HOUSE'],
        priceMin: '',
        priceMax: '',
        sortOption: 'NEWEST_FIRST',
      },
    },
  },
  {
    id: 'dream-office',
    titleKey: 'home.action_dream_office_title',
    descriptionKey: 'home.action_dream_office_desc',
    buttonTextKey: 'home.action_dream_office_button',
    image: require('@/assets/images/categories/commercial.png'),
    action: {
      type: 'search',
      filters: {
        query: '',
        address: '',
        listingType: 'RENT',
        propertyTypes: ['COMMERCIAL_SPACE'],
        priceMin: '',
        priceMax: '',
        sortOption: 'NEWEST_FIRST',
      },
    },
  },
];
