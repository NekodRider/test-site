function uploadFile() {
    var fd = new FormData();
    var done_mes = document.getElementById('success-mes');
    var error_mes = document.getElementById('error-mes');
    fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", uploadProgress, false);
    xhr.addEventListener("error", function () {
        error_mes.classList.remove("unshow");
        error_mes.classList.add('show');
        done_mes.classList.remove("show");
        done_mes.classList.add('unshow');
    }, false);
    xhr.addEventListener("abort", function () {
        error_mes.classList.remove("unshow");
        error_mes.classList.add('show');
        done_mes.classList.remove("show");
        done_mes.classList.add('unshow');
    }, false);
    xhr.upload.addEventListener("load", function () {
        done_mes.classList.remove("unshow");
        done_mes.classList.add('show');
        error_mes.classList.remove("show");
        error_mes.classList.add('unshow');
    }, false);
    xhr.open("POST", "/");//修改成自己的接口
    xhr.send(fd);
}
function closeError() {
    var error_mes = document.getElementById('error-mes');
    error_mes.classList.remove("show");
    error_mes.classList.add('unshow')
}
function closeDone() {
    var done_mes = document.getElementById('success-mes');
    done_mes.classList.remove("show");
    done_mes.classList.add('unshow')
}
function uploadProgress(evt) {
    var bar = document.getElementById('progress-bar'),
        num = document.getElementById('progressNumber');
    if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        num.innerHTML = percentComplete.toString() + '%';
        bar.style.width = percentComplete.toString() + '%';
        if (percentComplete.toString() == '100') {
            bar.classList.add('progress-bar-success');
            bar.classList.remove('active');
        }
    }
    else {
        num.innerHTML = 'unable to compute';
    }
}
function uploadSelected() {
    var bar = document.getElementById('progress-bar'),
        num = document.getElementById('progressNumber');
    bar.classList.remove('progress-bar-success');
    bar.classList.add('active');
    num.innerHTML = '0%';
    bar.style.width = '0%';
}