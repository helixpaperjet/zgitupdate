let objText;
let getSuccess;
const getKey = (project) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `/key/${project}`);
    xhr.send();
    xhr.onreadystatechange = (e) => {
        console.log(xhr.responseText);
        return xhr.responseText;
    }
}
document.getElementById("btn-get").addEventListener("click", () => {
    let http = new XMLHttpRequest();
    let url=`/data/test/${document.getElementById("project-url").value}`;
    http.open("GET", url);
    http.send();
    http.onreadystatechange = (e) => {
        console.log(http.responseText);
        objText = http.responseText;
        document.getElementById("result").innerText = "Query successful!";
        getSuccess = true;
        //FIXME - project status display
        /*
        if (objText != "") {
            let object = JSON.parse(objText);
            console.log("success");
            document.getElementById("old-latest").innerText = object.latest;
            document.getElementById("old-data-data").innerText = object.data.data; 
        }*/
    }
});
document.getElementById("btn-submit").addEventListener("click", () => {
    if (getSuccess) {
        let obj = JSON.parse(objText);
        const originalLatest = obj.latest;
        const bn = Number.parseInt(document.getElementById("build-number").value);
        const un = document.getElementById("name").value;
        const num = document.getElementById("number").value;
        const stat = document.getElementById("status").value;
        const ud = document.getElementById("description").value;
        const dt = document.getElementById("download-type").value;
        const dd = document.getElementById("download-data").value;
        // new obj.data.data
        // check if every input box is filled
        if (
            bn != "" && 
            un != "" && 
            num != "" && 
            stat != "" && 
            ud != "" && 
            dt != "" && 
            dd != "") {
            var updateData = [bn, un, num, stat, ud, {type: dt, data: dd}];
            // check if new build number is wrong
            if (!(bn <= originalLatest)) {
                obj.latest = bn;
                if (bn > originalLatest + 1) {
                    let i = originalLatest + 1;
                    // add placeholder element for each skipped version
                    while (i < bn) {
                        let placeholder = [i, "", "", "", "", {type: "", data: ""}];
                        console.log(placeholder);
                        obj.data.data.push(placeholder);
                        i++;
                    }
                    obj.data.data.push(updateData);
                }
                document.getElementById("json-export").innerText = JSON.stringify(obj);
                let xhr = new XMLHttpRequest();
                xhr.open("POST", `/data/test/${document.getElementById("project-url").value}`);
                console.log(`About to send:\n${JSON.stringify(obj)}`);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(obj));
                xhr.onreadystatechange = (e) => {
                    console.log(xhr.responseText);
                }
                let key = getKey(document.getElementById("project-url").value);
                console.log(`Got key: ${key}`);
            }
            else {alert("错误：构建号（buildNumber）小于最新构建号，请重新填写");submitOK = false}
        }
        else {alert("至少有一个输入框未填!");}
    }
    else {alert("请先指定您想要修改的项目文件！(Target Project URL)")}
});