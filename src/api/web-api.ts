let latency = 200;
let id = 0;

function getId(){
  return ++id;
}

let contacts = [
  {
    id:getId(),
    first_name:'John',
    last_name:'Tolkien',
    email:'tolkien@inklings.com',
    phone_number:'867-5309'
  },
  {
    id:getId(),
    first_name:'Clive',
    last_name:'Lewis',
    email:'lewis@inklings.com',
    phone_number:'867-5309'
  },
  {
    id:getId(),
    first_name:'Owen',
    last_name:'Barfield',
    email:'barfield@inklings.com',
    phone_number:'867-5309'
  },
  {
    id:getId(),
    first_name:'Charles',
    last_name:'Williams',
    email:'williams@inklings.com',
    phone_number:'867-5309'
  },
  {
    id:getId(),
    first_name:'Roger',
    last_name:'Green',
    email:'green@inklings.com',
    phone_number:'867-5309'
  }
];

export class WebAPI {
  isRequesting = false;
  
  getContactList(){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let results = contacts.map(x =>  { return {
          id:x.id,
          first_name:x.first_name,
          last_name:x.last_name,
          email:x.email,
          phone_number:x.phone_number
        }});
        resolve(results);
        this.isRequesting = false;
      }, latency);
    });
  }

  getContactDetails(id){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let found = contacts.filter(x => x.id == id)[0];
        resolve(JSON.parse(JSON.stringify(found)));
        this.isRequesting = false;
      }, latency);
    });
  }

  saveContact(contact){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(contact));
        let found = contacts.filter(x => x.id == contact.id)[0];

        if(found){
          let index = contacts.indexOf(found);
          contacts[index] = instance;
        }else{
          instance.id = getId();
          contacts.push(instance);
        }

        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
}
