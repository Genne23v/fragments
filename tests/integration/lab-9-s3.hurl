POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
test1@test.com: Test123$
```Hello S3!```

HTTP/* 201
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
test1@test.com: Test123$

HTTP/* 200
Content-Type: text/plain
[Asserts]
body == "Hello S3!"

DELETE {{url}}
[BasicAuth]
test1@test.com: Test123$

HTTP/* 200

GET {{url}}

HTTP/* 404