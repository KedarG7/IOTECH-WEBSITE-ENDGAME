import re

with open('src/lib/animations.js', 'r') as f:
    content = f.read()

content = content.replace('import { animate } from "animejs";', 'import { animate, utils, stagger } from "animejs";')
content = content.replace('animate.set(', 'utils.set(')
content = content.replace('animate.stagger(', 'stagger(')

# Change animate({ targets: x, ... }) to animate(x, { ... })
def replace_animate(match):
    targets = match.group(1)
    rest = match.group(2)
    return f"animate({targets}, {{{rest}}});"

# Simple replacement for specific patterns
content = re.sub(r'animate\(\{\s*targets:\s*([^,]+),\s*(.+?)\s*\}\);', replace_animate, content, flags=re.DOTALL)

with open('src/lib/animations.js', 'w') as f:
    f.write(content)
