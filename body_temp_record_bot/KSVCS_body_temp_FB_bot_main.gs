/*
Ref:https://github.com/JZL/Facebook-bot-Google-Apps-Script/blob/master/Code.gs

SETTING UP:
follow https://developers.facebook.com/docs/messenger-platform/quickstart but to get your webhook URL:
     go to the cloud icon (5th from the left) and make sure at the bottom "Who has access to the app:" = "Anyone, even anonymous", then press "DEPLOY" and use the resulting url
*/
//MAKE SURE EACH TIME UPDATE: GO TO THE CLOUD ICON (5th icon from the left), click "Project Version"->"New" and click the Update Button

var APP_NAME="FB";

var DEBUG = true
//used to debug, will add to this instead of Logger.log (can't bc is being triggered outside the normal GAS runtime)
var SPREADSHEET_ID = "...";//"PUT_SPREADHSEET_ID_HERE (make new spreadsheet and is part after "/d")"

function log(subject, body){ //
//  MailApp.sendEmail("user@gmail.com", subject, body)
  if(DEBUG){
    SpreadsheetApp.openById(SPREADSHEET_ID).appendRow([subject, body,getNowDateTime(1),APP_NAME]);
  }
}

var ACCESS_TOKEN = "FB_ACCESS_Token"

var LINE_SS = SpreadsheetApp.openByUrl('...'); //此處填入Google試算表的網址-通訊軟體ID記錄試算表
var Temp_SS = SpreadsheetApp.openByUrl('...'); //此處填入Google試算表的網址-體溫記錄記錄試算表
var record_url="...."; //體溫記錄記錄試算表的URL
var userID_field=4;

function hi(usrmsg, userID){
  var Sheet = LINE_SS.getSheetByName("教職員");  //此處填入試算表的標籤名稱
  var LastRow = Sheet.getLastRow();
  var replyMessage="\n";
  var i=0;
  //var msg_cmd=usrmsg.split(" ");//字元分割
   try { // statements to try
      for(i=2;i<=LastRow;i++){
        if(Sheet.getRange(i, userID_field).getValue().toString().search(userID)!=-1){
          replyMessage="你已註冊過了,直接輸入溫度即可!!\n";
          return replyMessage;
        }

        //已在Line註冊過了
        if(Sheet.getRange(i, 1).getValue().search(usrmsg)!=-1){
          replyMessage="已在Line註冊過了!!\n";
          break;
        }
      }
      if(i==(LastRow+1)){//找不到,建立新的記錄
        Sheet.getRange(i, userID_field).setValue(userID);
        Sheet.getRange(i, 1).setValue(usrmsg);
        //return "新註冊!!";

        //Ref:https://stackoverflow.com/questions/22898501/create-a-new-sheet-in-a-google-sheets-with-google-apps-script

        //Ref:https://stackoverflow.com/questions/19791132/google-apps-script-copy-one-spreadsheet-to-another-spreadsheet-with-formatting
        var src_sheet = Temp_SS.getSheets()[0];
        src_sheet.copyTo(Temp_SS);
        var newSheet=Temp_SS.getSheetByName("「原始」的副本");

        var sheet = Temp_SS.getSheetByName(usrmsg.trim());
        if (sheet!=null) {
          Temp_SS.deleteSheet(newSheet);
        }else{
          newSheet.setName(usrmsg.trim());
          var timeDate= new Date();
          newSheet.getRange(5, 1).setValue((timeDate.getFullYear()-1911)+"年");
          newSheet.getRange(5, 7).setValue("員工姓名："+usrmsg.trim());
        }
        replyMessage=APP_NAME+":你註冊完成,每天傳送輸入溫度訊息即可!!\n";
      }else{
        Sheet.getRange(i, userID_field).setValue(userID);
        replyMessage=replyMessage+APP_NAME+":你註冊完成,每天傳送輸入溫度訊息即可!!\n";
      }
   }catch(e){
      replyMessage=Sheet.getRange(i, userID_field).getValue()+":發生錯誤(Hi funs):\n";
      replyMessage+=e;
    }
  return replyMessage;

}

