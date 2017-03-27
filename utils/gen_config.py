import os

if __name__ == "__main__":

    json_str = "var config = "
    json_data = {"baseurl":"data", "exps":[]}
    
    for exp in os.listdir("./data"):
        exp_dic = {"path":exp}
        exp_dic["styles"] = []
        exp_dic["info"] = ""
        exp_path = os.path.join("./data", exp)
        for stl in os.listdir(exp_path):
            exp_dic["styles"].append(stl)
        if(exp[:3] == "ABX" or exp[:3] == "MOS"):
            exp_dic["type"] = exp[:3]
            exp_dic["files"] = []
            style = exp_dic["styles"][0]
            file_path = os.path.join(exp_path,style)
            for fnm in os.listdir(file_path):
                exp_dic["files"].append(fnm)
        elif(exp[:2] == "CM"):
            exp_dic["type"] = "CM"
            exp_dic["files"] = []
            for stl in exp_dic["styles"]:
                file_path = os.path.join(exp_path,stl)
                for fnm in os.listdir(file_path):
                    exp_dic["files"].append(stl + "/" + fnm)
        else:
            pass
        json_data["exps"].append(exp_dic)

    json_str += str(json_data) + ";"

    handle = open("./scripts/config.js","w")
    handle.write(json_str)
    handle.close()
