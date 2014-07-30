var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/leaveMessage"] = requestHandlers.leaveMessage;
handle["/adminLogin"] = requestHandlers.adminLogin;
handle["/deleteRecord"] = requestHandlers.deleteRecord;
handle["/layout.css"] = requestHandlers.layout;

server.start(router.route, handle);