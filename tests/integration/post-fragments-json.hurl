POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
test1@test.com: Test123$
{
  "input": "./Sherlock Homes",
  "lang": "fr",
  "stylesheets": ["https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css",
    "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"],
  "This":"Blah",
  "output": "tmp"
}


HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.size" == 238

[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
test1@test.com: Test123$

HTTP/1.1 200
Content-Type: application/json
Content-Length: 238
[Asserts]
jsonpath "$.input" == "./Sherlock Homes"
jsonpath "$.lang" == "fr"
jsonpath "$.stylesheets[0]" == "https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css"
jsonpath "$.This" == "Blah"
jsonpath "$.output" == "tmp"