import { Map } from 'react-map-gl/maplibre';

import { EUROPE_MAP_BOUNDS, WARSAW_VIEW_STATE } from './constants';

export default function ExpanderMap() {
  return (
    <Map
      initialViewState={WARSAW_VIEW_STATE}
      maxBounds={EUROPE_MAP_BOUNDS}
      mapStyle='https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    ></Map>
  );
}
