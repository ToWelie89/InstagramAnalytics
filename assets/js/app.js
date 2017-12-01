/*
* IMPORTS
*/

import MainController from './angular/controllers/mainController';
import InstagramService from './angular/services/instagramService';

const app = angular.module('instaAnalyzeApp', []);

/* CONTROLLERS */
app.controller('mainController', MainController);
/* SERVICES */
app.service('instagramService', InstagramService);
