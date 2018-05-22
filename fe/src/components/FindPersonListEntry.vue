<template>
  <div class="find-person-list-entry">

		<p class="person-name">{{ fname }}</p>
		<p> <i class="fas fa-map"></i> {{ address }}</p>
		<p> <i class="fas fa-phone"></i> {{ phone }}</p>
		<p> <i class="fas fa-comment"></i> {{ text }}</p>
		<p> <i class="fas fa-envelope"></i> {{ email }}</p>

  </div>
</template>

<script>
export default {
  name: 'FindPersonListEntry',
  props: ['name'],
  // components: { Junk },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
			fname: "David & Juventa Vezzani",
			address: "132 S. Dry Creek Lane, Vineyard UT  84058",
			phone: "2097569688",
			text: "2097569688",
			email: "dcvezzani@gmail.com",
    }
  },
  computed: {
    stuff: function() {
			return 'stuff';
		},
  },
  methods: {
    junk: function() {
		},
  },
  sockets:{
    "FindPersonListEntry:blah": function(data){
		  console.log('FindPersonListEntry:blah', data);
			this.$socket.emit('FindPersonListEntry:blah', {msg: 'bleh'});
    },
  },
  mounted () {
		window.Event.$on('FindPersonListEntry:activate', (data) => {
		  console.log('FindPersonListEntry:blah', data);
			window.Event.$emit('FindPersonListEntry:activated', {msg: 'done'});
		});
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.find-person-list-entry {
		margin-bottom: 1em;
	}
	.person-name {
		font-weight: bold;
	}
</style>

