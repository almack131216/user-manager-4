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
        //console.log('navigateToUserPage: ' + getName + ', ' + getId)
        var tmpUrl = '';

        switch(getName){
            case 'review':
                tmpUrl = getName + '/' + getId;
                break;
            case 'edit':
            case 'read':
                tmpUrl = 'user/' + getId + '/' + getName;
                break;
        }
        
        //route: user-edit; params.bind: {id:user.id, pageType:'edit'}
        this.router.navigate(tmpUrl);//"users/5/edit"
    }

    emailUser(getEmailAddress) {
        //console.log('mailto:' + getEmailAddress);
        location.href = 'mailto:' + getEmailAddress + '?subject=MRT Administrator';
    }

}