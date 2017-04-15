var audio_prefix = "aud_";
var select_prefix = "sel_";

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

var saveText = function(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
};

var createAudHtml = function(dic,exp_order){
    var exp_type = dic.type;
    var style_cnt = dic.styles.length;
    var audio_wrapper = "";
    if(exp_type === "MOS" || exp_type === "ABX"){
        audio_wrapper += "<div class='audio_wrapper'>";
        for(var i = 0; i < style_cnt; i++){
            audio_wrapper += "<div><audio src='' controls class='audio' id='" + audio_prefix + exp_order + "_" + i + "'></audio></div>";
        }
        audio_wrapper += "</div>";
    }else if(exp_type === "CM"){
        audio_wrapper += "<div class='audio_wrapper'>";
        audio_wrapper +=    "<div><audio src='' controls class='audio' id='" + audio_prefix + exp_order + "_0" + "'></audio></div>";
        audio_wrapper += "</div>";
    }else if(exp_type === "rABX"){
        audio_wrapper += "<div class='audio_wrapper'>";
        audio_wrapper +=    "<div><audio src='' controls class='audio' id='" + audio_prefix + exp_order + "_0" + "'></audio></div>";
        audio_wrapper +=    "<div><audio src='' controls class='audio' id='" + audio_prefix + exp_order + "_1" + "'></audio></div>";
        audio_wrapper +=    "<div><audio src='' controls class='audio' id='" + audio_prefix + exp_order + "_2" + "'></audio></div>";
        audio_wrapper += "</div>";
    }
    return audio_wrapper;
};

var createSelHtml = function(dic,exp_order){
    var exp_type = dic.type;
    var style_cnt = dic.styles.length;
    var select_wrapper = "";
    if(exp_type === "MOS"){
        select_wrapper += "<div class='select_wrapper'>";
        for(var i = 0; i < style_cnt; i++){
            select_wrapper += "<div>";
            select_wrapper +=   "<select class='selector' id='" + select_prefix + exp_order + "_" + i + "'>"
                                    + "<option value='1'> bad </option>"
                                    + "<option value='2'> poor </option>"
                                    + "<option value='3' selected> fair </option>"
                                    + "<option value='4'> good </option>"
                                    + "<option value='5'> excellent </option>"
            select_wrapper +=   "</select>";
            select_wrapper += "</div>";
        }
        select_wrapper += "</div>";
    }else if(exp_type === "ABX"){
        select_wrapper += "<div class='select_wrapper'>";
        select_wrapper +=   "<select class='selector' id='" + select_prefix + exp_order + '_0' + "'>";
        select_wrapper +=       "<option value='0' selected> A </option>";
        select_wrapper +=       "<option value='1'> B </option>";
        select_wrapper +=       "<option value='2'> X </option>";
        select_wrapper +=   "</select>";
        select_wrapper += "</div>";
    }else if(exp_type === "CM"){
        select_wrapper += "<div class='select_wrapper'>";
        select_wrapper +=   "<select class='selector' id='" + select_prefix + exp_order + '_0' + "'>";
        for(var i = 0; i < style_cnt; i++){
            select_wrapper +=   "<option value='" + dic.styles[i] + "'> " + dic.styles[i] + " </option>";
        }
        select_wrapper +=   "</select>";
        select_wrapper += "</div>";
    }else if(exp_type === "rABX"){
        select_wrapper += "<div class='select_wrapper'>";
        select_wrapper +=   "<div> A </div>";
        select_wrapper +=   "<div> B </div>";
        select_wrapper +=   "<select class='selector' id='" + select_prefix + exp_order + '_0' + "'>";
        select_wrapper +=       "<option value='0' selected> A </option>";
        select_wrapper +=       "<option value='1'> B </option>";
        select_wrapper +=       "<option value='2'> X </option>";
        select_wrapper +=   "</select>";
        select_wrapper += "</div>";
    }else{
        // raise NotImplError
    }
    return select_wrapper;
};

