#!/usr/bin/env python3
"""Project6 localhost recording proxy.

Why: browser screen/region capture requires a secure context. localhost is treated as secure,
even over plain HTTP. This script proxies the existing Project6 server through 127.0.0.1
without changing the server, DNS, Cloudflare or certificates.

Usage:
  python tools/project6-recording-localhost.py
Then open:
  http://127.0.0.1:28444/presentations/harness-engineering/full-video.html?v=42
"""
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import sys

UPSTREAM = 'http://186.244.245.177:28443'
HOST = '127.0.0.1'
PORT = 28444

HOP_BY_HOP = {
    'connection','keep-alive','proxy-authenticate','proxy-authorization','te','trailers',
    'transfer-encoding','upgrade','content-encoding','content-length'
}

class Proxy(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def _proxy(self):
        target = UPSTREAM + self.path
        body = None
        if self.command in ('POST','PUT','PATCH'):
            n = int(self.headers.get('Content-Length','0') or 0)
            body = self.rfile.read(n) if n else None
        headers = {k:v for k,v in self.headers.items() if k.lower() not in HOP_BY_HOP and k.lower() != 'host'}
        headers['User-Agent'] = headers.get('User-Agent','Project6-Local-Recorder/1.0')
        try:
            req = Request(target, data=body, headers=headers, method=self.command)
            with urlopen(req, timeout=30) as resp:
                data = resp.read()
                self.send_response(resp.status)
                for k,v in resp.headers.items():
                    if k.lower() in HOP_BY_HOP: continue
                    self.send_header(k,v)
                self.send_header('Content-Length', str(len(data)))
                self.send_header('Cache-Control','no-store')
                self.end_headers()
                if self.command != 'HEAD': self.wfile.write(data)
        except HTTPError as e:
            data = e.read()
            self.send_response(e.code)
            self.send_header('Content-Type', e.headers.get('Content-Type','text/plain; charset=utf-8'))
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            if self.command != 'HEAD': self.wfile.write(data)
        except URLError as e:
            data = ('Project6 upstream unavailable: %s' % e).encode('utf-8')
            self.send_response(502)
            self.send_header('Content-Type','text/plain; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)

    do_GET = _proxy
    do_HEAD = _proxy
    do_POST = _proxy
    do_PUT = _proxy
    do_PATCH = _proxy
    do_DELETE = _proxy

    def log_message(self, fmt, *args):
        sys.stdout.write('[Project6 localhost] ' + (fmt % args) + '\n')

if __name__ == '__main__':
    print('Project6 1080P localhost recorder bridge')
    print('Upstream:', UPSTREAM)
    print('Open: http://127.0.0.1:%d/presentations/harness-engineering/full-video.html?v=42' % PORT)
    print('Keep this window open while recording. Ctrl+C to stop.')
    ThreadingHTTPServer((HOST, PORT), Proxy).serve_forever()
