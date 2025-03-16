import re
from datetime import datetime, timedelta
from html.parser import HTMLParser
from urllib.parse import quote
from helpers import retrieve_url
import sys




class limetorrents(object):
    url = "https://www.limetorrents.lol"
    name = "LimeTorrents"
    supported_categories = {'all': 'all',
                            'anime': 'anime',
                            'software': 'applications',
                            'games': 'games',
                            'movies': 'movies',
                            'music': 'music',
                            'tv': 'tv'}

    class MyHtmlParser(HTMLParser):
        """ Sub-class for parsing results """

        def error(self, message):
            pass

        A, TD, TR, HREF = ('a', 'td', 'tr', 'href')

        def __init__(self, url):
            HTMLParser.__init__(self)
            self.url = url
            self.current_item = {}  # dict for found item
            self.page_items = 0
            self.inside_table = False
            self.inside_tr = False
            self.column_index = -1
            self.column_name = None  # key's name in current_item dict
            self.columns = ["name", "pub_date", "size", "seeds", "leech"]
            self.found_magnet = False  # Flag to check if a magnet link is found

        def handle_starttag(self, tag, attrs):
            if self.found_magnet:  # Skip processing if magnet is found
                return

            params = dict(attrs)

            if params.get('class') == 'table2':
                self.inside_table = True
            elif not self.inside_table:
                return

            if tag == self.TR and (params.get('bgcolor') == '#F4F4F4' or params.get('bgcolor') == '#FFFFFF'):  # noqa
                self.inside_tr = True
                self.column_index = -1
                self.current_item = {"engine_url": self.url}
            elif not self.inside_tr:
                return

            if tag == self.TD:
                self.column_index += 1
                if self.column_index < len(self.columns):
                    self.column_name = self.columns[self.column_index]
                else:
                    self.column_name = None

            if self.column_name == "name" and tag == self.A and self.HREF in params:
                link = params["href"]
                if link.endswith(".html"):
                    try:
                        safe_link = quote(self.url + link, safe='/:')
                    except KeyError:
                        safe_link = self.url + link
                    self.current_item["desc_link"] = safe_link

        def handle_data(self, data):
            if self.found_magnet:  # Skip processing if magnet is found
                return

            if self.column_name:
                if self.column_name in ["size", "seeds", "leech"]:
                    data = data.replace(',', '')
                self.current_item[self.column_name] = data.strip()
                self.column_name = None

        def handle_endtag(self, tag):
            if self.found_magnet:  # Skip processing if magnet is found
                return

            if tag == 'table':
                self.inside_table = False

            if self.inside_tr and tag == self.TR:
                self.inside_tr = False
                self.column_name = None
                if "desc_link" in self.current_item:
                    # Print the descriptive link
                    # print(f"Torrent Name: {self.current_item.get('name', 'N/A')}")
                    # print(f"Desc Link: {self.current_item['desc_link']}")
                    try:
                        # Fetch magnet link
                        magnet_page = retrieve_url(self.current_item['desc_link'])
                        magnet_match = re.search(r"href\s*=\s*\"(magnet[^\"]+)\"", magnet_page)
                        if magnet_match and magnet_match.groups():
                            self.current_item["magnet"] = magnet_match.group(1)
                            print(f"Magnet Link: {self.current_item['magnet']}")
                            self.found_magnet = True  # Set flag to True once found
                            return  # Exit further processing
                        else:
                            print("Magnet Link: Not Found")
                    except Exception as e:
                        print(f"Error fetching magnet link: {e}")
                    print("-" * 40)

    def search(self, query, cat='all'):
        """ Performs search """
        query = query.replace("%20", "-")
        category = self.supported_categories[cat]

        page_url = f"{self.url}/search/{category}/{query}/seeds/1/"
        html = retrieve_url(page_url)
        parser = self.MyHtmlParser(self.url)
        parser.feed(html)
        parser.close()
        if parser.page_items < 20:  # Stop if fewer than 20 results on the page
            return


# Example usage
# Main logic for command-line arguments
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 search.py <search_query> [category]")
        sys.exit(1)

    search_query = sys.argv[1]
    category = sys.argv[2] if len(sys.argv) > 2 else 'all'

    torrent_site = limetorrents()
    torrent_site.search(search_query, category)
