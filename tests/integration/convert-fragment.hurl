POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
test1@test.com: Test123$
```# Heading```

HTTP/1.1 201 
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

GET {{url}}.html
[BasicAuth]
test1@test.com: Test123$

HTTP/1.1 200
Content-Type: text/html; charset=utf-8
Content-Length: 17
[Asserts]
body == "<h1>Heading</h1>\n"

GET {{url}}.txt
[BasicAuth]
test1@test.com: Test123$

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
Content-Length: 9
[Asserts]
body == "# Heading"

GET {{url}}.json
[BasicAuth]
test1@test.com: Test123$

HTTP/1.1 404