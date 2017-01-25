let latency = 200;
let id = 0;

function getId(){
  return ++id;
}

let users = [
  {
    id:getId(),
    first_name:'John',
    last_name:'Tolkien',
    email:'tolkien@inklings.com',
    cell_number:'867-5309'
  },
  {
    id:getId(),
    first_name:'Clive',
    last_name:'Lewis',
    email:'lewis@inklings.com',
    cell_number:'867-5309'
  },
  {
    id:getId(),
    first_name:'Owen',
    last_name:'Barfield',
    email:'barfield@inklings.com',
    cell_number:'867-5309'
  },
  {
    id:getId(),
    first_name:'Charles',
    last_name:'Williams',
    email:'williams@inklings.com',
    cell_number:'867-5309'
  },
  {
    id:getId(),
    first_name:'Roger',
    last_name:'Green',
    email:'green@inklings.com',
    cell_number:'867-5309'
  },
  {
    id:getId(),
    first_name:'David',
    last_name:'Bowie',
    email:'david@bowie.com',
    cell_number:'123-4567'
  },
  {
    id:getId(),
    first_name:'Dan',
    last_name:'Pena',
    email:'dan@pena.com',
    cell_number:'891-3210'
  }
];

export class WebAPIUsers {
  isRequesting = false;
  
  getUserList(){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let results = users.map(x =>  { return {
          id:x.id,
          first_name:x.first_name,
          last_name:x.last_name,
          email:x.email,
          cell_number:x.cell_number
        }});
        resolve(results);
        this.isRequesting = false;
      }, latency);
    });
  }

  getUserDetails(id){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let found = users.filter(x => x.id == id)[0];
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
          instance.id = getId();
          users.push(instance);
        }

        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
}
