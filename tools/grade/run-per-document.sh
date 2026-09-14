#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: tools/grade/run-per-document.sh --run-id <id> [options]

Run the three-stage grade pipeline to completion for one document before moving
to the next document. Completed stages are persisted below --work-dir so the
same command resumes after an interruption. Incomplete pipelines are also
persisted below the project execution path so a later Job Run can retry them.

Options:
  --run-id <id>                 Stable id used for resume state (required)
  --project <id>                Project id (default: prj-0001)
  --target <target>             kata or deliverable (default: kata)
  --kind <kind>                 rulebook, recipe, sample, template, or all
                                (kata only; default: rulebook)
  --path <markdown>             Limit to one document (repeatable)
  --changed-only[=true|false]   Select documents changed since the latest grade
  --ungraded[=true|false]       Select documents without a stored grade
  --incomplete[=true|false]     Select retryable incomplete pipelines
  --max-stage-failures <count>  Stop retrying a stage after this many failures
                                (default: 3)
  --limit <count>               Process at most this many selected documents
  --work-dir <directory>        State and result directory
  --stage-1-executor <nickname> (default: gemma-expert-executor)
  --stage-1-reporter <nickname> (default: gemma-reporter)
  --stage-1-reference <path>    Comparison document. Kata defaults to the
                                same-kind prj-overview; deliverable defaults to none
  --stage-2-executor <nickname> (default: gemma-expert-executor)
  --stage-2-reporter <nickname> (default: gemma-reporter)
  --stage-2-reference <path|none> (default: none)
  --stage-3-executor <nickname> (default: codex-expert-executor)
  --stage-3-reporter <nickname> (default: gemma-reporter)
  --stage-3-reference <path|none> (default: none)
  --specdojo-bin <path>         Use one executable instead of npx tsx
  --dry-run                     Print selection and configuration only
  --help                        Show this help
USAGE
}

fail() {
  printf 'grade pipeline: %s\n' "$*" >&2
  exit 1
}

require_value() {
  [[ $# -ge 2 && -n "${2-}" ]] || fail "$1 requires a value"
}

validate_scalar() {
  local option=$1
  local value=$2
  [[ "$value" != *$'\n'* && "$value" != *$'\r'* && "$value" != *$'\t'* ]] ||
    fail "$option cannot contain tabs or newlines"
}

project=prj-0001
target=kata
kind=rulebook
run_id=
limit=0
work_dir=
dry_run=false
specdojo_bin=
changed_only=false
ungraded=false
incomplete=false
max_stage_failures=3
declare -a selected_paths=()
declare -a requested_paths=()
declare -a exhausted_paths=()

stage_1_executor=gemma-expert-executor
stage_1_reporter=gemma-reporter
stage_1_reference=
stage_1_reference_explicit=false
stage_2_executor=gemma-expert-executor
stage_2_reporter=gemma-reporter
stage_2_reference=none
stage_3_executor=codex-expert-executor
stage_3_reporter=gemma-reporter
stage_3_reference=none

while [[ $# -gt 0 ]]; do
  case "$1" in
    --run-id)
      require_value "$@"
      run_id=$2
      shift 2
      ;;
    --project)
      require_value "$@"
      project=$2
      shift 2
      ;;
    --target)
      require_value "$@"
      target=$2
      shift 2
      ;;
    --kind)
      require_value "$@"
      kind=$2
      shift 2
      ;;
    --path)
      require_value "$@"
      requested_paths+=("$2")
      shift 2
      ;;
    --changed-only)
      changed_only=true
      shift
      ;;
    --changed-only=*)
      changed_only=${1#*=}
      shift
      ;;
    --ungraded)
      ungraded=true
      shift
      ;;
    --ungraded=*)
      ungraded=${1#*=}
      shift
      ;;
    --incomplete)
      incomplete=true
      shift
      ;;
    --incomplete=*)
      incomplete=${1#*=}
      shift
      ;;
    --max-stage-failures)
      require_value "$@"
      max_stage_failures=$2
      shift 2
      ;;
    --limit)
      require_value "$@"
      limit=$2
      shift 2
      ;;
    --work-dir)
      require_value "$@"
      work_dir=$2
      shift 2
      ;;
    --stage-1-executor)
      require_value "$@"
      stage_1_executor=$2
      shift 2
      ;;
    --stage-1-reporter)
      require_value "$@"
      stage_1_reporter=$2
      shift 2
      ;;
    --stage-1-reference)
      require_value "$@"
      stage_1_reference=$2
      stage_1_reference_explicit=true
      shift 2
      ;;
    --stage-2-executor)
      require_value "$@"
      stage_2_executor=$2
      shift 2
      ;;
    --stage-2-reporter)
      require_value "$@"
      stage_2_reporter=$2
      shift 2
      ;;
    --stage-2-reference)
      require_value "$@"
      stage_2_reference=$2
      shift 2
      ;;
    --stage-3-executor)
      require_value "$@"
      stage_3_executor=$2
      shift 2
      ;;
    --stage-3-reporter)
      require_value "$@"
      stage_3_reporter=$2
      shift 2
      ;;
    --stage-3-reference)
      require_value "$@"
      stage_3_reference=$2
      shift 2
      ;;
    --specdojo-bin)
      require_value "$@"
      specdojo_bin=$2
      shift 2
      ;;
    --dry-run)
      dry_run=true
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      fail "unknown option: $1"
      ;;
  esac
