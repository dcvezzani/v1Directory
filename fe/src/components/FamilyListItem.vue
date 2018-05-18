<template>
	<li class="family-list-item">
		{{ family.name }} : {{ family.id }} : [{{ memberCnt }}] 
		<a @click="fetchMembers" class="button is-primary fetch-button">Fetch</a>
	</li>
</template>

<script>
export default {
			/* <li v-for="family in families" :key="family.name">{{ family.name }} : {{ family.id }} <a @click="fetchMembers" class="button is-primary fetch-button">Fetch</a> </li> */

  props: ['family'], 
  name: 'FamilyListItem',
  computed: {
		memberCnt: function(){
			return (this.cnt !== null) ? this.cnt : this.family.cnt;
		},
	},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
			cnt: null,
    }
  },
  // sockets:{
  //   "fetchAllMembers:done:": function(data){
	// 	  console.log('fetchAllMembers:done: ', data);
	// 		if (data.status == 200) {
	// 			this.families = data.json.rows;
	// 		}
  //   },
  // },
  methods: {
		fetchMembers: function(){
			console.log(this.family);
			this.$socket.emit('fetchMembers', {family_id: this.family.id, ldscookie: this.$parent.$refs.ldscookie.value});
		}
  },
	mounted() {
		this.$socket.on(`fetchMembers:done:${this.family.id}`, (data) => {
	 	  console.log(`fetchMembers:done:${this.family.id}`, data);
	 		if (data.status == 200) {
	 			// this.families = data.json.rows;
				this.cnt = Object.keys(data.json).length;
	 		}
		});
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.fetch-button {
		font-size: 6pt;
	}
</style>