var createExpBodyHtml = function(dic,exp_order){
    var style_cnt = dic.styles.length;
    var audio_wrapper = createAudHtml(dic,exp_order);
    var select_wrapper = createSelHtml(dic,exp_order);
    var audio_select = "<div class='aud_sel_wrapper'>" + audio_wrapper + select_wrapper + "</div>";
    var str_prev = "<div class='btn' id='exp_p" + exp_order + "'>Prev</div>";
    var str_next = "<div class='btn' id='exp_n" + exp_order + "'>Next</div>";
    var str_step = "<div class='box_info box_step' id='exp_s" + exp_order + "'>Steps:" + dic.files.length + "</div>";
    var str_btns = "<div class='btn_wrapper'>" + str_prev + str_step + str_next + "</div>"
    var str_okay = "<div class='btn_wrapper'>" + "<div class='btn btn_single' id='ok_" + exp_order + "'>Okay</div></div>";
    if(dic.info.length == 0){
        var str = "<div class='EVAL_wrapper' id='exp_w" + exp_order + "'>" + str_btns + audio_select + str_okay + "</div>";
    }else{
        var str_info = "<div class='btn_wrapper'>" + "<div class='box_info'>" + dic.info + "</div></div>";
        var str = "<div class='EVAL_wrapper' id='exp_w" + exp_order + "'>" + str_btns + str_info + audio_select + str_okay + "</div>";
    }
    return str;
};

var createExpSelHtml = function(dic,exp_order){
    var show_exp_type = "Exp " + exp_order + ": " + dic.type;
    var str = "<div class='btn' id='" + select_prefix + exp_order + "'>" + show_exp_type + "</div>";
    return str;
};

var addInnerHtml = function(func,dom_obj,dic,exp_order){
    var inner_html = func(dic,exp_order);
    dom_obj.innerHTML += inner_html;
};

var refined_file_lst = new Array(config.exps.length);
(function(){
    var exps_cnt = config.exps.length;
    for(var i = 0; i < exps_cnt; i++){
        if(config.exps[i].type != "rABX"){
            refined_file_lst[i] = config.exps[i].files;
        }else{
            var stl_cnt = config.exps[i].styles.length;
            var required_files_per_stl = (stl_cnt - 1) * 3;
            refined_file_lst[i] = new Array(stl_cnt);
            for(var stl = 0; stl < stl_cnt; stl++){
                var file_lst = config.exps[i].files[stl];
                var file_cnt = file_lst.length;
                var tmp_perm;
                // deal with the files num not equal problem
                if(file_cnt >= required_files_per_stl){
                    tmp_perm = linVector(0,file_cnt);
                    permutation(tmp_perm);
                }else{
                    var repeat = Math.floor(required_files_per_stl / file_cnt);
                    var drop = required_files_per_stl - repeat * file_cnt;
                    tmp_perm = new Array(0);
                    for(var k = 0; k < repeat; k++){
                        var inner_tmp_perm = linVector(0,file_cnt);
                        permutation(inner_tmp_perm);
                        for(var kk = 0; kk < file_cnt; kk++){
                            tmp_perm = tmp_perm.concat(inner_tmp_perm[kk]);
                        }
                    }
                    var inner_tmp_perm = linVector(0,drop);
                    permutation(inner_tmp_perm);
                    for(var kk = 0; kk < drop; kk++){
                        tmp_perm = tmp_perm.concat(inner_tmp_perm[kk]);
                    }
                }
                // gen new file list according to tmp_perm
                refined_file_lst[i][stl] = new Array(required_files_per_stl);
                for(var k = 0; k < required_files_per_stl; k++){
                    refined_file_lst[i][stl][k] = config.exps[i].files[stl][tmp_perm[k]];
                }
                var un_bagged_file_lst = new Array(stl_cnt-1);
                for(var bat = 0; bat < stl_cnt-1; bat++){
                    var tuple = new Array(3);
                    tuple[0] = refined_file_lst[i][stl][bat*3+0];
                    tuple[1] = refined_file_lst[i][stl][bat*3+1];
                    tuple[2] = refined_file_lst[i][stl][bat*3+2];
                    un_bagged_file_lst[bat] = tuple;
                }
                refined_file_lst[i][stl] = un_bagged_file_lst;
            }
        }
    }
})();

// update file lst
(function(){
    var exps_cnt = config.exps.length;
    for(var i = 0; i < exps_cnt; i++){
        config.exps[i].files = refined_file_lst[i];
    }
})();

var perm_lst = new Array(config.exps.length);

