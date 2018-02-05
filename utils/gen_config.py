import os, json, sys, copy, codecs
from six.moves import xrange


DEFAULT_DATA_ROOT = "static/data"
DEFAULT_SCRIPTS_ROOT = "static/scripts"
DEFAULT_GUIDE_NM = "guide.txt"
DEFAULT_TRANS_NM = "transcript.txt"
DEFAULT_STYLE_NM = "style.txt"
DEFAULT_GUIDE = {
    "ABX": "听音频，选择自然度更高的语音。<br>上方音频为A，下方为B。",
    "CM": "听音频，选择该音频所属的类别。",
    "MOS": "听音频，依据语音自然度高低打分。"
    }
DEFAULT_CONFIG = {
    "name": "",
    "type": "",
    "guide": "",
    "cur_ep_id": 1,
    "tot_eps_num": 0,
    "eps_list": [],
    }


def getSubPath(path):
    for sub_name in os.listdir(path):
        yield os.path.join(path, sub_name)


def getValidSubDirs(path):
    return sorted([sub_path for sub_path in getSubPath(path) if os.path.isdir(sub_path)])


def getGuide(path, exp_type):
    guide_path = os.path.join(path, DEFAULT_GUIDE_NM)
    if os.path.exists(guide_path):
        with codecs.open(guide_path, "r", "utf-8") as f:
            return f.read().strip()
    else:
        return DEFAULT_GUIDE.get(exp_type, "")


def getTranscript(path):
    ts_path = os.path.join(path, DEFAULT_TRANS_NM)
    if os.path.exists(ts_path):
        try:
            with codecs.open(ts_path, "r", "utf-8") as f:
                return dict([line.strip().split("|") for line in f.readlines()])
        except ValueError as e:
            print("[E] Try to get {}'s transcript file, failed.".format(path), e)
            exit(1)
    else:
        return None


def getStyle(path):
    st_path = os.path.join(path, DEFAULT_STYLE_NM)
    if os.path.exists(st_path):
        try:
            with codecs.open(st_path, "r", "utf-8") as f:
                return [line.strip() for line in f.readlines()]
        except ValueError as e:
            print("[E] Try to get {}'s styles file, failed.".format(path), e)
            exit(1)
    print("[E] No styles file found for {}.".format(path))
    exit(1)
 

def getValidFiles(sub_dirs_path):
    dirs_files_list = [set(os.listdir(dir_path)) for dir_path in sub_dirs_path]
    return sorted(set.intersection(*dirs_files_list))


def buildSingleConfig(path):
    # path: static/data/EXPTYPE-EXPNAME
    # where EXPTYPE := {MOS, ABX, CM},
    #       EXPTYPE and EXPNAME are linked with a hyphen.
    exp_type_name = os.path.basename(path)
    exp_type, exp_name = exp_type_name.split("-")

    exp_config = copy.deepcopy(DEFAULT_CONFIG)
    exp_config["name"] = exp_name
    exp_config["type"] = exp_type
    exp_config["guide"] = getGuide(path, exp_type)

    transcript_dict = getTranscript(path)
    sub_dirs_path = getValidSubDirs(path)
    files_list = getValidFiles(sub_dirs_path)
    exp_config["tot_eps_num"] = 0
    for file_nm in files_list:
        exp_config["eps_list"].append({"ep": [{"src": os.path.join(dir_path, file_nm)}
                                                for dir_path in sub_dirs_path]})
        exp_config["tot_eps_num"] += 1
    if transcript_dict is not None:
        for idx, file_nm in enumerate(files_list):
            exp_config["eps_list"][idx]["ts"] = transcript_dict.get(file_nm, "")
    if exp_type == "MOS":
        for ep_dict in exp_config["eps_list"]:
            for audio in ep_dict["ep"]:
                audio["eval"] = "fair"
    elif exp_type == "ABX":
        for ep_dict in exp_config["eps_list"]:
            ep_dict["sel"] = "NP"
    elif exp_type == "CM":
        exp_config["valid_styles_list"] = getStyle(path)
        for ep_dict in exp_config["eps_list"]:
            for audio in ep_dict["ep"]:
                # choose the first style as the default value.
                audio["eval"] = exp_config["valid_styles_list"][0]
    return exp_config


def buildConfigList(root=DEFAULT_DATA_ROOT):
    return [buildSingleConfig(dir_path) for dir_path in getValidSubDirs(root)]


if __name__ == "__main__":
    config_obj = buildConfigList()
    config_str = json.JSONEncoder().encode(config_obj)
    config_str = "var config = " + config_str
    with codecs.open(os.path.join(DEFAULT_SCRIPTS_ROOT, "config.js"), "w", "utf-8") as f:
        f.write(config_str)
