#!/usr/bin/env python3
"""Local preview with the same extensionless addresses as GitHub Pages: /about serves about.html.
Usage: python3 serve.py [port]   (default 8000)"""
import http.server, os, sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        return p + ".html" if not os.path.exists(p) and os.path.exists(p + ".html") else p

if __name__ == "__main__":
    http.server.test(HandlerClass=Handler, port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)
