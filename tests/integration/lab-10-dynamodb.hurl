POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
test1@test.com: Test123$
{
  "service": "DynamoDB"
}

HTTP/* 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.size" == 27

[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

GET {{fragment1_url}}/info
[BasicAuth]
test1@test.com: Test123$

HTTP/* 200
Content-Type: application/json; charset=utf-8
Content-Length: 259
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 27

POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
test1@test.com: Test123$
```**great**```

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
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

GET {{fragment2_url}}/info
[BasicAuth]
test1@test.com: Test123$

HTTP/* 200
Content-Type: application/json; charset=utf-8
Content-Length: 255
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 9


GET http://localhost:8080/v1/fragments?expand=false
[BasicAuth]
test1@test.com: Test123$

HTTP/* 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "ok"
body contains "{{fragment1_id}}"
body contains "{{fragment2_id}}"

DELETE {{fragment1_url}}
[BasicAuth]
test1@test.com: Test123$

HTTP/* 200

GET {{fragment1_url}}
[BasicAuth]
test1@test.com: Test123$

HTTP/* 404

GET http://localhost:8080/v1/fragments?expand=false
[BasicAuth]
test1@test.com: Test123$

HTTP/* 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments[0]" != "{{fragment1_id}}"
jsonpath "$.fragments[0]" == "{{fragment2_id}}"