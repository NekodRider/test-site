# test-site  

## Introduce

基于Flask的试题发布以及提交功能的Web服务器-用于联创团队熬测

基于python3下flask,依赖已导出为requirements.txt文件

uploads及test文件夹均位于根目录下且会自动创建并检测

服务器会自动扫描test文件夹中存在的题目文件并显示在页面中供于下载

用户上传解答文件将储存于uploads文件夹中,格式限制为常见的压缩文件格式并且大小可作限制

建议运行时使用gunicorn 注意自定义端口

## Usage
``` shell
git clone https://github.com/NekodRider/test-site
cd test-site
(OPTIONAL) git checkout semantic-theme
pip3 install -r requirement.txt
python3 run.py
```

or

```
pip3 install gunicorn
gunicorn -w {WORKER_NUM} --bind {IP}:{PORT} run:app
```
