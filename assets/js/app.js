/*
* IMPORTS
*/

import MainController from './angular/controllers/mainController';
import InstagramService from './angular/services/instagramService';
import {DateFilter} from './angular/filters/dateFilter';

const app = angular.module('instaAnalyzeApp', []);

/* CONTROLLERS */
app.controller('mainController', MainController);
/* SERVICES */
app.service('instagramService', InstagramService);
/* FILTERS */
app.filter('dateFilter', DateFilter);
