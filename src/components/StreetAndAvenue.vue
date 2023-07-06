<script setup>
import { defineProps, toRef } from "vue";

const props = defineProps({
  location: Object,
});
const location = toRef(props, 'location');
const streetArray = Array.from({ length: 7 }, (_, index) => index + 1);
const avenueArray = Array.from({ length: 8 }, (_, index) => String.fromCharCode(65 + index));
</script>


<template>
  <div class="row" style="display:flex;justify-content:space-between;">
      <div class="col-6">
        <label for="Apartment" class="form-label">Street</label>
        <select class="form-control" id="dropdown" v-model="location.street" >
          <option v-for="street in streetArray" :key="street" :value="street"> Street - {{street}}</option>
        </select>
      </div>
      <div class="col-6">
          <label for="Apartment" class="form-label">Avenue</label>
          <select class="form-control" id="dropdown" v-model="location.avenue">
          <option v-for="avenue in avenueArray" :key="avenue" :value="avenue"> Avenue - {{avenue}}</option>
        </select>
      </div>
      </div>
<div style="margin-bottom:10px;"/> 
</template>
