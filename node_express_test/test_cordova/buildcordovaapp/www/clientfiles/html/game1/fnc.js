//random >=min && <max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

async function sleep_ms(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function copyobj_1lvl(from,to){
    for (key in from) {
      to[key] = from[key];
    }
    return to;
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

/**********
date_to_str_format(time,format_str) выводит дату - time в формате format_str:
format_str - строка задает какие данные даты и в какой последовательности будут выведены:
Y - год, в виде 1900-2100
M - месяц (01-12)
D - день (01-31)
W - день недели 0-6(0 - воскресенье;1-п)
h - час (00-23)
m - минуты (00-59)
k - миллисекунды (000-999)
**********/
exports.date_format = date_to_str_format;
exports.date_to_str_format = date_to_str_format;
function date_to_str_format(time,format_str){
      if(arguments.length==1){
            format_str = time;
            time = new Date();
      }else{
            time = new Date(time);
            /*if (typeof(time)!=='Date') {
                  return "WRONG TIME";
            }*/
      }
      
      var s = String(format_str);
      if(!s || s=="") s = "Y.M.D (W) h:m:s.k";
      if(/Y/gm.test(s)) s = s.replace(/Y/gm,time.getFullYear());
      if(/M/gm.test(s)) s = s.replace(/M/gm,String(100+time.getMonth()+1).substring(1));       
      if(/D/gm.test(s)) s = s.replace(/D/gm,String(100+time.getDate()).substring(1));          
      if(/W/gm.test(s)) s = s.replace(/W/gm,time.getDay());                                    
      if(/h/gm.test(s)) s = s.replace(/h/gm,String(100+time.getHours()).substring(1));
      if(/m/gm.test(s)) s = s.replace(/m/gm,String(100+time.getMinutes()).substring(1));
      if(/s/gm.test(s)) s = s.replace(/s/gm,String(100+time.getSeconds()).substring(1));
      if(/k/gm.test(s)) s = s.replace(/k/gm,String(1000+time.getMilliseconds()).substring(1));
      return s;
}
