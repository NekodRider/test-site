function uploadFile() {
    var flag = 0,
        i;
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
    } else {
        var button = document.getElementById("submit");
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
                .modal('show');
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
    bar_.style.width = "0%";
    bar.setAttribute('data-percent', '0');
}

function uploadProgress(evt) {
    var bar = document.getElementById('progress-bar'),
        bar_ = document.getElementById('progress-bar_'),
        num = document.getElementById('progress-num');
    if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        num.innerHTML = percentComplete.toString() + '%';
        bar_.style.width = percentComplete.toString() + '%';
        bar.setAttribute("data-percent", percentComplete.toString());
        if (percentComplete.toString() === '100') {
            bar.classList.add('success');
            bar.classList.remove('active');
        }
    } else
        uploadError();
}

function uploadError() {
    var button = document.getElementById("submit"),
        bar = document.getElementById('progress-bar'),
        bar_ = document.getElementById('progress-bar_'),
        num = document.getElementById('progress-num');
    num.innerHTML = '上传出错!请重新上传';
    button.classList.remove('loading');
    bar.classList.remove('active');
    bar.classList.add('error');
    bar_.style.width = "100%";
    bar.setAttribute('data-percent', '100');
    $('.ui.basic.modal.fail')
        .modal({
            blurring: true
        })
        .modal('show');
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
    bar.setAttribute("data-percent", "0");
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
    if (upload.files[0])
        filename.innerHTML = '文件名:' + upload.files[0].name;
}

function input_check() {
    return $('#password').val && $('#id').val
}

function init() {
    var file_list = $('#file_list');
    $('.ui.accordion').accordion();
    $('table').tablesort();
    $('#pickout_btn').children().get().forEach(function (element) {
        $(element).bind("click", {
            team: element.innerHTML
        }, pick_out);
    });
}

function judge(line, team) {
    var line_new = $(line),
        line_name = line_new.children().get()[0].innerHTML.toLowerCase(),
        result = line_name.search(team.toLowerCase());
    if (result === -1) {
        line_new.hide();
    } else {
        line_new.show();
    }
}

function pick_out(event) {
    var lines = $(file_list).children('tbody').children('tr').get(),
        team = event.data.team;
    lines.forEach(function (element) {
        if (team === 'All') {
            $(element).show();
        } else {
            judge(element, team);
        }
    });
    sum_counter();
}

function sum_counter() {
    var a = document.querySelector("tbody"),
        sum = 0,
        num = 0;
    a.querySelectorAll("tr").forEach(function (element) {
        if (element.style.display === "none")
            num++;
    });
    sum = a.querySelectorAll("tr").length - num;
    $("#sum_counter").html("总计:" + sum);
}
