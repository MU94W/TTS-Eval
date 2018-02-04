// arr -> reference
var permutation = function(arr){
    var len = arr.length;
    var p_last = len - 1;
    var p_select;
    for(var i = 0; i < len; i++){
        p_select = Math.round(Math.random() * p_last);
        var swap_num = arr[p_last];
        arr[p_last] = arr[p_select];
        arr[p_select] = swap_num;
        p_last -= 1;
    }
};

var getRandomColor = function(){
    return '#' + 
        (function(color){
            return (color += 
                    '0123456789abcdef'[Math.floor(Math.random()*16)])
                    && (color.length == 6) ? color : arguments.callee(color);
        })('');
};

var saveText = function(text, filename){
    var data_blob = new Blob([text], {type: 'application/json'});
    var url = URL.createObjectURL(data_blob);
    var a = document.createElement('a');
    a.style = "display: none"
    a.href = url
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
};

/*
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
  
      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);
  
    } else if (typeof XDomainRequest != "undefined") {
  
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
  
    } else {
  
      // Otherwise, CORS is not supported by the browser.
      xhr = null;
  
    }
    return xhr;
}
*/

var sendText = function(text, url){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           // document.getElementById("demo").innerHTML = xhttp.responseText;
           alert("Succeeded.");
        }
    };
    xhr.send(text);
}

/*
var sendText = function(text, url){
    var xhr = createCORSRequest("POST", url);
    if (!xhr) {
        throw new Error('CORS not supported');
        console.log('CORS not supported');
    }
    xhr.send(text);
}
*/