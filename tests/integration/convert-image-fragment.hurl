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

GET {{url}}
[BasicAuth]
test1@test.com: Test123$

HTTP/1.1 200
#file,image-tester.png;

GET {{url}}.jpg
[BasicAuth]
test1@test.com: Test123$

HTTP/1.1 200
Content-Type: image/jpeg; charset=utf-8
Content-Length: 54122

GET {{url}}.webp
[BasicAuth]
test1@test.com:Test123$

HTTP/1.1 200
Content-Type: image/webp; charset=utf-8
Content-Length: 43665

GET {{url}}.gif
[BasicAuth]
test1@test.com:Test123$

HTTP/1.1 200
Content-Type: image/gif; charset=utf-8
Content-Length: 117982

GET {{url}}.svg
[BasicAuth]
test1@test.com:Test123$

HTTP/1.1 404
