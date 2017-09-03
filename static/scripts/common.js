var linVector = function(start, stop, interval=1){
    var len = Math.floor((stop - start - 1)/interval) + 1;
    var ret = new Int32Array(len);
    for(var i = 0; i < len; i++){
        ret[i] = start + i * interval
    }
    return ret;
};

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
    a.href = URL.createObjectURL(data_blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
};

