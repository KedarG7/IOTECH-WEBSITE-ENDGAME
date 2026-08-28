import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    
    # 1. Update imports
    content = re.sub(
        r'import anime from ["\']animejs["\'];?',
        'import { animate, createTimeline, stagger, utils } from "animejs";',
        content
    )
    
    # Hero section already had correct import but wait, it used stagger without anime.
    # Let's just blindly add what's missing if needed, or if it already imports animate, we skip.
    
    # 2. Update timeline
    content = content.replace('anime.timeline(', 'createTimeline(')
    
    # 3. Update stagger
    content = content.replace('anime.stagger(', 'stagger(')
    
    # 4. Update set
    content = content.replace('anime.set(', 'utils.set(')

    # 5. Fix anime({ targets: X, ... }) -> animate(X, { ... })
    # This requires a bit of regex. We look for `anime({`
    def replace_anime_call(match):
        inner_content = match.group(1)
        # Find targets
        target_match = re.search(r'targets:\s*([^,]+?)(?:,\s*|\n\s*)', inner_content)
        if target_match:
            target_val = target_match.group(1)
            # Remove targets from inner_content
            new_inner = inner_content[:target_match.start()] + inner_content[target_match.end():]
            return f'animate({target_val}, {{{new_inner}'
        return match.group(0) # If we can't find targets, don't change

    # We need to match up to the end of anime({ but it's hard with regex to balance braces.
    # Instead, we'll just match `anime({\s*targets:\s*[^,]+,` and rewrite it.
    def rewrite_anime(m):
        target = m.group(1)
        # return f"animate({target}, {{"
        # Actually it's better to just remove the targets part and put it as first arg.
        return f"animate({target}, {{"
        
    content = re.sub(r'anime\(\s*\{\s*targets:\s*([^,]+),', r'animate(\1, {', content)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

