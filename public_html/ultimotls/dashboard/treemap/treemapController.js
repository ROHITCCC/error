/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var treemapControllerModule = angular.module('treemapControllerModule', ['ultimotls', 'treemapControllerModule', 'auditControllerModule', 'ngRoute']);

treemapControllerModule.controller('treemapController', ['$scope', '$location', 'mongoAggregateService', 'treemapSaver', 'auditQuery',
    function($scope, $location, mongoAggregateService, treemapSaver, auditQuery){
    $scope.toDate=null; $scope.fromDate=null;
    $scope.timeOptions = [{"time":.25, "description":"15 minutes"},{"time":.5, "description":"30 minutes"},
                         {"time":1,"description":"1 hour"},{"time":24, "description":"24 hours"},
                         {"time":48,"description":"48 hours"}];
   $scope.timeSelected = $scope.timeOptions[2];
    $scope.treemapSaver = treemapSaver;
    if(!$scope.toDate){
        var currentDateTime = new Date();
        if(typeof $scope.treemapSaver.slideVal !== 'undefined'){ //checks whether or not the slider value holder in the service exists yet
            for(var i =0; i< $scope.timeOptions.length; i++){
                if ($scope.treemapSaver.slideVal === $scope.timeOptions[i].time){
                    $scope.timeSelected = $scope.timeOptions[i]; 
                }
            }  
            $scope.fromDate = new Date(currentDateTime - ($scope.treemapSaver.slideVal*60*60*1000)).toISOString();  //changes the time accordingly
        }
        else{
            $scope.fromDate = new Date(currentDateTime - 7200000).toISOString(); //Current minus 2 hours           
        }
        $scope.toDate = new Date(currentDateTime).toISOString();
    }
    var dataQuery = "[ { '$match': { '$and': [ { 'timestamp': { '$gte': " +
            "{'$date': '"+$scope.fromDate+"'}, '$lt': {'$date': '"+ $scope.toDate +"'} } }, { '$and': [ {'severity': {'$ne': null}}, {'severity': {'$exists': true, '$ne': ''}} ] } ] } },{ '$group': { '_id' : { 'interface1': '$interface1', 'application': '$application' }, 'count': {'$sum': 1} } } , { '$group': { '_id' : { 'application': '$_id.application' }, 'data': { '$addToSet':{ 'name': '$_id.interface1', 'size': '$count' } } } } , { '$project': { '_id': 1, 'name': '$_id.application', 'children': '$data' } } ]";
    $scope.sliderDatePromise = mongoAggregateService.callHttp(dataQuery);
    
    //date slider Config
    
    $scope.fromDateChange = function(){
        var currentDateTime = new Date();
        $scope.fromDate = new Date(currentDateTime - ($scope.timeSelected.time*60*60*1000)).toISOString();
        $scope.toDate = new Date(currentDateTime).toISOString(); 
            
            var sliderDataQuery = "[ { '$match': { '$and': [ { 'timestamp': { '$gte': " +
                    "{'$date': '"+$scope.fromDate+"'}, '$lt': {'$date': '"+ $scope.toDate +"'} } }, { '$and': [ {'severity': {'$ne': null}}, {'severity': {'$exists': true, '$ne': ''}} ] } ] } },{ '$group': { '_id' : { 'interface1': '$interface1', 'application': '$application' }, 'count': {'$sum': 1} } } , { '$group': { '_id' : { 'application': '$_id.application' }, 'data': { '$addToSet':{ 'name': '$_id.interface1', 'size': '$count' } } } } , { '$project': { '_id': 1, 'name': '$_id.application', 'children': '$data' } } ]";
            
            $scope.sliderDatePromise = mongoAggregateService.callHttp(sliderDataQuery);
            $scope.treemapSaver.slideVal = $scope.timeSelected.time; //Saves TimeSelected when drop down value changes
    };
    $scope.replaceGraph = function(divID, newData, element, newGraph){
        var elementExists = document.getElementById("treemapZoom");
        //edit.removeChild(edit.childNodes[0]);
        newGraph(newData,element, "true");
    };
    $scope.getAuditsForInterface = function(interface){
        console.log("here");
        var keys = interface.split('.');
        var interfaceQuery = '{"application":"'+keys[0]+'","interface1":"'+keys[1]+'","timestamp":{"$gte":{"$date":"'+$scope.fromDate+'"},"$lt":{"$date":"'+$scope.toDate+'"}},"$and":[{"severity":{"$ne":"null"}},{"severity":{"$exists":"true","$ne":""}}]}';

        auditQuery.query(interfaceQuery);
        $scope.$apply($location.path("/audits"));
        
    };
    }]);