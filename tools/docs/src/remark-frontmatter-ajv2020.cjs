const fs = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { load } = require('js-yaml')
const Ajv2020 = require('ajv/dist/2020').default
const addFormats = require('ajv-formats')

// Markdown の frontmatter を、設定で指定したスキーマへマッピングして検証する Remark プラグイン。
// `yaml.schemas` 形式（schemaPath: [glob...]）または `schemaRules` 形式を受け取り、先勝ちで適用する。
const validatorCache = new Map()

function toPosix(p) {
  return p.split(path.sep).join('/')
}

function decodePointerToken(token) {
  return token.replace(/~1/g, '/').replace(/~0/g, '~')
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findKeyLine(frontmatterBody, key) {
  if (!key) return 2
  const lines = frontmatterBody.split(/\r?\n/)
  const matcher = new RegExp(`^\\s*${escapeRegExp(key)}\\s*:`)
  const index = lines.findIndex(line => matcher.test(line))
  return index >= 0 ? index + 2 : 2
}

function toArray(value) {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

function globToRegExp(globPattern) {
  // VS Code の yaml.schemas に近いグロブ解釈になるように変換する。
  const pattern = toPosix(String(globPattern || ''))
  let source = '^'
  for (let i = 0; i < pattern.length; i += 1) {
    const ch = pattern[i]
    const next = pattern[i + 1]
    const next2 = pattern[i + 2]
    if (ch === '*' && next === '*' && next2 === '/') {
      source += '(?:.*/)?'
      i += 2
      continue
    }
    if (ch === '*' && next === '*') {
      source += '.*'
      i += 1
      continue
    }
    if (ch === '*') {
      source += '[^/]*'
      continue
    }
    if (ch === '?') {
      source += '[^/]'
      continue
    }
    source += escapeRegExp(ch)
  }
  source += '$'
  return new RegExp(source)
}

function normalizeYamlSchemas(yamlSchemas) {
  if (!yamlSchemas || typeof yamlSchemas !== 'object' || Array.isArray(yamlSchemas)) {
    return []
  }

  const rules = []
  // { schemaPath: [glob...] } を内部のマッチングルールへ正規化する。
  for (const [schemaPath, patterns] of Object.entries(yamlSchemas)) {
    for (const pattern of toArray(patterns)) {
      rules.push({ glob: String(pattern), schema: String(schemaPath) })
    }
  }
  return rules
}

function ruleMatches(filePath, rule) {
  const globs = toArray(rule.glob)
  const startsWith = toArray(rule.startsWith)
  const endsWith = toArray(rule.endsWith)
  const includes = toArray(rule.includes)

  if (globs.length) {
    const matched = globs.some(glob => globToRegExp(glob).test(filePath))
    if (!matched) return false
  }

  if (startsWith.length && !startsWith.some(prefix => filePath.startsWith(String(prefix)))) {
    return false
  }
  if (endsWith.length && !endsWith.some(suffix => filePath.endsWith(String(suffix)))) {
    return false
  }
  if (includes.length && !includes.some(part => filePath.includes(String(part)))) {
    return false
  }
  if (rule.regex != null) {
    const re = new RegExp(String(rule.regex))
    if (!re.test(filePath)) return false
  }
  return true
}

function resolveSchemaPath(schemaRef, schemas) {
  if (typeof schemaRef !== 'string' || !schemaRef) return null
  return schemas[schemaRef] || schemaRef
}

function selectSchemaPath(relativePath, schemas, schemaRules) {
  const filePath = toPosix(relativePath || '')

  // 先勝ちで評価するため、具体的なルールを汎用ルールより前に置く。
  for (const rule of schemaRules) {
    if (!rule || typeof rule !== 'object') continue
    if (!ruleMatches(filePath, rule)) continue
    const path = resolveSchemaPath(rule.schema, schemas)
    if (path) return path
  }

  return null
}

function getValidator(workspaceRoot, schemaPath, strictMode) {
  const absoluteSchemaPath = path.resolve(workspaceRoot, schemaPath)
  const cacheKey = `${absoluteSchemaPath}::${strictMode}`
  const cached = validatorCache.get(cacheKey)
  if (cached) return cached

  const schema = load(fs.readFileSync(absoluteSchemaPath, 'utf8'))
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    throw new Error(`Schema root must be an object: ${schemaPath}`)
  }

  const schemaId = schema.$id || pathToFileURL(absoluteSchemaPath).href
  if (!schema.$id) schema.$id = schemaId

  const ajv = new Ajv2020({
    allErrors: true,
    strict: strictMode,
  })
  addFormats(ajv)

  const commonRef = './common-frontmatter.schema.yaml'
  const schemaText = JSON.stringify(schema)
  if (schemaText.includes(commonRef)) {
    const commonAbsolutePath = path.resolve(path.dirname(absoluteSchemaPath), commonRef)
    const commonSchema = load(fs.readFileSync(commonAbsolutePath, 'utf8'))
    if (commonSchema && typeof commonSchema === 'object' && !Array.isArray(commonSchema)) {
      const commonId = commonSchema.$id || pathToFileURL(commonAbsolutePath).href
      if (!commonSchema.$id) commonSchema.$id = commonId
      ajv.addSchema(commonSchema, commonId)
    }
  }

  const validate = ajv.compile(schema)
  const result = { validate, schemaPath }
  validatorCache.set(cacheKey, result)
  return result
}

module.exports = function remarkFrontmatterAjv2020(options = {}) {
  const strictMode = options.strict !== false
  const optionSchemas = options.schemas || {}
  const schemas = {
    ...optionSchemas,
  }
  // 互換性のため、camelCase と VS Code 風キー名の両方を受け付ける。
  const yamlSchemasOption = options.yamlSchemas || options['yaml.schemas']
  const yamlSchemaRules = normalizeYamlSchemas(yamlSchemasOption)
  const schemaRules = Array.isArray(options.schemaRules)
    ? options.schemaRules
    : yamlSchemaRules.length
      ? yamlSchemaRules
      : []

  if (!schemaRules.length) {
    throw new Error(
      // 設定漏れ時に frontmatter 検証を黙ってスキップしないため、明示的に失敗させる。
      'remark-frontmatter-ajv2020: schema rules are required. Set options.schemaRules or options["yaml.schemas"].'
    )
  }

  return function transformer(tree, file) {
    const workspaceRoot = options.workspaceRoot || process.cwd()
    const currentPath = file.path ? path.resolve(String(file.path)) : ''
    const relativePath = currentPath ? toPosix(path.relative(workspaceRoot, currentPath)) : ''
    const schemaPath = selectSchemaPath(relativePath, schemas, schemaRules)
    if (!schemaPath) return

    const source = String(file.value || '')
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
    if (!match) return

    const frontmatterBody = match[1]

    let data
    try {
      data = load(frontmatterBody)
    } catch (error) {
      const line =
        error && error.mark && Number.isInteger(error.mark.line) ? error.mark.line + 2 : 2
      const column =
        error && error.mark && Number.isInteger(error.mark.column) ? error.mark.column + 1 : 1
      file.message(
        `Frontmatter YAML parse error: ${error.message || 'invalid YAML'}`,
        { start: { line, column } },
        'frontmatter-schema-2020'
      )
      return
    }

    if (data == null) data = {}
    if (typeof data !== 'object' || Array.isArray(data)) {
      file.message(
        'Frontmatter root must be an object.',
        { start: { line: 2, column: 1 } },
        'frontmatter-schema-2020'
      )
      return
    }

    const { validate } = getValidator(workspaceRoot, schemaPath, strictMode)
    const valid = validate(data)
    if (valid) return

    for (const err of validate.errors || []) {
      const segments = String(err.instancePath || '')
        .split('/')
        .filter(Boolean)
        .map(decodePointerToken)
      const key = segments[segments.length - 1] || ''
      const line = findKeyLine(frontmatterBody, key)
      const reason = `Frontmatter schema error (${err.keyword}): ${err.message || 'validation error'}`
      file.message(reason, { start: { line, column: 1 } }, 'frontmatter-schema-2020')
    }
  }
}
