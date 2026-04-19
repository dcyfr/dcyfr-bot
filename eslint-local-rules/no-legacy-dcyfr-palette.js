/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * ESLint Rule: no-legacy-dcyfr-palette
 *
 * Catches both scaled and unscaled references to the retired DCYFR palette.
 * The palette (`dcyfr-primary-N`, `dcyfr-accent-N`) was retired 2026-04-18 per
 * openspec/changes/archive/2026-04-18-dcyfr-palette-class-migration/.
 *
 * The existing CI backstop (.github/workflows/design-tokens.yml) covers scaled
 * refs only. This rule also catches the unscaled variants (`text-dcyfr-accent`,
 * `bg-dcyfr-primary`) that slipped through the original migration and weren't
 * caught until the 2026-04-19 parity sweep. Matches the
 * `dcyfr-sites-design-parity` Phase 2.11 scope.
 *
 * Migration: replace with semantic tokens — `secure` for blue-brand accents,
 * `primary` / `accent` for the site's identity hues.
 *
 * Examples:
 *   text-dcyfr-accent    → text-secure     (for blue-brand accents)
 *   bg-dcyfr-primary-500 → bg-primary      (for the site's brand hue)
 *   ring-dcyfr-accent/40 → ring-secure/40
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow references to the retired dcyfr-primary / dcyfr-accent / dcyfr-secondary palette',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      legacyPalette:
        'The dcyfr palette ("{{match}}") was retired 2026-04-18. Migrate to semantic tokens (secure / primary / accent). See openspec/changes/archive/2026-04-18-dcyfr-palette-class-migration/.',
    },
    schema: [],
  },

  create(context) {
    // Scaled: text-dcyfr-primary-500, bg-dcyfr-accent-400, etc.
    // Unscaled: text-dcyfr-accent (no scale suffix — the case missed by CI).
    // Covers all class-context prefixes Tailwind uses for colors.
    const prefixes =
      'text|bg|border|ring|from|via|to|divide|outline|decoration|placeholder|caret|fill|stroke|shadow|accent';
    const palette = 'primary|accent|secondary|dark|light';

    const scaledPattern = new RegExp(
      `\\b(${prefixes})-dcyfr-(${palette})-(50|100|200|300|400|500|600|700|800|900|950)\\b`,
    );
    const unscaledPattern = new RegExp(
      `\\b(${prefixes})-dcyfr-(${palette})(?![-a-zA-Z0-9])`,
    );

    function checkValue(node, value) {
      if (!value || typeof value !== 'string') return;

      for (const pattern of [scaledPattern, unscaledPattern]) {
        const match = value.match(pattern);
        if (match) {
          context.report({
            node,
            messageId: 'legacyPalette',
            data: { match: match[0] },
          });
          return; // one report per attribute is enough
        }
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== 'className') return;

        if (node.value?.type === 'Literal') {
          checkValue(node, node.value.value);
        }

        if (node.value?.type === 'JSXExpressionContainer') {
          const expr = node.value.expression;
          if (expr.type === 'TemplateLiteral') {
            const combined = expr.quasis.map((q) => q.value.raw).join('');
            checkValue(node, combined);
          }
        }
      },
    };
  },
};