//記錄體溫
function record_temp(o_usrmsg, userID){
  var usrmsg=o_usrmsg;
  var Sheet = LINE_SS.getSheetByName("教職員");  //此處填入試算表的標籤名稱
  var LastRow = Sheet.getLastRow();
  var replyMessage="\n";
  var i=0;
  var empolyee="";
  var timeDate= new Date();
  var m=timeDate.getMonth()+1;
  var d=timeDate.getDate();
  var addmsg="***\n...";

  var slash_pos=usrmsg.indexOf("/");
  //return slash_pos;
  if(slash_pos>=1 && slash_pos<=3){//修改某一日期的溫度
    var space_pos=usrmsg.indexOf(" ");
    m=parseInt(usrmsg.substring(0, slash_pos));
    d=parseInt(usrmsg.substring(slash_pos+1,space_pos));
    usrmsg=usrmsg.substring(space_pos+1,usrmsg.length);
    //return "修改日期:"+m+"/"+d+"-"+usrmsg;
  }
  if(parseFloat(usrmsg)<=34.0 || parseFloat(usrmsg)>=42.0){
    replyMessage="你輸入的體溫為"+usrmsg+"度,請再確認是否正確!!!";
    return replyMessage;
  }
  
  //Change Timezone issue in Google App Script:https://www.youtube.com/watch?v=Mi-kqAL1KMg
  //var now_t=timeDate.getHours()+":"+timeDate.getMinutes();//test;

  try{ // statements to try
    replyMessage="無法記錄\n"+"今天是:"+m+"/"+d;
    for(i=2;i<=LastRow;i++){
      if(Sheet.getRange(i, userID_field).getValue().toString().trim().search(userID.trim())!=-1 ){
        empolyee=Sheet.getRange(i, 1).getValue();
        break;
      }
    }
    if(empolyee==""){
      replyMessage="你還沒註冊,請先註冊,註冊方式,直接傳送你的姓名!!\n";
    }else{
      
      var Temp_Sheet = Temp_SS.getSheetByName(empolyee);
      var flag=false;
      for(j=0;j<4;j++){
        for(i=7;i<=47;i++){
          if(parseInt(Temp_Sheet.getRange(i, j*3+1).getValue())==m && parseInt(Temp_Sheet.getRange(i, j*3+2).getValue())==d)
          {
            var tmp_val=Temp_Sheet.getRange(i, j*3+3).getValue();
            Temp_Sheet.getRange(i, j*3+3).setValue(usrmsg);
            flag=true;
            replyMessage=empolyee+",你好!今天記錄的溫度是"+usrmsg+"度\n";
            

            //另外記錄在另一張試算表中
            var msg_Sheet = LINE_SS.getSheetByName("體溫記錄");  //此處填入試算表的標籤名稱
            //Ref:https://stackoverflow.com/questions/28295056/google-apps-script-appendrow-to-the-top
            msg_Sheet.insertRowBefore(2).getRange(2,1).setValue(empolyee);
            msg_Sheet.getRange(2,2).setValue(usrmsg);
            msg_Sheet.getRange(2,3).setValue(getNowDateTime(1));
            msg_Sheet.getRange(2,4).setValue(APP_NAME);
            if(slash_pos>=1 && slash_pos<=3){//記錄修改前的日期與溫度
                msg_Sheet.getRange(2,5).setValue("m:"+m+"/"+d+"-"+tmp_val);
                replyMessage=empolyee+",你好!你修改"+m+"/"+d+"溫度:"+usrmsg+"度\n";
            }
            replyMessage+="下列網址可下載溫度記錄"+record_url+"\n\n"+addmsg;
            break;
          }
        }
        if(flag)
          break;
      }
    }

  }catch(e){
    replyMessage="發生錯誤(record_temp funs):\n";
    replyMessage+=e;
  }
  return replyMessage;
}


//Ref:https://blog.xuite.net/chu.hsing/Think/24697294-%E8%A8%88%E7%AE%97%E6%97%A5%E6%9C%9F%E7%9A%84%E6%99%82%E9%96%93%E5%B7%AE%28DateObject.dateDiff%29++
Date.prototype.dateDiff = function(interval,objDate){
  var dtEnd = new Date(objDate);
  if(isNaN(dtEnd)||objDate.constructor!=Date) return "111";
  switch (interval) {
      case "s":return parseInt((dtEnd - this) / 1000);
      case "n":return parseInt((dtEnd - this) / 60000);
      case "h":return parseInt((dtEnd - this) / 3600000);
      case "d":return parseInt((dtEnd - this) / 86400000);
      case "w":return parseInt((dtEnd - this) / (86400000 * 7));
      case "m":return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-this.getFullYear())*12) - (this.getMonth()+1);
      case "y":return dtEnd.getFullYear() - this.getFullYear();
      //輸入有誤
      default:return undefined;
  }//switch (interval) {
}

