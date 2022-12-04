POST http://localhost:8080/v1/fragments
Content-Type: text/html
[BasicAuth]
test1@test.com: Test123$
```<h1>Fragment</h1>```

HTTP/* 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.size" == 17

[Captures]
fragment_url: header "Location"

PUT {{fragment_url}}
Content-Type: text/html
[BasicAuth]
test1@test.com: Test123$
```<h1>Updated fragment</h1>```

HTTP/* 200
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.size" == 25

GET {{fragment_url}}
[BasicAuth]
test1@test.com: Test123$

HTTP/* 200
Content-Type: text/html; charset=utf-8
[Asserts]
body == "<h1>Updated fragment</h1>"