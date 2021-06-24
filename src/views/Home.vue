<template>
    <div>
        <h2>组件库</h2>
        <div>
            <router-link to="/html5Drag" style="margin-right: 20px">html5拖拽</router-link>
            <router-link to="/jsDrag" style="margin-right: 20px">js拖拽</router-link>
            <router-link to="/vueQuillEditor">富文本编辑(vue-quill-editor)</router-link>
        </div>
        <div style="padding: 24px">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    import VueQuillEditor from "../components/VueQuillEditor";
    export default {
        components:{
            VueQuillEditor
        },
        data() {
            return {
                testContent:'<p>22222333333</p>'
            };
        },
        methods: {

        },
        mounted() {

        }
    };
</script>
