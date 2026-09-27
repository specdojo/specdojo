import re

for filename in ['docs/ja/projects/prj-0001/routines/rtn-grade-recheck.yaml', 'docs/ja/projects/prj-0001/routines/rtn-grade-deliverable-recheck.yaml']:
    with open(filename, 'r') as f:
        content = f.read()
    
    # Check if they are already present
    if 'changed_only: "true"' not in content:
        content = re.sub(
            r'(\s+unreviewed: "true")',
            r'\1\n    changed_only: "true"\n    ungraded: "true"\n    incomplete: "true"',
            content
        )
        with open(filename, 'w') as f:
            f.write(content)

