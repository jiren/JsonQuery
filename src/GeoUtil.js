
//Geocoding
export const GeoUtil = {
  toRad(value){
    return value * Math.PI / 180;
  },
  calculateDistance(lat1, lat2, lng1, lng2){
    var dLat = this.toRad(lat2 - lat1),
      dLon = this.toRad(lng2 - lng1),
      lat1 = this.toRad(lat1),
      lat2 = this.toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);

    return (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))) * 6371; // 6371 Earth radius in km
  },
  mileToKm(distance){
    return 1.60934 * distance;
  }
}
