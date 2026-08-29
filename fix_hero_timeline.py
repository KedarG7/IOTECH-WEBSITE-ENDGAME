import re

filepath = 'src/components/sections/HeroSection.jsx'

with open(filepath, 'r') as f:
    content = f.read()

# Replace tl.add({ targets: X, ... }) with tl.add(X, { ... })
def fix_tl_add(match):
    targets_match = re.search(r'targets:\s*([^,]+)(?:,\s*|\n\s*)', match.group(1))
    if targets_match:
        target_val = targets_match.group(1)
        new_inner = match.group(1)[:targets_match.start()] + match.group(1)[targets_match.end():]
        # Return .add(target_val, { new_inner
        return f'.add({target_val}, {{{new_inner}'
    return match.group(0)

# Replace any .add({ targets: ... }) 
content = re.sub(r'\.add\(\s*\{\s*targets:\s*([^,]+),', r'.add(\1, {', content)
# We also have tl.add({ targets: ... })
content = re.sub(r'tl\.add\(\s*\{\s*targets:\s*([^,]+),', r'tl.add(\1, {', content)

with open(filepath, 'w') as f:
    f.write(content)

