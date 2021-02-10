/*
Ref:https://medium.com/front-end-augustus-study-notes/telegram-bot-api-2-2b022628cc1d

token:***...***
set webhook:
https://api.telegram.org/bot{�����Htoken}/setWebhook?url={GAP�ͦ������}}

https://api.telegram.org/bot***...***/setWebhook?url=https://GAP

*/

var APP_NAME="Telegram";

var DEBUG = true
//used to debug, will add to this instead of Logger.log (can't bc is being triggered outside the normal GAS runtime)
var SPREADSHEET_ID = "....";//"PUT_SPREADHSEET_ID_HERE (make new spreadsheet and is part after "/d")"

function log(subject, body){ //
//  MailApp.sendEmail("user@gmail.com", subject, body)
  if(DEBUG){
    SpreadsheetApp.openById(SPREADSHEET_ID).appendRow([subject, body,getNowDateTime(1),APP_NAME]);
  }
}

var LINE_SS = SpreadsheetApp.openByUrl('...'); //���B��JGoogle�պ�����}-�q�T�n��ID�O���պ��
var Temp_SS = SpreadsheetApp.openByUrl('...'); //���B��JGoogle�պ�����}-��ŰO���O���պ��
var record_url="...."; //��ŰO���O���պ��URL

var TelegramBotToken = "TG_Token";
var TelegramBotAPI = "https://api.telegram.org/bot" + TelegramBotToken + "/"; 
var userID_field=3;


function hi(usrmsg, userID){
  var Sheet = LINE_SS.getSheetByName("��¾��");  //���B��J�պ�����ҦW��
  var LastRow = Sheet.getLastRow();
  var replyMessage="\n";
  var i=0;
   try { // statements to try
      for(i=2;i<=LastRow;i++){
        if(Sheet.getRange(i,userID_field).getValue().toString().search(userID)!=-1){
          replyMessage="�A�w���U�L�F,������J�ūקY�i!!\n";
          return replyMessage;
        }

        //�w�bLine���U�L�F
        if(Sheet.getRange(i, 1).getValue().search(usrmsg)!=-1){
          replyMessage="�w�bLine���U�L�F!!\n";
          break;
        }
      }
      if(i==(LastRow+1)){//�䤣��,�إ߷s���O��
        Sheet.getRange(i,userID_field).setValue(userID);
        Sheet.getRange(i, 1).setValue(usrmsg);

        //Ref:https://stackoverflow.com/questions/22898501/create-a-new-sheet-in-a-google-sheets-with-google-apps-script

        //Ref:https://stackoverflow.com/questions/19791132/google-apps-script-copy-one-spreadsheet-to-another-spreadsheet-with-formatting
        var src_sheet = Temp_SS.getSheets()[0];
        src_sheet.copyTo(Temp_SS);
        var newSheet=Temp_SS.getSheetByName("�u��l�v���ƥ�");
        var sheet = Temp_SS.getSheetByName(usrmsg.trim());
        if (sheet!=null) {
          Temp_SS.deleteSheet(newSheet);
        }else{
          newSheet.setName(usrmsg.trim());
          var timeDate= new Date();
          newSheet.getRange(5, 1).setValue((timeDate.getFullYear()-1911)+"�~");
          newSheet.getRange(5, 7).setValue("���u�m�W�G"+usrmsg.trim());
        }
        replyMessage=APP_NAME+":�A���U����,�C�Ѷǰe��J�ūװT���Y�i!!\n";
      }else{
        Sheet.getRange(i,userID_field).setValue(userID);
        replyMessage=replyMessage+APP_NAME+":�A���U����,�C�Ѷǰe��J�ūװT���Y�i!!\n";
      }
   }catch(e){
      replyMessage=Sheet.getRange(i,userID_field).getValue()+":�o�Ϳ��~(Hi funs):\n";
      replyMessage+=e;
    }
  return replyMessage;

}

