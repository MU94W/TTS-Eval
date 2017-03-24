// config object
var config = {
    baseurl:'data',
    exps:[
        {
            name:'ABX',
            styles:['Emphasis','Neutral'],
            files:['Test_1.wav','Test_3.wav','Test_6.wav','Test_15.wav','Test_17.wav'],
        },
        {
            name:'MOS',
            styles:['Natural','Neutral','Emphasis'],
            files:['Test_21.wav','Test_27.wav','Test_42.wav','Test_43.wav','Test_44.wav'],
        },
    ],
};
// config object

var linVector = function(start, stop, interval=1){
    var len = Math.floor((stop - start - 1)/interval) + 1;
    var ret = new Int32Array(len);
    for(var i = 0; i < len; i++){
        ret[i] = start + i * interval;
    }
    return ret;
};

// arr -> reference
var permutation = function(arr){
    var len = arr.length;
    var p_last = len - 1;
    var p_select;
    for(var i = 0; i < len; i++){
        p_select = Math.round(Math.random() * p_last);
        var swap_num = arr[p_last];
        arr[p_last] = arr[p_select];
        arr[p_select] = swap_num;
        p_last -= 1;
    }
};

var getRandomColor = function(){
    return '#' + 
        (function(color){
            return (color += 
                    '0123456789abcdef'[Math.floor(Math.random()*16)])
                    && (color.length == 6) ? color : arguments.callee(color);
        })('');
};

var create_EVAL_HTML = function(dic,exp_order){
    var style_cnt = dic.styles.length;
    var tmp = "";
    for(var i = 0; i < style_cnt; i++){
        tmp += "<audio src='' controls class='EVAL' id='exp_" + exp_order + "_" + i +"'></audio>";
    }
    var str_prev = "<div class='btn' id='exp_p" + exp_order + "'>Prev</div>";
    var str_next = "<div class='btn' id='exp_n" + exp_order + "'>Next</div>";
    var str = "<div class='EVAL_wrapper'>" + tmp + str_prev + str_next + "</div>";
    return str;
};

var add_eval_func = function(dom_obj,dic,exp_order){
    var inner_html = create_EVAL_HTML(dic,exp_order);
    dom_obj.innerHTML += inner_html;
};

var eval_container = document.getElementById("main_eval_container");
for(var i = 0; i < config.exps.length; i++){
    add_eval_func(eval_container,config.exps[i],i);
};

// global log all the exps' step
var init_cnt = new Int32Array(config.exps.length);
var audi_lst = new Array(config.exps.length);
for(var i = 0; i < config.exps.length; i++){
    audi_lst[i] = config.exps[i].files;
}
var perm_lst = new Array(config.exps.length);
(function(){
    for(var i = 0; i < config.exps.length; i++){
        perm_lst[i] = linVector(0,config.exps[i].files.length);
        permutation(perm_lst[i]);
        //console.log(perm_lst[i]);
    }
})();

(function(){
    for(var i = 0; i < config.exps.length; i++){
        var btn_p_id = 'exp_p' + i;
        var btn_n_id = 'exp_n' + i;
        var btn_p = document.getElementById(btn_p_id);
        var btn_n = document.getElementById(btn_n_id);
        // add this.exp_order, or else this.onclick cant access var i.
        btn_p.exp_order = i;
        btn_n.exp_order = i;
        btn_p.onclick = function(){
            var exp_order = this.exp_order;
            var step = init_cnt[exp_order];
            var audios = config.exps[exp_order].files.length;
            for(var j = 0; j < config.exps[exp_order].styles.length; j++){
                var this_audio_id = 'exp_' + exp_order + '_' + j;
                var this_audio = document.getElementById(this_audio_id);
                var audio_path = config.baseurl + '/' + config.exps[exp_order].name
                                    + '/' + config.exps[exp_order].styles[j]
                                    + '/' + audi_lst[exp_order][perm_lst[exp_order][step]];
                this_audio.setAttribute('src',audio_path);
            }
            step = (step - 1) % audios;
            if(step < 0){
                step += audios;
            }
            init_cnt[exp_order] = step;
        };
        btn_n.onclick = function(){
            var exp_order = this.exp_order;
            var step = init_cnt[exp_order];
            var audios = config.exps[exp_order].files.length;
            for(var j = 0; j < config.exps[exp_order].styles.length; j++){
                var this_audio_id = 'exp_' + exp_order + '_' + j;
                var this_audio = document.getElementById(this_audio_id);
                var audio_path = config.baseurl + '/' + config.exps[exp_order].name
                                    + '/' + config.exps[exp_order].styles[j]
                                    + '/' + audi_lst[exp_order][perm_lst[exp_order][step]];
                this_audio.setAttribute('src',audio_path);
            }
            step = (step + 1) % audios;
            init_cnt[exp_order] = step;
        };
 
    }
})();

var myHeading = document.querySelector("h1");
var myHeadingStaticStyle = myHeading.getAttribute('style');
var cnt = 0;
myHeading.onclick = function(){
    var res = cnt + Math.round(Math.random()*10);
    this.textContent = res;
    var color = 'color:' + getRandomColor()
    this.setAttribute('style', myHeadingStaticStyle + ';' + color);
    cnt++;
};