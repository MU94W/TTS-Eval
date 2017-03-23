/*
var readTextFile = function(file){
    var rawFile = new XMLHttpRequest();
    rawFile.open('Get', file, true);
    rawFile.onreadystatechange = function(){
        if (rawFile.readyState === 4 && rawFile.status == '200'){
            var allText = rawFile.responseText;
            alert(allText);
        };
    };
    rawFile.send(null);
};

readTextFile('data/config.json')
*/

// config object
var config = {
    baseurl:'data',
    exps:{
        ABX:{
            styles:['Emphasis','Neutral'],
            files:['Test_1.wav','Test_3.wav','Test_6.wav','Test_15.wav','Test_17.wav'],
        }
    }
}

// config object

var getRandomColor = function(){
    return '#' + 
        (function(color){
            return (color += 
                    '0123456789abcdef'[Math.floor(Math.random()*16)])
                    && (color.length == 6) ? color : arguments.callee(color);
        })('');
};

var myHeading = document.querySelector("h1");
var myHeadingStaticStyle = myHeading.getAttribute('style');
var audio = document.querySelector("audio");
var cnt = 0;
myHeading.onclick = function(){
    var res = cnt + Math.round(Math.random()*10);
    this.textContent = res;
    var color = 'color:' + getRandomColor()
    this.setAttribute('style', myHeadingStaticStyle + ';' + color);
    console.log(this.getAttribute('style'));
    cnt++;
    var this_audio_url = config.baseurl + '/ABX/'
                        + config.exps.ABX.styles[0] + '/'
                        + config.exps.ABX.files[cnt % 5];
    audio.setAttribute('src',this_audio_url);
};