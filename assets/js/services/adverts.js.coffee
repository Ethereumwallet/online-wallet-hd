angular.module("adverts", []).factory "Adverts", ($log, $rootScope, $http) -> 

  service = {
    ads: []
    didFetch: false
  }
  
  service.fetch = () ->
    test = true
          
  service.fetchOnce = () ->
    unless service.didFetch
      service.fetch()
      service.didFetch = true
      
  
  return service
  
  