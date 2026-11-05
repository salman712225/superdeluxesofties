import urllib.request
import re

req = urllib.request.Request('https://superdeluxesofties.in/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        with open('scratch/live_site.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Saved live_site.html, length:', len(html))
        
        # Search for all sections
        sections = re.findall(r'<section[^>]*id=["\']([^"\']+)["\'][^>]*>', html)
        print('Sections found:', sections)
        
        # Look for menu section
        menu_match = re.search(r'(<section[^>]*id=["\']menu["\'][^>]*>.*?</section>)', html, re.DOTALL | re.IGNORECASE)
        if menu_match:
            print('\n=== FOUND #menu SECTION ===')
            content = menu_match.group(1)
            print('Length:', len(content))
            with open('scratch/live_menu_section.html', 'w', encoding='utf-8') as mf:
                mf.write(content)
            print(content[:3000])
        else:
            print('No #menu section found directly.')
except Exception as e:
    print('Error:', e)
