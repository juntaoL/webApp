/**
 * Created by Administrator on 2017/7/10.
 */
// 1.创建模块
var app = angular.module('app',['ui.router']);

/**
 * Created by Administrator on 2017/7/10.
 */
// 4.配置路由
angular.module('app').config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
    $stateProvider.state('home',{
        url:'/home',
        views:{
            home:{
                templateUrl:'../views/home_tpl.html',
                controller:'HomeController'
            },
            author:{
                template:'<h2>author</h2>'
            },
            content:{
                template:'<h2>content</h2>'
            },
            my:{
                template:'<h2>my</h2>'
            }
        }
    }).state('home.list',{
        url:'/list',
        templateUrl:'../views/list_tpl.html'
    }).state('home.detail',{
        url:'/detail/:id',
        // template:'<div ui-view>{{item.content}}</div>',
        template:'<details></details>',
        controller:'DetailController'
    });

    // 一开始显示列表
    $urlRouterProvider.otherwise('home/list');

}]);

// 配置白名单
angular.module('app').config(['$sceDelegateProvider',function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://localhost:8080/api/**'
    ]);
}]);
/**
 * Created by Administrator on 2017/7/10.
 */
// 2.创建控制器
angular.module('app').controller('AppController',['$scope','$window',function ($scope,$window) {
    $scope.appTitle = '每日一刻';

    // 当前的标题
    $scope.title = '首页';
    // 记录当前选中的索引
    $scope.id = 0;
    // 接收广播
    $scope.$on('tab_notifice',function (e,regs) {
        console.log(regs.id);
        // var title = '首页';
        var titleArray = ['首页','作者','栏目','我'];
        $scope.id = regs.id;

        // 发送广播
        // $scope.$broadcast('home_notifice',{title:titleArray[regs.id]});

        $scope.title = titleArray[regs.id];
    })
    // 返回按钮
    $scope.back = function () {
        // 返回上一页
        $window.history.back();
    }
}]);
/**
 * Created by Administrator on 2017/7/10.
 */
// 详情控制器
angular.module('app').controller('DetailController',['$scope','$stateParams',function ($scope,$stateParams) {

    var index = $stateParams.id;

    $scope.item = $scope.homeData.posts[index];
    console.log($scope.item);

}]);

/**
 * Created by Administrator on 2017/7/10.
 */
// 5.创建首页控制器
angular.module('app').controller('HomeController',['$scope','xmgHttp',function ($scope,xmgHttp) {
    $scope.title = '首页1';

    /*跨域
     * http://localhost:8080/api/home.php?callback=fn
     * http://localhost:9999/#!/home
     * */
    // $http({
    //     url:'http://localhost:8080/api/home.php',
    //     method:'jsonp'
    // }).then(function (regs) {
    //     $scope.homeData = regs.data;
    //     console.log($scope.homeData);
    // }).catch(function (err) {
    //     console.log(err);
    // })
    var url = 'http://localhost:8080/api/home.php';

    xmgHttp.jsonp(url,null,function (regs) {
        console.log(regs);
        $scope.homeData = regs.data;
    },function (err) {
        console.log(err);
    })
}]);
/**
 * Created by Administrator on 2017/7/10.
 */
angular.module('app').controller('TabbarController',['$scope',function ($scope) {
    $scope.tabChange = function (index) {
        // 发送广播
        $scope.$emit('tab_notifice',{id:index});
    }
}]);
/**
 * Created by Administrator on 2017/7/10.
 */
// 自定义指令
angular.module('app').directive('details',function () {
    return {
        restrict:'EA',
        template:'<div class="home_detail"><div ui-view></div></div>',
        replace:true,
        link:function ($scope,ele,attr) {
            ele.html($scope.item.content);
        }
    }
})
/**
 * Created by Administrator on 2017/7/10.
 */
// 3.自定义指令
angular.module('app').directive('navs',function () {
    return {
        restrict:"EA",
        templateUrl:'../views/nav_tpl.html',
        controller:['$scope',function ($scope) {
            // 接收广播
            $scope.$on('home_notifice',function (e,regs) {
                console.log(regs.title);
                $scope.title = regs.title;
            });

        }],
        link:function ($scope,ele,attr) {
            if (attr.isBack != 'true'){
                ele.find('span').css({
                    display:'none'
                })
            }

        }
    }
});
/**
 * Created by Administrator on 2017/7/10.
 */
// tabbar
angular.module('app').directive('tabbar',function () {
    return {
        restrict:"EA",
        templateUrl:'../views/tabbar_tpl.html',
        controller:'TabbarController',
        replace:true,
        link:function ($scope,ele,attr) {
            $scope.$watch('id',function (newV,oldV) {
                var list = ele.children()[0].children;
                for (var i = 0; i<list.length; i++){
                    list[i].className = '';
                }
                list[$scope.id].className = 'active';
            })
        }
    }
});
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