//�O�����
function record_temp(o_usrmsg, userID){
  var usrmsg=o_usrmsg;
  var Sheet = LINE_SS.getSheetByName("��¾��");  //���B��J�պ�����ҦW��
  var LastRow = Sheet.getLastRow();
  var replyMessage="\n";
  var i=0;
  var empolyee="";
  var timeDate= new Date();
  var m=timeDate.getMonth()+1;
  var d=timeDate.getDate();
  var addmsg="......";

  var slash_pos=usrmsg.indexOf("/");
  if(slash_pos>=1 && slash_pos<=3){//�ק�Y�@������ū�
    var space_pos=usrmsg.indexOf(" ");
    m=parseInt(usrmsg.substring(0, slash_pos));
    d=parseInt(usrmsg.substring(slash_pos+1,space_pos));
    usrmsg=usrmsg.substring(space_pos+1,usrmsg.length);
    //return "�ק���:"+m+"/"+d+"-"+usrmsg;
  }
  if(parseFloat(usrmsg)<=34.0 || parseFloat(usrmsg)>=42.0){
    replyMessage="�A��J����Ŭ�"+usrmsg+"��,�ЦA�T�{�O�_���T!!!";
    return replyMessage;
  }
  
  //Change Timezone issue in Google App Script:https://www.youtube.com/watch?v=Mi-kqAL1KMg
  //var now_t=timeDate.getHours()+":"+timeDate.getMinutes();//test;

  try{ // statements to try
    replyMessage="�L�k�O��\n"+"���ѬO:"+m+"/"+d;
    for(i=2;i<=LastRow;i++){
      if(Sheet.getRange(i,userID_field).getValue().toString().trim().search(userID.trim())!=-1 ){
        empolyee=Sheet.getRange(i, 1).getValue();
        break;
      }
    }
    if(empolyee==""){
      replyMessage="�A�٨S���U,�Х����U,���U�覡,�����ǰe�A���m�W!!\n";
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
            replyMessage=empolyee+",�A�n!���ѰO�����ū׬O"+usrmsg+"��\n";
            

            //�t�~�O���b�t�@�i�պ��
            var msg_Sheet = LINE_SS.getSheetByName("��ŰO��");  //���B��J�պ�����ҦW��
            //Ref:https://stackoverflow.com/questions/28295056/google-apps-script-appendrow-to-the-top
            msg_Sheet.insertRowBefore(2).getRange(2,1).setValue(empolyee);
            msg_Sheet.getRange(2,2).setValue(usrmsg);
            msg_Sheet.getRange(2,3).setValue(getNowDateTime(1));
            msg_Sheet.getRange(2,4).setValue(APP_NAME);
            if(slash_pos>=1 && slash_pos<=3){//�O���ק�e������P�ū�
                msg_Sheet.getRange(2,5).setValue("m:"+m+"/"+d+"-"+tmp_val);
                replyMessage=empolyee+",�A�n!�A�ק�"+m+"/"+d+"�ū�:"+usrmsg+"��\n";
            }
            replyMessage+="�U�C���}�i�U���ūװO��"+record_url+"\n\n"+addmsg;
            break;
          }
        }
        if(flag)
          break;
      }
    }

  }catch(e){
    replyMessage="�o�Ϳ��~(record_temp funs):\n";
    replyMessage+=e;
  }
  return replyMessage;
}


function test(){
  console.log("function test()");
  ReplyMessage(TelegramBotToken,...ID...,"psuh message-test!!!");
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
      //��J���~
      default:return undefined;
  }//switch (interval) {
}

//�C�ѥD�ʴ�������g���H��. **�n�`�N,�C�Ӥ�u��D�ʵo�T��,�o500�h,�P�@�T���ǵ��h�H�]��h�h
function remind(){
  var Sheet = LINE_SS.getSheetByName("��¾��");  //���B��J�պ�����ҦW��
  var LastRow = Sheet.getLastRow();
  var i,j,l=0;
  var userID="";
  var empolyee="";
  var timeDate= new Date();
  var m=timeDate.getMonth()+1;
  var d=timeDate.getDate();
  var year=timeDate.getFullYear();
  var eDT = new Date(year+"/"+m+"/"+d);
  addmsg="\n\n...";
  var rec_Sheet = LINE_SS.getSheetByName("�O��");  //���B��J�պ�����ҦW��
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

          if( days>0 && days<=7 && Temp_Sheet.getRange(i, j*3+3).getValue()==""){
            s++;
          }

          if(days==0 && Temp_Sheet.getRange(i, j*3+3).getValue()=="")
          {
            //if(days==1 && Temp_Sheet.getRange(i, j*3+3).getValue()=="")//�e�@�Ѥ]�S��A�ǰe,�H�`�٥i�ǰe�T��(500�h)
            {
                s++;
                flag=true;
                //if(s<7){//�@�ӬP���H�W�S�O�����ӴN���|�ΤF...�N���δ����F,�u��500�h���n���O
                try{
                    pushMessage(TelegramBotToken,userID,"�����z:�A���ѩ|���W�ǧA�����!!�A�L�h7�Ѧܤ֦�"+s+"�ѥ��W��."+addmsg);
                }catch(e){
                  console.log("����T�������ϥΪ�,�]���L��chat���F��!");
                  break;
                }
                  
                  console.log("�A���ѩ|���W�ǧA�����!!!"+empolyee+":"+userID+",�A�L�h7�Ѧܤ֦�"+s+"�ѥ��W��:"+i+",LastRow:"+LastRow);
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
    var msg="�o�Ϳ��~(remind funs):\n";
    msg+=e;
    console.log(msg);
  }
}

function doPost(e) {
  //Ref:https://www.tpisoftware.com/tpu/articleDetails/2099
  
  var userData = JSON.parse(e.postData.contents);    //���o Telegram Bot ���쪺��T

  var replyMessage="";
  var userID = userData.message.chat.id.toString();
  var flag=false;

  if (!userData.message.text) {return;}    //�����r�H�~���T���i��B�z

  var userMessage = userData.message.text;
  try{
    if (typeof userID === 'undefined') {
      replyMessage="�o�Ϳ��~!!!";
    }else if(userMessage=="/start"){ 
      replyMessage="�п�J�A���m�W���U,�άO������J�A�����!!!";
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
      replyMessage="�o�Ϳ��~!!"+e; 
      log("error", e);
  }
  
    
  if(replyMessage.trim()!=""){
    try{
      ReplyMessage(TelegramBotToken,userID,replyMessage); 
    }catch(e){
      throw e;
    }
  }else{
    ReplyMessage(TelegramBotToken,userID,"�L�k����A�����O!!"); 
  }

}
