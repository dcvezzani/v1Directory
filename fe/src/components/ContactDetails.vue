<template>
  <div class="queue-visits">
		ContactDetails
  </div>
</template>

<script>
export default {
  name: 'ContactDetails',
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
    "ContactDetails:blah": function(data){
		  console.log('ContactDetails:blah', data);
			this.$socket.emit('ContactDetails:blah', {msg: 'bleh'});
    },
  },
  mounted () {
		window.Event.$on('ContactDetails:activate', (data) => {
		  console.log('ContactDetails:blah', data);
			window.Event.$emit('ContactDetails:activated', {msg: 'done'});
		});
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

