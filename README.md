# TTS-Eval
TTS主观评测系统。目前支持搭建服务器实验，评测结果可以保存到客户端本地，也可以上传到服务器（保存在`results/`文件夹下）。
## 数据准备
你需要在index.html同级目录下放置static/data/文件夹，其中应含有欲进行的实验文件夹。目前支持三种实验：

1. ABX
2. MOS
3. CM

各子实验文件夹的名字应为`EXPTYPE-EXPNAME`，例如`ABX-similarity`，连字符前面为实验类型名，后面为实验名。

注意：对于ABX或MOS实验，各风格下的音频文件命名应当对应相同。如MOS-mos1/Emphasis/{1.wav,2.wav}, MOS-mos1/Neutral/{1.wav,2.wav}。

示例结构：

    - static/data/
        - MOS-mos1/
            - Emphasis/
                - {0.wav, 1.wav, ...}
            - Neutral/
                - {0.wav, 1.wav, ...}
            - ...
            - guide.txt
            - transcript.txt
        - ABX-abx1/
            - Emphasis/
                - {0.wav, 1.wav, ...}
            - Neutral/
                - {0.wav, 1.wav, ...}
            - ...
            - guide.txt
            - transcript.txt
        - CM-cm1/
            - audio/
                - {0.wav, 1.wav, ...}
            - guide.txt
            - transcript.txt
            - style.txt
其中，

1. `guide.txt`记录了当前实验的目的；
2. `transcript.txt`的每一行记录了一条音频的文本，例如`0.wav|今天天气不错。`，用竖线分隔音频名和文本。
3. `style.txt`记录了CM实验允许选择的风格类型。

在准备好data/文件夹之后，在index.html同级目录下运行`python utils/gen_config.py`

## 评测须知
点击“TTS”三个斜体字母下的选择框开始进行实验。
使用“Next”调出下一组音频，使用“Prev”调出上一组音频。

一项实验进行完之后，点击最上方的实验选择框选择下一实验。

完成所有的实验之后，点击最下方的“Save”保存实验记录到本地, 默认文件名为`save.json`。

## 实验记录文件格式

## 浏览器兼容性
Safari, Chrome, Firefox, Edge
注意，为了保证最大兼容性，最好使用mp3格式文件。
