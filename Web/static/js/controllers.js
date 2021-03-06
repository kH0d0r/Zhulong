/**
 * Created by edwardl on 2016/9/6.
 */

userHomeApp.controller("bodyController", function ($scope) {
    $scope.test = "123";
});

// 侧边栏高亮显示的控制器
userHomeApp.controller("SidebarController", function ($scope, $log, $location) {
    $scope.activeSidebar = $location.$$path.split("/")[1];
});


userHomeApp.controller("showMyContainers", function ($scope, $http, $log, $window) {

    // API版本，后续更新时，保持接口一致，只需更改这个就可以了
    var API_VERSION = "v1";

    // 获取生成表单用的信息
    $http({
        method: 'GET',
        url: "/api/" + API_VERSION + "/get_containers"
    }).success(function (response) {
        if (response.code != 1001) {
            $scope.errorMessage = response.message;
            alert($scope.errorMessage);
            return false;
        } else {
            $scope.info = response.info;
        }
    }).error(function () {
        $log.error("拉取信息失败！");
        $scope.errorMessage = "Error when getting containers...";
        alert($scope.errorMessage);
        return false;
    });

    //
    $scope.opContainer = function (conid,opstate) {
        if(opstate=="start"){
            var payload = {
                "conid": conid
            };
            var csrfToken = $window.document.getElementsByName("csrf-token")[0].content;
            $http({
                method: "POST",
                url: "/api/" + API_VERSION + "/start_container",
                data: payload,
                headers: {"X-CSRFToken": csrfToken}
            }).success(function (data) {
                if (data.code != 1001) {
                    $scope.errorMessage = data.message;
                    alert($scope.errorMessage);
                } else {
                    $scope.alertTag = 'success';
                    $scope.errorMessage = data.message;                    
                    $window.location.reload();
                }
            }).error(function () {
                $scope.errorMessage = "start container failed.";
                alert($scope.errorMessage);
                return false;
            });

        }else{
            var payload = {
                "conid": conid
            };
            var csrfToken = $window.document.getElementsByName("csrf-token")[0].content;
            $http({
                method: "POST",
                url: "/api/" + API_VERSION + "/stop_container",
                data: payload,
                headers: {"X-CSRFToken": csrfToken}
            }).success(function (data) {
                if (data.code != 1001) {
                    $scope.errorMessage = data.message;
                    alert($scope.errorMessage);
                } else {
                    $scope.alertTag = 'success';
                    $scope.errorMessage = data.message;
                    $window.location.reload();
                }
            }).error(function () {
                $scope.errorMessage = "stop container failed.";
                alert($scope.errorMessage);
                return false;
            });
        }
    };
    //
    $scope.delContainer = function (conid) {
        if(confirm("Are you sure you want to delete it?")){
            var payload = {
                "conid": conid
            };
            var csrfToken = $window.document.getElementsByName("csrf-token")[0].content;
            $http({
                method: "POST",
                url: "/api/" + API_VERSION + "/del_container",
                data: payload,
                headers: {"X-CSRFToken": csrfToken}
            }).success(function (data) {
                if (data.code != 1001) {
                    $scope.errorMessage = data.message;
                    alert($scope.errorMessage);
                } else {
                    $scope.alertTag = 'success';
                    $scope.errorMessage = data.message;
                    $window.location.reload();
                }
            }).error(function () {
                $scope.errorMessage = "del container failed.";
                alert($scope.errorMessage);
                return false;
            });
        }
    };

    
});


userHomeApp.controller("createNewDocker", function ($scope, $http, $log, $window) {

    // API版本，后续更新时，保持接口一致，只需更改这个就可以了
    var API_VERSION = "v1";

    // 系统镜像服务信息
    $scope.servers = [{"server": "None"}];
    $scope.ver_id = null;
    $scope.port = null;
    $scope.containerName = null;
    $scope.createDockerBtn = false;

    // 获取生成表单用的信息
    $http({
        method: 'GET',
        url: "/api/" + API_VERSION + "/get_info"
    }).success(function (response) {
        if (response.code != 1001) {
            $scope.errorMessage = response.message;
            alert($scope.errorMessage);
            return false;
        } else {
            $scope.info = response.info;
        }
    }).error(function () {
        $log.error("拉取操作系统版本信息失败！");
        $scope.errorMessage = "Error when getting op system...";
        alert($scope.errorMessage);
        return false;
    });

    // 选择系统镜像
    $scope.funcSystemImage = function (imageName) {
        $scope.imageName = imageName;
        $scope.servers = $scope.info[imageName];
        // $log.debug($scope.servers);
    };

    // 选择服务版本
    $scope.funcImageServer = function (ser_id) {
        $scope.ser_id = ser_id;
    };

    // 创建镜像
    $scope.funcCreateDocker = function () {

        // 整理数据
        var payload = {
            "server_id": $scope.ser_id,
            "port": $scope.port,
            "container_name": $scope.containerName
        };
        var csrfToken = $window.document.getElementsByName("csrf-token")[0].content;
        $http({
            method: "POST",
            url: "/api/" + API_VERSION + "/create_docker",
            data: payload,
            headers: {"X-CSRFToken": csrfToken}
        }).success(function (data) {
            if (data.code != 1001) {
                $scope.errorMessage = data.message;
                alert($scope.errorMessage);
            } else {
                $scope.alertTag = 'success';
                $scope.errorMessage = data.message;
                alert($scope.errorMessage);
                $window.location.reload();

            }
        }).error(function () {
            $scope.errorMessage = "Create a docker failed.";
            alert($scope.errorMessage);
            return false;
        });

    }
});
