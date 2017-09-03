import os, json, sys

info_nm = "info.txt"
transcript_nm = "transcript.txt"
not_style_filename = [info_nm, transcript_nm]

basic_info = {
        "ABX": "听音频，选择最符合**目标**的音频。<br>上方音频为A，下方为B。",
        "CM": "听音频，选择该音频所属的类别。",
        "MOS": "听音频，依据**目标**打分。"
        }

def parse_info(path, exp_type):
    if os.path.exists(path):
        with open(path, "r") as f:
            ob = f.read().split("\n")[0]
        info = basic_info.get(exp_type) + "<br>" + "目标：{}".format(ob)
        return info
    else:
        return basic_info.get(exp_type)

def parse_transcript(path, filelst):
    if os.path.exists(path):
        with open(path, "r") as f:
            trans = f.read().split("\n")
        if trans[-1] == "":
            trans = trans[:-1]
        trans_dic = dict([item.split("|") for item in trans])
        return [trans_dic.get(item) for item in filelst]
    else:
        return []

if __name__ == "__main__":

    static_dir = './static'
    if len(sys.argv) > 1:
        static_dir = sys.argv[1]
    data_dir = os.path.join(static_dir, 'data')
    json_data = {"baseurl":data_dir, "exps":[]}
    
    for exp in os.listdir(data_dir):
        if exp[0] == ".":
            continue
        exp_dic = {"path":exp}
        exp_dic["styles"] = []
        exp_dic["info"] = ""
        exp_path = os.path.join(data_dir, exp)
        ###
        if exp[:4] == "sMOS":
            for stl in os.listdir(exp_path):
                if stl[0] == "." or stl in not_style_filename:
                    continue
                if stl != "standard":
                    exp_dic["styles"].append(stl)
        else:
            for stl in os.listdir(exp_path):
                if stl[0] == "." or stl in not_style_filename:
                    continue
                exp_dic["styles"].append(stl)
        ###

        ###
        if(exp[:3] == "ABX" or exp[:3] == "MOS" or exp[:4] == "sMOS"):
            if exp[:4] != "sMOS":
                exp_dic["type"] = exp[:3]
            else:
                exp_dic["type"] = "sMOS"
            exp_dic["files"] = []
            style = exp_dic["styles"][0]
            file_path = os.path.join(exp_path,style)
            for fnm in os.listdir(file_path):
                if fnm[0] == ".":
                    continue
                exp_dic["files"].append(fnm)
        elif(exp[:2] == "CM"):
            exp_dic["type"] = "CM"
            exp_dic["files"] = []
            for stl in exp_dic["styles"]:
                file_path = os.path.join(exp_path,stl)
                for fnm in os.listdir(file_path):
                    if fnm[0] == ".":
                        continue
                    exp_dic["files"].append(stl + "/" + fnm)
        elif(exp[:4] == "rABX"):
            exp_dic["type"] = "rABX"
            exp_dic["files"] = []
            for stl in exp_dic["styles"]:
                file_path = os.path.join(exp_path,stl)
                tmp_lst = []
                for fnm in os.listdir(file_path):
                    if fnm[0] == ".":
                        continue
                    tmp_lst.append(os.path.join(data_dir, exp, stl, fnm))
                exp_dic["files"].append(tmp_lst)
        else:
            pass
        ###
        info_path = os.path.join(exp_path, info_nm)
        exp_dic["info"] = parse_info(info_path, exp_dic["type"])
        transcript_path = os.path.join(exp_path, transcript_nm)
        exp_dic["transcript"] = parse_transcript(transcript_path, exp_dic["files"])
        json_data["exps"].append(exp_dic)

    #json_str += str(json_data) + ";"

    json_path = os.path.join(static_dir, "scripts/config.json")
    with open(json_path,"w") as f:
	    json.dump(json_data, f)
    with open(json_path, "r") as f:
        json_str = f.read()
    js_path = json_path[:-2]
    with open(js_path, "w") as f:
        json_str = "var config = " + json_str
        f.write(json_str)
