var myHeading = document.querySelector("p");
myHeading.onclick = function(){
    this.style.color = getRandomColor();
};

var app = new Vue({
    el: "#tts-eval-app",
    data: {
        server: "http://localhost",
        exp_list: config,   // 使用config.js的配置
        defaultNP: "NP",
        cur_exp: {
            // 避免未定义情况出现
            name: null,
            cur_ep_id: null,
            tot_eps_num: null,
        },
    },
    beforeCreate: function(){
        console.log("实验配置载入中......");
    },
    created: function(){
        console.log("实验配置已载入！");
        console.log("打乱实验顺序......");
        for (var exp_id = 0; exp_id < this.exp_list.length; exp_id++){
            // 打乱每个子实验中，不同example间的顺序
            permutation(this.exp_list[exp_id].eps_list);
            for (var ep_id = 0; ep_id < this.exp_list[exp_id].eps_list.length; ep_id++){
                // 打乱当前子实验的某条example中的各条待比较音频的顺序
                permutation(this.exp_list[exp_id].eps_list[ep_id]);
            }
        }
    },
    methods: {
        prevEp: function(){
            if (this.cur_exp.cur_ep_id > 0){
                this.cur_exp.cur_ep_id -= 1;
            }
            return;
        },
        nextEp: function(){
            if (this.cur_exp.cur_ep_id < this.cur_exp.tot_eps_num - 1){
                this.cur_exp.cur_ep_id += 1;
            }
            return;
        },
        convertNumToABC: function(num){
            return String.fromCodePoint(num + 65);
        },
        saveResult: function(){
            saveText(JSON.stringify(this.exp_list),"save.json");
        },
        sendResult: function(){
            sendText(JSON.stringify(this.exp_list), this.server)
        }
    }
})