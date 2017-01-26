import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';



let latency = 200;
let id = 0;
let users = null;
let usersArr = [];
let results = null;

@autoinject
export class WebAPIUsers {
  isRequesting = false;
  usersArr = [];

  http:HttpClient

    constructor(http:HttpClient) {
        this.http = http;          
    }

  
  getUserList(){
    this.isRequesting = true;

    return new Promise(resolve => {
      setTimeout(() => {
        let users = this.http.fetch('src/views/widgets/user-panels/dummy-data.json')
            .then(users => users.json());

        // let results = users.map(x =>  { return {
        //   id:x.id,
        //   first_name:x.first_name,
        //   last_name:x.last_name,
        //   email:x.email,
        //   cell_number:x.cell_number
        // }});
              

        resolve(users);
        this.isRequesting = false;
      }, latency);
    });
  }

  getUserDetails(id){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('usersArr:' + usersArr);
        let found = usersArr.filter(x => x.id == id);
        
        resolve(JSON.parse(JSON.stringify(found)));
        this.isRequesting = false;
      }, latency);
    });
  }

  saveUser(user){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(user));
        let found = users.filter(x => x.id == user.id)[0];

        if(found){
          let index = users.indexOf(found);
          users[index] = instance;
        }else{
          //instance.id = getId();
          users.push(instance);
        }

        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
}
