<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import CourierServices from "../services/CourierServices.js";
import { ref } from "vue";
import PageLoader from "../components/PageLoader.vue";
import Snackbar from "../components/Snackbar.vue";
import { getSnackBar } from "../utils"


const couriers = ref([]);
const backup = ref([]);
const spinner = ref(true);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const router = useRouter()
const type = router.currentRoute.value.params.type
const pickup_from_details = ref({})
const drop_customer_details = ref({})
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getCouriers();
  spinner.value = false;
});

watch(
      () => router.currentRoute.value.params.type,
      (newType, oldType) => {
        if (newType !== oldType) {
          location.reload();
        }
      }
    );

async function getCouriers() {
  await CourierServices.getCouriers(type,user.value.id)
    .then((res) => {
      couriers.value = res.data;
      backup.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const deleteCourier = async(id,index) => {
    // to do
}
</script>

<template>
<v-container>
  <div style="margin-top: 20px">
    <div style="display: flex; justify-content: center;">
      <h3>Couriers</h3>
    </div>
    <br/>
    <PageLoader v-if="spinner" />
     <div class="col-md-12 elevation-4 couriers" v-else-if="couriers.length != 0">
                <table class="table" style="background-color: white;">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">id</th>
                    <th scope="col">Pickup Customer</th>
                    <th scope="col">Delivery Customer</th>
                    <th v-if="user.role_id != 3"> Delivery Boy </th>
                     <th scope="col">Pickup Date</th>
                    <th scope="col">Pickup Time</th>
                    <th scope="col">Price of Courier</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Status</th>
                    <th scope="col" v-if="user.role_id != 3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(courier,index) in couriers" :key="index" >
                    <th scope="row">{{ courier.id }}</th>
                    <td>{{ courier.pickup_from.firstName }} {{ courier.pickup_from.lastName }}</td>
                    <td>{{ courier.delivery_to_customerDetails.firstName }} {{ courier.delivery_to_customerDetails.lastName }}</td>
                    <td v-if="courier.courierBoyId && user.role_id != 3">{{ courier.courier_boy_details.firstName }} {{ courier.courier_boy_details.laststName }}</td>
                    <td v-else-if="user.role_id != 3"> Not Assigned</td>
                    <td>{{ courier.dateForPickup}} </td>
                    <td>{{ courier.timeForPickup }}</td>
                    <td>${{ courier.cost }}</td>
                    <td >{{ courier.distance }} Miles</td>
                    <td> {{ courier.status }} </td>
                    <td v-if="user.role_id != 3">
                        <div class="btn-group" role="group" aria-label="Basic example">
                        <a type="button" class="btn btn-secondary edit" :href="['/update-courier/'+courier.id]">Update</a>
                        <button type="button" class="btn btn-secondary delete" @click="deleteCourier(courier.id,index)">Delete</button>
                        </div>         
                    </td>
                    </tr>
                </tbody>
                </table>
    </div>
     <div class="text-center" v-else>
      <h4 class="text-primary">No Couriers are available Now.</h4>
      
    </div>
  </div>
  <Snackbar :snackbar="snackbar"/>
  <br/>
</v-container>

</template>

<style scoped>

.couriers {
    background-color: #FFFFFF;
}
.couriers {
  padding: 30px;
}
.courier {
  margin-top: 30px;
  width:100%;
  padding-bottom: 1px solid black;
  padding:15px;
  margin-left: 20px;
}
.btn-danger {
  margin-left: 20px;
}
.users{
  margin-top: 20px;
  margin-bottom: 20px;
}
.add {
    background-color: #1E73BE ;
    margin-left: 20px;
    padding-top: -10px;
    color: #FFFFFF;
}
.edit {
  background-color: #1E73BE;
  color: #FFFFFF;
}
.delete {
  background-color: #dc3545;
  color: #FFFFFF;
}
.search {
  margin-left: 70%;
  width: 30%;
}
</style>