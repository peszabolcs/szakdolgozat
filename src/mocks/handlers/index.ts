import { parkingSpacesHandlers } from './parkingSpaces';
import { areasHandlers } from './areas';
import { shoppingCenterHandlers } from './shoppingCenters';

export const handlers = [
  ...parkingSpacesHandlers,
  ...areasHandlers,
  ...shoppingCenterHandlers,
];