(function(){
    var exps_cnt = config.exps.length;
    for(var i = 0; i < exps_cnt; i++){
        if(config.exps[i].type != "rABX"){
            perm_lst[i] = linVector(0,config.exps[i].files.length);
            permutation(perm_lst[i]);
        }else{
            // rABX's permutation has done in the refined step.
            // here just perm the comb of diff stl
            var stl_cnt = config.exps[i].styles.length;
            var required_steps = (stl_cnt - 1) * stl_cnt;
            perm_lst[i] = new Array();
            var log_prob = {};
            for(var pair0 = 0; pair0 < stl_cnt; pair0++){
                for(var pair1 = 0; pair1 < stl_cnt; pair1++){
                    if(pair0 != pair1){
                        perm_lst[i] = perm_lst[i].concat([[pair0,pair1]]);
                        log_prob[(1<<pair0) + (1<<pair1)] = -1;
                    }
                }
            }
            // draw X sample
            for(var step = 0; step < required_steps; step++){
                var pair = perm_lst[i][step];
                var key = (1<<pair[0]) + (1<<pair[1]);
                if(log_prob[key] == -1){
                    var sample = Math.round(Math.random());
                    log_prob[key] = sample;
                    pair = pair.concat(pair[sample]);
                }else{
                    var sample = log_prob[key];
                    pair = pair.concat(pair[sample]);
                }
                perm_lst[i][step] = pair;
            }
            var tmp_perm = linVector(0,required_steps);
            permutation(tmp_perm);
            var new_perm_lst = new Array(required_steps);
            for(var step = 0; step < required_steps; step++){
                new_perm_lst[step] = perm_lst[i][tmp_perm[step]];
            }
            // config.exps[x].files get new struct here
            var new_file_lst = new Array(0,required_steps);
            var old_file_lst = config.exps[i].files;
            for(var step = 0; step < required_steps; step++){
                var single_comb = new Array(3);
                var tmp_pair = new_perm_lst[step];
                // extract file name according to pair
                var A_pair_index = (tmp_pair[0] > tmp_pair[1]) ? tmp_pair[1] : (tmp_pair[1] - 1);
                var B_pair_index = (tmp_pair[1] > tmp_pair[0]) ? tmp_pair[0] : (tmp_pair[0] - 1);
                var A_pair = old_file_lst[tmp_pair[0]][A_pair_index];
                var B_pair = old_file_lst[tmp_pair[1]][B_pair_index];
                var AB_index = (tmp_pair[0] > tmp_pair[1]) ? 0 : 1;
                var A_fnm = A_pair[AB_index];
                var B_fnm = B_pair[AB_index];
                var X_fnm = (tmp_pair[2] == tmp_pair[0]) ? A_pair[2] : B_pair[2];
                console.log(X_fnm);
                single_comb = [A_fnm, B_fnm, X_fnm];
                new_file_lst[step] = single_comb;
            }
            config.exps[i].files = new_file_lst;
            perm_lst[i] = linVector(0,required_steps);
        }
    }
})();

var style_perm_lst = new Array(config.exps.length);

(function(){
    var exps_cnt = config.exps.length;
    for(var i = 0; i < exps_cnt; i++){
        var this_type = config.exps[i].type;
        if(this_type != "CM" && this_type != "rABX"){
            var files_cnt = config.exps[i].files.length;
            var styles_cnt = config.exps[i].styles.length;
            style_perm_lst[i] = new Array(files_cnt);
            for(var j = 0; j < files_cnt; j++){
                style_perm_lst[i][j] = linVector(0,styles_cnt);
                permutation(style_perm_lst[i][j]);
            }
        }
    }
})();


// the audio_path is selected according to the permutated style order.
var getAudioPath = function(exp_order, style_order, step){
    var this_type = config.exps[exp_order].type;
    if(this_type == "ABX" || this_type == "MOS"){
        var rand_style_order = style_perm_lst[exp_order][step][style_order];
        return config.baseurl + '/' + config.exps[exp_order].path
                + '/' + config.exps[exp_order].styles[rand_style_order]
                + '/' + audi_lst[exp_order][perm_lst[exp_order][step]];
    }else if(this_type == "CM"){
        return config.baseurl + '/' + config.exps[exp_order].path
                + '/' + audi_lst[exp_order][perm_lst[exp_order][step]];
    }else if(this_type == "rABX"){
        return config.exps[exp_order].files[step][style_order];
    }else{
        // raise ERROR
    }
};

var setAudioPath = function(exp_order, style_order, step){
    var this_audio_id = audio_prefix + exp_order + '_' + style_order;
    var this_audio = document.getElementById(this_audio_id);
    // the audio_path is selected according to the permutated style order.
    // but the audio_id is still kept unchanged.
    var audio_path = getAudioPath(exp_order, style_order, step);
    this_audio.src = audio_path;
};

var updateStepShow = function(exp_order, step){
    var this_step_show_id = 'exp_s' + exp_order;
    var this_step_show = document.getElementById(this_step_show_id);
    this_step_show.innerHTML = (step+1) + ' / ' + config.exps[exp_order].files.length;
};

