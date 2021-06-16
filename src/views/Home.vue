<template>
    <div>
        <h2>组件示例</h2>
        <div>
            <router-link to="/html5Drag" style="margin-right: 20px">html5拖拽</router-link>
            <router-link to="/jsDrag">js拖拽</router-link>
        </div>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {

            };
        },
        methods: {

        },
        mounted() {

        }
    };
</script>
