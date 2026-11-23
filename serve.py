#!/usr/bin/env python3
"""Local preview with the same extensionless addresses as GitHub Pages: /about serves about.html.
Usage: python3 serve.py [port]   (default 8000)"""
import http.server, os, sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):  # always fetch fresh files, so a phone or browser never shows an old copy while you edit
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def translate_path(self, path):
        p = super().translate_path(path)
        return p + ".html" if not os.path.exists(p) and os.path.exists(p + ".html") else p

if __name__ == "__main__":
    http.server.test(HandlerClass=Handler, port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)