var eval_selector = document.getElementById("eval_selector");
(function(){
    for(var i = 0; i < config.exps.length; i++){
        addInnerHtml(createExpSelHtml,eval_selector,config.exps[i],i);
    }
})();

var eval_container = document.getElementById("expbodys_wrapper");
(function(){
    for(var i = 0; i < config.exps.length; i++){
        addInnerHtml(createExpBodyHtml,eval_container,config.exps[i],i);
    }
})();

// global log all exps' step
var init_cnt = new Int32Array(config.exps.length);
(function(){
    for(var i = 0; i < config.exps.length; i++){
        init_cnt[i] = -1;
    }
})();

var audi_lst = new Array(config.exps.length);

(function(){
    for(var i = 0; i < config.exps.length; i++){
        audi_lst[i] = config.exps[i].files;
    }
})();

var log_is_done_lst = new Array(config.exps.length);

(function(){
    var exps_cnt = config.exps.length;
    for(var i = 0; i < exps_cnt; i++){
        var files_cnt = config.exps[i].files.length;
        log_is_done_lst[i] = new Int8Array(files_cnt);  // all initialized to zero
    }
})();

var notDoneList = function(){
    var not_done_lst = [];
    var exps_cnt = config.exps.length;
    for(var i = 0; i < exps_cnt; i++){
        var files_cnt = config.exps[i].files.length;
        not_done_lst.push([]);
        for(var j = 0; j < files_cnt; j++){
            if(log_is_done_lst[i][j] != 1){
                not_done_lst[i].push(j);
            }
        }
    }
    return not_done_lst;
};


