#!/usr/bin/python3

import feedparser

d = feedparser.parse('https://vkrishnapalepu.medium.com/feed')

titles = map(lambda x: f"{x.title},{x.link},{x.date}", d.entries)

for entry in d.entries:
    print(f"- date: '{entry.published}'")
    print(f"  link: '{entry.link}'")
    print(f"  title: '{entry.title}'")
    print()