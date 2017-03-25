// config object example
var config = {
    baseurl:'data',
    exps:[
        {
            name:'ABX',
            path:'ABX',
            styles:['Emphasis','Neutral'],
            files:['Test_1.wav','Test_3.wav','Test_6.wav','Test_15.wav','Test_17.wav'],
        },
        {
            name:'MOS',
            path:'MOS',
            styles:['Natural','Neutral','Emphasis'],
            files:['Test_21.wav','Test_27.wav','Test_42.wav','Test_43.wav','Test_44.wav','Test_57.wav','Test_66.wav','Test_77.wav','Test_83.wav','Test_90.wav'],
        },
    ],
};
// config object example

var audio_prefix = 'aud_';

var linVector = function(start, stop, interval=1){
    var len = Math.floor((stop - start - 1)/interval) + 1;
    var ret = new Int32Array(len);
    for(var i = 0; i < len; i++){
        ret[i] = start + i * interval
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

var createEvalHtml = function(dic,exp_order){
    var style_cnt = dic.styles.length;
    var tmp = "";
    for(var i = 0; i < style_cnt; i++){
        tmp += "<div class='audio_wrapper'>";
        tmp += "<audio src='' controls class='EVAL' id='" + audio_prefix + exp_order + "_" + i + "'></audio>";
        tmp += "<select class='selector' id='sel_" + exp_order + "_" + i + "'>"
                    + "<option value='1'> bad </option>"
                    + "<option value='2'> poor </option>"
                    + "<option value='3' selected> fair </option>"
                    + "<option value='4'> good </option>"
                    + "<option value='5'> excellent </option>"
                + "</select>";
        tmp += "</div>";
    }
    var str_prev = "<div class='btn' id='exp_p" + exp_order + "'>Prev</div>";
    var str_next = "<div class='btn' id='exp_n" + exp_order + "'>Next</div>";
    var str_step = "<div class='box_step' id='exp_s" + exp_order + "'>Audios:" + dic.files.length + "</div>";
    var str_btns = "<div class='btn_wrapper'>" + str_prev + str_step + str_next + "</div>"
    var str_okay = "<div class='btn' id='ok_" + exp_order + "'>Okay</div>";
    var str = "<div class='EVAL_wrapper' id='exp_w" + exp_order + "'>" + str_btns + tmp + str_okay + "</div>";
    return str;
};

var createEvalSelHtml = function(dic,exp_order){
    var show_exp_name = "Exp " + exp_order + ": " + dic.name;
    var str = "<div class='btn' id='sel_" + exp_order + "'>" + show_exp_name + "</div>";
    return str;
};

var addInnerHtml = function(func,dom_obj,dic,exp_order){
    var inner_html = func(dic,exp_order);
    dom_obj.innerHTML += inner_html;
};

var eval_selector = document.getElementById("eval_selector");
(function(){
    for(var i = 0; i < config.exps.length; i++){
        addInnerHtml(createEvalSelHtml,eval_selector,config.exps[i],i);
    }
})();

var eval_container = document.getElementById("main_eval_container");
(function(){
    for(var i = 0; i < config.exps.length; i++){
        addInnerHtml(createEvalHtml,eval_container,config.exps[i],i);
    }
})();

// global log all the exps' step
var init_cnt = new Int32Array(config.exps.length);
(function(){
    for(var i = 0; i < config.exps.length; i++){
        init_cnt[i] = -1;
    }
})();

var audi_lst = new Array(config.exps.length);

for(var i = 0; i < config.exps.length; i++){
    audi_lst[i] = config.exps[i].files;
}

var perm_lst = new Array(config.exps.length);

(function(){
    for(var i = 0; i < config.exps.length; i++){
        perm_lst[i] = linVector(0,config.exps[i].files.length);
        permutation(perm_lst[i]);
    }
})();

var getAudioPath = function(exp_order, style_order, step){
    return config.baseurl + '/' + config.exps[exp_order].path
            + '/' + config.exps[exp_order].styles[style_order]
            + '/' + audi_lst[exp_order][perm_lst[exp_order][step]];
};

var setAudioPath = function(exp_order, style_order, step){
    var this_audio_id = audio_prefix + exp_order + '_' + style_order;
    var this_audio = document.getElementById(this_audio_id);
    var audio_path = getAudioPath(exp_order, style_order, step);
    this_audio.src = audio_path;
};

var global_file_step;   // cache where i'm 

var updateStepShow = function(exp_order, step){
    global_file_step = step;
    var this_step_show_id = 'exp_s' + exp_order;
    var this_step_show = document.getElementById(this_step_show_id);
    this_step_show.innerHTML = (step+1) + ' / ' + config.exps[exp_order].files.length;
};

// Button 'Exp n: ##': add event(onclick) handle
(function(){
    for(var i = 0; i < config.exps.length; i++){
        var sel_id = 'sel_' + i;
        var sel_btn = document.getElementById(sel_id);
        sel_btn.show_id = 'exp_w' + i;
        sel_btn.onclick = function(){
            // turn off all EVAL_wrapper divs' show
            for(var i = 0; i < config.exps.length; i++){
                var eval_w_id = 'exp_w' + i;
                var eval_w = document.getElementById(eval_w_id);
                eval_w.style.display = 'none';
            }
            // turn on the EVAL_wrapper div's show controlled by this btn
            var eval_w = document.getElementById(this.show_id);
            eval_w.style.display = 'flex';
        };
    }
})();

// Button 'Prev' && 'Next': add event(onclick) handle
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
            if(step > 0){
                step -= 1;
                for(var j = 0; j < config.exps[exp_order].styles.length; j++){
                    setAudioPath(exp_order, j, step);
                    updateStepShow(exp_order, step);
                }
                init_cnt[exp_order] = step;
            }
        };
        btn_n.onclick = function(){
            var exp_order = this.exp_order;
            var step = init_cnt[exp_order];
            var audios = config.exps[exp_order].files.length;
            if(step < audios-1){
                step += 1;
                for(var j = 0; j < config.exps[exp_order].styles.length; j++){
                    setAudioPath(exp_order, j, step);
                    updateStepShow(exp_order, step);
                }
                init_cnt[exp_order] = step;
            }
        };
    }
})();

