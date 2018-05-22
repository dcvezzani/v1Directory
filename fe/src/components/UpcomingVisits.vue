<template>
  <div class="queue-visits">
		UpcomingVisits
  </div>
</template>

<script>
export default {
  name: 'UpcomingVisits',
  props: ['name'],
  // components: { Junk },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
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
    "UpcomingVisits:blah": function(data){
		  console.log('UpcomingVisits:blah', data);
			this.$socket.emit('UpcomingVisits:blah', {msg: 'bleh'});
    },
  },
  mounted () {
		window.Event.$on('UpcomingVisits:activate', (data) => {
		  console.log('UpcomingVisits:blah', data);
			window.Event.$emit('UpcomingVisits:activated', {msg: 'done'});
		});
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

