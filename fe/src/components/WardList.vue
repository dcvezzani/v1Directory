<template>
  <div class="ward-list">
		<ul>
			<li v-for="family in families" :key="family.name">{{ family.name }} : {{ family.id }}</li>
		</ul>
  </div>
</template>

<script>
export default {
  name: 'WardList',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App', 
			families: [],
    }
  },
  sockets:{
    connect: function(){
      console.log('socket connected');
			this.$socket.emit('join', 'Hello World from client');
			this.$socket.emit('fetchAllMembers');
    },
    joined: function(data){
		  console.log('Connected to server: ', data);
    },
    "fetchAllMembers:done": function(data){
		  console.log('fetchAllMembers:done: ', data);
			if (data.status == 200) {
				this.families = data.json.rows;
			}
    },
  },
  methods: {
    clickButton: function(val){
        // $socket is socket.io-client instance
        this.$socket.emit('emit_method', val);
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.ward-list {
		width: 500px;
		margin: 0 auto;
	}
</style>
