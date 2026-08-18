<template>
	<v-scale-screen class="content" :fullScreen='true'>
		<router-view/>
	</v-scale-screen>
</template>

<script>
import { defineComponent } from 'vue'
import VScaleScreen from 'v-scale-screen'

export default defineComponent({
  name: 'Demo',
  components: {
    VScaleScreen
  }
})
</script>

<style lang="less" scoped>
.content{
	background-color: rgba(240, 248, 255, 0) !important;
}
</style>

<style lang="less">
html,body{
	margin: 0;
	padding: 0;
	overflow: hidden !important;
	background: #0a1628;
} 
</style>