done

[[ -n "$run_id" ]] || fail "--run-id is required"
[[ "$run_id" =~ ^[A-Za-z0-9._-]+$ ]] ||
  fail "--run-id must contain only letters, digits, dot, underscore, or hyphen"
[[ "$limit" =~ ^[0-9]+$ ]] || fail "--limit must be a non-negative integer"
[[ "$changed_only" == true || "$changed_only" == false ]] ||
  fail "--changed-only must be true or false"
[[ "$ungraded" == true || "$ungraded" == false ]] || fail "--ungraded must be true or false"
[[ "$incomplete" == true || "$incomplete" == false ]] || fail "--incomplete must be true or false"
[[ "$max_stage_failures" =~ ^[1-9][0-9]*$ ]] ||
  fail "--max-stage-failures must be a positive integer"
[[ "$target" == kata || "$target" == deliverable ]] ||
  fail "--target must be kata or deliverable"

declare -a target_roots=()
if [[ "$target" == kata ]]; then
  case "$kind" in
    rulebook) kind_directories=(rulebooks) ;;
    recipe) kind_directories=(recipes) ;;
    sample) kind_directories=(samples) ;;
    template) kind_directories=(templates) ;;
    all) kind_directories=(rulebooks recipes samples templates) ;;
    *) fail "--kind must be rulebook, recipe, sample, template, or all" ;;
  esac

  for kind_directory in "${kind_directories[@]}"; do
    target_root="docs/ja/specdojo/$kind_directory"
    [[ -d "$target_root" ]] || fail "target directory not found: $target_root"
    target_roots+=("$target_root")
  done

  if [[ "$kind" != all ]]; then
    stage_1_reference_root=${target_roots[0]}
  fi
  if ! $stage_1_reference_explicit; then
    if [[ "$kind" == all ]]; then
      stage_1_reference=per-kind
    else
      stage_1_reference_root=${target_roots[0]}
      stage_1_reference="$stage_1_reference_root/prj-overview-$kind.md"
      if [[ ! -f "$stage_1_reference" ]]; then
        printf 'grade pipeline: default stage 1 reference not found for kind %s; continuing without a reference: %s\n' \
          "$kind" "$stage_1_reference" >&2
        stage_1_reference=none
      fi
    fi
  fi
else
  kind=none
  if ! $stage_1_reference_explicit; then
    stage_1_reference=none
  fi
fi

for option_and_value in \
  "--project:$project" \
  "--target:$target" \
  "--run-id:$run_id" \
  "--stage-1-executor:$stage_1_executor" \
  "--stage-1-reporter:$stage_1_reporter" \
  "--stage-1-reference:$stage_1_reference" \
  "--stage-2-executor:$stage_2_executor" \
  "--stage-2-reporter:$stage_2_reporter" \
  "--stage-2-reference:$stage_2_reference" \
  "--stage-3-executor:$stage_3_executor" \
  "--stage-3-reporter:$stage_3_reporter" \
  "--stage-3-reference:$stage_3_reference"; do
  validate_scalar "${option_and_value%%:*}" "${option_and_value#*:}"
done

