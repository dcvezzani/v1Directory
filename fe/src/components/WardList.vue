<template>
  <div class="ward-list">
		<textarea ref="ldscookie" class="textarea" placeholder="LDS token cookie">JSESSIONID=EBB562A427690E7F37ABA725391B4409; audience_split=66; aam_uuid=59021978805140378433128153389350885285; disable-footnotes=true; audience_id=501805; ldsorg_profile=%7B%22lastUser%22%3A%223694966261%22%2C%22users%22%3A%7B%223694966261%22%3A%7B%22nbIntro%22%3A0%2C%22nbMode%22%3A1%2C%22nbToolbar%22%3A1%2C%22nbColor%22%3A%22hl-color-1%22%2C%22nbFolder%22%3Anull%2C%22editId%22%3Anull%2C%22nbView%22%3A1%7D%7D%7D; _CT_RS_=Recording; WRUID=1734156077318192; lds-preferred-lang=eng; __CT_Data=gpv=4&ckp=tld&dm=lds.org&apv_59_www11=4&cpv_59_www11=4&rpv_59_www11=4; ctm={'pgv':1770140726949826|'vst':4738421549452151|'vstr':6736419646463608|'intr':1525922622442|'v':1|'lvst':63}; AMCV_66C5485451E56AAE0A490D45%40AdobeOrg=1099438348%7CMCIDTS%7C17669%7CMCMID%7C58906328506240852853115932400075023059%7CMCAAMLH-1527130111%7C9%7CMCAAMB-1527130111%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1526532511s%7CNONE%7CMCAID%7CNONE%7CMCSYNCSOP%7C411-17676%7CvVersion%7C2.1.0; aam_sc=aamsc%3D708195%7C855179; check=true; s_cc=true; audience_s_split=56; lds-youtube=true; amlbcookie=75; TS01b89640=01999b7023cc0a088ad98fbd75bab9574e61f6c837a2d13523042167c9197acf8848952069277acbb9672f677a24833dc06a721e82155d3b35f3b02477795113a0f74295c9; lds-id=AQIC5wM2LY4Sfcwz61g3WELAuAnRG8Oa1qxl9NfWrrRr1KU.*AAJTSQACMDIAAlNLABMxODIxMzY0Mjg3MTQyODQwOTc3AAJTMQACMDU.*; s_ppvl=lds.org%253A%2F%2C36%2C30%2C715%2C1440%2C715%2C1440%2C900%2C2%2CL; mbox=PC#fa0bff93ae4543ce8c4dcc46ddc4b1e7.17_15#1589806939|session#d8bd9f9d59f54fe7a359a079e7a6162e#1526620414; s_ppv=https%253A%2F%2Fwww.lds.org%2Fdirectory%2F%253Flang%253Deng%2C98%2C57%2C715%2C1440%2C715%2C1440%2C900%2C2%2CL; utag_main=v_id:01613d1c695300571a5f4e0e1ad00407900470710093c$_sn:26$_ss:1$_st:1526620353024$vapi_domain:lds.org$dc_visit:22$ses_id:1526618553024%3Bexp-session$_pn:1%3Bexp-session$dc_event:1%3Bexp-session$dc_region:us-east-1%3Bexp-session; t_ppv=undefined%2C98%2C57%2C715%2C6005; ObSSOCookie=KLDD9SQLmYfNXC%2F%2BHDSxDa3YxbUpxUopXArxmksZWmLJmpeGuzwq88rnFO42FAa1QJppEVH9y40CG4i%2Bon1WvGxMPJ%2F3a4lKBYxRib9Xlnm2Sx9SJtxmXWKEpB3cFE9no1xUxASwmALaEeCaSyJTgMOLaTfqmX96dETfmuahYGmWxcsLARu8Mg5TV%2FnYZXiOgkb3FoXsr4FFb1XTOyiXzY1hqSnveDUdAd0p2ee%2FMKOxDZAfbf6c5cuCuB2AgNOGxvtvYU2fXhE5WKRwqB%2Ft9%2B%2BTzpIIhCRc%2FNENTpgwx2JvytBmT9uQMNUM%2FLOWW5DV91E3PsCuEg4lpvwOe%2Bb%2FNXELHXLgmskimZonhhl2zqE%3D</textarea>

		<ul class="family-list">
			<FamilyListItem v-for="family in families" :key="family.name" :family="family"></FamilyListItem>
		</ul>
  </div>
</template>

<script>
import FamilyListItem from '@/components/FamilyListItem'

export default {
  name: 'WardList',
  components: { FamilyListItem },
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
			this.$socket.emit('fetchAllFamilies');
    },
    joined: function(data){
		  console.log('Connected to server: ', data);
    },
    "fetchAllFamilies:done": function(data){
		  console.log('fetchAllFamilies:done: ', data);
			if (data.status == 200) {
				this.families = data.json.rows;
			}
    },
  },
  methods: {
    clickButton: function(val){
      // $socket is socket.io-client instance
      this.$socket.emit('emit_method', val);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.ward-list {
		width: 500px;
		margin: 0 auto;
	}
	.family-list {
		margin-top: 1em;
	}
</style>
