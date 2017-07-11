/**
 * Created by Administrator on 2015/7/10.
 */
angular.module('app').service('xmgHttp',['$http',function ($http) {
    this.jsonp = function (url,params,success,error) {
        $http({
            url:url,
            method:'jsonp',
            params:params
        }).then(function (regs) {
            if (success) success(regs);
            // success && success(regs);
        }).catch(function (err) {

            if (error) error(err);
        })
    };
    this.getData = function () {

    }
    this.postData = function () {

    }
}])