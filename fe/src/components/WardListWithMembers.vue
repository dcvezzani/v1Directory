<template>
  <div class="ward-list ward-list-with-members">
		<ul class="family-list">
			<FamilyListItemWithDetails v-for="(family, index) in families" :key="index" :family="family"></FamilyListItemWithDetails>
		</ul>
  </div>
</template>

<script>
import FamilyListItemWithDetails from '@/components/FamilyListItemWithDetails'

export default {
  name: 'WardListWithMembers',
  components: { FamilyListItemWithDetails },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App', 
			families: [],
    }
  },
  sockets:{
    "fetchAllFamiliesWithMembers:done": function(data){
		  console.log('fetchAllFamiliesWithMembers:done:', data);
			if (data.status == 200) {
				this.families = data.json.rows;
			}
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

		this.$socket.emit('fetchAllFamiliesWithMembers');
	
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.ward-list {
		width: 90%;
		margin: 0 auto;
	}
</style>