// Button 'Exp n: ##': add event(onclick) handle
(function(){
    for(var i = 0; i < config.exps.length; i++){
        var sel_id = select_prefix + i;
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
        var this_type = config.exps[i].type;
        var btn_p_id = 'exp_p' + i;
        var btn_n_id = 'exp_n' + i;
        var btn_p = document.getElementById(btn_p_id);
        var btn_n = document.getElementById(btn_n_id);
        // add this.exp_order, or else this.onclick cant access var i.
        btn_p.exp_order = i;
        btn_n.exp_order = i;
        if(this_type == "ABX" || this_type == "MOS"){
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
        }else if(this_type == "CM"){
            btn_p.onclick = function(){
                var exp_order = this.exp_order;
                var step = init_cnt[exp_order];
                var audios = config.exps[exp_order].files.length;
                if(step > 0){
                    step -= 1;
                    setAudioPath(exp_order, 0, step);
                    updateStepShow(exp_order, step);
                    init_cnt[exp_order] = step;
                }
            };
            btn_n.onclick = function(){
                var exp_order = this.exp_order;
                var step = init_cnt[exp_order];
                var audios = config.exps[exp_order].files.length;
                if(step < audios-1){
                    step += 1;
                    setAudioPath(exp_order, 0, step);
                    updateStepShow(exp_order, step);
                    init_cnt[exp_order] = step;
                }
            };
        }else if(this_type == "rABX"){
            btn_p.onclick = function(){
                var exp_order = this.exp_order;
                var step = init_cnt[exp_order];
                var audios = config.exps[exp_order].files.length;
                if(step > 0){
                    step -= 1;
                    for(var j = 0; j < 3; j++){
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
                    for(var j = 0; j < 3; j++){
                        setAudioPath(exp_order, j, step);
                        updateStepShow(exp_order, step);
                    }
                    init_cnt[exp_order] = step;
                }
            };
        }else{
            // raise ERROR
        }
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
        var this_type = config.exps[i].type;
        if(this_type == "ABX" || this_type == "MOS"){
            for(var fl = 0; fl < config.exps[i].files.length; fl++){
                value_dic[config.exps[i].path][config.exps[i].files[fl]] = {};
            }
        }else if(this_type == "rABX"){
            value_dic[config.exps[i].path]['files'] = config.exps[i].files;
            var steps = config.exps[i].files.length;
            for(var step = 0; step < steps; step++){
            }
        }
    }
})();

var getExpFileStyle = function(aud_id){
    var aud_obj = document.getElementById(aud_id);
    var aud_path = aud_obj.src.split('/');
    var aud_path_len = aud_path.length;
    var file_name = aud_path[aud_path_len - 1];
    var style_name = aud_path[aud_path_len - 2];
    var exp_path = aud_path[aud_path_len - 3];
    return [exp_path,file_name,style_name];
 
};

// Button 'Okay': add event(onclick) handle
(function(){
    for(var i = 0; i < config.exps.length; i++){
        var btn_ok_id = 'ok_' + i;
        var btn_ok = document.getElementById(btn_ok_id);
        btn_ok.exp_id = i;
        var exp_type = config.exps[i].type;
        if(exp_type == "MOS"){
            btn_ok.onclick = function(){
                var styles = config.exps[this.exp_id].styles.length;
                for(var i = 0; i < styles; i++){
                    var sel_id = select_prefix + this.exp_id + '_' + i;
                    var sel_val = document.getElementById(sel_id).value;
                    // put sel_val to value_arr
                    // get audio path and then split it
                    var aud_id = audio_prefix + this.exp_id + '_' + i;
                    var aud_obj = document.getElementById(aud_id);
                    var aud_path = aud_obj.src.split('/');
                    var aud_path_len = aud_path.length;
                    var file_name = aud_path[aud_path_len - 1];
                    var style_name = aud_path[aud_path_len - 2];
                    var exp_path = aud_path[aud_path_len - 3];
                    value_dic[exp_path][file_name][style_name] = parseInt(sel_val);
                }
                log_is_done_lst[this.exp_id][init_cnt[this.exp_id]] = 1;
            };
        }else if(exp_type == "ABX"){
            btn_ok.onclick = function(){
                var sel_id = select_prefix + this.exp_id + "_0";
                var sel_val = parseInt(document.getElementById(sel_id).value);
                for(var i = 0; i < 2; i++){ // for ABX, styles === 2
                    var aud_id = audio_prefix + this.exp_id + '_' + i;
                    [exp_path,file_name,style_name] = getExpFileStyle(aud_id);
                    if(i == sel_val){
                        value_dic[exp_path][file_name][style_name] = 1;
                    }else{
                        value_dic[exp_path][file_name][style_name] = 0;
                    }
                }
                if(sel_val == 2){
                    value_dic[exp_path][file_name]["X"] = 1;
                }else{
                    value_dic[exp_path][file_name]["X"] = 0;
                }
                log_is_done_lst[this.exp_id][init_cnt[this.exp_id]] = 1;
            };
        }else if(exp_type == "CM"){
            btn_ok.onclick = function(){
                var sel_id = select_prefix + this.exp_id + "_0";
                var sel_val = document.getElementById(sel_id).value;
                var aud_id = audio_prefix + this.exp_id + '_0';
                [exp_path,file_name,style_name] = getExpFileStyle(aud_id);
                console.log(exp_path);
                console.log(file_name);
                console.log(style_name);
                value_dic[exp_path][style_name+'/'+file_name] = [style_name, sel_val];
                log_is_done_lst[this.exp_id][init_cnt[this.exp_id]] = 1;
            };
        }else if(exp_type == "rABX"){
            btn_ok.onclick = function(){
                var sel_id = select_prefix + this.exp_id + "_0";
                var sel_val = parseInt(document.getElementById(sel_id).value);
                console.log(sel_val);
                var styles = new Array(3);
                for(var i = 0; i < 3; i++){ // for ABX, styles === 2
                    var aud_id = audio_prefix + this.exp_id + '_' + i;
                    [exp_path,file_name,style_name] = getExpFileStyle(aud_id);
                    styles[i] = style_name;
                }
                var X_style = styles[2];
                styles[2] = [X_style, sel_val];
                value_dic[exp_path][init_cnt[this.exp_id]] = styles;
                log_is_done_lst[this.exp_id][init_cnt[this.exp_id]] = 1;
 
            };
        }
    }
})();

var myHeading = document.querySelector("p");
myHeading.onclick = function(){
    this.style.color = getRandomColor();
};

var saveBtn = document.getElementById("save_result");
saveBtn.onclick = function(){
    var not_done_lst = notDoneList();
    var exps_cnt = config.exps.length;
    var unfinished = false;
    for(var i = 0; i < exps_cnt; i++){
        if(not_done_lst[i].length != 0){
            unfinished = true;
            break;
        }
    }
    if(!unfinished){
        saveText(JSON.stringify(value_dic),"save.json");
    }else{
        var assert_info = "实验未完成！\n";
        for(var i = 0; i < exps_cnt; i++){
            var not_done_len = not_done_lst[i].length;
            if(not_done_len > 0){
                assert_info += "Exp " + i + " :";
                for(var j = 0; j < not_done_len; j++){
                    assert_info += " " + (not_done_lst[i][j]+1) + ",";
                }
                assert_info += "\n";
            }
        }
        alert(assert_info);
    }
}
