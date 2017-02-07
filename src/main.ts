import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import config from './auth-config';

//Configure Bluebird Promises.
(<any>Promise).config({
  longStackTraces: environment.debug,
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .feature('resources')
    .plugin('aurelia-table')
    .globalResources("aurelia-mask/masked-input")
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
      config.settings.lock = true;
      config.settings.centerHorizontalOnly = false;
      config.settings.centerVerticalOnly = false;
      config.settings.startingZIndex = 5;
      config.settings.enableEscClose = true;
    })
    .plugin('aurelia-auth', (baseConfig)=>{
         baseConfig.configure(config);
    })
    ;

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot(''));//login
}
