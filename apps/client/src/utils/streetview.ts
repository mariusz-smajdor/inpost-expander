export const checkLocationInStreetView = (lat: number, lon: number) => {
  const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;
  window.open(url, '_blank');
};
