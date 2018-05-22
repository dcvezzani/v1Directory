<template>
  <div class="queue-visits">
		Assignments
  </div>
</template>

<script>
export default {
  name: 'Assignments',
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
    "Assignments:blah": function(data){
		  console.log('Assignments:blah', data);
			this.$socket.emit('Assignments:blah', {msg: 'bleh'});
    },
  },
  mounted () {
		window.Event.$on('Assignments:activate', (data) => {
		  console.log('Assignments:blah', data);
			window.Event.$emit('Assignments:activated', {msg: 'done'});
		});
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

