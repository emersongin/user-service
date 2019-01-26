Array.prototype.empty = function(){
    if(!this || this.length <= 0){
        return true;
    }else{
        return false;
    }
}

Array.prototype.lastIndex = function(){
    return this.length - 1;
}