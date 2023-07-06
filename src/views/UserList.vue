<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import { ref } from "vue";
import PageLoader from "../components/PageLoader.vue";
import { getDomainUrl } from "../utils"
import Snackbar from "../components/Snackbar.vue";
import { getSnackBar } from "../utils"

const users = ref([]);
const spinner = ref(true);
const user = ref(null);
const router = useRouter();
const backup = ref([])
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getUsers();
  spinner.value = false;
});

async function getUsers() {
  await UserServices.getUsers()
    .then((res) => {
      users.value = res.data;
      backup.value = res.data
    })
    .catch((error) => {
      console.log(error);
    });
}
const deleteUser = async(id,index) => {
    //to do
}

</script>

<template>
<v-container>
  <div class="container" style="margin-top: 20px">
    <div style="display: flex; justify-content: center;">
      <h3>Users</h3>
    </div>
    <br/>
    <PageLoader v-if="spinner" />
    <div class="col-md-12 container elevation-4 users" v-else-if="users.length != 0">
                <table class="table" style="background-color: #FFFFFF;">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">id</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Is Available Now</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user,index) in users" :key="index" >
                    <th scope="row">{{ user.id }}</th>
                    <td>{{ user.firstName }}</td>
                    <td>{{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phoneNumber }}</td>
                    <td v-if="user.isAvailable == 1">Yes</td>
                    <td v-else>No</td>
                    <td>
                        <div class="btn-group" role="group" aria-label="Basic example">
                        <a type="button" class="btn btn-secondary edit" :href="[ getDomainUrl()+'/update-user/'+user.id]">Edit</a>
                        <button type="button" class="btn btn-secondary delete" @click="deleteUser(user.id,index)">Delete</button>
                        </div>         
                    </td>
                    </tr>
                </tbody>
                </table>
          </div>
    <div class="text-center" v-else>
      <h4 class="text-primary">No Users available</h4>
      
    </div>
    </div>
    <Snackbar :snackbar="snackbar"/>
  <br/>
</v-container>

</template>

<style scoped>

.users {
  padding: 30px;
  background-color: #FFFFFF;
}
 a:hover {
    text-decoration: none;
    color: #FFFFFF;
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
  margin-left: 60%;
  width: 30%;
}
</style>