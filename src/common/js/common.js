


function strFormat(str,callback){
    let formatStr = str.substring(0,10);
    callback(formatStr); 
}

exports.modules = {    

    strFormat : strFormat

}