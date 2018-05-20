<template>
	<li class="family-list-item" v-if="view === 'hoh'">
		{{ family.name }} : {{ family.lastName }}:{{ uniquePhone }}:{{ uniqueEmail }}
	</li>
	<li class="family-list-item" v-else>
		{{ family.name }} : {{ family.id }} : {{ formattedPhone }} : {{ family.email }} : {{ family.address }}
	</li>
</template>

<script>
import _ from 'lodash';

export default {
			/* <li v-for="family in families" :key="family.name">{{ family.name }} : {{ family.id }} <a @click="fetchMembers" class="button is-primary fetch-button">Fetch</a> </li> */

  props: ['family', 'view'], 
  name: 'FamilyListItemWithDetails',
	computed: {
		uniqueEmail: function() {
			if (!_.isEmpty(this.family.email)) {
				// return _.uniq(this.family.email.split(/, */)).join(',');

				const emails = _.uniq(this.family.email.split(/, */));
				return (emails.length > 1) ? emails[emails.length-1] : emails[0];
				
			} else {
				return '';
			}
		},
		uniquePhone: function() {
			if (!_.isEmpty(this.family.phone)) {
				// return _.uniq(this.family.phone.replace(/[^0-9,]/g, '').split(/,/)).join(',');

				const phones = _.uniq(this.family.phone.replace(/[^0-9,]/g, '').split(/, */));
				return (phones.length > 1) ? phones[phones.length-1] : phones[0];
				
			} else {
				return '';
			}
		},
		formattedPhone: function() {
			if (!_.isEmpty(this.family.phone)) {
				return this.family.phone.replace(/[^0-9,]/g, '').replace(/,/g, ', ');
			} else {
				return '';
			}
		},
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
