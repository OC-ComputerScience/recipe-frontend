<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CustomerServices from "../services/CustomerServices.js";
import PageLoader from "../components/PageLoader.vue";
import TextBox from "../components/TextBox.vue";
import StreetAndAvenue from "../components/StreetAndAvenue.vue";
import Snackbar from "../components/Snackbar.vue";
import { getSnackBar } from "../utils";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const customer = ref({
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
});
const location = ref({ street:"",avenue: ""})
const isPageLoader = ref(false);
onMounted(async () => {
  const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if(!isLoggedIn) {
    router.push({ name: "login" });
  }
});
const streetArray = Array.from({ length: 7 }, (_, index) => index + 1);
const avenueArray = Array.from({ length: 8 }, (_, index) => String.fromCharCode(65 + index));


async function addCustomer() {
  if(customer.value.firstName === "") {
      snackbar.value = getSnackBar("First Name is Empty")
  }
  else if(customer.value.lastName === "") {
    snackbar.value = getSnackBar("Last name is empty")
  }
  else if(customer.value.email === "") {
    snackbar.value = getSnackBar("Email is empty")
  }
  else if(customer.value.phoneNumber === "") {
    snackbar.value = getSnackBar("Mobile is empty")
  }
  else if(location.value.street === "") {
    snackbar.value = getSnackBar("Street is empty")
  }
  else if(location.value.avenue === "") {
    snackbar.value = getSnackBar("Avenue is empty")
  }
  else {
    isPageLoader.value = true
    await CustomerServices.addCustomer({...customer.value, streetNumber: location.value.street,avenue: location.value.avenue})
        .then((response) => {
            snackbar.value = getSnackBar("Customer is created successfully!","green")
            isPageLoader.value = false
        })
        .catch((error) => {
            console.log(error);
            snackbar.value = getSnackBar(error.response.data.message)
            isPageLoader.value = false
        });
  }
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <div style="display:flex;" class="heading">
          <v-card-title class="headline mb-2">Create Customer </v-card-title>
        </div>
        <PageLoader v-if="isPageLoader" />
        <v-card-text v-else>
          <TextBox class="md-3" id="firstName" title="First Name" :value="customer.firstName" @update:value="customer.firstName = $event"/>
          <TextBox class="md-3" id="lastName" title="Last Name" :value="customer.lastName" @update:value="customer.lastName = $event"/>
          <TextBox class="md-3" id="email" title="Email" :value="customer.email" @update:value="customer.email = $event"/>
          <TextBox class="md-3" id="mobile" title="Mobile Number" :value="customer.phoneNumber" @update:value="customer.phoneNumber = $event"/>
          <div style="margin-top:10px"/>
          <StreetAndAvenue :location="location" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="addCustomer()">Create</v-btn>
        </v-card-actions>
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
</style>