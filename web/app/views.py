## -*- coding: utf-8 -*-
"""
UniqueStudio 2017
Author:kurokoi
"""
from flask import render_template, flash, redirect, request, session, url_for, jsonify, send_from_directory
from app import app
import os, re, time
import urllib.parse
from werkzeug.utils import secure_filename
from werkzeug.wsgi import SharedDataMiddleware

ALLOWED_EXTENSIONS = {'zip', 'rar', '7z', 'tar', 'gz', 'tar.gz'}

colorList = ["red", "orange", "yellow", "green", "blue", "violet", "pink"]

admin = {'id': 'unique', 'password': app.config['ADMIN_PSWD']}


def name_check(filename):
    filename.replace(' ', '')
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
        file = request.files['fileToUpload']
        if file and allowed_file(file.filename):
            filename = name_check(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return render_template('upload.html', title='Upload')


@app.route('/test', methods=['GET'])
def test():
    files = []
    i = 0
    for file in os.listdir(app.config['DOWNLOAD_FOLDER']):
        files.append({'name': file, 'color': colorList[i]})
        i = 0 if i == len(colorList) - 1 else i + 1
    return render_template('test.html', title='Test', files=files)


@app.route("/system/login", methods=["GET"])
def login_html():
    if 'Auth' not in session:
        session['Auth'] = 0
    elif session['Auth'] == 1:
        return redirect(url_for('upload_list'))
    return render_template('login.html', title='Login')


@app.route("/system/login/post", methods=["POST"])
def login_post():
    if request.form['id'] == admin['id'] and request.form['pw'] == admin[
            'password']:
        session['Auth'] = 1
        return redirect(url_for('upload_list'))
    else:
        return redirect(url_for('login_html'))


@app.route("/system/list", methods=["GET"])
def upload_list():
    if 'Auth' not in session:
        session['Auth'] = 0
    elif session['Auth'] == 1:
        files = []
        for file in os.listdir(app.config['UPLOAD_FOLDER']):
            node = {}
            node['name'] = file
            node['time'] = time.strftime(
                "%Y-%m-%d %H:%M:%S",
                time.localtime(
                    os.stat(os.path.join(app.config['UPLOAD_FOLDER'] +
                                         file)).st_mtime))
            files.append(node)
        files.sort(key=lambda x: x['time'], reverse=True)
        return render_template('list.html', title='List', files=files)
    return redirect(url_for('login_html'))


@app.route('/test/<path:filename>')
def uploaded_file(filename):
    filename = urllib.parse.unquote(filename)
    return send_from_directory(
        os.path.join(os.getcwd(), app.config['DOWNLOAD_FOLDER']), filename)


@app.route('/storage/<path:filename>')
def storage_file(filename):
    filename = urllib.parse.unquote(filename)
    return send_from_directory(
        os.path.join(os.getcwd(), app.config['STORAGE_FOLDER']), filename)


@app.route('/download/<path:filename>')
def download_file(filename):
    if 'Auth' not in session:
        session['Auth'] = 0
    elif session['Auth'] == 1:
        filename = urllib.parse.unquote(filename)
        return send_from_directory(
            os.path.join(os.getcwd(), app.config['UPLOAD_FOLDER']), filename)
    return redirect(url_for('login_html'))


@app.errorhandler(413)
def file_too_large(error):
    return '413 File too Large!'


@app.errorhandler(404)
def page_not_found(error):
    return '404 Not Found!'
