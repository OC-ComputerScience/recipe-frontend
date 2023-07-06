import apiClient from "./services";

export default {
  getCouriers(type,userId) {
    if(!type)
      return apiClient.get("couriers");
    if(type == "clerk")
      return apiClient.get("couriers/clerk/"+userId)
    return apiClient.get("couriers/delivery-boy/"+userId) 
  },
  getCourier(id) {
    return apiClient.get("couriers/" + id);
  },
  addCourier(courier) {
    return apiClient.post("couriers", courier);
  },
  findDistance(courier) {
    return apiClient.post("couriers/find-distance",courier);
  },
  updateCourier(courier) {
    return apiClient.put("couriers/" + courier.id, courier);
  },
  deleteCourier(courierId) {
    return apiClient.delete("couriers/" + courierId);
  }
};