var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        
        var pathname = url.parse(request.url).pathname;
        var postData = "";
        console.log("Request for " + pathname + " received.");
        
        request.setEncoding("utf8");
        
        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
            console.log("Received POST data chunk '" + postDataChunk + "'.");
        });
        
        if(url.parse(request.url).query != null)
        {
            postData = url.parse(request.url).query;
            console.log(postData);
        }
        
        request.addListener("end", function() {
            console.log("end");
            route(handle, pathname, response, postData);
        });
    }
    
    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;