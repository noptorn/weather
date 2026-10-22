from __future__ import annotations

import argparse
from email import policy
from email.parser import BytesParser
from html.parser import HTMLParser
from pathlib import Path


class TextExtractor(HTMLParser):
    BLOCK_TAGS = {
        "article", "aside", "br", "div", "footer", "h1", "h2", "h3", "h4",
        "h5", "h6", "header", "li", "main", "nav", "p", "section", "table",
        "td", "th", "tr", "ul", "ol",
    }

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.hidden_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "noscript", "svg"}:
            self.hidden_depth += 1
        elif not self.hidden_depth and tag in self.BLOCK_TAGS:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript", "svg"} and self.hidden_depth:
            self.hidden_depth -= 1
        elif not self.hidden_depth and tag in self.BLOCK_TAGS:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self.hidden_depth:
            self.parts.append(data)


def extract(path: Path) -> str:
    message = BytesParser(policy=policy.default).parsebytes(path.read_bytes())
    html = ""
    for part in message.walk():
        if part.get_content_type() == "text/html":
            html = part.get_content()
            break
    if not html:
        raise ValueError(f"No text/html MIME part in {path}")
    parser = TextExtractor()
    parser.feed(html)
    lines = []
    for raw in "".join(parser.parts).splitlines():
        line = " ".join(raw.replace("\xa0", " ").split())
        if line and (not lines or line != lines[-1]):
            lines.append(line)
    return "\n".join(lines) + "\n"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("source", type=Path)
    ap.add_argument("destination", type=Path)
    args = ap.parse_args()
    args.destination.write_text(extract(args.source), encoding="utf-8")


if __name__ == "__main__":
    main()
