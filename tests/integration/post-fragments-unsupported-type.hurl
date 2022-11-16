POST http://localhost:8080/v1/fragments
Content-Type: application/pdf
[BasicAuth]
test1@test.com: Test123$
```This is a fragment```


HTTP/1.1 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" == "Invalid content type"