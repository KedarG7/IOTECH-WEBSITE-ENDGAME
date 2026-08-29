import re

filepath = 'src/app/events/[slug]/EventDetailsClient.jsx'

with open(filepath, 'r') as f:
    content = f.read()

# Replace any .add({ targets: ... }) 
content = re.sub(r'\.add\(\s*\{\s*targets:\s*([^,]+),', r'.add(\1, {', content)
# We also have tl.add({ targets: ... })
content = re.sub(r'tl\.add\(\s*\{\s*targets:\s*([^,]+),', r'tl.add(\1, {', content)

with open(filepath, 'w') as f:
    f.write(content)

