## -*- coding: utf-8 -*-
"""
UniqueStudio 2017
Author:kurokoi
"""
from flask import render_template, flash, redirect, request, session, url_for, jsonify, send_from_directory
from app import app
import os, re,time
from werkzeug import secure_filename, SharedDataMiddleware

ALLOWED_EXTENSIONS = {'zip', 'rar', '7z', 'tar', 'gz', 'tar.gz'}

admin = {
    'id': 'uniquestudio',
    'password': 'P@ssw0rd'
}





def name_check(filename):
    zh_Compile = re.compile(u'[\u4e00-\u9fa5]+')
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
        print(request.files['fileToUpload'])
        file = request.files['fileToUpload']
        print(file)
        if file and allowed_file(file.filename):
            filename = name_check(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return render_template('upload.html', title='Upload')


@app.route('/test', methods=['GET'])
def test():
    name = []
    for file in os.listdir(app.config['DOWNLOAD_FOLDER']):
        name.append(file)
    return render_template('test.html', title='Test', files=name)


@app.route("/system/login", methods=["GET"])
def login_html():
    if 'Auth' not in session:
        session['Auth'] = 0
        print(0)
    elif session['Auth'] == 1:
        return redirect(url_for('upload_list'))
    return render_template('login.html', title='Login')


@app.route("/system/login/post", methods=["POST"])
def login_post():
    print(request.form['id'],admin['id'])
    if request.form['id'] == admin['id'] and request.form['pw'] == admin['password']:
        session['Auth'] = 1
        print(1)
        return redirect(url_for('upload_list'))
    else:
        print(2)
        return redirect(url_for('login_html'))


@app.route("/system/list", methods=["GET"])
def upload_list():
    print(session)
    if 'Auth' not in session:
        session['Auth'] = 0
    elif session['Auth'] == 1:
        files=[]
        for file in os.listdir(app.config['UPLOAD_FOLDER']):
            node = {}
            node['name'] = file
            node['time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(os.stat(os.path.join(app.config['UPLOAD_FOLDER']+file)).st_mtime))
            files.append(node)
        files.sort(key=lambda x:x['time'],reverse=True)
        return render_template('list.html', title='List', files=files)
    return redirect(url_for('login_html'))


app.add_url_rule('/test/<filename>', 'downloaded_file',
                 build_only=True)
app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    '/test': app.config['DOWNLOAD_FOLDER']
})


@app.errorhandler(413)
def page_not_found(error):
    return '413 File too Large!'


@app.errorhandler(404)
def page_not_found(error):
    return '404 Not Found!'
