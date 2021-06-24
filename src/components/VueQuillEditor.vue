<template>
    <div class="collection-richtext">
        <template>
            <quill-editor
                class="editor"
                ref="myQuillEditor"
                :value="value"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @input="input($event)"
                @change="onEditorChange($event)"
            >
            </quill-editor>
            <!-- 文件上传input 将它隐藏-->
            <a-upload class="upload-demo"
                      :before-upload="beforeUpload"
                      @change='upScuccess'
                      ref="upload"
                      style="display:none"
            >
                <a-button size="small"
                          type="primary"
                          id="imgInput"
                >
                    点击上传
                </a-button>
            </a-upload>
        </template>
    </div>
</template>

<script>
import {Quill} from "vue-quill-editor";
import {ImageDrop} from "quill-image-drop-module";
import ImageResize from 'quill-image-resize-module';
import Video from "../util/video";
Quill.register(Video, true);
Quill.register('modules/imageResize', ImageResize);
Quill.register("modules/imageDrop", ImageDrop);
// 工具栏配置
const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
    ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
    [{header: 1}, {header: 2}], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
    [{list: "ordered"}, {list: "bullet"}], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    [{script: "sub"}, {script: "super"}], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
    [{indent: "-1"}, {indent: "+1"}], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
    [{direction: "rtl"}], // 文本方向-----[{'direction': 'rtl'}]
    [{size: ["small", false, "large", "huge"]}], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
    [{header: [1, 2, 3, 4, 5, 6, false]}], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
    [{color: []}, {background: []}], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
    [{font: []}], // 字体种类-----[{ font: [] }]
    [{align: []}], // 对齐方式-----[{ align: [] }]
    ["clean"], // 清除文本格式-----['clean']
    ["image", "video"], // 链接、图片、视频-----['link', 'image', 'video']
];
const STATICDOMAIN = '//ss.yidejia.com/'
const STATVIDEO = '//flv.yidejia.com/'
export default {
    model: {
        prop: "value",
        event: "change",
    },
    name: "RichText",
    mounted() {
        const myQuillEditor = this.$refs.myQuillEditor;
        // 为图片ICON绑定事件  getModule 为编辑器的内部属性
        myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
        myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)  // 为视频ICON绑定事件
    },
    data() {
        return {
            editorOption: {
                placeholder: "请输入",
                modules: {
                    imageDrop: true,
                    imageResize: {
                        displayStyles: {
                            backgroundColor: "black",
                            border: "none",
                            color: "white",
                        },
                        modules: ["Resize", "DisplaySize", "Toolbar"],
                    },
                    toolbar: {
                        container: toolbarOptions,
                    },
                },
            },
            uploadData: {},
            uploadType: '',    // 上传的文件类型（图片、视频）
            addRange:[],
            fullscreenLoading:false
        };
    },
    props: {
        value: String
    },
    methods: {
        onEditorBlur(e) {
            // console.log('失焦')
            // console.log(e);
            // console.log(this.content);
        },
        onEditorFocus(e) {
            // console.log('聚焦')
            // console.log(e);
            // console.log(this.content);
        },
        onEditorReady(e) {
            // console.log('准备好')
            // console.log(e);
            // console.log(this.content);
        },
        input(event) {
            this.$emit("change", event);
            console.log(event);
        },
        onEditorChange(event) {

        },
        // 图片上传之前调取的函数
        beforeUpload(file) {
            return false;
        },
        // 图片上传成功回调   插入到编辑器中
        upScuccess({file}) {
            console.log(file);
            this.fullscreenLoading = false
            let vm = this;
            let url = 'http://172.16.181.209:9297/museum/dq_zt/1623812504937728.mp4'
            if (url != null && url.length > 0) {  // 将文件上传后的URL地址插入到编辑器文本中
                let value = url
                vm.addRange = vm.$refs.myQuillEditor.quill.getSelection()
                value = value.indexOf('http') !== -1 ? value : 'http:' + value
                vm.$refs.myQuillEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER)   // 调用编辑器的 insertEmbed 方法，插入URL
            } else {

            }
        },

        // 点击图片ICON触发事件
        imgHandler(state) {
            this.addRange = this.$refs.myQuillEditor.quill.getSelection()
            if (state) {
                let fileInput = document.getElementById('imgInput')
                fileInput.click() // 加一个触发事件
            }
            this.uploadType = 'image'
        },

        // 点击视频ICON触发事件
        videoHandler(state) {
            this.addRange = this.$refs.myQuillEditor.quill.getSelection()
            if (state) {
                let fileInput = document.getElementById('imgInput')
                fileInput.click() // 加一个触发事件
            }
            this.uploadType = 'video';
            console.log('video----')
        }
    }
}
</script>

<style scoped lang="scss" type='text/scss'>
</style>
<style lang='scss'>
.collection-richtext {
    .editor {
        line-height: normal !important;
        width: 100%;
    }

    .ql-snow .ql-tooltip[data-mode="link"]::before {
        content: "请输入链接地址:";
    }

    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
        border-right: 0px;
        content: "保存";
        padding-right: 0px;
    }

    .ql-snow .ql-tooltip[data-mode="video"]::before {
        content: "请输入视频地址:";
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
        content: "14px";
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
        content: "10px";
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
        content: "18px";
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
        content: "32px";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
        content: "文本";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
        content: "标题1";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
        content: "标题2";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
        content: "标题3";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
        content: "标题4";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
        content: "标题5";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
        content: "标题6";
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
        content: "标准字体";
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
        content: "衬线字体";
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
        content: "等宽字体";
    }

    .ql-container {
        height: 550px;
    }
}
</style>