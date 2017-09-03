# TTS-Eval
TTS主观评测系统。目前支持搭建服务器实验，评测结果保存到客户端本地。
## 数据准备
你需要在index.html同级目录下放置static/data/文件夹，其中应含有欲进行的实验文件夹。目前支持三种实验：
  1. ABX
  2. MOS
  3. CM

如果需要多个同种类型的实验，请务必将各实验文件夹的名称以实验类型名作为前缀，如ABX1，MOS2，CM0等。

对于任意一个实验文件夹，其中应包含不同风格的子文件夹，最后在子文件夹中存放音频。

注意：对于ABX或MOS实验，各风格下的音频文件命名应当对应相同。如MOS/Emphasis/{1.wav,2.wav}, MOS/Neutral/{1.wav,2.wav}。

示例结构：

    - static/data/
        - MOS/
            - Emphasis/
                - {0.wav, 1.wav, ...}
            - Neutral/
                - {0.wav, 1.wav, ...}
            - ...
        - ABX/
            - Emphasis/
                - {0.wav, 1.wav, ...}
            - Neutral/
                - {0.wav, 1.wav, ...}
            - ...
        - CM/
            - Emphasis/
                - {0.wav, 2.wav, ...}
            - Neutral/
                - {1.wav, 5.wav, ...}
            - ...
在准备好data/文件夹之后，在index.html同级目录下运行`python utils/gen_config.py`

## 评测须知
点击“TTS”三个斜体字母下的选择框开始进行实验。
使用“Next”调出下一组音频，使用“Prev”调出上一组音频。

使用音频右方的选择框进行打分/选择，该组结束评测后点击下方的“Okay”进行记录，之后再点击“Next”到下一组音频。

一项实验进行完之后，点击最上方的实验选择框选择下一实验。

完成所有的实验之后，点击最下方的“Save Result”保存实验记录到本地, 默认文件名为`save.json`。

## 实验记录文件格式

## 浏览器兼容性
Safari, Chrome, Firefox, Edge
注意，为了保证最大兼容性，最好使用mp3格式文件。觉得mp3压缩影响音质的，可以采取提高采样率或其他措施。
