export class UserNoSelection {
  title = "";

  attached(){
    $('#nav_li_Team').addClass('active');
  }

  detached(){
    $('#nav_li_Team').removeClass('active');
  }
}