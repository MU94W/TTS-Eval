
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

var audi_lst = new Array(config.exps.length);

(function(){
    for(var i = 0; i < config.exps.length; i++){
        audi_lst[i] = config.exps[i].files;
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
        if(this_type == "ABX" || this_type == "MOS" || this_type == "sMOS"){
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

// global log all exps' step
var init_cnt = new Int32Array(config.exps.length);
(function(){
    for(var i = 0; i < config.exps.length; i++){
        init_cnt[i] = -1;
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

