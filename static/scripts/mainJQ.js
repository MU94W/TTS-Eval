$(document).ready(function(){

    var eval_selector = $("#eval_selector");
    (function(){
        for(var i = 0; i < config.exps.length; i++){
            addInnerHtml(createExpSelHtml,eval_selector,config.exps[i],i);
        }
    })();

    var eval_container = $("#expbodys_wrapper");
    (function(){
        for(var i = 0; i < config.exps.length; i++){
            addInnerHtml(createExpBodyHtml,eval_container,config.exps[i],i);
        }
    })();

    // Button 'Exp n: ##': add event(onclick) handle
    (function(){
        for(var i = 0; i < config.exps.length; i++){
            var sel_id = "#" + select_prefix + i;
            $(sel_id).click(function(){
                // turn off all EVAL_wrapper divs' show
                for(var i = 0; i < config.exps.length; i++){
                    var eval_w_id = '#exp_w' + i;
                    $(eval_w_id).css("display", "none");
                }
                // turn on the EVAL_wrapper div's show controlled by this btn
                var show_id = "#" + $(this).attr("id").replace(select_prefix, "exp_w");
                $(show_id).css("display", "flex");
            });
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
            if(this_type == "ABX" || this_type == "MOS" || this_type == "sMOS"){
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
                        // 更改sMOS的标准对比音频
                        if(config.exps[exp_order].type == "sMOS"){
                            var standard_audio_id = audio_prefix + exp_order + '_s';
                            var standard_audio = document.getElementById(standard_audio_id);
                            standard_audio.src = config.baseurl + '/' + config.exps[exp_order].path + '/standard/' + audi_lst[exp_order][perm_lst[exp_order][step]];
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
                        // 更改sMOS的标准对比音频
                        if(config.exps[exp_order].type == "sMOS"){
                            var standard_audio_id = audio_prefix + exp_order + '_s';
                            var standard_audio = document.getElementById(standard_audio_id);
                            standard_audio.src = config.baseurl + '/' + config.exps[exp_order].path + '/standard/' + audi_lst[exp_order][perm_lst[exp_order][step]];
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
            var btn_n_id = 'exp_n' + i;
            var btn_ok = document.getElementById(btn_ok_id);
            btn_ok.exp_id = i;
            btn_ok.next_id = btn_n_id;
            var exp_type = config.exps[i].type;
            if(exp_type == "MOS" || exp_type == "sMOS"){
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

                    var btn_n = document.getElementById(this.next_id);
                    btn_n.click();
 
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

                    var btn_n = document.getElementById(this.next_id);
                    btn_n.click();
 
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

                    var btn_n = document.getElementById(this.next_id);
                    btn_n.click();
    
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
    
                    var btn_n = document.getElementById(this.next_id);
                    btn_n.click();
    
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

});

