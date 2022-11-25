POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
test1@test.com: Test123$
```Hello S3!```

HTTP/* 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.size" == 9

[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
test1@test.com: Test123$

HTTP/* 200
Content-Type: text/plain; charset=utf-8
Content-Length: 9
[Asserts]
body == "Hello S3!"

DELETE {{url}}
[BasicAuth]
test1@test.com: Test123$

HTTP/* 200

GET {{url}}
[BasicAuth]
test1@test.com: Test123$

HTTP/* 404
