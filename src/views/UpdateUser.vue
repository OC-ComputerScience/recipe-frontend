<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import PageLoader from "../components/PageLoader.vue";
import Snackbar from "../components/Snackbar.vue";
import { getSnackBar } from "../utils"
import TextBox from "../components/TextBox.vue"

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  roleId: "",
});
const isPageLoader = ref(false);
const roleOptions =  [
        {
            id:"1",
            role:"Admin"
        },
         {
            id:"2",
            role:"Clerk"
        },
         {
            id:"3",
            role:"Delivery Boy"
        }
      ]
onMounted(async () => {
   const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if(!isLoggedIn) {
    router.push({ name: "login" });
  }
    await getUser();
    isPageLoader.value = false
});

async function getUser() {
    isPageLoader.value = true
    await UserServices.getUser(router.currentRoute.value.params.id)
        .then((response) => {
            user.value = response.data
            isPageLoader.value = false
        })
        .catch((error) => {
            isPageLoader.value = false
        });
}

async function updateUser() {
      if(user.value.firstName === "") {
        snackbar.value = getSnackBar("First Name is Empty")
    }
    else if(user.value.lastName === "") {
        snackbar.value = getSnackBar("Last Name is Empty")
    }
    else if(user.value.email === "") {
           snackbar.value = getSnackBar("Email is Empty")
    }
    else if(user.value.phoneNumber === "") {
             snackbar.value = getSnackBar("Mobile is Empty")
    }
    else if(user.value.password === "") {
        snackbar.value = getSnackBar("Password is Empty")
    }
    else if(user.value.apartment_number === "") {
        snackbar.value = getSnackBar("Apartment Number is Empty")
    }
    else if(user.value.role_id === "") {
        snackbar.value = getSnackBar("Role is Empty")
    }
    else {
        isPageLoader.value = true
        await UserServices.updateUser(user.value)
            .then((response) => {
              snackbar.value = getSnackBar("User is Updated successfully!","green")
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
          <v-card-title class="headline mb-2">Update User </v-card-title>
        </div>
        <PageLoader v-if="isPageLoader" />
        <v-card-text v-else>
        <TextBox class="md-3" id="firstName" title="First Name" :value="user.firstName" @update:value="user.firstName = $event"/>
        <TextBox class="md-3" id="lastName" title="Last Name" :value="user.lastName" @update:value="user.lastName = $event"/>
        <TextBox class="md-3" id="email" title="Email" :value="user.email" @update:value="user.email = $event"/>
        <TextBox class="md-3" id="mobile" title="Mobile" :value="user.phoneNumber" @update:value="user.phoneNumber = $event"/>
        <!-- <TextBox class="md-3" id="password" title="Password" :value="user.password" @update:value="user.password = $event"/> -->
        <div class="mb-3">
        <label for="role" class="form-label">Availability</label>
        <select class="form-control " id="role" v-model="user.isAvailable">
            <option value="0" key="0">No</option>
            <option value="1" key="1">Yes</option>
        </select>
        </div>
        <div class="mb-3">
        <label for="role" class="form-label">Role</label>
        <select class="form-control " id="role" v-model="user.roleId">
            <option v-for="item in roleOptions" :key="item.id" :value="item.id"> {{item.id}}.{{item.role}}</option>
        </select>
        </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="updateUser()">Update</v-btn>
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