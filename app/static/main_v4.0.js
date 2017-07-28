function uploadFile() {
    var flag = 0,i;
    var passList = ['zip', 'rar', '7z', 'tar', 'gz'];
    var fd = new FormData();
    var file = document.getElementById('fileToUpload').files[0];
    if (!file) {
        uploadError();
        return 0;
    }
    for (i in passList) {
        if (file.name.split(".").pop() === passList[i]) {
            flag = 1;
        }
    }
    if (!flag) {
        uploadError();
        return 0;
    }
    else {
        var button=document.getElementById("submit");
        button.classList.add('loading');
        fd.append("fileToUpload", file);
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("error", uploadError, false);
        xhr.addEventListener("abort", uploadError, false);
        xhr.upload.addEventListener("load", function () {
            $('.ui.basic.modal.done')
                .modal({
                    blurring: true
                })
                .modal('show')
            ;
            $('.ui.icon.header').transition('jiggle');
            button.classList.remove('loading')
        }, false);
        xhr.open("POST", "/");
        xhr.send(fd);
    }
}
function closeError() {
    var bar = document.getElementById('progress-bar'),
        bar_ = document.getElementById('progress-bar_'),
        num = document.getElementById('progress-num');
    num.innerHTML = '0%';
    bar.classList.add('active');
    bar.classList.remove('error');
    bar_.style.width="0%";
    bar.setAttribute('data-percent','0');
}

function uploadProgress(evt) {
    var bar = document.getElementById('progress-bar'),
        bar_ = document.getElementById('progress-bar_'),
        num = document.getElementById('progress-num');
    if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        num.innerHTML = percentComplete.toString() + '%';
        bar_.style.width = percentComplete.toString() + '%';
        bar.setAttribute("data-percent",percentComplete.toString());
        if (percentComplete.toString() === '100') {
            bar.classList.add('success');
            bar.classList.remove('active');
        }
    }
    else
        uploadError();
}

function uploadError() {
    var button=document.getElementById("submit"),
        bar = document.getElementById('progress-bar'),
        bar_ = document.getElementById('progress-bar_'),
        num = document.getElementById('progress-num');
    num.innerHTML = '上传出错!请重新上传';
    button.classList.remove('loading');
    bar.classList.remove('active');
    bar.classList.add('error');
    bar_.style.width="100%";
    bar.setAttribute('data-percent','100');
    $('.ui.basic.modal.fail')
        .modal({
            blurring: true
        })
        .modal('show')
    ;
    $('.ui.icon.header').transition('shake');
}

function uploadSelected() {
    closeError();
    var bar = document.getElementById('progress-bar'),
        bar_ = document.getElementById('progress-bar_'),
        num = document.getElementById('progress-num');
    bar.classList.remove('success');
    bar.classList.add('active');
    num.innerHTML = '0%';
    bar_.style.width = '0%';
    bar.setAttribute("data-percent","0");
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var upload = document.getElementById('fileToUpload');
    upload.files = ev.dataTransfer.files;
}

function dragClick() {
    var upload = document.getElementById('fileToUpload');
    upload.click();
}
function uploadGetName() {
    var filename = document.getElementById('filename'),
        upload = document.getElementById('fileToUpload');
    if(upload.files[0])
        filename.innerHTML='文件名:'+upload.files[0].name;
}