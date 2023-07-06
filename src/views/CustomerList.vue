<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import { ref } from "vue";
import PageLoader from "../components/PageLoader.vue";
import Snackbar from "../components/Snackbar.vue";
import { getSnackBar } from "../utils"


const customers = ref([]);
const spinner = ref(true);
const user = ref(null);
const router = useRouter();
const type = router.currentRoute.value.params.type
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const backup = ref([])
onMounted(async () => {
   user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getCustomers();
  spinner.value = false;
});

async function getCustomers() {
  await CustomerServices.getCustomers()
    .then((res) => {
      customers.value = res.data;
      backup.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const deleteCustomer = async(id,index) => {
    // to do
}
</script>

<template>
<v-container>
  <div class="container" style="margin-top: 20px">
    <div style="display: flex; justify-content: center;">
      <h3>Customers</h3>
    </div>
    <br/>
    <PageLoader v-if="spinner" />
    <div class="col-md-12 container elevation-4 customers" v-else-if="customers.length != 0">
             <table class="table" style="background-color: #FFFFFF;">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">id</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Street Number</th>
                    <th scope="col">Avenue</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(customer,index) in customers" :key="index" >
                    <th scope="row">{{ index+1 }}</th>
                    <td>{{ customer.firstName }}</td>
                    <td>{{ customer.lastName }}</td>
                    <td>{{ customer.email }}</td>
                    <td>{{ customer.phoneNumber }}</td>
                    <td>Street {{ customer.streetNumber }}</td>
                    <td>Avenue {{ customer.avenue }}</td>
                    <td>
                        <div class="btn-group" role="group" aria-label="Basic example">
                        <a type="button" class="btn btn-secondary edit" :href="['/update-customer/'+customer.id]">Edit</a>
                        <button type="button" class="btn btn-secondary delete" @click="deleteCustomer(customer.id,index)">Delete</button>
                        </div>         
                    </td>
                    </tr>
                </tbody>
                </table>
          </div>
      <div class="text-center" v-else>
      <h4 class="text-primary">No Customers are available</h4> 
    </div>
    </div>
    <Snackbar :snackbar="snackbar"/>
  <br/>
</v-container>

</template>

<style scoped>

.getplan {
    color: #FFFFFF;
    background-color: #80162B;
}
.customers {
  padding: 30px;
  background-color: #FFFFFF;
}
.btn-danger {
  margin-left: 20px;
}
.customers{
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