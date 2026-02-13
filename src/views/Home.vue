<template>
	<div class="el-container-max">
		<Main/>
	</div>
</template>

<script setup>
import { ref, markRaw, watch,computed } from 'vue';
import Main from '@/components/Main/index.vue'; // 明确指定 .vue 扩展名
import { useStore } from 'vuex'  //引入vuex实例
const UseStore = useStore();  //注册vuex实例对象

const isshowfooter = ref(true);
const showfooter = (value) => {
	isshowfooter.value = value;
}
const isShowDetail = computed(() => UseStore.state.AmapStore.Temporary);

</script>

<style lang="less" scoped>
.el-container-max {
	width: 1920px;
	height: 1080px;
}

</style>