if $stage_1_reference_explicit; then
  [[ "$target" != kata || "$kind" != all ]] ||
    fail "--stage-1-reference cannot be combined with --kind all"
  [[ "$stage_1_reference" != none ]] ||
    fail "--stage-1-reference cannot be none; omit the option to use the --kind default"
  [[ -f "$stage_1_reference" ]] || fail "reference not found: $stage_1_reference"
  if [[ "$target" == kata ]]; then
    case "$(basename "$stage_1_reference")" in
      prj-overview*.md) ;;
      *) fail "--stage-1-reference must be a prj-overview Markdown document" ;;
    esac
    stage_1_reference_directory=$(cd -- "$(dirname -- "$stage_1_reference")" && pwd -P)
    stage_1_reference_root_directory=$(cd -- "$stage_1_reference_root" && pwd -P)
    [[ "$stage_1_reference_directory" == "$stage_1_reference_root_directory" ]] ||
      fail "--stage-1-reference must be a $kind prj-overview document under $stage_1_reference_root"
  fi
fi

for reference in "$stage_1_reference" "$stage_2_reference" "$stage_3_reference"; do
  [[ "$reference" == none || "$reference" == per-kind || -f "$reference" ]] ||
    fail "reference not found: $reference"
done

if [[ -n "$specdojo_bin" ]]; then
  [[ -x "$specdojo_bin" ]] || fail "--specdojo-bin is not executable: $specdojo_bin"
  specdojo_command=("$specdojo_bin")
else
  specdojo_command=(npx tsx src/specdojo.ts)
fi

