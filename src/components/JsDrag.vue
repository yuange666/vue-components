<template>
    <div>
        <h2 style="text-align: center">js拖拽布局示例（较H5的拖拽麻烦一些）</h2>
        <div class="box"
             ref="box"
        >
            <div
                v-for="(pic,index) in collectionPics"
                class="pic"
                :class="{conflict:pic.conflict,current:currentMoveIndex===index}"
                :style="{left:pic.left+'px',top:pic.top+'px'}"
                ref="pic"
                @mousedown="picDragStart($event,index)"
            >
                <img
                    style="width: 100%"
                    :src="pic.url"
                    alt=""
                    :draggable="false"
                    @load="imgLoad"
                >
                <a-icon type="close-circle"
                        style="position: absolute;font-size: 30px"
                        :draggable="false"
                        @click="deletePic(index,pic.url)"
                />
            </div>
        </div>
        <div class="btn-area">
            <button class="btn"
                      v-for="(item,index) in collectionButtons"
                      :style="{left:item.left+'px',top:item.top+'px'}"
                      :disabled="item.disabled"
                      @mousedown="dragStart($event,item,index)"
            >
                {{ item.name }}
            </button>
        </div>
    </div>
</template>

<script>
import pic1 from '../assets/pic1.jpeg';
import pic2 from '../assets/pic2.jpeg';
import pic3 from '../assets/pic3.jpeg';
import pic4 from '../assets/pic4.jpeg';

