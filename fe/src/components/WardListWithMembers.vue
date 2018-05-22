<template>
  <div class="ward-list ward-list-with-members">
		<div class="filters">
			<div class="filter-input filter-available">
				<input @focus="filterAvailable" @blur="filterNotAvailable" ref="filterAvailable" class="input" type="text" placeholder="Text input">
			</div>
			<div class="filter-input filter-selected" style="display: none;">
				<input ref="filterSelected" class="input" type="text" placeholder="Text input">
			</div>
		</div>
		<div class="family-lists">
			<ul class="family-list">
				<FamilyListItemWithDetails v-for="(family, index) in availableFamilies" :key="index" :family="family" view="hoh"></FamilyListItemWithDetails>
			</ul>
			<ul class="family-list-selected">
				<FamilyListItemWithDetails v-for="(family, index) in selectedFamilies" :key="index" :family="family" view="hoh"></FamilyListItemWithDetails>
			</ul>
		</div>
  </div>
</template>

<script>
import FamilyListItemWithDetails from '@/components/FamilyListItemWithDetails'
import _ from 'lodash';
let _filterHandler = null;

export default {
  name: 'WardListWithMembers',
  components: { FamilyListItemWithDetails },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App', 
			families: [],
			selectedFamilies: [],
			filteredFamilies: [],
			filtering: null,
    }
  },
  sockets:{
    "fetchAllFamiliesWithMembers:done": function(data){
		  console.log('fetchAllFamiliesWithMembers:done:', data);
			if (data.status == 200) {
				this.families = data.json.rows;
			}
    },
    "fetchAllHohs:done": function(data){
		  console.log('fetchAllHohs:done:', data);
			if (data.status == 200) {
				this.families = data.json.rows;
			}
    },
  },
  computed:{
		availableFamilies: function() {
			return (this.filteredFamilies.length > 0) ? this.filteredFamilies : this.families;
		}
  },
  methods:{
		selectFamily: function(familyId) {
			const self = this;
			let availableFamilies = [];
			this.families.forEach(family => {
				if (family.id !== familyId) {
					availableFamilies.push(family);
				} else {
					this.selectedFamilies.push(family);
				}
			});
			this.families = availableFamilies;
			this.filteredFamilies = _.filter(this.families, family => family.name.match(new RegExp(self.$refs.filterAvailable.value, 'i')));
		},
		filterAvailable: function(evt) {
			const self = this;
			console.log(evt, this.$refs.filterAvailable);
			_filterHandler = (evt) => {
				clearTimeout(this.filtering);
				this.filtering = setTimeout(() => {
					console.log(self.$refs.filterAvailable.value)
					this.filteredFamilies = _.filter(this.families, family => family.name.match(new RegExp(self.$refs.filterAvailable.value, 'i')));
				}, 250)
			}
			document.addEventListener("keyup", _filterHandler, false);
			
		},
		filterNotAvailable: function(evt) {
			clearTimeout(this.filtering);
			this.filtering = null;
			document.removeEventListener("keyup", _filterHandler, false);
		},
  },
	mounted() {
		// this.$socket.on(`fetchMembers:done:${this.family.id}`, (data) => {
	 	//   console.log(`fetchMembers:done:${this.family.id}`, data);
	 	// 	if (data.status == 200) {
	 	// 		// this.families = data.json.rows;
		// 		this.cnt = Object.keys(data.json).length;
	 	// 	}
		// });

		this.$socket.emit('fetchAllHohs');
	
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.ward-list {
		width: 90%;
		margin: 0 auto;
	}
	.family-lists {
		position: relative;
		float: left;
		width: 100%;
	}
	.family-list {
		position: relative;
		float: left;
		width: 48%;
		margin-top: 1em;
	}
	.family-list-selected {
		position: relative;
		float: right;
		width: 48%;
		margin-top: 1em;
	}
	.filter-input {
		float: left;
		width: 48%;
	}
	.filter-selected {
		float: right;
	}
</style>
