import os
import urllib.parse as urlparse

def application(environ,start_response):
    url=environ["REQUEST_URI"]
    o=urlparse.urlparse(url)
    
    parameters=urlparse.parse_qs(o.query,keep_blank_values=True)
    if "operation" not in parameters:
        start_response("404 Not Found", [("Content-Type","text/html")])
        return ["Not Found".encode("utf-8")]
    if parameters["operation"][0] == "scan" and "path" in parameters:
        if "/" not in parameters["path"][0] and len(parameters["path"][0]) == 2 or len(parameters["path"][0]) == 3:
            try:
                with open("scenes/"+parameters["path"][0]) as f:
                    contents = f.read().strip()
                    start_response("200 OK", [("Content-Type","text/json")])
                    return [contents.encode("utf-8")]
            except FileNotFoundError:
                start_response("404 Not Found", [("Content-Type","text/html")])
                return ["Not Found".encode("utf-8")]
                

    if "data" not in parameters:
        parameters["data"]=""
    with open("asdf","w") as f:
        f.write(str(environ))
        f.write(str(parameters))
        f.write(parameters["operation"][0])

    start_response("502 Bad Request", [("Content-Type", "text/html")])

    return ["Bad Request".encode("utf-8")]
