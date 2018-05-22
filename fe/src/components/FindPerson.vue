<template>
  <div class="find-person">
		<div class="field has-addons">
			<div class="control">
				<input class="input" type="text" placeholder="Find contact">
			</div>
			<div class="control">
				<a class="button is-info">
					Find
				</a>
			</div>
		</div>
		<ul>
			<li><FindPersonListEntry></FindPersonListEntry></li>
			<li><FindPersonListEntry></FindPersonListEntry></li>
			<li><FindPersonListEntry></FindPersonListEntry></li>
		</ul>
  </div>
</template>

<script>
import FindPersonListEntry from '@/components/FindPersonListEntry'

export default {
  name: 'FindPerson',
  components: { FindPersonListEntry },	
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
    "FindPerson:blah": function(data){
		  console.log('FindPerson:blah', data);
			this.$socket.emit('FindPerson:blah', {msg: 'bleh'});
    },
  },
  mounted () {
		window.Event.$on('FindPerson:activate', (data) => {
		  console.log('FindPerson:blah', data);
			window.Event.$emit('FindPerson:activated', {msg: 'done'});
		});
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.field .control:nth-child(1) {
		width: 100%;
	}
</style>

