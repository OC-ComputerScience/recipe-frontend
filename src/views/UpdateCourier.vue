<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import CourierServices from "../services/CourierServices.js";
import PageLoader from "../components/PageLoader.vue";
import Snackbar from "../components/Snackbar.vue";
import { getSnackBar } from "../utils"
import TextBox from "../components/TextBox.vue";
import UserServices from "../services/UserServices.js";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const courier = ref(null);
const isPageLoader = ref(true);
const user = ref(null);
const couriers = ref([]);
const customers = ref([]);
const deliveryBoys = ref([]);
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
    if(!user.value) {
    router.push({ name: "login" });
  }
  await getCourier();
  await getCustomers();
  await getAvailableDeliveryBoys();
  isPageLoader.value = false;
});
const statusOptions =  [
        "PENDING","PROGRESS","DELIVERED"
      ]

async function getCourier() {
    isPageLoader.value = true
    await CourierServices.getCourier(router.currentRoute.value.params.id)
        .then((response) => {
            courier.value = response.data
            isPageLoader.value = false
        })
        .catch((error) => {
            isPageLoader.value = false
        });
}


async function updateCourier() {
    if(courier.value.status != 'PENDING' && !courier.value.delivery_boy_id) {
        snackbar.value = getSnackBar("Assign the Delivery Boy to change the status!")
        return;
    }
    isPageLoader.value = true
    await CourierServices.updateCourier({...courier.value,user_id: user.value.id})
        .then((response) => {
            snackbar.value = getSnackBar("Courier is updated successfully!","green")
            isPageLoader.value = false
        })
        .catch((error) => {
            console.log(error);
            snackbar.value = getSnackBar(error.response.data.message)
            isPageLoader.value = false
        });
}

async function getCustomers() {
  await CustomerServices.getCustomers()
    .then((response) => {
      customers.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getAvailableDeliveryBoys() {
  await UserServices.getAvailableDeliveryBoys()
    .then((response) => {
      deliveryBoys.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <div style="display:flex;" class="heading">
          <v-card-title class="headline mb-2">Update Courier </v-card-title>
        </div>
        <PageLoader v-if="isPageLoader" />
        <v-card-text v-else>
        <div class="mb-3">
          <label for="firstName" class="form-label">Pickup Time</label>
          <input type="text" class="form-control" id="firstName" v-model="courier.timeForPickup"/>
        </div>
        <div class="mb-3">
          <label for="firstName" class="form-label">Pickup Time</label>
          <input type="text" class="form-control" id="firstName" v-model="courier.dateForPickup"/>
        </div>
        <div class="mb-3">
          <label for="firstName" class="form-label">Pickup Location</label>
          <input type="text" class="form-control" id="firstName" v-model="courier.pickupLocation"/>
        </div>
        <div class="mb-3">
          <label for="firstName" class="form-label">Delivery Location</label>
          <input type="text" class="form-control" id="firstName" v-model="courier.deliveryLocation"/>
        </div>
        <div class="mb-3">
            <label for="user" class="form-label">Pickup Customer </label>
            <select class="form-control" id="dropdown" v-model="courier.pickupFrom">
              <option v-for="customer in customers" :key="customer.id" :value="customer.id"> {{customer.lastName}} {{customer.firstName}}</option>
            </select>
          </div>
        <div class="mb-3">
            <label for="user" class="form-label">Delivery Customer</label>
            <select class="form-control" id="dropdown" v-model="courier.deliveryTo">
              <option v-for="customer in customers" :key="customer.id" :value="customer.id"> {{customer.lastName}} {{customer.firstName}}</option>
            </select>
        </div>
        <TextBox class="md-3" id="price" title="Price for Courier" :value="courier.cost" @update:value="courier.cost = $event"/>
          <div class="mb-3">
              <label for="price" class="form-label">Status </label>
              <select class="form-control" id="dropdown" v-model="courier.status">
              <option v-for="status in statusOptions" :key="status" :value="status"> {{status}}</option>
            </select>
          </div>
        <TextBox class="md-3" id="time" title="Time takes to deliver courier" :value="courier.timeTakesForDelivery" @update:value="courier.timeTakesForDelivery = $event"/>
        <TextBox class="md-3" id="price" title="Distance" :value="courier.distance" @update:value="courier.distance = $event"/>
          <div class="mb-3">
            <label for="user" class="form-label">Assign Delivery Boy</label>
            <select class="form-control" id="dropdown" v-model="courier.courierBoyId">
              <option v-for="deliveryBoy in deliveryBoys" :key="deliveryBoy.id" :value="deliveryBoy.id"> {{deliveryBoy.lastName}} {{deliveryBoy.firstName}}</option>
            </select>
        </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="updateCourier()">Update</v-btn>
        </v-card-actions><br/>
      </v-card>
      <Snackbar :snackbar="snackbar"/>
    </div>
  </v-container>
</template>

<style scoped>
.add {
  margin-right: 20px;
  height: 40px;
  margin-top: 5px;
}
.heading {
    margin-top: 10px;
    justify-content: space-between;
}
.click {
  color: #1E73BE;
}
.courier_details {
  margin-left: 30px;
}

</style>