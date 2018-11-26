//random >=min && <max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

async function sleep_ms(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
function time_long_str(time_begin,time_end){
  if(!time_begin['getTime']){
        if(time_begin['toFixed']){
              time_begin = new Date(time_begin);
        }            
  }
  if(!time_end){
        time_end = new Date();
  }else
  if(!time_end['getTime']){
        if(time_end['toFixed']){
              time_end = new Date(time_end);
        }
  }
  
  var t = time_end.getTime()-time_begin.getTime();
  
  var a = t % 1000;
  t /= 1000;
  var ret_s = a+"ms";
  
  t = t.toFixed();
  if(t>0){
      a = t % 60;
      t /= 60;
      ret_s = a+"s "+ret_s;
  }else{
      return ret_s;
  }
  
  t = t.toFixed();
  if(t>0){
      a = t % 60;
      t /= 60;   
      ret_s = a+"m "+ret_s;
  }else{
      return ret_s;
  }
  
  t = t.toFixed();
  if(t>0){
      a = t % 24;
      t /= 24;   
      ret_s = a+"h "+ret_s;
  }else{
      return ret_s;
  }
  
  t = t.toFixed();
  if(t>0){
      a = t % 30;
      t /= 30;   
      ret_s = a+"d "+ret_s;
  }else{
      return ret_s;
  }
  
  t = t.toFixed();
  if(t>0){
      a = t % 12;
      t /= 12;   
      ret_s = a+"mth "+ret_s;
  }else{
      return ret_s;
  }
  
  t = t.toFixed();
  if(t>0){
      a = t;
      ret_s = a+"y "+ret_s;
  }else{
      return ret_s;
  }
  
  return ret_s;
}
