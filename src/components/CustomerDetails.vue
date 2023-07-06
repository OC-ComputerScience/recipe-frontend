<script setup>
import { defineProps, toRef } from "vue";

const props = defineProps({
  customer: Object,
});
const customer = toRef(props, 'customer');
</script>


<template>
  <div class="row" style="display:flex;justify-content:space-between;" v-if="customer?.id">
    <h6>Customer Details</h6>
    <div class="col-6">
      <label for="location" class="form-label">Street</label>
      <input type="text" class="form-control" id="location" :value="'Street - ' + customer.streetNumber" disabled/>
    </div>
    <div class="col-6">
      <label for="apt" class="form-label">Avenue</label>
      <input type="text" class="form-control" id="apt" :value="customer.avenue" disabled />
    </div>
  </div>
  <div style="margin-bottom:10px;"/>
</template>
