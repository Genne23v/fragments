POST http://localhost:8080/v1/fragments
Content-Type: image/png
[BasicAuth]
test1@test.com: Test123$
file,image-tester.png;

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.size" == 59547

[Captures]
url: header "Location"

GET {{url}}.jpg
[BasicAuth]
test1@test.com: Test123$

HTTP/1.1 200
Content-Type: image/jpeg
Content-Length: 29645

GET {{url}}.webp
[BasicAuth]
test1@test.com:Test123$

HTTP/1.1 200
Content-Type: image/webp
Content-Length: 23972

GET {{url}}.gif
[BasicAuth]
test1@test.com:Test123$

HTTP/1.1 200
Content-Type: image/gif
Content-Length: 67932

GET {{url}}.svg
[BasicAuth]
test1@test.com:Test123$

HTTP/1.1 404
