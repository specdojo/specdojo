import re

with open('docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml', 'r') as f:
    content = f.read()

# Add to inputs
inputs_addition = """
  changed_only:
    type: boolean
    default: false
  ungraded:
    type: boolean
    default: false
  incomplete:
    type: boolean
    default: false"""
content = re.sub(r'(\s+unreviewed:\n\s+type: boolean\n\s+default: false)', r'\1' + inputs_addition, content)

# Modify precondition
old_precondition = """      selection=$(
        if [ "{{inputs.dependency_changed}}" = "false" ] && [ "{{inputs.rulebook_changed}}" = "false" ] && [ "{{inputs.unreviewed}}" = "false" ]; then
          {{specdojo}} grade list --target deliverable --project {{project_id}}
        else
          if [ "{{inputs.dependency_changed}}" = "true" ]; then
            {{specdojo}} grade list --target deliverable --project {{project_id}} --dependency-changed || exit $?
          fi
          if [ "{{inputs.rulebook_changed}}" = "true" ]; then
            {{specdojo}} grade list --target deliverable --project {{project_id}} --rulebook-changed || exit $?
          fi
          if [ "{{inputs.unreviewed}}" = "true" ]; then
            {{specdojo}} grade list --target deliverable --project {{project_id}} --unreviewed || exit $?
          fi
        fi
      )"""
new_precondition = """      selection=$(
        if [ "{{inputs.dependency_changed}}" = "false" ] && [ "{{inputs.rulebook_changed}}" = "false" ] && [ "{{inputs.unreviewed}}" = "false" ] && [ "{{inputs.changed_only}}" = "false" ] && [ "{{inputs.ungraded}}" = "false" ] && [ "{{inputs.incomplete}}" = "false" ]; then
          {{specdojo}} grade list --target deliverable --project {{project_id}}
        else
          if [ "{{inputs.dependency_changed}}" = "true" ]; then
            {{specdojo}} grade list --target deliverable --project {{project_id}} --dependency-changed || exit $?
          fi
          if [ "{{inputs.rulebook_changed}}" = "true" ]; then
            {{specdojo}} grade list --target deliverable --project {{project_id}} --rulebook-changed || exit $?
          fi
          if [ "{{inputs.unreviewed}}" = "true" ]; then
            {{specdojo}} grade list --target deliverable --project {{project_id}} --unreviewed || exit $?
          fi
          if [ "{{inputs.changed_only}}" = "true" ]; then
            {{specdojo}} grade list --target deliverable --project {{project_id}} --changed-only || exit $?
          fi
          if [ "{{inputs.ungraded}}" = "true" ]; then
            {{specdojo}} grade list --target deliverable --project {{project_id}} --ungraded || exit $?
          fi
          if [ "{{inputs.incomplete}}" = "true" ]; then
            {{specdojo}} grade list --target deliverable --project {{project_id}} --incomplete || exit $?
          fi
        fi
      )"""
content = content.replace(old_precondition, new_precondition)

# Modify command
old_command = """    if tools/grade/run-per-document.sh --run-id {{job_run_id}} --stages 1 --target deliverable --limit {{inputs.limit}} --dependency-changed={{inputs.dependency_changed}} --rulebook-changed={{inputs.rulebook_changed}} --unreviewed={{inputs.unreviewed}}; then"""
new_command = """    if tools/grade/run-per-document.sh --run-id {{job_run_id}} --stages 1 --target deliverable --limit {{inputs.limit}} --dependency-changed={{inputs.dependency_changed}} --rulebook-changed={{inputs.rulebook_changed}} --unreviewed={{inputs.unreviewed}} --changed-only={{inputs.changed_only}} --ungraded={{inputs.ungraded}} --incomplete={{inputs.incomplete}}; then"""
content = content.replace(old_command, new_command)

# Modify idempotency_key
old_key = """idempotency_key: "{{job_id}}:command-v5:{{scheduled_at}}:{{inputs.limit}}:{{inputs.dependency_changed}}:{{inputs.rulebook_changed}}:{{inputs.unreviewed}}"""
new_key = """idempotency_key: "{{job_id}}:command-v6:{{scheduled_at}}:{{inputs.limit}}:{{inputs.dependency_changed}}:{{inputs.rulebook_changed}}:{{inputs.unreviewed}}:{{inputs.changed_only}}:{{inputs.ungraded}}:{{inputs.incomplete}}"""
content = content.replace(old_key + '"', new_key + '"')

with open('docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml', 'w') as f:
    f.write(content)