path_matches_target() {
  local path=$1
  local root
  [[ "$path" != */generated/* ]] || return 1
  if [[ "$target" == deliverable ]]; then
    [[ "$path" == *.md ]] && return 0
    return 1
  fi
  for root in "${target_roots[@]}"; do
    [[ "$path" == "$root"/*.md ]] && return 0
  done
  return 1
}

for path in "${requested_paths[@]}"; do
  validate_scalar "--path" "$path"
  [[ -f "$path" ]] || fail "target not found: $path"
  path_matches_target "$path" ||
    fail "target is outside the selected target scope or generated: $path"
done

# The run directory stays outside docs/ because `grade plan --out` writes a plan pair per
# stage and the plan id is derived from the graded document, not from the stage. Three stages
# therefore produce three files sharing one id, which makes `index build` fail on duplicate
# document ids. `grade plan --out` still refuses paths outside the repository, so logs/ is used.
if [[ -z "$work_dir" ]]; then
  work_dir="logs/grade/runs/per-document/$run_id"
fi
validate_scalar "--work-dir" "$work_dir"

select_documents() {
  local root
  local path
  local output
  local requested
  local requested_path
  local -a candidates=()
  local -a exhausted_candidates=()
  local -a limited_candidates=()
  local -A exhausted_set=()
  local -a list_command=(grade list --target "$target" --project "$project")
  for path in "${requested_paths[@]}"; do
    list_command+=(--path "$path")
  done

  if ! $changed_only && ! $ungraded && ! $incomplete && [[ ${#requested_paths[@]} -gt 0 ]]; then
    candidates=("${requested_paths[@]}")
  elif ! $changed_only && ! $ungraded && ! $incomplete && [[ "$target" == kata ]]; then
    if [[ ${#requested_paths[@]} -eq 0 ]]; then
      for root in "${target_roots[@]}"; do
        while IFS= read -r path; do
          [[ -n "$path" ]] && candidates+=("$path")
        done < <(find "$root" -type f -name '*.md' -not -path '*/generated/*' -print)
      done
    fi
  elif ! $changed_only && ! $ungraded && ! $incomplete; then
    output=$("${specdojo_command[@]}" "${list_command[@]}") || fail "grade list failed"
    while IFS= read -r path; do
      [[ -n "$path" ]] && candidates+=("$path")
    done <<<"$output"
  else
    if $changed_only; then
      output=$("${specdojo_command[@]}" "${list_command[@]}" --changed-only) ||
        fail "grade list --changed-only failed"
      while IFS= read -r path; do
        [[ -n "$path" ]] && candidates+=("$path")
      done <<<"$output"
    fi
    if $ungraded; then
      output=$("${specdojo_command[@]}" "${list_command[@]}" --ungraded) ||
        fail "grade list --ungraded failed"
      while IFS= read -r path; do
        [[ -n "$path" ]] && candidates+=("$path")
      done <<<"$output"
    fi
    if $incomplete; then
      output=$("${specdojo_command[@]}" "${list_command[@]}" --incomplete) ||
        fail "grade list --incomplete failed"
      while IFS= read -r path; do
        [[ -n "$path" ]] && candidates+=("$path")
      done <<<"$output"
    fi
  fi

  exhausted_paths=()
  if $incomplete; then
    output=$("${specdojo_command[@]}" grade state --target "$target" --project "$project" --exhausted) ||
      fail "grade state --exhausted failed"
    while IFS= read -r path; do
      [[ -n "$path" ]] && path_matches_target "$path" || continue
      if [[ ${#requested_paths[@]} -gt 0 ]]; then
        requested=false
        for requested_path in "${requested_paths[@]}"; do
          if [[ "$path" == "$requested_path" ]]; then
            requested=true
            break
          fi
        done
        $requested || continue
      fi
      exhausted_candidates+=("$path")
      exhausted_set["$path"]=1
    done <<<"$output"
  fi

  selected_paths=()
  while IFS= read -r path; do
    if [[ -n "$path" ]] && path_matches_target "$path"; then
      limited_candidates+=("$path")
    fi
  done < <(printf '%s\n' "${candidates[@]}" "${exhausted_candidates[@]}" | LC_ALL=C sort -u)
  if ((limit > 0 && ${#limited_candidates[@]} > limit)); then
    limited_candidates=("${limited_candidates[@]:0:limit}")
  fi
  for path in "${limited_candidates[@]}"; do
    if [[ -n "${exhausted_set[$path]-}" ]]; then
      exhausted_paths+=("$path")
    else
      selected_paths+=("$path")
    fi
  done
}

requested_signature=$(printf '%s\n' "${requested_paths[@]}" | node -e \
  'const c=require("node:crypto");let s="";process.stdin.on("data",d=>s+=d).on("end",()=>process.stdout.write(c.createHash("sha256").update(s).digest("hex")))')
expected_config=$(printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
  "$project" "$target" "$kind" "$limit" "$changed_only" "$ungraded" "$incomplete" \
  "$max_stage_failures" "$requested_signature" \
  "$stage_1_executor" "$stage_1_reporter" "$stage_1_reference" \
  "$stage_2_executor:$stage_2_reporter:$stage_2_reference" \
  "$stage_3_executor:$stage_3_reporter:$stage_3_reference" "selection-v3" "pipeline-v3")
config_file="$work_dir/config.tsv"
selection_file="$work_dir/selection.txt"
results_file="$work_dir/results.tsv"

if ! $dry_run; then
  mkdir -p "$work_dir/documents"
  if [[ -f "$config_file" ]]; then
    actual_config=$(<"$config_file")
    [[ "$actual_config" == "$expected_config" ]] ||
      fail "run configuration differs from saved state; use a new --run-id"
  else
    printf '%s' "$expected_config" >"$config_file"
  fi
fi

if ! $dry_run && [[ -f "$selection_file" ]]; then
  mapfile -t selected_paths <"$selection_file"
else
  select_documents
  if ! $dry_run; then
    if [[ ${#selected_paths[@]} -gt 0 ]]; then
      printf '%s\n' "${selected_paths[@]}" >"$selection_file"
    else
      : >"$selection_file"
    fi
  fi
fi

print_configuration() {
  printf 'run_id=%s project=%s target=%s kind=%s changed_only=%s ungraded=%s incomplete=%s max_stage_failures=%s documents=%s exhausted=%s work_dir=%s\n' \
    "$run_id" "$project" "$target" "$kind" "$changed_only" "$ungraded" "$incomplete" \
    "$max_stage_failures" \
    "${#selected_paths[@]}" "${#exhausted_paths[@]}" "$work_dir"
  printf 'stage=1 executor=%s reporter=%s reference=%s\n' \
    "$stage_1_executor" "$stage_1_reporter" "$stage_1_reference"
  printf 'stage=2 executor=%s reporter=%s reference=%s\n' \
    "$stage_2_executor" "$stage_2_reporter" "$stage_2_reference"
  printf 'stage=3 executor=%s reporter=%s reference=%s condition="pass, score>=96, findings<=1"\n' \
    "$stage_3_executor" "$stage_3_reporter" "$stage_3_reference"
}

print_configuration
if $dry_run; then
  if [[ ${#selected_paths[@]} -gt 0 ]]; then
    printf '%s\n' "${selected_paths[@]}"
  fi
  for path in "${exhausted_paths[@]}"; do
    printf 'retry_exhausted document=%s\n' "$path"
  done
  exit 0
fi

if [[ ! -f "$results_file" ]]; then
  printf 'recorded_at\tdocument\tstage\tstatus\tduration_seconds\tverdict\tscore\tfindings\texecutor\treporter\treference\tconsecutive_failures\tmax_failures\n' >"$results_file"
fi

current_document=
current_stage=
on_interrupt() {
  printf 'grade pipeline: interrupted document=%s stage=%s; rerun with --run-id %s to resume\n' \
    "${current_document:-none}" "${current_stage:-none}" "$run_id" >&2
  exit 130
}
trap on_interrupt INT TERM

document_key() {
  local path=$1
  local stem
  local digest
  stem=$(basename "$path" .md | tr -c 'A-Za-z0-9._-' '-')
  digest=$(node -e "process.stdout.write(require('node:crypto').createHash('sha256').update(process.argv[1]).digest('hex').slice(0,12))" "$path")
  printf '%s-%s' "$stem" "$digest"
}

read_grade_metrics() {
  # JavaScript template expressions belong to node, not bash.
  # shellcheck disable=SC2016
  node -e '
    const fs = require("node:fs");
    const source = fs.readFileSync(process.argv[1], "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const frontmatter = source?.[1] ?? "";
    if (!/^  grade:\s*$/m.test(frontmatter)) {
      process.stdout.write("ungraded\t\t");
      process.exit(0);
    }
    const verdict = frontmatter.match(/^    verdict:\s*([^\s#]+)\s*$/m)?.[1] ?? "";
    const score = frontmatter.match(/^    score:\s*([0-9]+)\s*$/m)?.[1] ?? "";
    const findingLine = frontmatter.match(/^    findings:\s*(.*)$/m)?.[1] ?? "";
    const counts = [...findingLine.matchAll(/(?:blocker|major|minor|note):\s*([0-9]+)/g)];
    const findings = counts.length === 4
      ? counts.reduce((total, match) => total + Number(match[1]), 0)
      : "";
    process.stdout.write(`${verdict}\t${score}\t${findings}\n`);
  ' "$1"
}

record_result() {
  local document=$1
  local stage=$2
  local status=$3
  local duration=$4
  local verdict=$5
  local score=$6
  local findings=$7
  local executor=$8
  local reporter=$9
  local reference=${10}
  local consecutive_failures=${11-}
  local max_failures=${12-}
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$document" "$stage" "$status" "$duration" \
    "$verdict" "$score" "$findings" "$executor" "$reporter" "$reference" \
    "$consecutive_failures" "$max_failures" >>"$results_file"
}

read_pipeline_state() {
  local document=$1
  "${specdojo_command[@]}" grade state --target "$target" --project "$project" --path "$document"
}

pipeline_state_fields() {
  # shellcheck disable=SC2016
  node -e '
    let source = "";
    process.stdin.on("data", (chunk) => source += chunk).on("end", () => {
      if (!source.trim()) return;
      const state = JSON.parse(source);
      process.stdout.write([
        state.stage_completed,
        state.stage_failed ?? "none",
        state.consecutive_failures,
        state.max_failures,
      ].join("\t") + "\n");
    });
  '
}

record_pipeline_stage() {
  local document=$1
  local stage=$2
  local status=$3
  local state_output
  pipeline_consecutive_failures=
  pipeline_max_failures=
  state_output=$("${specdojo_command[@]}" grade state --target "$target" --project "$project" \
    --path "$document" --status "$status" --stage "$stage" --stage-total 3 \
    --max-failures "$max_stage_failures" --run-id "$run_id") ||
    fail "could not persist pipeline state for document=$document stage=$stage status=$status"
  if [[ "$status" == failed ]]; then
    IFS=$'\t' read -r _ _ pipeline_consecutive_failures pipeline_max_failures < <(
      printf '%s' "$state_output" | pipeline_state_fields
    )
  fi
}

for document in "${exhausted_paths[@]}"; do
  pipeline_state=$(read_pipeline_state "$document") || fail "grade state read failed: $document"
  IFS=$'\t' read -r _ exhausted_stage exhausted_failures exhausted_max < <(
    printf '%s' "$pipeline_state" | pipeline_state_fields
  )
  record_result "$document" "$exhausted_stage" retry_exhausted 0 "" "" "" "" "" none \
    "$exhausted_failures" "$exhausted_max"
done

save_stage_state() {
  local state_file=$1
  local status=$2
  local verdict=$3
  local score=$4
  local findings=$5
  printf '%s\t%s\t%s\t%s\n' "$status" "$verdict" "$score" "$findings" >"$state_file"
}

run_specdojo() {
  local log_file=$1
  shift
  local exit_code
  set +e
  "${specdojo_command[@]}" "$@" >>"$log_file" 2>&1
  exit_code=$?
  set -e
  return "$exit_code"
}

stage_status=
stage_verdict=
stage_score=
stage_findings=

execute_stage() {
  local document=$1
  local document_dir=$2
  local stage=$3
  local executor=$4
  local reporter=$5
  local reference=$6
  local state_file="$document_dir/stage-$stage.state.tsv"
  local stage_dir="$document_dir/stage-$stage"
  local log_file="$stage_dir/commands.log"
  local started_at=$SECONDS
  local exit_code
  local executor_plan
  local reporter_plan
  local executor_output="$stage_dir/executor-output.txt"
  local reporter_input="$stage_dir/reporter-input.md"
  local reporter_output="$stage_dir/grade-submission.json"
  local -a plan_command=(grade plan --target "$target" --project "$project" --path "$document" --out "$stage_dir/plans")
  local -a apply_command=(grade apply --target "$target" --project "$project" --path "$document" --analysis-from "$executor_output" --from "$reporter_output" --by "$executor")

  if [[ -f "$state_file" ]]; then
    IFS=$'\t' read -r stage_status stage_verdict stage_score stage_findings <"$state_file"
    if [[ "$stage_status" != failed ]]; then
      printf 'resume stage=%s document=%s status=%s\n' "$stage" "$document" "$stage_status"
      return 0
    fi
    printf 'retry stage=%s document=%s previous_status=failed\n' "$stage" "$document"
  fi

  current_stage=$stage
  mkdir -p "$stage_dir/plans"
  : >"$log_file"
  if [[ "$reference" != none ]]; then
    plan_command+=(--reference "$reference")
    apply_command+=(--reference "$reference")
  fi

  if run_specdojo "$log_file" "${plan_command[@]}"; then
    :
  else
    exit_code=$?
    record_pipeline_stage "$document" "$stage" failed
    record_result "$document" "$stage" failed "$((SECONDS - started_at))" "" "" "" "$executor" "$reporter" "$reference" "$pipeline_consecutive_failures" "$pipeline_max_failures"
    save_stage_state "$state_file" failed "" "" ""
    stage_status=failed
    return 0
  fi

  mapfile -t executor_plans < <(find "$stage_dir/plans" -maxdepth 1 -type f -name '*-grade-plan.md' ! -name '*-reporter-*' -print)
  mapfile -t reporter_plans < <(find "$stage_dir/plans" -maxdepth 1 -type f -name '*-grade-reporter-plan.md' -print)
  if [[ ${#executor_plans[@]} -ne 1 || ${#reporter_plans[@]} -ne 1 ]]; then
    printf 'expected exactly one executor and reporter plan\n' >>"$log_file"
    record_pipeline_stage "$document" "$stage" failed
    record_result "$document" "$stage" failed "$((SECONDS - started_at))" "" "" "" "$executor" "$reporter" "$reference" "$pipeline_consecutive_failures" "$pipeline_max_failures"
    save_stage_state "$state_file" failed "" "" ""
    stage_status=failed
    return 0
  fi
  executor_plan=${executor_plans[0]}
  reporter_plan=${reporter_plans[0]}

  if run_specdojo "$log_file" agent run --project "$project" --plan "$executor_plan" --by "$executor" --out "$executor_output"; then
    :
  else
    exit_code=$?
    if [[ $exit_code -eq 75 ]]; then
      record_result "$document" "$stage" rate_limited "$((SECONDS - started_at))" "" "" "" "$executor" "$reporter" "$reference"
      return 75
    fi
    record_pipeline_stage "$document" "$stage" failed
    record_result "$document" "$stage" failed "$((SECONDS - started_at))" "" "" "" "$executor" "$reporter" "$reference" "$pipeline_consecutive_failures" "$pipeline_max_failures"
    save_stage_state "$state_file" failed "" "" ""
    stage_status=failed
    return 0
  fi

  {
    cat "$reporter_plan"
    printf '\n<grade_executor_output>\n'
    cat "$executor_output"
    printf '\n</grade_executor_output>\n'
  } >"$reporter_input"

  if run_specdojo "$log_file" agent run --project "$project" --plan "$reporter_input" --by "$reporter" --out "$reporter_output"; then
    :
  else
    exit_code=$?
    if [[ $exit_code -eq 75 ]]; then
      record_result "$document" "$stage" rate_limited "$((SECONDS - started_at))" "" "" "" "$executor" "$reporter" "$reference"
      return 75
    fi
    record_pipeline_stage "$document" "$stage" failed
    record_result "$document" "$stage" failed "$((SECONDS - started_at))" "" "" "" "$executor" "$reporter" "$reference" "$pipeline_consecutive_failures" "$pipeline_max_failures"
    save_stage_state "$state_file" failed "" "" ""
    stage_status=failed
    return 0
  fi

  if run_specdojo "$log_file" "${apply_command[@]}"; then
    :
  else
    record_pipeline_stage "$document" "$stage" failed
    record_result "$document" "$stage" failed "$((SECONDS - started_at))" "" "" "" "$executor" "$reporter" "$reference" "$pipeline_consecutive_failures" "$pipeline_max_failures"
    save_stage_state "$state_file" failed "" "" ""
    stage_status=failed
    return 0
  fi

  IFS=$'\t' read -r stage_verdict stage_score stage_findings < <(read_grade_metrics "$document")
  if [[ -z "$stage_score" || -z "$stage_findings" || "$stage_verdict" == ungraded ]]; then
    printf 'grade metrics missing after apply\n' >>"$log_file"
    record_pipeline_stage "$document" "$stage" failed
    record_result "$document" "$stage" failed "$((SECONDS - started_at))" "$stage_verdict" "$stage_score" "$stage_findings" "$executor" "$reporter" "$reference" "$pipeline_consecutive_failures" "$pipeline_max_failures"
    save_stage_state "$state_file" failed "$stage_verdict" "$stage_score" "$stage_findings"
    stage_status=failed
    return 0
  fi

  stage_status=passed
  record_result "$document" "$stage" passed "$((SECONDS - started_at))" "$stage_verdict" "$stage_score" "$stage_findings" "$executor" "$reporter" "$reference"
  save_stage_state "$state_file" passed "$stage_verdict" "$stage_score" "$stage_findings"
  record_pipeline_stage "$document" "$stage" passed
}

mark_stage_skipped() {
  local document=$1
  local document_dir=$2
  local stage=$3
  local executor=$4
  local reporter=$5
  local reference=$6
  local reason=$7
  local state_file="$document_dir/stage-$stage.state.tsv"
  if [[ ! -f "$state_file" ]]; then
    printf 'resume stage=%s document=%s status=%s\n' "$stage" "$document" "$reason"
    record_result "$document" "$stage" "$reason" 0 "" "" "" "$executor" "$reporter" "$reference"
    save_stage_state "$state_file" "$reason" "" "" ""
  fi
}

stage_1_reference_for_document() {
  local document=$1
  local document_kind
  local reference
  if [[ "$target" == deliverable ]]; then
    printf '%s' "$stage_1_reference"
    return 0
  fi
  if [[ "$stage_1_reference" != per-kind ]]; then
    printf '%s' "$stage_1_reference"
    return 0
  fi
  case "$document" in
    docs/ja/specdojo/rulebooks/*.md) document_kind=rulebook ;;
    docs/ja/specdojo/recipes/*.md) document_kind=recipe ;;
    docs/ja/specdojo/samples/*.md) document_kind=sample ;;
    docs/ja/specdojo/templates/*.md) document_kind=template ;;
    *) fail "cannot determine kind for selected document: $document" ;;
  esac
  case "$document_kind" in
    rulebook) reference="docs/ja/specdojo/rulebooks/prj-overview-rulebook.md" ;;
    recipe) reference="docs/ja/specdojo/recipes/prj-overview-recipe.md" ;;
    sample) reference="docs/ja/specdojo/samples/prj-overview-sample.md" ;;
    template) reference="docs/ja/specdojo/templates/prj-overview-template.md" ;;
  esac
  if [[ ! -f "$reference" ]]; then
    printf 'grade pipeline: default stage 1 reference not found for kind %s; continuing without a reference: %s\n' \
      "$document_kind" "$reference" >&2
    reference=none
  fi
  printf '%s' "$reference"
}

processed=0
completed=0
incomplete_documents=0
for document in "${selected_paths[@]}"; do
  current_document=$document
  current_stage=
  key=$(document_key "$document")
  document_dir="$work_dir/documents/$key"
  complete_file="$document_dir/complete"
  mkdir -p "$document_dir"

  if [[ -f "$complete_file" ]]; then
    printf 'resume skip document=%s status=complete\n' "$document"
    continue
  fi
  processed=$((processed + 1))
  printf 'document start: %s\n' "$document"
  document_stage_1_reference=$(stage_1_reference_for_document "$document")
  pipeline_state=$(read_pipeline_state "$document") || fail "grade state read failed: $document"
  start_stage=1
  if [[ -n "$pipeline_state" ]]; then
    IFS=$'\t' read -r completed_stage failed_stage _ _ < <(
      printf '%s' "$pipeline_state" | pipeline_state_fields
    )
    if [[ "$failed_stage" != none ]]; then
      start_stage=$failed_stage
    else
      start_stage=$((completed_stage + 1))
    fi
    printf 'document resume: %s start_stage=%s\n' "$document" "$start_stage"
  fi

  if ((start_stage <= 1)); then
    if execute_stage "$document" "$document_dir" 1 "$stage_1_executor" "$stage_1_reporter" "$document_stage_1_reference"; then
      :
    else
      exit_code=$?
      [[ $exit_code -eq 75 ]] && exit 75
      exit "$exit_code"
    fi
    if [[ "$stage_status" == failed ]]; then
      incomplete_documents=$((incomplete_documents + 1))
      printf 'document incomplete: %s failed_stage=1\n' "$document"
      continue
    fi
  else
    mark_stage_skipped "$document" "$document_dir" 1 "$stage_1_executor" "$stage_1_reporter" "$document_stage_1_reference" resumed_completed
  fi

  if ((start_stage <= 2)); then
    if execute_stage "$document" "$document_dir" 2 "$stage_2_executor" "$stage_2_reporter" "$stage_2_reference"; then
      stage_2_status=$stage_status
      stage_2_verdict=$stage_verdict
      stage_2_score=$stage_score
      stage_2_findings=$stage_findings
    else
      exit_code=$?
      [[ $exit_code -eq 75 ]] && exit 75
      exit "$exit_code"
    fi
    if [[ "$stage_2_status" == failed ]]; then
      incomplete_documents=$((incomplete_documents + 1))
      printf 'document incomplete: %s failed_stage=2\n' "$document"
      continue
    fi
  else
    mark_stage_skipped "$document" "$document_dir" 2 "$stage_2_executor" "$stage_2_reporter" "$stage_2_reference" resumed_completed
    # A persistent stage-3 retry exists only after stage 2 passed the expert threshold.
    stage_2_status=passed
    stage_2_verdict=pass
    stage_2_score=96
    stage_2_findings=0
  fi

  if [[ "$stage_2_status" == passed && "$stage_2_verdict" == pass && "$stage_2_score" -ge 96 && "$stage_2_findings" -le 1 ]]; then
    if execute_stage "$document" "$document_dir" 3 "$stage_3_executor" "$stage_3_reporter" "$stage_3_reference"; then
      :
    else
      exit_code=$?
      [[ $exit_code -eq 75 ]] && exit 75
      exit "$exit_code"
    fi
    if [[ "$stage_status" == failed ]]; then
      incomplete_documents=$((incomplete_documents + 1))
      printf 'document incomplete: %s failed_stage=3\n' "$document"
      continue
    fi
  else
    mark_stage_skipped "$document" "$document_dir" 3 "$stage_3_executor" "$stage_3_reporter" "$stage_3_reference" skipped_condition
  fi

  record_pipeline_stage "$document" 3 complete
  printf '%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >"$complete_file"
  completed=$((completed + 1))
  printf 'document complete: %s\n' "$document"
done

current_document=
current_stage=
printf 'grade pipeline complete: selected=%s processed=%s completed_now=%s incomplete=%s exhausted=%s results=%s\n' \
  "${#selected_paths[@]}" "$processed" "$completed" "$incomplete_documents" \
  "${#exhausted_paths[@]}" "$results_file"
