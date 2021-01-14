from http.server import BaseHTTPRequestHandler
from functions import *
import socketserver
import json

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

        print("GET {}".format(self.path))

        if self.path.startswith('/values'):
            response = generateValues()
            try:
                self.sendContent("success", response)
            except:
                self.sendContent("error", "Error during computation")
                print("Error during computation")

print("Listening...")
httpd = socketserver.TCPServer(("", 80), MyHandler)
httpd.serve_forever()
