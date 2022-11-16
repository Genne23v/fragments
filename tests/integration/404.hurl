
GET http://localhost:8080/invalid-route

HTTP/1.1 404

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code.code" == 404
jsonpath "$.error.code.message" == "Not Found"