// value_arr's dims: 
//                  1st-dim: exp_order
//                  2nd-dim: file_order [dict]
//                  3rd-dim: style_order [dict]
var value_dic = {};
(function(){
    for(var i = 0; i < config.exps.length; i++){
        value_dic[config.exps[i].path] = {};
        for(var fl = 0; fl < config.exps[i].files.length; fl++){
            value_dic[config.exps[i].path][config.exps[i].files[fl]] = {};
        }
    }
})();

// Button 'Okay': add event(onclick) handle
(function(){
    for(var i = 0; i < config.exps.length; i++){
        var btn_ok_id = 'ok_' + i;
        var btn_ok = document.getElementById(btn_ok_id);
        btn_ok.exp_id = i;
        btn_ok.onclick = function(){
            var styles = config.exps[this.exp_id].styles.length;
            for(var i = 0; i < styles; i++){
                var sel_id = 'sel_' + this.exp_id + '_' + i;
                var sel_val = document.getElementById(sel_id).value;
                // put sel_val to value_arr
                // get audio path and then split it
                var aud_id = audio_prefix + this.exp_id + '_' + i;
                var aud_obj = document.getElementById(aud_id);
                var aud_path = aud_obj.src.split('/');
                var aud_path_len = aud_path.length;
                var file_name = aud_path[aud_path_len - 1];
                var style_name = aud_path[aud_path_len - 2];
                var exp_name = aud_path[aud_path_len - 3];
                value_dic[exp_name][file_name][style_name] = parseInt(sel_val);
            }
        };
    }
})();

var myHeading = document.querySelector("p");
myHeading.onclick = function(){
    this.style.color = getRandomColor();
};