var app = new Vue({
    el: "#tts-eval-app",
    data: {
        post_url: "/",
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
            this.exp_list[exp_id].cur_ep_id = 1;
            this.exp_list[exp_id].tot_eps_num = this.exp_list[exp_id].eps_list.length;
            for (var ep_id = 0; ep_id < this.exp_list[exp_id].tot_eps_num; ep_id++){
                // 打乱当前子实验的某条example中的各条待比较音频的顺序
                permutation(this.exp_list[exp_id].eps_list[ep_id].ep);
            }
        }
    },
    methods: {
        prevEp: function(){
            if (this.cur_exp.cur_ep_id > 1){
                $("#transcript, .audio_select_wrapper").fadeOut(250);
                // $(".audio_select_wrapper").slideToggle(250);
                this.cur_exp.cur_ep_id -= 1;
                $("#transcript, .audio_select_wrapper").fadeIn(250);
                // $(".audio_select_wrapper").slideToggle(250);
            }
            return;
        },
        nextEp: function(){
            if (this.cur_exp.cur_ep_id < this.cur_exp.tot_eps_num){
                $("#transcript, .audio_select_wrapper").fadeOut(250);
                // $(".audio_select_wrapper").slideToggle(250);
                this.cur_exp.cur_ep_id += 1;
                $("#transcript, .audio_select_wrapper").fadeIn(250);
                // $(".audio_select_wrapper").slideToggle(250);
            }
            return;
        },
        convertNumToABC: function(num){
            return String.fromCodePoint(num + 65);
        },
        saveResult: function(){
            // index:        0      1     2       3         4          5          6
            // date_list: ["Mon", "Feb", "05", "2018", "04:58:08", "GMT+0800", "(CST)"]
            var date_list = Date().split(" ");
            // save_name: 2018_Feb_05_04_58_08.json
            var save_name = date_list[3] + "_" +
                            date_list[1] + "_" +
                            date_list[2] + "_" +
                            date_list[4].replace(/:/g, "_") +
                            ".json";
            saveText(JSON.stringify(this.exp_list), save_name);
        },
        sendResult: function(){
            sendText(JSON.stringify(this.exp_list), this.post_url)
        }
    }
})
