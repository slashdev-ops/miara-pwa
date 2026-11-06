"""Generuje logo aplikacji Miara w SVG do katalogu brand/ (znak, logotyp, wersja ciemna, ikona, favicon).
Uruchom z katalogu repozytorium: python3 tools/make_logo.py"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "brand"
GREEN, AMBER, BLUE = "#2B6A55", "#C08A2E", "#5563B0"
INK, INK_DARK, BG_DARK = "#16231C", "#E4EDE8", "#0F1613"
SW = 10  # grubość kreski: wspólna dla pierścienia i liter


def arc(cx, cy, r, a0, a1):
    """Łuk zgodnie z ruchem wskazówek zegara, kąty w stopniach (0 = góra)."""
    def pt(a):
        t = math.radians(a - 90)
        return cx + r * math.cos(t), cy + r * math.sin(t)
    x0, y0 = pt(a0)
    x1, y1 = pt(a1)
    large = 1 if (a1 - a0) % 360 > 180 else 0
    return f"M{x0:.2f} {y0:.2f}A{r} {r} 0 {large} 1 {x1:.2f} {y1:.2f}"


def mark(colors, trend, cx=50, cy=50, r=38, sw=SW):
    """Talerz: 1/2 warzywa, 1/4 białko, 1/4 węglowodany; w środku trend zakończony punktem."""
    gap = 11  # połowa przerwy między segmentami w stopniach (miejsce na zaokrąglone końce)
    segs = [(0, 180, colors[0]), (180, 270, colors[1]), (270, 360, colors[2])]
    parts = [f'<path d="{arc(cx, cy, r, a0 + gap, a1 - gap)}" stroke="{c}"/>' for a0, a1, c in segs]
    k = r / 38  # trend skaluje się razem z pierścieniem
    pts = [(-19, 10), (-7, 0), (2, 6), (10, -4)]
    d = "M" + "L".join(f"{cx + x * k:.2f} {cy + y * k:.2f}" for x, y in pts)
    parts.append(f'<path d="{d}" stroke="{trend}" stroke-width="{sw * k:.2f}"/>')
    parts.append(f'<circle cx="{cx + 19 * k:.2f}" cy="{cy - 14 * k:.2f}" r="{6.5 * k:.2f}" fill="{trend}" stroke="none"/>')
    return "".join(parts)


def word(color):
    """Litery „miara” jako ścieżki: wysokość x 44, linia bazowa 74."""
    m = "M129 69V47A12 12 0 0 1 153 47V69M153 47A12 12 0 0 1 177 47V69"
    i = "M199 69V40"
    a1 = "M244 35A17 17 0 1 0 244 69A17 17 0 1 0 244 35ZM261 35V69"
    r = "M283 69V48Q283 35 301 35"
    a2 = "M342 35A17 17 0 1 0 342 69A17 17 0 1 0 342 35ZM359 35V69"
    return (f'<path d="{m}{i}{a1}{r}{a2}" stroke="{color}"/>'
            f'<circle cx="199" cy="21" r="6" fill="{color}" stroke="none"/>')


def svg(view, body, title, bg=None, sw=SW, rx=None):
    corner = f' rx="{rx}"' if rx else ""
    rect = f'<rect width="100%" height="100%"{corner} fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" role="img" aria-labelledby="t">'
            f'<title id="t">{title}</title>{rect}'
            f'<g fill="none" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">{body}</g></svg>\n')


# Ikona i favicon pokazują znak z logo w jego kolorach na białym kafelku: tak samo na ekranie początkowym,
# w karcie przeglądarki i w logo; biały kafel jest widoczny także na ciemnym pasku kart.
ICON_BG = "#FFFFFF"
FAV_SW = 12  # grubsza kreska, żeby znak był czytelny w 16-32 px


files = {
    "miara-favicon.svg": svg("0 0 100 100", mark((GREEN, AMBER, BLUE), INK, r=33, sw=FAV_SW), "Miara", ICON_BG, sw=FAV_SW, rx=22),
    "miara-logo.svg": svg("0 0 370 100", mark((GREEN, AMBER, BLUE), INK) + word(INK), "Miara"),
    "miara-logo-ciemne.svg": svg("0 0 370 100", mark(("#62B597", "#E2AE55", "#93A0EE"), INK_DARK) + word(INK_DARK), "Miara", BG_DARK),
    "miara-znak.svg": svg("0 0 100 100", mark((GREEN, AMBER, BLUE), INK), "Miara"),
    "miara-ikona.svg": svg("0 0 100 100", mark((GREEN, AMBER, BLUE), INK, r=33, sw=FAV_SW), "Miara", ICON_BG, sw=FAV_SW),  # = favicon bez zaokrąglenia
}
for name, content in files.items():
    (OUT / name).write_text(content, encoding="utf-8", newline="\n")  # LF także na Windows
    print(name, len(content.encode()), "B")
