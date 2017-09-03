var audio_prefix = "aud_";
var select_prefix = "sel_";

var createAudHtml = function(dic,exp_order){
    var exp_type = dic.type;
    var style_cnt = dic.styles.length;
    var audio_wrapper = "";
    if(exp_type === "MOS" || exp_type === "ABX" || exp_type === "sMOS"){
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
    if(exp_type === "MOS" || exp_type === "sMOS"){
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
    var str_info = "<div class='box_info' id='exp_i" + exp_order + "'>" + dic.info + "</div>";
    var str_tran = "<div class='box_info' id='exp_t" + exp_order + "'>Transcript</div>";
    var str_btns = "<div class='btn_wrapper'>" + str_prev + str_step + str_next + "</div>"
    var str_okay = "<div class='btn_wrapper'>" + "<div class='btn btn_single' id='ok_" + exp_order + "'>Okay</div></div>";

    // 现在临时添加sMOS的standard音频， dirty的做法， 需要重构
    if(dic.type === "sMOS"){
        var standard_audio = "";
        standard_audio += "<div class='audio_wrapper'>";
        standard_audio +=    "<div><audio src='" + dic.standard + "' controls class='audio' id='" + audio_prefix + exp_order + '_s' + "'></audio></div>";
        standard_audio += "</div>";
    }else{
        var standard_audio = "";
    }
    
    if(dic.transcript.length == 0){
        var str = "<div class='EVAL_wrapper' id='exp_w" + exp_order + "'>" + str_btns + str_info + audio_select + str_okay + "</div>";
    }else{
        var str = "<div class='EVAL_wrapper' id='exp_w" + exp_order + "'>" + str_btns + str_info + str_tran + audio_select + str_okay + "</div>";
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
    dom_obj.append(inner_html);
};

// the audio_path is selected according to the permutated style order.
var getAudioPath = function(exp_order, style_order, step){
    var this_type = config.exps[exp_order].type;
    if(this_type == "ABX" || this_type == "MOS" || this_type == "sMOS"){
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

var getTranscript = function(exp_order, step){
    var this_type = config.exps[exp_order].type;
    if(this_type == "ABX" || this_type == "MOS" || this_type == "sMOS"){
        return config.exps[exp_order].transcript[perm_lst[exp_order][step]];
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
    var this_audio_id = "#" +  audio_prefix + exp_order + '_' + style_order;
    // the audio_path is selected according to the permutated style order.
    // but the audio_id is still kept unchanged.
    $(this_audio_id).attr("src", getAudioPath(exp_order, style_order, step));
};

var updateStepShow = function(exp_order, step){
    var this_step_show_id = '#exp_s' + exp_order;
    var content = (step+1) + ' / ' + config.exps[exp_order].files.length;
    $(this_step_show_id).html(content);
    if(config.exps[exp_order].transcript.length != 0){
        var this_tran_show_id = '#exp_t' + exp_order;
        var transcript = getTranscript(exp_order, step);
        $(this_tran_show_id).html(transcript);
    }
};
