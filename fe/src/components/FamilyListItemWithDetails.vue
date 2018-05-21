<template>
	<li class="family-list-item" v-if="view === 'hoh'">
		<div :class="cssFamilyDetails">
			{{ family.name }} : {{ family.lastName }}:{{ uniquePhone }}:{{ uniqueEmail }}
		</div>
    <div :class="cssSelectButton"><a @click="selectFamily" href="#" class="button is-primary"> &gt; </a></div>
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
		cssSelectButton: function () {
			let classNames = ['select-button'];
			return (this.selected === true) ? [...classNames, 'select-button-selected'] : classNames;
		},
		cssFamilyDetails: function () {
			let classNames = ['family-details'];
			return (this.selected === true) ? [...classNames, 'family-details-selected'] : classNames;
		},
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
			selected: false,
    }
  },
  methods: {
		selectFamily: function() {
			this.$parent.selectFamily(this.family.id);
			// this.selected = true;
		},
  },
	mounted() {
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.select-button {
		float: right;
	}

	.family-details {
		float: left;
		width: 90%;
	}

	.family-details-selected {
		float: right;
	}
	.select-button-selected {
		float: left;
	}
	
	.select-button a {
		width: 10px;
		height: 19px;
		font-size: 8pt;
	}
</style>
