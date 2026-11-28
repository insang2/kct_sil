// 실행: npx tsx scripts/tds-selfcheck.ts
import assert from 'node:assert/strict'
import { generateToken, isTokenFormat, sha256Hex, isExpired, isValidSlug, validateRequestInput, looksHuman, escapeHtml, tdsKey } from '../lib/tds-server'
import { CATALOG } from '../lib/products-catalog'

;(async () => {
  const t = generateToken()
  assert.ok(isTokenFormat(t) && t.length === 43, '토큰 43자 base64url(256bit)')
  assert.notEqual(t, generateToken())
  assert.ok(!isTokenFormat(t + 'x') && !isTokenFormat('../etc/passwd') && !isTokenFormat(''))
  assert.equal(await sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  const now = Date.now()
  assert.ok(isExpired(null) && isExpired(new Date(now - 1), now) && !isExpired(new Date(now + 1000), now))
  const slug = CATALOG[0].slug
  assert.ok(isValidSlug(slug) && !isValidSlug('../x') && !isValidSlug('dowsil-789.pdf') && !isValidSlug(undefined))
  assert.equal(tdsKey(slug), `tds/${slug}.pdf`)
  const ok = { slug, name: '홍길동', email: 'A@b.co', consent: true }
  const r = validateRequestInput(ok)
  assert.ok(r.ok && r.v.email === 'a@b.co')
  assert.ok(!validateRequestInput({ ...ok, consent: 'true' }).ok && !validateRequestInput({ ...ok, consent: false }).ok)
  assert.ok(!validateRequestInput({ ...ok, slug: 'nope' }).ok && !validateRequestInput({ ...ok, email: 'a@b' }).ok)
  assert.ok(!validateRequestInput({ ...ok, name: 'x'.repeat(61) }).ok && !validateRequestInput({ ...ok, message: 'x'.repeat(1001) }).ok)
  assert.ok(!validateRequestInput({ ...ok, phone: 'abc<script>' }).ok && !validateRequestInput(null).ok)
  assert.ok(looksHuman('', now - 5000, now) && !looksHuman('x', now - 5000, now) && !looksHuman('', now - 1000, now) && !looksHuman('', 'nan', now))
  assert.equal(escapeHtml(`<a href="x">&'`), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;')
  console.log('tds-selfcheck OK')
})()
