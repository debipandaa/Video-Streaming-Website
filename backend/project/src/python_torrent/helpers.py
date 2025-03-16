import datetime
import gzip
import html
import io
import os
import re
import socket
import socks
import ssl
import sys
import tempfile
import urllib.error
import urllib.request
from collections.abc import Mapping
from typing import Any, Optional


def getBrowserUserAgent() -> str:
    """ Disguise as browser to circumvent website blocking """

    # Firefox release calendar
    # https://whattrainisitnow.com/calendar/
    # https://wiki.mozilla.org/index.php?title=Release_Management/Calendar&redirect=no

    baseDate = datetime.date(2024, 4, 16)
    baseVersion = 125

    nowDate = datetime.date.today()
    nowVersion = baseVersion + ((nowDate - baseDate).days // 30)

    return f"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:{nowVersion}.0) Gecko/20100101 Firefox/{nowVersion}.0"


headers: dict[str, Any] = {'User-Agent': getBrowserUserAgent()}

# SOCKS5 Proxy support
if "sock_proxy" in os.environ and len(os.environ["sock_proxy"].strip()) > 0:
    proxy_str = os.environ["sock_proxy"].strip()
    m = re.match(r"^(?:(?P<username>[^:]+):(?P<password>[^@]+)@)?(?P<host>[^:]+):(?P<port>\w+)$",
                 proxy_str)
    if m is not None:
        socks.setdefaultproxy(socks.PROXY_TYPE_SOCKS5, m.group('host'),
                              int(m.group('port')), True, m.group('username'), m.group('password'))
        socket.socket = socks.socksocket  # type: ignore[misc]


# This is only provided for backward compatibility, new code should not use it
htmlentitydecode = html.unescape


def retrieve_url(url: str, custom_headers: Mapping[str, Any] = {}, request_data: Optional[Any] = None, ssl_context: Optional[ssl.SSLContext] = None, unescape_html_entities: bool = True) -> str:
    """ Return the content of the url page as a string """

    request = urllib.request.Request(url, request_data, {**headers, **custom_headers})
    try:
        response = urllib.request.urlopen(request, context=ssl_context)
    except urllib.error.URLError as errno:
        print(f"Connection error: {errno.reason}", file=sys.stderr)
        return ""
    data: bytes = response.read()

    # Check if it is gzipped
    if data[:2] == b'\x1f\x8b':
        # Data is gzip encoded, decode it
        with io.BytesIO(data) as compressedStream, gzip.GzipFile(fileobj=compressedStream) as gzipper:
            data = gzipper.read()

    charset = 'utf-8'
    try:
        charset = response.getheader('Content-Type', '').split('charset=', 1)[1]
    except IndexError:
        pass

    dataStr = data.decode(charset, 'replace')

    if unescape_html_entities:
        dataStr = html.unescape(dataStr)

    return dataStr


def download_file(url: str, referer: Optional[str] = None, ssl_context: Optional[ssl.SSLContext] = None) -> str:
    """ Download file at url and write it to a file, return the path to the file and the url """

    # Download url
    request = urllib.request.Request(url, headers=headers)
    if referer is not None:
        request.add_header('referer', referer)
    response = urllib.request.urlopen(request, context=ssl_context)
    data = response.read()

    # Check if it is gzipped
    if data[:2] == b'\x1f\x8b':
        # Data is gzip encoded, decode it
        with io.BytesIO(data) as compressedStream, gzip.GzipFile(fileobj=compressedStream) as gzipper:
            data = gzipper.read()

    # Write it to a file
    fileHandle, path = tempfile.mkstemp()
    with os.fdopen(fileHandle, "wb") as file:
        file.write(data)

    # return file path
    return f"{path} {url}"