//每天主動提醒未填寫的人員. **要注意,每個月只能主動發訊息,發500則,同一訊息傳給多人也算多則
function remind(){
  var Sheet = LINE_SS.getSheetByName("教職員");  //此處填入試算表的標籤名稱
  var LastRow = Sheet.getLastRow();
  var i,j,l=0;
  var userID="";
  var empolyee="";
  var timeDate= new Date();
  var m=timeDate.getMonth()+1;
  var d=timeDate.getDate();
  var year=timeDate.getFullYear();
  var eDT = new Date(year+"/"+m+"/"+d);
  addmsg="\n\nTelegram/FB Messenger版上線了\n因為LINE有傳訊上限限制,若你要每天能接收到提醒,請使用Telegram/FB Messenger(使用方式與LINE相同),\n加入Telegram方式 連結:https://t.me/ksvcs_body_temp_bot 或 ID:ksvs_body_temp_bot\n加入FB Messenger方式 連結:https://m.me/ksvcs.body.temp.bot  或 ID:ksvcs.body.temp.bot";
  var rec_Sheet = LINE_SS.getSheetByName("記錄");  //此處填入試算表的標籤名稱
   
  try{ // statements to try
    for(l=2;l<=LastRow;l++){
      empolyee=Sheet.getRange(l, 1).getValue();
      userID=Sheet.getRange(l,userID_field).getValue();
      if(userID.toString()=="")
        continue;
      var Temp_Sheet = Temp_SS.getSheetByName(empolyee);
      var flag=false;
      for(j=0;j<4;j++){
        s=0;
        
        for(i=7;i<=47;i++){
          var sDT = new Date(year+"/"+Temp_Sheet.getRange(i, j*3+1).getValue()+"/"+Temp_Sheet.getRange(i, j*3+2).getValue());
          
          days=sDT.dateDiff("d",eDT);
          //console.log("你今天尚未上傳你的體溫!!!"+empolyee+":"+userID+",days:"+days);
          if( days>0 && days<=7 && Temp_Sheet.getRange(i, j*3+3).getValue()==""){
            s++;
          }

          if(days==0 && Temp_Sheet.getRange(i, j*3+3).getValue()=="")
          {
            //if(days==1 && Temp_Sheet.getRange(i, j*3+3).getValue()=="")//前一天也沒填再傳送,以節省可傳送訊息(500則)
            {
                s++;
                flag=true;
                //if(s<7){//一個星期以上沒記錄應該就不會用了...就不用提醒了,只有500則不要浪費
                try{
                    //pushMessage(TelegramBotToken,userID,"提醒您:你今天尚未上傳你的體溫!!你過去7天至少有"+s+"天未上傳."+addmsg);
                    sendMessage(userID,"提醒您:你今天尚未上傳你的體溫!!你過去7天至少有"+s+"天未上傳."+addmsg);
                }catch(e){
                  console.log("不能訊息給此使用者,因為他把chat關了解!");
                  break;
                }
                  
                  console.log("你今天尚未上傳你的體溫!!!"+empolyee+":"+userID+",你過去7天至少有"+s+"天未上傳:"+i+",LastRow:"+LastRow);
                //}
                
                break;
            }
            
          }
        }
        if(flag)
          break;
      }
    }
    
  }catch(e){
    var msg="發生錯誤(remind funs):\n";
    msg+=e;
    console.log(msg);
  }
}

function doGet(request) {//在fb developer上編輯webhook時傳回相對映的challenge
  //this is for renewing the webhook
  log("gotrequest", JSON.stringify(request)) 
  log("request.parameters[\"hub.verify_token\"]", request.parameters["hub.verify_token"]) 
  if(request.parameters["hub.verify_token"] == "access_token_you_set"){
    log("gotVerify", "")
    return ContentService.createTextOutput(request.parameters["hub.challenge"][0]);
  }
  return ContentService.createTextOutput("");
}

function doPost(request){
  try{
    var data = JSON.parse(request.postData.contents)//.contents;
    log("data",JSON.stringify(data))
    // Make sure this is a page subscription
    if (data.object == 'page') {
      pageEntry=data.entry[0];
      //log("pageEntry",JSON.stringify(pageEntry))
      var event=pageEntry.messaging[0];
      var userID=event.sender.id;
      
      if(event.message.text){
        //----------------------------------
        var replyMessage="";
        var flag=false;
        var userMessage = event.message.text;
        log("messageText",userMessage)

        try{
          if (typeof userID === 'undefined') {
            replyMessage="發生錯誤!!!";
          }else if(userMessage=="/start"){ 
            replyMessage="請輸入你的姓名註冊,或是直接輸入你的體溫!!!";
            flag=true;
          }else if(isNaN(userMessage)){ //Ref:https://codertw.com/%E5%89%8D%E7%AB%AF%E9%96%8B%E7%99%BC/229683/
              //Ref:https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/isNaN
            if(userMessage.indexOf("/")>=1 && userMessage.indexOf("/")<=3)
              replyMessage+=record_temp(userMessage,userID);
            else
              replyMessage+=hi(userMessage,userID);
            flag=true;
          }else{
            replyMessage+=record_temp(userMessage,userID);
            flag=true;
          }
        }catch(e){
            replyMessage="發生錯誤!!"+e; 
        }
        sendMessage(userID,replyMessage);
      }else{
        log("messagingEvent not message", "")
        sendMessage(userID,"請使用輸入文字!!");
      }
    }else{
      log("dataObject not page", "")
      sendMessage(userID,"dataObject not page");
    }
  }catch(e){
    log("error", e)
    
  }
}

function test(){
//  sendMessage("1359249650767661", "hellop")
}


function sendMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  var JSONdMessageData = {}
  for(var i in messageData){
    JSONdMessageData[i] = JSON.stringify(messageData[i])
  }
  payload = JSONdMessageData
  payload.access_token = ACCESS_TOKEN
  
  var options =
      {
        "method" : "post",
        "payload" : payload,  
      };
  //Ref:https://developers.facebook.com/docs/messenger-platform/send-messages
  log("options", JSON.stringify(options)) 
  UrlFetchApp.fetch("https://graph.facebook.com/v9.0/me/messages", options); 
}