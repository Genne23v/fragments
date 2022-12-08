POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
test1@test.com: Test123$
{
  "name": "test",
  "description": "json tester"
}

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.size" == 52

[Captures]
url: header "Location"

GET {{url}}.txt
[BasicAuth]
test1@test.com: Test123$

HTTP/1.1 200
Content-Type: text/plain
Content-Length: 52
[Asserts]
jsonpath "$.name" == "test"
jsonpath "$.description" == "json tester"

GET {{url}}.md
[BasicAuth]
test1@test.com:Test123$

HTTP/1.1 404
