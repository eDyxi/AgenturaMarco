#!/usr/bin/env python3
"""Stáhne fotky/videa ze starého webu agenturamarco.cz, zkomprimuje a uloží do assets/.
Zdroje = seznam stránek v scripts/sources.txt (jedna URL na řádek, # = komentář).
Obrázky -> WebP max 1200px q80; videa -> mp4 960px CRF 28 (ffmpeg)."""
import os, re, sys, hashlib, subprocess, urllib.request
from urllib.parse import urljoin
from io import BytesIO
from PIL import Image

UA = {"User-Agent": "Mozilla/5.0 (asset-mirror)"}
OUT = "assets/mirror"
os.makedirs(OUT, exist_ok=True)

def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    return urllib.request.urlopen(req, timeout=30).read()

def slug(url):
    name = url.rstrip("/").split("/")[-1]
    name = re.sub(r"[^a-zA-Z0-9._-]", "_", name)
    return name or hashlib.md5(url.encode()).hexdigest()[:10]

pages = [l.strip() for l in open("scripts/sources.txt")
         if l.strip() and not l.startswith("#")]
media = set()
for p in pages:
    try:
        html = fetch(p).decode("utf-8", "ignore")
    except Exception as e:
        print("PAGE FAIL", p, e); continue
    for m in re.findall(r'(?:src|href)=["\']([^"\']+?\.(?:jpe?g|png|gif|webp|mp4|mov))["\']', html, re.I):
        media.add(urljoin(p, m))

print(f"{len(media)} media URLs")
for url in sorted(media):
    if "admin/" in url or "hlaska-error" in url:
        continue
    base = slug(url); low = url.lower()
    try:
        data = fetch(url)
    except Exception as e:
        print("DL FAIL", url, e); continue
    if low.endswith((".mp4", ".mov")):
        tmp = f"/tmp/{base}"
        open(tmp, "wb").write(data)
        out = os.path.join(OUT, os.path.splitext(base)[0] + ".mp4")
        subprocess.run(["ffmpeg", "-y", "-i", tmp, "-vf",
                        "scale='min(960,iw)':-2", "-c:v", "libx264", "-crf", "28",
                        "-preset", "slow", "-c:a", "aac", "-b:a", "96k",
                        "-movflags", "+faststart", out], check=False)
    else:
        try:
            img = Image.open(BytesIO(data)).convert("RGB")
        except Exception as e:
            print("IMG FAIL", url, e); continue
        img.thumbnail((1200, 1200))
        out = os.path.join(OUT, os.path.splitext(base)[0] + ".webp")
        img.save(out, "WEBP", quality=80)
    print("OK", out, os.path.getsize(out)//1024, "kB")
