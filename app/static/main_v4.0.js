function uploadFile() {
    var flag = 0,i;
    var passList = ['zip', 'rar', '7z', 'tar', 'gz'];
    var fd = new FormData();
    var done_mes = document.getElementById('success-mes');
    var error_mes = document.getElementById('error-mes');
    var file = document.getElementById('fileToUpload').files[0];
    if (!file) {
        alert("请选择文件!");
    }
    for (i in passList){
        if (file.name.split(".").pop() == passList[i]) {
            flag = 1;
        }
    }
    else if (!flag) {
        alert("文件格式有误!只支持 zip , rar , 7z , tar , gz , tar.gz");
        return 0;
    }
    else {
        fd.append("fileToUpload", file);
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
        xhr.open("POST", "/");
        xhr.send(fd);
    }
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
    closeError();
    closeDone();
    var bar = document.getElementById('progress-bar'),
        num = document.getElementById('progressNumber');
    bar.classList.remove('progress-bar-success');
    bar.classList.add('active');
    num.innerHTML = '0%';
    bar.style.width = '0%';
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var upload = document.getElementById('fileToUpload');
    upload.files = ev.dataTransfer.files;
}
