from flask import Flask, request, redirect, url_for

UPLOAD_FOLDER = './uploads/'
DOWNLOAD_FOLDER = './test'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['DOWNLOAD_FOLDER'] = DOWNLOAD_FOLDER
app.config['SECRET_KEY'] = 'unique-studio'
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

from app import views