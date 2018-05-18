<template>
	<li class="family-list-item">
		{{ family.name }} : {{ family.id }} : {{ formattedPhone }} : {{ family.email }} : {{ family.address }}
	</li>
</template>

<script>
import _ from 'lodash';

export default {
			/* <li v-for="family in families" :key="family.name">{{ family.name }} : {{ family.id }} <a @click="fetchMembers" class="button is-primary fetch-button">Fetch</a> </li> */

  props: ['family'], 
  name: 'FamilyListItemWithDetails',
	computed: {
		formattedPhone: function() {
			return (!_.isEmpty(this.family.phone)) ? this.family.phone.replace(/[^0-9]/g, '') : this.family.phone;
		}
	},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
  methods: {
  },
	mounted() {
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
