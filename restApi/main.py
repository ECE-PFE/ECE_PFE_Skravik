from lib import socketserver
from lib.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json
import cgi
from functions import *
import numpy as np

def getParams(uri):
    if "?" in uri:
        param=uri.split("?")
        param=param[1]
        param=parse_qs(param)
        return param
    return {}

class MyHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        return #We overwrite this function to remove red log messages

    def sendContent(self, status, data):
        self.send_response(200 if (status == "success") else 400)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        content = json.dumps({'Status': status, "data": data})
        content =str.encode(content)
        self.wfile.write(content)

    def do_GET(self):
        if self.path == "/favicon.ico":
            return
        if self.path == "/":
            self.sendContent("success", {"msg":"Hello"})
            return

        print("GET {}".format(self.path))

        if self.path.startswith('/values'):
            self.params=getParams(self.path)
            values(self)

print("Listening...")
httpd = socketserver.TCPServer(("", 80), MyHandler)
httpd.serve_forever()
