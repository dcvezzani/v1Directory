<template>
  <div class="dashboard section">
		<div class="container">

<div class="tile is-ancestor">
  <div class="tile is-vertical is-8">
    <div class="tile">
      <div class="tile is-parent is-vertical">
        <article class="tile is-child notification is-primary">
<FindPerson></FindPerson>
        </article>
        <article class="tile is-child notification is-warning">
<ContactDetails></ContactDetails>
        </article>
      </div>
      <div class="tile is-parent is-vertical">
				<div class="tile is-child">
					<article class="tile is-child notification is-info">
<QueueVisits></QueueVisits>
					</article>
				</div>
				<div class="tile is-child">
					<article class="tile is-child notification is-info">
<UpcomingVisits></UpcomingVisits>
					</article>
				</div>
      </div>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child notification is-danger">
      </article>
    </div>
  </div>
  <div class="tile is-parent">
    <article class="tile is-child notification is-success">
<Assignments></Assignments>
    </article>
  </div>
</div>

		</div>
  </div>
</template>

<script>
import QueueVisits from '@/components/QueueVisits'
import UpcomingVisits from '@/components/UpcomingVisits'
import FindPerson from '@/components/FindPerson'
import Assignments from '@/components/Assignments'
import ContactDetails from '@/components/ContactDetails'

export default {
  name: 'Dashboard',
  components: { QueueVisits, UpcomingVisits, FindPerson, Assignments, ContactDetails },	
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.notification {
		padding: 1.25rem 1.25rem 1.25rem 1.25rem
	}
</style>
