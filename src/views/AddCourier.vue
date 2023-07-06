<script setup>
import { onMounted, watch } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import CustomerDetails from "../components/CustomerDetails.vue";
import { getSnackBar } from "../utils";
import CustomerServices from "../services/CustomerServices.js";
import TextBox from "../components/TextBox.vue";
import Snackbar from "../components/Snackbar.vue";
import CourierServices from "../services/CourierServices.js";
import PageLoader from "../components/PageLoader.vue";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const courier = ref({
  timeForPickup: "",
  dateForPickup: "",
  pickupFrom: "",
  deliveryTo: "",
});
const pickupCustomerDetails = ref({})
const deliveryCustomerDetails = ref({})
const courierDetailsRetrieved = ref(null)
const isPageLoader = ref(true);
const user = ref(null);
const customers = ref([]);

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getCustomers();
  isPageLoader.value = false;
});

async function getCustomers() {
  await CustomerServices.getCustomers()
    .then((response) => {
      customers.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
async function getCourierDetails() {
  if(courier.value.pickupFrom === "") {
      snackbar.value = getSnackBar("Pickup Customer is empty!")
  }
  else if(courier.value.deliveryTo === "") {
      snackbar.value = getSnackBar("Delivery Customer is empty!")
  }
  else {
    isPageLoader.value = true
    const body = {
      pickup_street: pickupCustomerDetails.value.streetNumber ,
      pickup_avenue: pickupCustomerDetails.value.avenue,
      delivery_street: deliveryCustomerDetails.value.streetNumber ,
      delivery_avenue: deliveryCustomerDetails.value.avenue
      }
    await CourierServices.findDistance(body)
        .then((response) => {
            snackbar.value = getSnackBar("courier details retrieved successfully!","green")
            isPageLoader.value = false
            courierDetailsRetrieved.value = response.data
        })
        .catch((error) => {
            console.log(error);
            snackbar.value = getSnackBar(error.response.data.message)
            isPageLoader.value = false
        });
  }
}
async function addCourier() {
    isPageLoader.value = true
    const otherFields = {
      distance: courierDetailsRetrieved.value.distance,
      timeTakesForDelivery: courierDetailsRetrieved.value.distance * 2,
      cost: courierDetailsRetrieved.value.distance * 10,
      pickupLocation: "Street "+pickupCustomerDetails.value.streetNumber + " Avenue "+pickupCustomerDetails.value.avenue ,
      deliveryLocation: "Street "+deliveryCustomerDetails.value.streetNumber + " Avenue "+deliveryCustomerDetails.value.avenue

    }
    await CourierServices.addCourier({...courier.value,...otherFields})
        .then((response) => {
            isPageLoader.value = false
            snackbar.value = getSnackBar("courier created successfully!","green")
            console.log("res",response)
        })
        .catch((error) => {
            console.log(error);
            snackbar.value = getSnackBar(error.response.data.message)
            isPageLoader.value = false
        });
}

 watch(
      pickupCustomerDetails,
      (newValue, oldValue) => {
          console.log("new",newValue)
          courier.value.pickupFrom = newValue?.id || ""
      }
    );
  
  watch(
      deliveryCustomerDetails,
      (newValue, oldValue) => {
          courier.value.deliveryTo = newValue?.id || ""
      }
    );


</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <div style="display:flex;" class="heading">
          <v-card-title class="headline mb-2">Create Courier </v-card-title>
        </div>
        <PageLoader v-if="isPageLoader" />
        <v-card-text v-else>
        <TextBox class="md-3" id="firstName" title="Pickup Time" :value="courier.timeForPickup" @update:value="courier.timeForPickup = $event"/>
        <div :class="className" style="margin-bottom:10px">
            <label :for="id" class="form-label">Pickup Date</label>
            <input
              type="date"
              class="form-control"
              id="date"
              v-model="courier.dateForPickup"
              :disabled="disabled"
            />
        </div>
        <div class="mb-3">
            <label for="user" class="form-label">Pickup Customer </label>
            <select class="form-control" id="dropdown" v-model="pickupCustomerDetails">
              <option v-for="customer in customers" :key="customer.id" :value="customer"> {{customer.lastName}} {{customer.firstName}}</option>
            </select>
        </div>
        <CustomerDetails :customer="pickupCustomerDetails" v-if="pickupCustomerDetails.id"/>
        <div class="mb-3">
            <label for="user" class="form-label">Delivery Customer</label>
            <select class="form-control" id="dropdown" v-model="deliveryCustomerDetails">
              <option v-for="customer in customers" :key="customer.id" :value="customer"> {{customer.lastName}} {{customer.firstName}}</option>
            </select>
        </div>
        <CustomerDetails :customer="deliveryCustomerDetails" v-if="deliveryCustomerDetails.id"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="getCourierDetails()">Next</v-btn>
        </v-card-actions><br/>
        <div v-if="courierDetailsRetrieved != null" class="courier_details">
          <h4 style="text-decoration:underline;">Courier Details</h4>
          <TextBox class="md-3 details" id="distance" title="Distance" :value="courierDetailsRetrieved.distance" disabled/>
          <v-card-actions>
            <v-btn variant="flat" class="create" color="primary" @click="addCourier()">Place Courier</v-btn>
          </v-card-actions><br/>
        </div>
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
.details {
  width: 30%;
}
.create {
  margin-left:40%;
}
</style>