function uploadFile() {
    var fd = new FormData();
    fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", uploadProgress, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);
    xhr.open("POST","/");//修改成自己的接口
    xhr.send(fd);
}
function uploadProgress(evt) {
    if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
        document.getElementById('progress-bar').style.width=percentComplete.toString() + '%';
    }
    else {
        document.getElementById('progressNumber').innerHTML = 'unable to compute';
    }
}
function uploadFailed(evt) {
    alert("上传错误！请重新上传！");
    window.location.replace(location.href);
}
function uploadCanceled(evt) {
    alert("上传中断！请重新上传！");
    window.location.replace(location.href);
}