## -*- coding: utf-8 -*-
"""
UniqueStudio 2017
Author:kurokoi
"""
from flask import render_template, flash, redirect, request, session, url_for, jsonify , send_from_directory
from app import app
import os,re
from werkzeug import secure_filename,SharedDataMiddleware

ALLOWED_EXTENSIONS = set(['zip', 'rar', '7z', 'tar', 'gz', 'tar.gz'])

def name_check(filename):
    zh_Compile=re.compile(u'[\u4e00-\u9fa5]+')
    if zh_Compile.search(filename):
        return filename
    else:
        return secure_filename(filename)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = name_check(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            flash('success')
            flash('上传成功！感谢你参加联创熬测！')
        else:
            flash('error')
            flash('上传失败！请检查文件大小或格式是否符合要求！')
    return render_template('upload.html', title='Upload')

@app.route('/test', methods=['GET'])
def test():
    name = []
    for file in os.listdir(app.config['DOWNLOAD_FOLDER']):
        name.append(file)
    return render_template('test.html', title='Test', files=name)

app.add_url_rule('/test/<filename>', 'downloaded_file',
                 build_only=True)
app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    '/test':  app.config['DOWNLOAD_FOLDER']
})

@app.errorhandler(413)
def page_not_found(error):
    return '413 File too Large!'

@app.errorhandler(404)
def page_not_found(error):
    return '404 Not Found!'
