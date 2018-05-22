<template>
  <div class="queue-visits">
		QueueVisits
  </div>
</template>

<script>
export default {
  name: 'QueueVisits',
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
    "QueueVisits:blah": function(data){
		  console.log('QueueVisits:blah', data);
			this.$socket.emit('QueueVisits:blah', {msg: 'bleh'});
    },
  },
  mounted () {
		window.Event.$on('QueueVisits:activate', (data) => {
		  console.log('QueueVisits:blah', data);
			window.Event.$emit('QueueVisits:activated', {msg: 'done'});
		});
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

