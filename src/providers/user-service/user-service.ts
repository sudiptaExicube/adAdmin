import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class UserServiceProvider {
 public baseUrl = "http://dev6.ivantechnology.in/radioapp/server/xml.server.php?action=";
  constructor(private https: HTTP, public httpclient: HttpClient) {
    console.log('Hello UserServiceProvider Provider');
  }

  checkSession(authKey){
    let HEADERS: any = { 'Content-type': 'text/xml; charset=utf-8' };
    return this.https.post(this.baseUrl+"songs&auth=" + authKey, {}, HEADERS)
  }

  callForHashKey(password){
    // let HEADERS: any = { 'Content-type': 'application/json; charset=utf-8' };
    return this.https.post('https://dev6.ivantechnology.in/leaketronics/api/v1/get-hash-information', { password:password }, {})
  }

  loginService(passphrase,timeStamp,username){
    let HEADERS: any = { 'Content-type': 'text/xml; charset=utf-8' };
    return this.https.post(this.baseUrl+"handshake&auth=" + passphrase + "&timestamp=" + timeStamp + "&version=380001&user=" + username, {}, HEADERS)
  }
  
  signUpService(adminAuthKey,username,md5password,email,fullname){
    let HEADERS: any = { 'Content-type': 'text/xml; charset=utf-8' };
    return this.https.post(this.baseUrl+"user_create&auth=" + adminAuthKey + "&username=" + username + "&password=" + md5password + "&email=" + email + "&fullname=" + fullname + "&version=400001", {}, HEADERS)
  }

  logout(authKey){
    let HEADERS: any = { 'Content-type': 'text/xml; charset=utf-8' };
    return this.https.post(this.baseUrl+"goodbye&auth=" + authKey, {}, HEADERS)
  }

  getmediaList(authKey,apiName){
    let HEADERS: any = { 'Content-type': 'text/xml; charset=utf-8' };
    return this.https.post(this.baseUrl+apiName+"&auth=" + authKey, {}, HEADERS)
  }
  artistsList(authKey){
    let HEADERS: any = { 'Content-type': 'text/xml; charset=utf-8' };
    return this.https.post(this.baseUrl+"artists&auth=" + authKey, {}, HEADERS)
  }
  fetchUser(authKey,username){
    console.log(authKey,username)
    let HEADERS: any = { 'Content-type': 'text/xml; charset=utf-8' };
    return this.https.post('https://dev6.ivantechnology.in/radioapp/server/xml.server.php?action=user&auth='+authKey+'&username='+username, {}, HEADERS)
  }
  updateUser(authKey, username, data){
    console.log(authKey,username, data)
    let HEADERS: any = { 'Content-type': 'text/xml; charset=utf-8' };
    return this.https.post('https://dev6.ivantechnology.in/radioapp/server/xml.server.php?action=user_update&auth='+authKey+'&username='+username+'&fullname='+data.fullname+'&email='+data.email+'&state='+data.state+'&city='+data.city+'&website='+data.website, {}, HEADERS)
  }
  updatepassword(authKey, username, password){
    console.log(authKey,username, password)
    let HEADERS: any = { 'Content-type': 'text/xml; charset=utf-8' };
    return this.https.post('https://dev6.ivantechnology.in/radioapp/server/xml.server.php?action=user_update&auth='+authKey+'&username='+username+'&password='+password, {}, HEADERS)
  }

  sendPushNotification(token, msgBody) {
    return new Promise((resolve, reject) => {
      let url: string = 'https://fcm.googleapis.com/fcm/send';

      let body: any = {
        "to": token,
        "notification": {
          "title": "Check this Mobile (title)",
          "body": msgBody,
          "mutable_content": true,
          "sound": "Tri-tone"
        },
    
      "data": {
          "url": "<url of media image>",
          "dl": "<deeplink action on tap of notification>"
        }
      }
      
      this.httpclient.post(url, body, {
        headers: new HttpHeaders().set('Authorization', 'key=AAAA7hYqhRE:APA91bHxeBpsR9j48kwt1IAvlK25X8INBQzTOUqDDMqVpiSb1impnQs-b9TWK7KMV-fTafMEm2UQx5_Jq37LpN04cH9T4S7b6a6v1rgd3fQPJSIISIy4vbG4vYGDWvLwM2CGwtcdXzyp'),
      })
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
        console.log(err);
      });
    });
  }

  
}
//"https://dev6.ivantechnology.in/radioapp/server/xml.server.php?action=user_update&auth=69fed049b087faa18300920866701b6d&username=sudipta93&website=sudipta.com"