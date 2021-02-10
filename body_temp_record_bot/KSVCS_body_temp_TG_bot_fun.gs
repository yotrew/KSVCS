function getNowDateTime(f){
    //Ref:https://blog.wu-boy.com/2009/11/javascript-%E5%9C%A8%E5%87%BD%E6%95%B8%E8%A3%A1%E8%A8%AD%E5%AE%9A%E5%8F%83%E6%95%B8%E9%A0%90%E8%A8%AD%E5%80%BC/
    //Ref:https://stackoverflow.com/questions/894860/set-a-default-parameter-value-for-a-javascript-function
    f = f || 1; 
  
	var timeDate= new Date();
	var tMonth = (timeDate.getMonth()+1) > 9 ? (timeDate.getMonth()+1) : '0'+(timeDate.getMonth()+1);
	var tDate = timeDate.getDate() > 9 ? timeDate.getDate() : '0'+timeDate.getDate();
	var tHours = timeDate.getHours() > 9 ? timeDate.getHours() : '0'+timeDate.getHours();
	var tMinutes = timeDate.getMinutes() > 9 ? timeDate.getMinutes() : '0'+timeDate.getMinutes();
	var tSeconds = timeDate.getSeconds() > 9 ? timeDate.getSeconds() : '0'+timeDate.getSeconds();
    if(f==1)
      return timeDate= timeDate.getFullYear()+'/'+ tMonth +'/'+ tDate +' '+ tHours +':'+ tMinutes +':'+ tSeconds;
    else if(f==2)
      return timeDate= timeDate.getFullYear()+'/'+ tMonth +'/'+ tDate;
    else if(f==3)
      return timeDate= tMonth +'/'+ tDate;
    else
      return timeDate= tHours +':'+ tMinutes +':'+ tSeconds;
}

function getDateTime(date_f,f){
    f = f || 1; 
	var timeDate= new Date(date_f);
	var tMonth = (timeDate.getMonth()+1) > 9 ? (timeDate.getMonth()+1) : '0'+(timeDate.getMonth()+1);
	var tDate = timeDate.getDate() > 9 ? timeDate.getDate() : '0'+timeDate.getDate();
	var tHours = timeDate.getHours() > 9 ? timeDate.getHours() : '0'+timeDate.getHours();
	var tMinutes = timeDate.getMinutes() > 9 ? timeDate.getMinutes() : '0'+timeDate.getMinutes();
	var tSeconds = timeDate.getSeconds() > 9 ? timeDate.getSeconds() : '0'+timeDate.getSeconds();
    if(f==1)
      return timeDate= timeDate.getFullYear()+'/'+ tMonth +'/'+ tDate +' '+ tHours +':'+ tMinutes +':'+ tSeconds;
    else if(f==2)
      return timeDate= timeDate.getFullYear()+'/'+ tMonth +'/'+ tDate;
    else if(f==3)
      return timeDate= tMonth +'/'+ tDate;
    else
      return timeDate= tHours +':'+ tMinutes +':'+ tSeconds;
}


//http://zhi-bin1985.blogspot.com/2015/02/javascript.html
function showIntFromString(text){
   var num_g = text.match(/\d+/);
   if(num_g != null){
     return num_g[0];
   }else{
      return; 
   }
}
function dayOfyear(){
  var now = new Date();//現在時間
  var firstDay = new Date(now.getFullYear(),0,1);//今年1月1號時間
  var dateDiff = Math.ceil((now - firstDay)/ (1000*60*60*24)); //javascript時間單位為milisecond,所以一天有000*60*60*24 ms
  return dateDiff;
}
function pushMessage(caToken,userID,msg){
  ReplyMessage(caToken,userID,msg);
}

function ReplyMessage(CHANNEL_ACCESS_TOKEN,replyToken,replyMessage)
{
  var TelegramBotAPI = "https://api.telegram.org/bot" + CHANNEL_ACCESS_TOKEN + "/"; 
  var payload = {
    "chat_id": replyToken,
    "text": replyMessage,
  }
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  UrlFetchApp.fetch(TelegramBotAPI + "sendMessage", options);
}