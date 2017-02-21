import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
//NOTE: @noView gave problems. Not sure why. To investigate...
//@noView
@inject(Router)
export class MyNav {

    router

    constructor(router: Router) {
        this.router = router;
    }


    navigateTo(getUrl) {
        //route: user-edit; params.bind: {id:user.id, pageType:'edit'}
        this.router.navigate(getUrl);//"users/5/edit"
    }

    navigateToUserPage(getName, getId) {
        console.log('navigateToUserPage: ' + getName + ', ' + getId)
        var tmpUrl = 'user/' + getId + '/' + getName;
        //route: user-edit; params.bind: {id:user.id, pageType:'edit'}
        this.router.navigate(tmpUrl);//"users/5/edit"
    }

    emailUser(getEmailAddress) {
        console.log('mailto:' + getEmailAddress);
    }

}