var app = new Vue({
    el: "#tts-eval-app",
    data: {
        exp_list: [
            {name: "MOS0",
             type: "MOS",
             eps_list: [[{src: "static/data/ABX0/model_0_A/0.mp3", eval: "fair"},
                        {src: "static/data/ABX0/model_0_A/1.mp3", eval: "fair"}],
                        [{src: "static/data/ABX0/model_0_A/2.mp3", eval: "fair"},
                        {src: "static/data/ABX0/model_0_A/3.mp3", eval: "fair"}],
                        [{src: "static/data/ABX0/model_0_A/4.mp3", eval: "fair"},
                        {src: "static/data/ABX0/model_0_A/5.mp3", eval: "fair"}]],
             cur_ep_id: 0,
             tot_eps_num: 3,
             },
            {name: "MOS1",
             type: "MOS",
             eps_list: [[{src: "static/data/ABX0/model_0_A/0.mp3", eval: "fair"},
                        {src: "static/data/ABX0/model_0_A/1.mp3", eval: "fair"}],
                        [{src: "static/data/ABX0/model_0_A/2.mp3", eval: "fair"},
                        {src: "static/data/ABX0/model_0_A/3.mp3", eval: "fair"}],
                        [{src: "static/data/ABX0/model_0_A/4.mp3", eval: "fair"},
                        {src: "static/data/ABX0/model_0_A/5.mp3", eval: "fair"}]],
             cur_ep_id: 0,
             tot_eps_num: 3,
             }
        ],
        cur_exp: {},
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
        }
    }
})