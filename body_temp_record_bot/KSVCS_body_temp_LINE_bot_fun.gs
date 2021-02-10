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
  var now = new Date();//�{�b�ɶ�
  var firstDay = new Date(now.getFullYear(),0,1);//���~1��1���ɶ�
  var dateDiff = Math.ceil((now - firstDay)/ (1000*60*60*24)); //javascript�ɶ���쬰milisecond,�ҥH�@�Ѧ�000*60*60*24 ms
  return dateDiff;
}

//�O���C�Ӥ�T���ǰe�q(LINE�@�Ӥ�K�O�q��500),���u��pushMessage�~������
function record_message_per_month(parameter){
  var Line_Bot_Sheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1b-qU0Db1z7cjlV6QnOQrAvTmgz9QFHos_6asjBjjJLM/edit')
  var Sheet = Line_Bot_Sheet.getSheetByName('�O��');  //���B��J�պ�����ҦW��
  var LastRow = Sheet.getLastRow();
  var msg_count=0;
  

  if(parameter=="�C�Ӥ�ζqpush"){
    var para_Sheet = Line_Bot_Sheet.getSheetByName('�Ѽ�');  //���B��J�պ�����ҦW��
    var para_LastRow = Sheet.getLastRow();
    var para_row=0;
    for(i=2;i<=para_LastRow;i++){
      if(para_Sheet.getRange(i, 1).getValue().trim().search("�C�Ӥ�ζqpush����")!=-1){
          para_row=i;
          break;
        }
    }
    if(para_row<=0)
      throw "fun:record_message_per_month:�䤣��Ѽ�!��������D�Ь��޲z��!\n";
  }
  
  
  for(i=2;i<=LastRow;i++){
    if(Sheet.getRange(i, 1).getValue().trim().search(parameter)!=-1){
      var now = new Date();//�{�b�ɶ�
      var last_date = new Date(Sheet.getRange(i, 3).getValue());
      msg_count=Sheet.getRange(i, 2).getValue();
      var dateDiff=now.getMonth()-last_date.getMonth();
      if(dateDiff>0){
        msg_count=0;
      }
      Sheet.getRange(i, 3).setValue(getNowDateTime(1));
      
      msg_count++;
      Sheet.getRange(i, 2).setValue(msg_count);

      if(parameter=="�C�Ӥ�ζqpush" && parseInt(msg_count)>parseInt(para_Sheet.getRange(para_row, 2).getValue()))
        throw "�Ȱ��ϥΤ�...���\��Τw��"+msg_count+"�h�T��\n";
      
      break;
     }
  }//for(i=2;i<=LastRow;i++)
}//function record_message_per_month
  
//�����T�����ϥΪ�
function pushMessage(caToken,userID,msg){//https://www.oxxostudio.tw/articles/201806/line-push-message.html
    var url = 'https://api.line.me/v2/bot/message/push';
    if(userID.trim()==="")
      return;
  
      UrlFetchApp.fetch(url, {
          'headers': {
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization': 'Bearer ' + caToken,
          },
          'method': 'post',
          'payload': JSON.stringify({
              'to':  userID,
              'messages': [{
                  type:'text',
                  text:msg
              }]
          }),
      });
      try{
        record_message_per_month("�C�Ӥ�ζqpush");//�O���C�Ӥ�����T���ǰe�q(LINE�@�Ӥ�K�O�q��500),���u��pushMessage�~������
        //console.log("�O���C�Ӥ�push�ζq");
      }catch (e) {
        //replyMessage+=e;
        throw e;
        console.log(e);
      }
      
}

//�^�T�����ϥΪ�
//Ref:https://ithelp.ithome.com.tw/articles/10198142?sc=iThelpR
function ReplyMessage(CHANNEL_ACCESS_TOKEN,replyToken,replyMessage){//https://www.oxxostudio.tw/articles/201806/line-push-message.html
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': replyMessage,
      }],
    }),
  });

}



function backup() {
  var timeDate= new Date();
  var y=timeDate.getFullYear();
  var m=timeDate.getMonth()+1;
  var d=timeDate.getDate();
  
  var record_file="�������Ӧ]��COVID-19��¾���u���d�ۥD�޲z��Ŷq��������";//�A���O���ɦW�٩M�O��ID�ɦW��
  //Ref:https://stackoverflow.com/questions/45095087/google-apps-script-duplicate-a-file
  DriveApp.getFilesByName(record_file).next().makeCopy();
  var file = DriveApp.getFilesByName(record_file+' ���ƥ�').next();
  
  //dest_folder.addFile(file); //ref:https://www.labnol.org/code/19975-move-file-between-folders
  //source_folder.removeFile(file);
  file.setName(y+"-"+m+"-"+d+"������");
  
  //Ref:https://stackoverflow.com/questions/38808875/moving-files-in-google-drive-using-google-script
  var folder = DriveApp.getFolderById('1yjsXlDL-mn9F8h5sefSg06t1OQgR970I');
  file.moveTo(folder);

    DriveApp.getFilesByName(record_file+'_LINE_ID').next().makeCopy();
  file = DriveApp.getFilesByName(record_file+'_LINE_ID ���ƥ�').next();
  file.setName(y+"-"+m+"-"+d+"LINE_ID������");
  folder = DriveApp.getFolderById('1yjsXlDL-mn9F8h5sefSg06t1OQgR970I');
  file.moveTo(folder);

}
