"""Renderuje ikony PNG z brand/miara-ikona.svg (wymaga: pip install playwright; playwright install chromium).
Uruchom z katalogu repozytorium: python3 tools/render_icons.py"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SRC = (ROOT / "brand" / "miara-ikona.svg").read_text(encoding="utf-8")
OUT = ROOT / "icons"
SIZES = {"apple-touch-icon.png": 180, "icon-192.png": 192, "icon-512.png": 512, "icon-512-maskable.png": 512}


def main() -> None:
    OUT.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, size in SIZES.items():
            page = browser.new_page(viewport={"width": size, "height": size}, device_scale_factor=1)
            page.set_content(f"<html><body style='margin:0'><div style='width:{size}px;height:{size}px'>{SRC}</div></body></html>")
            page.add_style_tag(content="svg{width:100%;height:100%;display:block}")
            page.screenshot(path=str(OUT / name), clip={"x": 0, "y": 0, "width": size, "height": size})
            page.close()
            print(name, size)
        browser.close()


if __name__ == "__main__":
    main()