export default {
    data() {
        return {
            collectionButtons: [
                {name: '藏品1', link: pic1, disabled: false,left:0,top:0},
                {name: '藏品2', link: pic2, disabled: false,left:0,top:0},
                {name: '藏品3', link: pic3, disabled: false,left:0,top:0},
                {name: '藏品4', link: pic4, disabled: false,left:0,top:0},
            ],
            collectionPics: [
                // {
                //     url:'',
                //     left:0,
                //     top:0,
                //     conflict: false
                // }
            ],
            currentMoveIndex: -1,
            collectionButtonDisabled: [],
            addState: false
        };
    },
    computed: {},
    methods: {
        dragStart(e,item,index){
            if(e.button===0){
                this.collectionButtons.push({...item});
                let currentEle=e.currentTarget;
                let disX = e.clientX - currentEle.offsetLeft;
                let disY = e.clientY - currentEle.offsetTop;
                document.onmousemove = (e) => {
                    this.$set(this.collectionButtons,index,{
                        ...this.collectionButtons[index],
                        left:e.clientX-disX,
                        top:e.clientY-disY
                    });
                }
                document.onmouseup =  (e)=> {
                    let {left,top}=this.collectionButtons.pop();
                    this.$set(this.collectionButtons,index,{
                        ...this.collectionButtons[index],
                        left:left,
                        top:top
                    });
                    if(this.enterBox(this.$refs.box,currentEle,e.clientX-disX,e.clientY-disY)){
                        this.drop(e,item.link);
                    }
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        },
        enterBox(boxEle,btnEle,left,top){
            return (left>=boxEle.offsetLeft)&&(left<=boxEle.offsetLeft+boxEle.offsetWidth-btnEle.offsetWidth)&&(top>=boxEle.offsetTop)&&(top<=boxEle.offsetTop+boxEle.offsetHeight-btnEle.offsetHeight)
        },
        drop(e,data) {
            this.addState = true;
            this.collectionPics.push({
                url: data,
                left: e.clientX - this.$refs.box.offsetLeft,
                top: e.clientY - this.$refs.box.offsetTop
            });
            this.buttonStatusChange(data, true);
            this.currentMoveIndex = this.collectionPics.length - 1;
        },
        buttonStatusChange(data, status) {
            let currentButtonIndex = this.collectionButtons.findIndex((e) => e.link === data);
            this.$set(this.collectionButtons, currentButtonIndex, {
                ...this.collectionButtons[currentButtonIndex],
                disabled: status
            })
        },
        imgLoad() {
            if (this.addState) {
                let lastPicData = this.collectionPics[this.collectionPics.length - 1];
                let lastPicEle = this.$refs.pic[this.collectionPics.length - 1];
                let {l1, t1} = this.BorderDetection(lastPicData.left, lastPicData.top,
                    lastPicEle.offsetWidth, lastPicEle.offsetHeight,
                    this.$refs.box.offsetWidth, this.$refs.box.offsetHeight
                )
                this.$set(this.collectionPics, this.collectionPics.length - 1, {
                    ...lastPicData,
                    left: l1,
                    top: t1
                });
                this.highLightPics();
            }
        },
        highLightPics(){
            let conflictArr=this.conflictTest();
            this.collectionPics.forEach((e,index)=>{
                this.$set(this.collectionPics, index, {
                    ...this.collectionPics[index],
                    conflict: conflictArr.has(index)
                });
            })
        },
        picDragStart(e, index) {
            if (e.button === 0) {
                this.currentMoveIndex = index;
                let disX = e.clientX - e.currentTarget.offsetLeft;
                let disY = e.clientY - e.currentTarget.offsetTop;
                document.onmousemove = (e) => {
                    let {
                        l1,
                        t1
                    } = this.BorderDetection(e.clientX - disX, e.clientY - disY, this.$refs.pic[index].offsetWidth,
                        this.$refs.pic[index].offsetHeight, this.$refs.box.offsetWidth, this.$refs.box.offsetHeight);
                    this.$set(this.collectionPics,index,{
                        ...this.collectionPics[index],
                        left: l1,
                        top:t1
                    })
                    this.highLightPics();
                }
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        },
        //碰撞检测，判断任意藏品之间是否有重合
        conflictTest() {
            let res=new Set();
            for (let i = 0; i < this.collectionPics.length - 1; i++) {
                let currentEle=this.$refs.pic[i];
                let l1 = currentEle.offsetLeft;
                let r1 = l1 + currentEle.offsetWidth;
                let t1 = currentEle.offsetTop;
                let b1 = t1 + currentEle.offsetHeight;
                for (let j = i + 1; j < this.collectionPics.length;j++) {
                    let ele2 = this.$refs.pic[j];
                    let l2 = ele2.offsetLeft;
                    let r2 = l2 + ele2.offsetWidth;
                    let t2 = ele2.offsetTop;
                    let b2 = t2 + ele2.offsetHeight;
                    if (!(r1 < l2 || l1 > r2 || b1 < t2 || t1 > b2)) {
                        res.add(j);
                        res.add(i);
                    }
                }
            }
            return res;
        },
        //边界检测，l1,t1分别为拖拽元素的left，top值,w1,h1为拖拽元素的宽高，w2,h2为画布的宽高
        BorderDetection(l1, t1, w1, h1, w2, h2) {
            if (l1 < 0) {
                l1 = 0;
            } else if (l1 > w2 - w1) {
                l1 = w2 - w1;
            }
            if (t1 < 0) {
                t1 = 0;
            } else if (t1 > h2 - h1) {
                t1 = h2 - h1;
            }
            return {l1, t1};
        },
        deletePic(index, data) {
            this.addState = false;
            this.collectionPics.splice(index, 1);
            this.buttonStatusChange(data, false);
        }
    },
    mounted() {
        this.collectionButtons=this.collectionButtons.map((e,index)=>{
            return {
                ...e,
                top:this.$refs.box.offsetTop+this.$refs.box.offsetHeight+50,
                left: 80*index
            }
        })
    }
};
</script>
<style scoped>
.box {
    position: relative;
    width: 900px;
    height: 500px;
    margin: 20px auto;
    border: 1px solid #cccccc;
}

.pic {
    position: absolute;
    z-index: 1;
    width: 200px;
}

.btn-area {
    margin-top: 50px;
    text-align: center;
}
.btn{

}
.conflict {
    border: 1px solid #f00;
}

.current {
    z-index: 2;
}

.right-menu {
    position: absolute;
    width: 100px;
    height: 100px;
    z-index: 10;
    border: 1px solid #cccccc;
}
</style>