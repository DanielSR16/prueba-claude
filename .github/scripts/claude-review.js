const Anthropic = require('@anthropic-ai/sdk');
const { execSync } = require('child_process');

const client = new Anthropic.Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const diff = execSync('git diff origin/main...HEAD').toString();

if (!diff.trim()) {
  console.log('No hay cambios para revisar.');
  process.exit(0);
}

async function main() {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Eres un senior backend engineer revisando un PR de Node.js.

Analiza este diff y dame un code review en español. Enfócate en:
- Bugs o errores potenciales
- Problemas de seguridad
- Mejoras de performance
- Calidad del código

Sé directo y concreto. Si el código está bien, dilo brevemente.

Diff:
\`\`\`
${diff.slice(0, 15000)}
\`\`\``,
      },
    ],
  });

  const review = response.content[0].text;
  const body = `## 🤖 Claude Code Review\n\n${review}`;

  execSync(
    `gh pr comment ${process.env.PR_NUMBER} --repo ${process.env.REPO} --body "${body.replace(/"/g, '\\"')}"`,
    { env: { ...process.env, GH_TOKEN: process.env.GH_TOKEN } }
  );

  console.log('✅ Review publicado.');
}

main();