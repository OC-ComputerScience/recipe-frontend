<script setup>
import { defineProps, toRef } from "vue";

const props = defineProps({
  customers: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  selected: {
    type: Object,
    required: true,
  },
  selectCustomer : {
    type: Function,
    required: true,
  }
});

const customers = toRef(props, 'customers');
const selected = toRef(props, 'selected');
const title = toRef(props, 'title');
const handleDropdownChange = () => {
  props.selectCustomer(selected.value);
};

</script>
<template>
    <div class="mb-3">
        <label for="user" class="form-label">{{ title }}</label>
        <select class="form-control" id="dropdown" v-model="selected" @change="handleDropdownChange">
            <option v-for="customer in customers" :key="customer.id" :value="customer">{{ customer.lastName }} {{ customer.firstName }}</option>
        </select>
    </div>
</template>