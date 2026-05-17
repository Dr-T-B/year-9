// Run with: npx ts-node scripts/test-generate.ts
// Requires: npm install -D ts-node

const BASE = 'http://localhost:8888/api/generate-problems'

async function test(skill_ref: string, difficulty: string, count: number) {
  console.log(`\nTesting: ${skill_ref} | ${difficulty} | count=${count}`)
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skill_ref, difficulty, count }),
  })
  const data = await res.json()
  console.log('Status:', res.status)
  console.log('Source:', data.source)
  if (data.problems) {
    data.problems.forEach((p: any, i: number) => {
      console.log(`\nQ${i + 1}: ${p.question}`)
      console.log(`Hint: ${p.hint}`)
      console.log(`Answer: ${p.answer}`)
    })
  } else {
    console.log('Error:', data.error, data.detail ?? '')
  }
}

// Run tests sequentially
;(async () => {
  await test('T3-10', 'foundation', 2)   // Flame test colours — recall
  await test('T3-08', 'standard', 2)     // Balancing equations — balance
  await test('T4-08', 'stretch', 2)      // Neutralisation — explain
})()
