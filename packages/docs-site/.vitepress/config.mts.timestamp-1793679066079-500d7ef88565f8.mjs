// packages/docs-site/.vitepress/config.mts
import { defineConfig } from "file:///workspaces/specdojo-workspace/specdojo/packages/docs-site/node_modules/vitepress/dist/node/index.js";
import { generateSidebar } from "file:///workspaces/specdojo-workspace/specdojo/packages/docs-site/node_modules/vitepress-sidebar/dist/index.js";

// packages/docs-site/.vitepress/sidebar-config.ts
var specdojoLink = (dir, id) => `/ja/specdojo/${dir}/${id}`;
var guide = (text, id) => ({
  text,
  link: specdojoLink("guides", id),
});
var reference = (text, id) => ({
  text,
  link: specdojoLink("references", id),
});
var standard = (text, id) => ({
  text,
  link: specdojoLink("standards", id),
});
var philosophy = (text, id) => ({
  text,
  link: specdojoLink("philosophy", id),
});
var rulebook = (text, id, items) => ({
  text,
  link: specdojoLink("rulebooks", `${id}-rulebook`),
  ...(items ? { collapsed: true, items } : {}),
});
var recipe = (text, id, items) => ({
  text,
  link: specdojoLink("recipes", `${id}-recipe`),
  ...(items ? { collapsed: true, items } : {}),
});
var sample = (text, id, items) => ({
  text,
  link: specdojoLink("samples", `${id}-sample`),
  ...(items ? { collapsed: true, items } : {}),
});
var sampleYaml = (text, id, items) => ({
  text,
  link: specdojoLink("samples", `generated/${id}-sample`),
  ...(items ? { collapsed: true, items } : {}),
});
var template = (text, id, items) => ({
  text,
  link: specdojoLink("templates", `${id}-template`),
  ...(items ? { collapsed: true, items } : {}),
});
var templateYaml = (text, id, items) => ({
  text,
  link: specdojoLink("templates", `generated/${id}-template`),
  ...(items ? { collapsed: true, items } : {}),
});
var group = (text, items, collapsed = true) => ({
  text,
  collapsed,
  items,
});
var projectDefinitionRulebooks = [
  rulebook("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u6982\u8981", "prj-overview"),
  rulebook(
    "\u30B9\u30C6\u30FC\u30AF\u30DB\u30EB\u30C0\u30FC\u767B\u9332\u7C3F",
    "prj-stakeholder-register",
  ),
  rulebook("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u61B2\u7AE0", "prj-charter"),
  rulebook("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30B9\u30B3\u30FC\u30D7", "prj-scope"),
  rulebook(
    "\u6210\u529F\u57FA\u6E96\u3068\u53D7\u5165\u6761\u4EF6",
    "prj-success-criteria-and-acceptance-criteria",
  ),
  rulebook(
    "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u8AB2\u984C\u3068\u89E3\u6C7A\u30A2\u30D7\u30ED\u30FC\u30C1",
    "prj-issues-and-approach",
  ),
  rulebook(
    "\u524D\u63D0\u30FB\u5236\u7D04\u30FB\u4F9D\u5B58\u95A2\u4FC2",
    "prj-assumptions-constraints-dependencies",
  ),
  rulebook("\u4EE3\u66FF\u6848\u306E\u6BD4\u8F03", "prj-comparison-of-alternatives"),
];
var projectManagementRulebooks = [
  group("\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0", [
    rulebook("\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0\u306E\u7D22\u5F15", "dct-index"),
    rulebook("\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0", "dct"),
  ]),
  group("\u7BA1\u7406\u8A08\u753B", [
    rulebook("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u7BA1\u7406\u8A08\u753B", "pm-plan"),
    rulebook(
      "\u30B3\u30DF\u30E5\u30CB\u30B1\u30FC\u30B7\u30E7\u30F3\u8A08\u753B",
      "pm-communication-plan",
    ),
    rulebook("\u54C1\u8CEA\u7BA1\u7406\u8A08\u753B", "pm-quality-management-plan"),
  ]),
  group("\u7D44\u7E54\u4F53\u5236", [
    rulebook("\u7D44\u7E54\u3068\u30ED\u30FC\u30EB\u306E\u5B9A\u7FA9", "pm-organization"),
    rulebook("\u30ED\u30FC\u30EB\u5B9A\u7FA9", "pm-roles"),
    rulebook("\u30E1\u30F3\u30D0\u30FC\u5B9A\u7FA9", "pm-members"),
    rulebook("\u7D44\u7E54\u4F53\u5236\u3068RACI", "pm-raci"),
  ]),
  group("\u7BA1\u7406\u53F0\u5E33\u30FB\u7BA1\u7406\u30D3\u30E5\u30FC", [
    rulebook("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u767B\u9332\u7C3F", "pjr"),
    rulebook("\u30EA\u30B9\u30AF\u767B\u9332\u7C3F", "pm-risk-register"),
    rulebook("\u8AB2\u984C\u30ED\u30B0", "pm-issue-log"),
    rulebook("\u5909\u66F4\u8981\u6C42\u30ED\u30B0", "pm-change-request-log"),
    rulebook("\u610F\u601D\u6C7A\u5B9A\u30ED\u30B0", "dec"),
  ]),
  rulebook("\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB", "sch"),
  rulebook("\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3", "tml"),
  rulebook("\u9032\u6357\u5831\u544A", "pr"),
  rulebook("\u8B70\u4E8B\u9332", "mm"),
];
var productChangeRulebooks = [
  group("\u5F71\u97FF\u8ABF\u67FB", [
    rulebook("\u696D\u52D9\u5F71\u97FF", "imp-business"),
    rulebook("\u30C7\u30FC\u30BF\u5F71\u97FF", "imp-data"),
    rulebook("\u30A4\u30F3\u30BF\u30FC\u30D5\u30A7\u30FC\u30B9\u5F71\u97FF", "imp-interface"),
    rulebook("\u30C6\u30B9\u30C8\u5F71\u97FF", "imp-test"),
    rulebook("\u904B\u7528\u5F71\u97FF", "imp-operations"),
  ]),
  group("\u30C8\u30EC\u30FC\u30B5\u30D3\u30EA\u30C6\u30A3", [
    rulebook(
      "\u8981\u6C42\u3068\u4ED5\u69D8\u306E\u30C8\u30EC\u30FC\u30B9",
      "trc-requirements-to-specs",
    ),
    rulebook(
      "\u8981\u6C42\u3068\u30C6\u30B9\u30C8\u306E\u30C8\u30EC\u30FC\u30B9",
      "trc-requirements-to-tests",
    ),
  ]),
];
var businessSpecificationRulebooks = [
  group("\u6982\u5FF5\u30C7\u30FC\u30BF\u30D5\u30ED\u30FC\u56F3", [
    rulebook("\u5168\u4F53\u6982\u8981", "cdfd-overview"),
    rulebook("\u30E6\u30FC\u30B9\u30B1\u30FC\u30B9\u5225", "cdfd-uc"),
    rulebook("\u30D7\u30ED\u30BB\u30B9\u30B0\u30EB\u30FC\u30D7\u5225", "cdfd"),
    rulebook("\u56F3\u306E\u8A18\u6CD5\u30EB\u30FC\u30EB\uFF08Mermaid\uFF09", "cdfd-mermaid"),
    rulebook("\u56F3\u306E\u8A18\u6CD5\u30EB\u30FC\u30EB\uFF08D2\uFF09", "cdfd-d2"),
  ]),
  group("\u30C7\u30FC\u30BF\u30E2\u30C7\u30EB", [
    rulebook("\u696D\u52D9\u30C7\u30FC\u30BF\u8F9E\u66F8", "bdd"),
    rulebook("\u6982\u5FF5\u30C7\u30FC\u30BF\u30B9\u30C8\u30A2\u5B9A\u7FA9", "cdsd"),
    rulebook("\u4FDD\u7BA1\u5834\u6240\u5B9A\u7FA9", "sld"),
    rulebook("\u30B9\u30C6\u30FC\u30BF\u30B9\u5B9A\u7FA9", "stsd", [
      rulebook("\u72B6\u614B\u9077\u79FB\u56F3\uFF08Mermaid\uFF09", "stsd-mermaid"),
    ]),
    rulebook("\u5206\u985E\u5B9A\u7FA9", "cld"),
    rulebook("\u6982\u5FF5\u30AF\u30E9\u30B9\u56F3", "ccd-mermaid"),
  ]),
  group("\u696D\u52D9\u30E2\u30C7\u30EB", [
    rulebook("\u696D\u52D9\u30D7\u30ED\u30BB\u30B9\u4ED5\u69D8", "bps"),
    rulebook("\u30D3\u30B8\u30CD\u30B9\u30EB\u30FC\u30EB", "br"),
    rulebook("\u696D\u52D9\u30A4\u30D9\u30F3\u30C8\u4E00\u89A7", "bes-index"),
    rulebook("\u696D\u52D9\u30A4\u30D9\u30F3\u30C8\u4ED5\u69D8", "bes"),
  ]),
  group("\u30A4\u30F3\u30BF\u30FC\u30D5\u30A7\u30FC\u30B9\u30E2\u30C7\u30EB", [
    rulebook("\u753B\u9762\u4ED5\u69D8", "uis"),
    rulebook("\u5E33\u7968\u4ED5\u69D8", "bds"),
  ]),
  group("\u5171\u901A", [
    rulebook("\u30B7\u30B9\u30C6\u30E0\u5316\u6A5F\u80FD\u4E00\u89A7", "sf-index"),
    rulebook("\u30B7\u30B9\u30C6\u30E0\u5316\u6A5F\u80FD", "sf"),
    rulebook("\u7528\u8A9E\u96C6", "gl"),
  ]),
];
var externalIfRulebooks = [
  rulebook("\u5916\u90E8\u30B7\u30B9\u30C6\u30E0I/F\u4E00\u89A7", "ifx-index"),
  rulebook("\u5916\u90E8API\u4ED5\u69D8", "ifx-api"),
  rulebook("\u5916\u90E8\u30B3\u30DE\u30F3\u30C9\u9023\u643A\u4ED5\u69D8", "ifx-cmd"),
  rulebook("\u5916\u90E8\u30D5\u30A1\u30A4\u30EB\u4ED5\u69D8", "ifx-file"),
  rulebook("\u5916\u90E8\u30E1\u30C3\u30BB\u30FC\u30B8\u4ED5\u69D8", "ifx-msg"),
];
var architectureRulebooks = [
  group("C4", [
    rulebook("\u30B3\u30F3\u30C6\u30AD\u30B9\u30C8\u56F3", "cxd", [
      rulebook("\u56F3\u306E\u8A18\u6CD5\u30EB\u30FC\u30EB", "cxd-mermaid"),
    ]),
    rulebook("\u30B3\u30F3\u30C6\u30CA\u56F3", "cnd", [
      rulebook("\u56F3\u306E\u8A18\u6CD5\u30EB\u30FC\u30EB", "cnd-mermaid"),
    ]),
    rulebook("\u30B3\u30F3\u30DD\u30FC\u30CD\u30F3\u30C8\u56F3", "cpd", [
      rulebook("\u56F3\u306E\u8A18\u6CD5\u30EB\u30FC\u30EB", "cpd-mermaid"),
    ]),
  ]),
  group("\u30A4\u30F3\u30D5\u30E9\u30FB\u6280\u8853\u9078\u5B9A", [
    rulebook("\u30A4\u30F3\u30D5\u30E9\u69CB\u6210\u56F3", "ifd-mermaid"),
    rulebook("\u6280\u8853\u30B9\u30BF\u30C3\u30AF\u4E00\u89A7", "tsd-index"),
    rulebook("\u6280\u8853\u30B9\u30BF\u30C3\u30AF", "tsd"),
  ]),
];
var systemDesignRulebooks = [
  rulebook("\u30B7\u30B9\u30C6\u30E0\u8A2D\u8A08 \u5168\u4F53\u69CB\u6210", "sysd-index"),
  rulebook("\u500B\u5225\u30B7\u30B9\u30C6\u30E0\u8A2D\u8A08", "sysd"),
  rulebook("\u91CD\u8981\u30D5\u30ED\u30FC", "sysd-critical-flows"),
  rulebook("\u6A2A\u65AD\u30EB\u30FC\u30EB", "sysd-cross-cutting-policy"),
];
var nonFunctionalRequirementRulebooks = [
  rulebook("\u975E\u6A5F\u80FD\u8981\u4EF6 \u5168\u4F53\u69CB\u6210", "nfr-index"),
  rulebook("\u4FE1\u983C\u6027", "nfr-reliability"),
  rulebook("\u53EF\u7528\u6027", "nfr-availability"),
  rulebook("\u4FDD\u5B88\u6027", "nfr-maintainability"),
  rulebook("\u5B8C\u5168\u6027", "nfr-integrity"),
  rulebook("\u6A5F\u5BC6\u6027\u30FB\u5B89\u5168\u6027", "nfr-security-safety"),
  rulebook("\u6027\u80FD", "nfr-performance"),
  rulebook("\u904B\u7528", "nfr-operations"),
  rulebook("\u64CD\u4F5C\u6027", "nfr-usability"),
];
var testingRulebooks = [
  rulebook("\u30C6\u30B9\u30C8\u6226\u7565\u30FB\u65B9\u91DD", "tsp-index"),
  group("\u5358\u4F53\u30C6\u30B9\u30C8", [
    rulebook("\u5358\u4F53\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u6982\u8981", "utc-index"),
    rulebook("\u5358\u4F53\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u5BFE\u8C61\u5225", "utc"),
  ]),
  group("\u5185\u90E8\u7D50\u5408\u30C6\u30B9\u30C8", [
    rulebook(
      "\u5185\u90E8\u7D50\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u6982\u8981",
      "itc-index",
    ),
    rulebook(
      "\u5185\u90E8\u7D50\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u5BFE\u8C61\u5225",
      "itc",
    ),
  ]),
  group("\u5916\u90E8\u7D50\u5408\u30C6\u30B9\u30C8", [
    rulebook(
      "\u5916\u90E8\u7D50\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u6982\u8981",
      "etc-index",
    ),
    rulebook(
      "\u5916\u90E8\u7D50\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u5BFE\u8C61\u5225",
      "etc",
    ),
  ]),
  group("\u7DCF\u5408\u30C6\u30B9\u30C8", [
    rulebook("\u7DCF\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u6982\u8981", "stc-index"),
    rulebook("\u7DCF\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u5BFE\u8C61\u5225", "stc"),
  ]),
  group("\u53D7\u5165\u30C6\u30B9\u30C8", [
    rulebook("\u53D7\u5165\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u6982\u8981", "atc-index"),
    rulebook("\u53D7\u5165\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u5BFE\u8C61\u5225", "atc"),
  ]),
];
var migrationRulebooks = [
  rulebook("\u79FB\u884C\u8A08\u753B", "mip-index"),
  rulebook("\u30C7\u30FC\u30BF\u79FB\u884C\u8A2D\u8A08 \u5168\u4F53\u69CB\u6210", "dmd-index"),
  rulebook("\u30C7\u30FC\u30BF\u79FB\u884C\u8A2D\u8A08", "dmd"),
  rulebook("\u79FB\u884C\u30C6\u30B9\u30C8\u8A08\u753B", "mtp"),
  rulebook(
    "\u79FB\u884C\u30C6\u30B9\u30C8\u8A08\u753B\uFF08\u30EA\u30CF\u30FC\u30B5\u30EB\u8A08\u753B\uFF09",
    "ntp",
  ),
  rulebook(
    "\u30AB\u30C3\u30C8\u30AA\u30FC\u30D0\u30FC\u8A08\u753B \u5168\u4F53\u69CB\u6210",
    "cop-index",
  ),
  rulebook("\u30AB\u30C3\u30C8\u30AA\u30FC\u30D0\u30FC\u8A08\u753B", "cop"),
  rulebook("\u904B\u7528\u5207\u66FF\u8A08\u753B \u5168\u4F53\u69CB\u6210", "otp-index"),
  rulebook("\u904B\u7528\u5207\u66FF\u8A08\u753B", "otp"),
];
var operationsRulebooks = [
  rulebook("\u904B\u7528\u65B9\u91DD\u30FB\u8A2D\u8A08 \u5168\u4F53\u69CB\u6210", "opd-index"),
  rulebook("\u904B\u7528\u65B9\u91DD\u30FB\u8A2D\u8A08", "opd"),
  rulebook("\u904B\u7528\u624B\u9806 \u5168\u4F53\u69CB\u6210", "opr-index"),
  rulebook("\u904B\u7528\u624B\u9806", "opr"),
];
var projectDefinitionRecipes = [
  recipe("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u6982\u8981", "prj-overview"),
  recipe(
    "\u30B9\u30C6\u30FC\u30AF\u30DB\u30EB\u30C0\u30FC\u767B\u9332\u7C3F",
    "prj-stakeholder-register",
  ),
  recipe("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u61B2\u7AE0", "prj-charter"),
  recipe("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30B9\u30B3\u30FC\u30D7", "prj-scope"),
  recipe(
    "\u6210\u529F\u57FA\u6E96\u3068\u53D7\u5165\u6761\u4EF6",
    "prj-success-criteria-and-acceptance-criteria",
  ),
  recipe(
    "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u8AB2\u984C\u3068\u89E3\u6C7A\u30A2\u30D7\u30ED\u30FC\u30C1",
    "prj-issues-and-approach",
  ),
  recipe(
    "\u524D\u63D0\u30FB\u5236\u7D04\u30FB\u4F9D\u5B58\u95A2\u4FC2",
    "prj-assumptions-constraints-dependencies",
  ),
  recipe("\u4EE3\u66FF\u6848\u306E\u6BD4\u8F03", "prj-comparison-of-alternatives"),
];
var projectManagementRecipes = [
  group("\u7BA1\u7406\u8A08\u753B", [
    recipe("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u7BA1\u7406\u8A08\u753B", "pm-plan"),
    recipe(
      "\u30B3\u30DF\u30E5\u30CB\u30B1\u30FC\u30B7\u30E7\u30F3\u8A08\u753B",
      "pm-communication-plan",
    ),
    recipe("\u54C1\u8CEA\u7BA1\u7406\u8A08\u753B", "pm-quality-management-plan"),
  ]),
  group("\u7D44\u7E54\u4F53\u5236", [
    recipe("\u7D44\u7E54\u3068\u30ED\u30FC\u30EB\u306E\u5B9A\u7FA9", "pm-organization"),
    recipe("\u30ED\u30FC\u30EB\u5B9A\u7FA9", "pm-roles"),
    recipe("\u30E1\u30F3\u30D0\u30FC\u5B9A\u7FA9", "pm-members"),
    recipe("\u7D44\u7E54\u4F53\u5236\u3068RACI", "pm-raci"),
  ]),
];
var businessSpecificationRecipes = [
  group("\u6982\u5FF5\u30C7\u30FC\u30BF\u30D5\u30ED\u30FC\u56F3", [
    recipe("\u5168\u4F53\u6982\u8981", "cdfd-overview"),
    recipe("\u30E6\u30FC\u30B9\u30B1\u30FC\u30B9\u5225", "cdfd-uc"),
    recipe("\u30D7\u30ED\u30BB\u30B9\u30B0\u30EB\u30FC\u30D7\u5225", "cdfd"),
  ]),
  group("\u30C7\u30FC\u30BF\u30E2\u30C7\u30EB", [
    recipe("\u30B9\u30C6\u30FC\u30BF\u30B9\u5B9A\u7FA9", "stsd"),
  ]),
  group("\u696D\u52D9\u30E2\u30C7\u30EB", [
    recipe("\u696D\u52D9\u30D7\u30ED\u30BB\u30B9\u4ED5\u69D8", "bps"),
  ]),
];
var externalIfRecipes = [
  recipe("\u5916\u90E8\u30B3\u30DE\u30F3\u30C9\u9023\u643A\u4ED5\u69D8", "ifx-cmd"),
];
var architectureRecipes = [
  group("\u30A4\u30F3\u30D5\u30E9\u30FB\u6280\u8853\u9078\u5B9A", [
    recipe("\u6280\u8853\u30B9\u30BF\u30C3\u30AF", "tsd"),
  ]),
];
var execRecipes = [recipe("human\u30BF\u30B9\u30AF\u306E\u78BA\u5B9A", "exec-human-finalize")];
var projectDefinitionSamples = [
  sample("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u6982\u8981", "prj-overview"),
  sample(
    "\u30B9\u30C6\u30FC\u30AF\u30DB\u30EB\u30C0\u30FC\u767B\u9332\u7C3F",
    "prj-stakeholder-register",
  ),
  sample("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u61B2\u7AE0", "prj-charter"),
  sample("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30B9\u30B3\u30FC\u30D7", "prj-scope"),
  sample(
    "\u6210\u529F\u57FA\u6E96\u3068\u53D7\u5165\u6761\u4EF6",
    "prj-success-criteria-and-acceptance-criteria",
  ),
  sample(
    "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u8AB2\u984C\u3068\u89E3\u6C7A\u30A2\u30D7\u30ED\u30FC\u30C1",
    "prj-issues-and-approach",
  ),
  sample(
    "\u524D\u63D0\u30FB\u5236\u7D04\u30FB\u4F9D\u5B58\u95A2\u4FC2",
    "prj-assumptions-constraints-dependencies",
  ),
  sample("\u4EE3\u66FF\u6848\u306E\u6BD4\u8F03", "prj-comparison-of-alternatives"),
];
var projectManagementSamples = [
  group("\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0", [
    sampleYaml("\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0\u306E\u7D22\u5F15", "dct-index"),
    sampleYaml("\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0", "dct"),
  ]),
  group("\u7BA1\u7406\u8A08\u753B", [
    sample("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u7BA1\u7406\u8A08\u753B", "pm-plan"),
    sample(
      "\u30B3\u30DF\u30E5\u30CB\u30B1\u30FC\u30B7\u30E7\u30F3\u8A08\u753B",
      "pm-communication-plan",
    ),
    sample("\u54C1\u8CEA\u7BA1\u7406\u8A08\u753B", "pm-quality-management-plan"),
  ]),
  group("\u7D44\u7E54\u4F53\u5236", [
    sample("\u7D44\u7E54\u3068\u30ED\u30FC\u30EB\u306E\u5B9A\u7FA9", "pm-organization"),
    sampleYaml("\u30ED\u30FC\u30EB\u5B9A\u7FA9", "pm-roles"),
    sampleYaml("\u30E1\u30F3\u30D0\u30FC\u5B9A\u7FA9", "pm-members"),
    sample("\u7D44\u7E54\u4F53\u5236\u3068RACI", "pm-raci"),
  ]),
  group("\u7BA1\u7406\u53F0\u5E33\u30FB\u7BA1\u7406\u30D3\u30E5\u30FC", [
    sample("\u30EA\u30B9\u30AF\u767B\u9332\u7C3F", "pm-risk-register"),
    sample("\u8AB2\u984C\u30ED\u30B0", "pm-issue-log"),
    sample("\u5909\u66F4\u8981\u6C42\u30ED\u30B0", "pm-change-request-log"),
    sample("\u610F\u601D\u6C7A\u5B9A\u30ED\u30B0", "dec"),
  ]),
  sampleYaml("\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3", "tml"),
  sample("\u9032\u6357\u5831\u544A", "pr"),
  sample("\u8B70\u4E8B\u9332", "mm"),
];
var productChangeSamples = [
  group("\u5F71\u97FF\u8ABF\u67FB", [
    sample("\u696D\u52D9\u5F71\u97FF", "imp-business"),
    sample("\u30C7\u30FC\u30BF\u5F71\u97FF", "imp-data"),
    sample("\u30A4\u30F3\u30BF\u30FC\u30D5\u30A7\u30FC\u30B9\u5F71\u97FF", "imp-interface"),
    sample("\u30C6\u30B9\u30C8\u5F71\u97FF", "imp-test"),
    sample("\u904B\u7528\u5F71\u97FF", "imp-operations"),
  ]),
  group("\u30C8\u30EC\u30FC\u30B5\u30D3\u30EA\u30C6\u30A3", [
    sample(
      "\u8981\u6C42\u3068\u4ED5\u69D8\u306E\u30C8\u30EC\u30FC\u30B9",
      "trc-requirements-to-specs",
    ),
    sample(
      "\u8981\u6C42\u3068\u30C6\u30B9\u30C8\u306E\u30C8\u30EC\u30FC\u30B9",
      "trc-requirements-to-tests",
    ),
  ]),
];
var businessSpecificationSamples = [
  group("\u6982\u5FF5\u30C7\u30FC\u30BF\u30D5\u30ED\u30FC\u56F3", [
    sample("\u5168\u4F53\u6982\u8981", "cdfd-overview"),
    sample("\u30E6\u30FC\u30B9\u30B1\u30FC\u30B9\u5225", "cdfd-uc"),
    sample("\u30D7\u30ED\u30BB\u30B9\u30B0\u30EB\u30FC\u30D7\u5225", "cdfd"),
  ]),
  group("\u30C7\u30FC\u30BF\u30E2\u30C7\u30EB", [
    sampleYaml("\u696D\u52D9\u30C7\u30FC\u30BF\u8F9E\u66F8", "bdd"),
    sample("\u6982\u5FF5\u30C7\u30FC\u30BF\u30B9\u30C8\u30A2\u5B9A\u7FA9", "cdsd"),
    sample("\u4FDD\u7BA1\u5834\u6240\u5B9A\u7FA9", "sld"),
    sample("\u30B9\u30C6\u30FC\u30BF\u30B9\u5B9A\u7FA9", "stsd"),
    sample("\u5206\u985E\u5B9A\u7FA9", "cld"),
    sample("\u6982\u5FF5\u30AF\u30E9\u30B9\u56F3", "ccd"),
  ]),
  group("\u696D\u52D9\u30E2\u30C7\u30EB", [
    sample("\u696D\u52D9\u30D7\u30ED\u30BB\u30B9\u4ED5\u69D8", "bps"),
    sample("\u30D3\u30B8\u30CD\u30B9\u30EB\u30FC\u30EB", "br"),
    sample("\u696D\u52D9\u30A4\u30D9\u30F3\u30C8\u4E00\u89A7", "bes-index"),
    sample("\u696D\u52D9\u30A4\u30D9\u30F3\u30C8\u4ED5\u69D8", "bes"),
  ]),
  group("\u30A4\u30F3\u30BF\u30FC\u30D5\u30A7\u30FC\u30B9\u30E2\u30C7\u30EB", [
    sample("\u753B\u9762\u4ED5\u69D8", "uis"),
    sample("\u5E33\u7968\u4ED5\u69D8", "bds"),
  ]),
  group("\u5171\u901A", [
    sample("\u30B7\u30B9\u30C6\u30E0\u5316\u6A5F\u80FD\u4E00\u89A7", "sf-index"),
    sample("\u30B7\u30B9\u30C6\u30E0\u5316\u6A5F\u80FD", "sf"),
    sampleYaml("\u7528\u8A9E\u96C6", "gl"),
  ]),
];
var externalIfSamples = [
  sampleYaml("\u5916\u90E8\u30B7\u30B9\u30C6\u30E0I/F\u4E00\u89A7", "ifx-index"),
  sampleYaml("\u5916\u90E8API\u4ED5\u69D8", "ifx-api"),
  sampleYaml("\u5916\u90E8\u30B3\u30DE\u30F3\u30C9\u9023\u643A\u4ED5\u69D8", "ifx-cmd"),
  sample("\u5916\u90E8\u30D5\u30A1\u30A4\u30EB\u4ED5\u69D8", "ifx-file"),
  sampleYaml("\u5916\u90E8\u30E1\u30C3\u30BB\u30FC\u30B8\u4ED5\u69D8", "ifx-msg"),
];
var architectureSamples = [
  group("C4", [
    sample("\u30B3\u30F3\u30C6\u30AD\u30B9\u30C8\u56F3", "cxd"),
    sample("\u30B3\u30F3\u30C6\u30CA\u56F3", "cnd"),
    sample("\u30B3\u30F3\u30DD\u30FC\u30CD\u30F3\u30C8\u56F3", "cpd"),
  ]),
  group("\u30A4\u30F3\u30D5\u30E9\u30FB\u6280\u8853\u9078\u5B9A", [
    sample("\u30A4\u30F3\u30D5\u30E9\u69CB\u6210\u56F3", "ifd"),
    sample("\u6280\u8853\u30B9\u30BF\u30C3\u30AF\u4E00\u89A7", "tsd-index"),
    sample("\u6280\u8853\u30B9\u30BF\u30C3\u30AF", "tsd"),
  ]),
];
var systemDesignSamples = [
  sample("\u30B7\u30B9\u30C6\u30E0\u8A2D\u8A08 \u5168\u4F53\u69CB\u6210", "sysd-index"),
  sample("\u91CD\u8981\u30D5\u30ED\u30FC", "sysd-critical-flows"),
  sample("\u6A2A\u65AD\u30EB\u30FC\u30EB", "sysd-cross-cutting-policy"),
];
var nonFunctionalRequirementSamples = [
  sample("\u975E\u6A5F\u80FD\u8981\u4EF6 \u5168\u4F53\u69CB\u6210", "nfr-index"),
  sample("\u4FE1\u983C\u6027", "nfr-reliability"),
  sample("\u53EF\u7528\u6027", "nfr-availability"),
  sample("\u4FDD\u5B88\u6027", "nfr-maintainability"),
  sample("\u5B8C\u5168\u6027", "nfr-integrity"),
  sample("\u6A5F\u5BC6\u6027\u30FB\u5B89\u5168\u6027", "nfr-security-safety"),
  sample("\u6027\u80FD", "nfr-performance"),
  sample("\u904B\u7528", "nfr-operations"),
  sample("\u64CD\u4F5C\u6027", "nfr-usability"),
];
var testingSamples = [
  sample("\u30C6\u30B9\u30C8\u6226\u7565\u30FB\u65B9\u91DD", "tsp-index"),
  group("\u5358\u4F53\u30C6\u30B9\u30C8", [
    sample("\u5358\u4F53\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u6982\u8981", "utc-index"),
    sample("\u5358\u4F53\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u5BFE\u8C61\u5225", "utc"),
  ]),
  group("\u5185\u90E8\u7D50\u5408\u30C6\u30B9\u30C8", [
    sample(
      "\u5185\u90E8\u7D50\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u6982\u8981",
      "itc-index",
    ),
    sample(
      "\u5185\u90E8\u7D50\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u5BFE\u8C61\u5225",
      "itc",
    ),
  ]),
  group("\u5916\u90E8\u7D50\u5408\u30C6\u30B9\u30C8", [
    sample(
      "\u5916\u90E8\u7D50\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u6982\u8981",
      "etc-index",
    ),
    sample(
      "\u5916\u90E8\u7D50\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u5BFE\u8C61\u5225",
      "etc",
    ),
  ]),
  group("\u7DCF\u5408\u30C6\u30B9\u30C8", [
    sample("\u7DCF\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u6982\u8981", "stc-index"),
    sample("\u7DCF\u5408\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u5BFE\u8C61\u5225", "stc"),
  ]),
  group("\u53D7\u5165\u30C6\u30B9\u30C8", [
    sample("\u53D7\u5165\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u6982\u8981", "atc-index"),
    sample("\u53D7\u5165\u30C6\u30B9\u30C8\u30AB\u30BF\u30ED\u30B0 \u5BFE\u8C61\u5225", "atc"),
  ]),
];
var migrationSamples = [
  sample("\u79FB\u884C\u8A08\u753B", "mip-index"),
  sample("\u30C7\u30FC\u30BF\u79FB\u884C\u8A2D\u8A08 \u5168\u4F53\u69CB\u6210", "dmd-index"),
  sample("\u30C7\u30FC\u30BF\u79FB\u884C\u8A2D\u8A08", "dmd"),
  sample("\u79FB\u884C\u30C6\u30B9\u30C8\u8A08\u753B", "mtp"),
  sample(
    "\u79FB\u884C\u30C6\u30B9\u30C8\u8A08\u753B\uFF08\u30EA\u30CF\u30FC\u30B5\u30EB\u8A08\u753B\uFF09",
    "ntp",
  ),
  sample(
    "\u30AB\u30C3\u30C8\u30AA\u30FC\u30D0\u30FC\u8A08\u753B \u5168\u4F53\u69CB\u6210",
    "cop-index",
  ),
  sample("\u30AB\u30C3\u30C8\u30AA\u30FC\u30D0\u30FC\u8A08\u753B", "cop"),
  sample("\u904B\u7528\u5207\u66FF\u8A08\u753B \u5168\u4F53\u69CB\u6210", "otp-index"),
  sample("\u904B\u7528\u5207\u66FF\u8A08\u753B", "otp"),
];
var operationsSamples = [
  group("\u904B\u7528\u65B9\u91DD\u30FB\u8A2D\u8A08", [
    sample("\u5168\u4F53\u69CB\u6210", "opd-index"),
    sample("\u904B\u7528\u65B9\u91DD\u30FB\u8A2D\u8A08", "opd"),
    sample("\u6A29\u9650\u30FB\u30A2\u30AB\u30A6\u30F3\u30C8", "opd-access-control"),
    sample("\u969C\u5BB3\u5BFE\u5FDC", "opd-incident-management"),
    sample("\u76E3\u8996", "opd-monitoring"),
  ]),
  group("\u904B\u7528\u624B\u9806", [
    sample("\u5168\u4F53\u69CB\u6210", "opr-index"),
    sample("\u904B\u7528\u624B\u9806", "opr"),
    sample("\u30A2\u30AB\u30A6\u30F3\u30C8\u4ED8\u4E0E\u30FB\u5265\u596A", "opr-access-control"),
    sample(
      "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u78BA\u8A8D\u30FB\u30EA\u30B9\u30C8\u30A2",
      "opr-backup-restore",
    ),
    sample("\u30D0\u30C3\u30C1\u518D\u5B9F\u884C\u30FB\u5931\u6557\u5BFE\u5FDC", "opr-batch"),
    sample(
      "\u904B\u7528\u5909\u66F4\uFF08\u8A2D\u5B9A\u5909\u66F4\u30FB\u30C7\u30D7\u30ED\u30A4\uFF09",
      "opr-change",
    ),
    sample("\u969C\u5BB3\u5BFE\u5FDC", "opr-incident"),
    sample("\u76E3\u8996\u30FB\u30A2\u30E9\u30FC\u30C8\u5BFE\u5FDC", "opr-monitoring"),
    sample("\u554F\u3044\u5408\u308F\u305B\u4E00\u6B21\u5BFE\u5FDC", "opr-support"),
  ]),
];
var projectDefinitionTemplates = [
  template("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u6982\u8981", "prj-overview"),
  template(
    "\u30B9\u30C6\u30FC\u30AF\u30DB\u30EB\u30C0\u30FC\u767B\u9332\u7C3F",
    "prj-stakeholder-register",
  ),
  template("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u61B2\u7AE0", "prj-charter"),
  template("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30B9\u30B3\u30FC\u30D7", "prj-scope"),
  template(
    "\u6210\u529F\u57FA\u6E96\u3068\u53D7\u5165\u6761\u4EF6",
    "prj-success-criteria-and-acceptance-criteria",
  ),
  template(
    "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u8AB2\u984C\u3068\u89E3\u6C7A\u30A2\u30D7\u30ED\u30FC\u30C1",
    "prj-issues-and-approach",
  ),
  template(
    "\u524D\u63D0\u30FB\u5236\u7D04\u30FB\u4F9D\u5B58\u95A2\u4FC2",
    "prj-assumptions-constraints-dependencies",
  ),
  template("\u4EE3\u66FF\u6848\u306E\u6BD4\u8F03", "prj-comparison-of-alternatives"),
];
var deliverablesCatalogTemplates = [
  template("\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0\u306E\u7D22\u5F15", "dct-index"),
  templateYaml("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u5B9A\u7FA9", "dct-project-definition"),
  templateYaml("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u7BA1\u7406", "dct-project-management"),
  templateYaml("\u696D\u52D9\u30D7\u30ED\u30BB\u30B9\u4ED5\u69D8", "dct-business-model-bps"),
  templateYaml("\u30D3\u30B8\u30CD\u30B9\u30EB\u30FC\u30EB", "dct-business-model-br"),
  templateYaml("\u696D\u52D9\u30A4\u30D9\u30F3\u30C8\u4ED5\u69D8", "dct-business-model-bes"),
  templateYaml("\u30C7\u30FC\u30BF\u30D5\u30ED\u30FC", "dct-data-flow"),
  templateYaml("\u696D\u52D9\u30C7\u30FC\u30BF\u8F9E\u66F8", "dct-data-model-bdd"),
  templateYaml(
    "\u6982\u5FF5\u30C7\u30FC\u30BF\u30B9\u30C8\u30A2\u5B9A\u7FA9",
    "dct-data-model-cdsd",
  ),
  templateYaml("\u4FDD\u7BA1\u5834\u6240\u5B9A\u7FA9", "dct-data-model-sld"),
  templateYaml(
    "\u30B9\u30C6\u30FC\u30BF\u30B9\u5B9A\u7FA9\u30FB\u72B6\u614B\u9077\u79FB",
    "dct-data-model-stsd",
  ),
  templateYaml("\u5206\u985E\u5B9A\u7FA9", "dct-data-model-cld"),
  templateYaml("\u6982\u5FF5\u30AF\u30E9\u30B9\u56F3", "dct-data-model-ccd"),
  templateYaml(
    "\u30E6\u30FC\u30B6\u30FC\u30A4\u30F3\u30BF\u30FC\u30D5\u30A7\u30FC\u30B9\u30E2\u30C7\u30EB",
    "dct-user-interface-model",
  ),
  templateYaml("\u30B7\u30B9\u30C6\u30E0\u5316\u6A5F\u80FD", "dct-system-functions"),
  templateYaml("\u7528\u8A9E\u96C6", "dct-glossary"),
  templateYaml("\u5916\u90E8IF\u4ED5\u69D8", "dct-external-interface-specs"),
  templateYaml("\u30A2\u30FC\u30AD\u30C6\u30AF\u30C1\u30E3", "dct-architecture"),
  templateYaml("\u30B7\u30B9\u30C6\u30E0\u8A2D\u8A08", "dct-system-design"),
  templateYaml("\u696D\u52D9\u53D7\u5165\u57FA\u6E96", "dct-business-acceptance-criteria"),
  templateYaml("\u975E\u6A5F\u80FD\u8981\u4EF6", "dct-non-functional-requirements"),
  templateYaml(
    "\u30B7\u30B9\u30C6\u30E0\u53D7\u5165\u57FA\u6E96",
    "dct-system-acceptance-criteria",
  ),
  templateYaml("\u30C6\u30B9\u30C8", "dct-test-specs"),
  templateYaml("\u5F71\u97FF\u8ABF\u67FB", "dct-impact-analysis"),
  templateYaml("\u79FB\u884C\u8A08\u753B", "dct-migration-planning"),
  templateYaml("\u904B\u7528", "dct-operations"),
];
var projectManagementTemplates = [
  group("\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0", deliverablesCatalogTemplates),
  group("\u7BA1\u7406\u8A08\u753B", [
    template("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u7BA1\u7406\u8A08\u753B", "pm-plan"),
    template(
      "\u30B3\u30DF\u30E5\u30CB\u30B1\u30FC\u30B7\u30E7\u30F3\u8A08\u753B",
      "pm-communication-plan",
    ),
    template("\u54C1\u8CEA\u7BA1\u7406\u8A08\u753B", "pm-quality-management-plan"),
  ]),
  group("\u7D44\u7E54\u4F53\u5236", [
    template("\u7D44\u7E54\u3068\u30ED\u30FC\u30EB\u306E\u5B9A\u7FA9", "pm-organization"),
    templateYaml("\u30ED\u30FC\u30EB\u5B9A\u7FA9", "pm-roles"),
    templateYaml("\u30E1\u30F3\u30D0\u30FC\u5B9A\u7FA9", "pm-members"),
    templateYaml("\u4FDD\u8B77\u3055\u308C\u305F agent \u5B9A\u7FA9", "agent-members"),
    template("\u7D44\u7E54\u4F53\u5236\u3068RACI", "pm-raci"),
  ]),
  group("\u7BA1\u7406\u53F0\u5E33\u30FB\u7BA1\u7406\u30D3\u30E5\u30FC", [
    template("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u767B\u9332\u7C3F", "pjr-index"),
    template("\u53F0\u5E33\u30D3\u30E5\u30FC\uFF08\u72B6\u614B\u5225\uFF09", "pjr-views-by-status"),
    template(
      "\u53F0\u5E33\u30D3\u30E5\u30FC\uFF08\u512A\u5148\u5EA6\u5225\uFF09",
      "pjr-views-by-priority",
    ),
    template(
      "\u53F0\u5E33\u30D3\u30E5\u30FC\uFF08\u62C5\u5F53\u8005\u5225\uFF09",
      "pjr-views-by-owner",
    ),
    template("\u767B\u9332\u9805\u76EE\u306E\u5B9F\u884C\u4F9D\u5B58", "pjr-dependent-items"),
    template("\u767B\u9332\u9805\u76EE\u306E\u6D3E\u751F\u95A2\u4FC2", "pjr-derived-items"),
    template("epic \u3054\u3068\u306E\u5B50\u9805\u76EE", "pjr-epic-items"),
    group("\u767B\u9332\u9805\u76EE", [
      template("TODO", "pjr-todo"),
      template("\u8AB2\u984C", "pjr-issue"),
      template("\u30EA\u30B9\u30AF", "pjr-risk"),
      template("\u5909\u66F4\u8981\u6C42", "pjr-change-request"),
      template("\u610F\u601D\u6C7A\u5B9A", "pjr-decision"),
      template("\u30CE\u30FC\u30C8", "pjr-note"),
      template("\u8CEA\u554F", "pjr-question"),
      template("EPIC", "pjr-epic"),
    ]),
    template("\u30EA\u30B9\u30AF\u767B\u9332\u7C3F", "pm-risk-register"),
    template("\u8AB2\u984C\u30ED\u30B0", "pm-issue-log"),
    template("\u5909\u66F4\u8981\u6C42\u30ED\u30B0", "pm-change-request-log"),
    template("\u610F\u601D\u6C7A\u5B9A\u30ED\u30B0", "pm-decision-log"),
  ]),
];
var businessSpecificationTemplates = [
  group("\u6982\u5FF5\u30C7\u30FC\u30BF\u30D5\u30ED\u30FC\u56F3", [
    template("\u5168\u4F53\u6982\u8981", "cdfd-overview"),
    template("\u30E6\u30FC\u30B9\u30B1\u30FC\u30B9\u5225", "cdfd-uc"),
    template("\u30D7\u30ED\u30BB\u30B9\u30B0\u30EB\u30FC\u30D7\u5225", "cdfd"),
  ]),
  group("\u30C7\u30FC\u30BF\u30E2\u30C7\u30EB", [
    template("\u30B9\u30C6\u30FC\u30BF\u30B9\u5B9A\u7FA9", "stsd"),
  ]),
  group("\u696D\u52D9\u30E2\u30C7\u30EB", [
    template("\u696D\u52D9\u30D7\u30ED\u30BB\u30B9\u4ED5\u69D8", "bps"),
  ]),
];
var externalIfTemplates = [
  templateYaml("\u5916\u90E8\u30B3\u30DE\u30F3\u30C9\u9023\u643A\u4ED5\u69D8", "ifx-cmd"),
];
var operationsTemplates = [template("\u904B\u7528\u624B\u9806", "opr")];
var specdojoSidebarItems = [
  {
    text: "\u30AC\u30A4\u30C9",
    collapsed: false,
    items: [
      group(
        "\u306F\u3058\u3081\u306B",
        [
          guide("\u5168\u4F53\u6982\u8981", "specdojo-overview-guide"),
          guide("Quick Start", "quick-start-guide"),
          guide("\u30E6\u30FC\u30B9\u30B1\u30FC\u30B9\u5225", "use-case-guide"),
          guide("\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u69CB\u6210", "docs-structure-guide"),
        ],
        false,
      ),
      group(
        "\u578B\u3067\u4F5C\u308B",
        [
          guide("\u578B\u306E\u69CB\u6210", "practice-system-composition-guide"),
          guide("\u5B9F\u8DF5\u306E\u9032\u3081\u65B9", "ryu-guide"),
          guide("\u5B9F\u8DF5\u306E\u578B\u6D3B\u7528", "kata-guide"),
          guide("\u30EC\u30D3\u30E5\u30FC", "review-guide"),
        ],
        false,
      ),
      group(
        "\u6280\u3067\u56DE\u3059",
        [
          guide("\u9042\u884C\u306E\u6280\u6D3B\u7528", "waza-guide"),
          guide(
            "\u30AA\u30FC\u30B1\u30B9\u30C8\u30EC\u30FC\u30BF\u30FC\u904B\u7528",
            "orchestrator-operation-guide",
          ),
          guide("exec\u904B\u7528", "exec-operation-guide"),
          guide("\u767B\u9332\u7C3F\u904B\u7528", "register-operation-guide"),
          group("Schedule\u8A2D\u8A08\u30FB\u5B9F\u884C", [
            guide("\u30C8\u30E9\u30C3\u30AF\u8A2D\u8A08", "track-design-guide"),
            guide("Schedule\u8A2D\u8A08", "schedule-design-guide"),
            guide("Schedule\u5B9F\u884C\u904B\u7528", "schedule-operation-guide"),
          ]),
          guide("routine\u904B\u7528", "routine-operation-guide"),
          guide(
            "\u5E38\u6642\u7A3C\u50CD\u30DB\u30B9\u30C8\u904B\u7528",
            "remote-host-development-guide",
          ),
          group("exec\u5171\u901A", [
            guide("exec\u8A2D\u5B9A", "exec-config-guide"),
            guide(
              "plan/result\u30E9\u30A4\u30D5\u30B5\u30A4\u30AF\u30EB",
              "plan-result-lifecycle-guide",
            ),
            guide("exec worktree\u904B\u7528", "exec-worktree-guide"),
            guide(
              "\u30D6\u30E9\u30F3\u30C1\u30EF\u30FC\u30AF\u30D5\u30ED\u30FC",
              "branch-workflow-guide",
            ),
          ]),
        ],
        false,
      ),
      group("\u4ED8\u9332", [
        guide("\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u7DE8\u96C6", "docs-editing-guide"),
      ]),
    ],
  },
  {
    text: "\u30EA\u30D5\u30A1\u30EC\u30F3\u30B9",
    collapsed: false,
    items: [
      reference("\u6210\u679C\u7269\u30EA\u30D5\u30A1\u30EC\u30F3\u30B9", "deliverables-reference"),
      reference(
        "\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u30EC\u30A4\u30A2\u30A6\u30C8\u30EA\u30D5\u30A1\u30EC\u30F3\u30B9",
        "directory-layout-reference",
      ),
      reference(
        "SpecDojo\u8A2D\u5B9A\u30EA\u30D5\u30A1\u30EC\u30F3\u30B9",
        "specdojo-config-reference",
      ),
      reference(
        "CLI\u30B3\u30DE\u30F3\u30C9\u30EA\u30D5\u30A1\u30EC\u30F3\u30B9",
        "command-reference",
      ),
    ],
  },
  {
    // 規約の前提となる考え方。一度読めば足りるため、実務で引く guide / reference の後ろへ置く。
    text: "\u8003\u3048\u65B9",
    collapsed: true,
    items: [
      philosophy("SpecDojo", "specdojo-philosophy"),
      philosophy(
        "\u8981\u6C42\u304B\u3089\u5B9F\u88C5\u307E\u3067",
        "needs-to-implementation-philosophy",
      ),
    ],
  },
  {
    text: "\u30EC\u30B7\u30D4",
    collapsed: true,
    items: [
      group("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8", [
        group("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u5B9A\u7FA9", projectDefinitionRecipes),
        group(
          "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30DE\u30CD\u30B8\u30E1\u30F3\u30C8",
          projectManagementRecipes,
        ),
      ]),
      group("\u696D\u52D9\u4ED5\u69D8", businessSpecificationRecipes),
      group("\u5916\u90E8I/F\u4ED5\u69D8", externalIfRecipes),
      group("\u30A2\u30FC\u30AD\u30C6\u30AF\u30C1\u30E3", architectureRecipes),
      group("\u5B9F\u884C", execRecipes),
    ],
  },
  {
    text: "\u30B5\u30F3\u30D7\u30EB",
    collapsed: true,
    items: [
      group("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8", [
        group("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u5B9A\u7FA9", projectDefinitionSamples),
        group(
          "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30DE\u30CD\u30B8\u30E1\u30F3\u30C8",
          projectManagementSamples,
        ),
        group("\u30D7\u30ED\u30C0\u30AF\u30C8\u5909\u66F4", productChangeSamples),
      ]),
      group("\u696D\u52D9\u4ED5\u69D8", businessSpecificationSamples),
      group("\u5916\u90E8I/F\u4ED5\u69D8", externalIfSamples),
      group("\u30A2\u30FC\u30AD\u30C6\u30AF\u30C1\u30E3", architectureSamples),
      group("\u30B7\u30B9\u30C6\u30E0\u8A2D\u8A08", systemDesignSamples),
      sample("\u696D\u52D9\u53D7\u5165\u6761\u4EF6", "bac"),
      group("\u975E\u6A5F\u80FD\u8981\u4EF6", nonFunctionalRequirementSamples),
      sample("\u30B7\u30B9\u30C6\u30E0\u53D7\u5165\u6761\u4EF6", "sac"),
      group("\u30C6\u30B9\u30C8", testingSamples),
      group("\u79FB\u884C", migrationSamples),
      group("\u904B\u7528", operationsSamples),
    ],
  },
  {
    text: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8",
    collapsed: true,
    items: [
      group("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8", [
        group("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u5B9A\u7FA9", projectDefinitionTemplates),
        group(
          "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30DE\u30CD\u30B8\u30E1\u30F3\u30C8",
          projectManagementTemplates,
        ),
      ]),
      group("\u696D\u52D9\u4ED5\u69D8", businessSpecificationTemplates),
      group("\u5916\u90E8I/F\u4ED5\u69D8", externalIfTemplates),
      group("\u904B\u7528", operationsTemplates),
    ],
  },
  {
    text: "\u6A19\u6E96",
    collapsed: true,
    items: [
      standard(
        "\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8ID\u30FB\u30D5\u30A1\u30A4\u30EB\u547D\u540D",
        "id-and-file-naming-standard",
      ),
      standard(
        "\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u30E1\u30BF\u60C5\u5831",
        "document-metadata-standard",
      ),
      standard("Git\u30D6\u30E9\u30F3\u30C1\u904B\u7528", "git-branching-standard"),
      standard("\u30EB\u30FC\u30EB\u30D6\u30C3\u30AF\u8A18\u8FF0", "rulebook-authoring-standard"),
      standard("\u30EC\u30B7\u30D4\u8A18\u8FF0", "recipe-authoring-standard"),
      standard("\u30B5\u30F3\u30D7\u30EB\u8A18\u8FF0", "sample-authoring-standard"),
      standard("\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u8A18\u8FF0", "template-authoring-standard"),
      standard("\u30AC\u30A4\u30C9\u8A18\u8FF0", "guide-authoring-standard"),
      standard("\u30EA\u30D5\u30A1\u30EC\u30F3\u30B9\u8A18\u8FF0", "reference-authoring-standard"),
      standard("\u6A19\u6E96\u8A18\u8FF0", "standard-authoring-standard"),
      standard(
        "\u4EBA\u30FB\u7D44\u7E54\u5B9A\u7FA9",
        "people-and-organization-definition-standard",
      ),
      standard(
        "\u30C6\u30B9\u30C8\u6587\u66F8\u30B9\u30B3\u30FC\u30D7",
        "test-document-scope-standard",
      ),
    ],
  },
  {
    text: "\u30EB\u30FC\u30EB",
    collapsed: true,
    items: [
      group("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8", [
        group("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u5B9A\u7FA9", projectDefinitionRulebooks),
        group(
          "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30DE\u30CD\u30B8\u30E1\u30F3\u30C8",
          projectManagementRulebooks,
        ),
        group("\u30D7\u30ED\u30C0\u30AF\u30C8\u5909\u66F4", productChangeRulebooks),
      ]),
      group("\u696D\u52D9\u4ED5\u69D8", businessSpecificationRulebooks),
      group("\u5916\u90E8I/F\u4ED5\u69D8", externalIfRulebooks),
      group("\u30A2\u30FC\u30AD\u30C6\u30AF\u30C1\u30E3", architectureRulebooks),
      group("\u30B7\u30B9\u30C6\u30E0\u8A2D\u8A08", systemDesignRulebooks),
      rulebook("\u696D\u52D9\u53D7\u5165\u6761\u4EF6", "bac"),
      group("\u975E\u6A5F\u80FD\u8981\u4EF6", nonFunctionalRequirementRulebooks),
      rulebook("\u30B7\u30B9\u30C6\u30E0\u53D7\u5165\u6761\u4EF6", "sac"),
      group("\u30C6\u30B9\u30C8", testingRulebooks),
      group("\u79FB\u884C", migrationRulebooks),
      group("\u904B\u7528", operationsRulebooks),
    ],
  },
];
var PROJECTS_SEGMENT_TEXT = {
  projects: "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8",
  "010-deliverables-catalog": "\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0",
  "020-project-definition": "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u5B9A\u7FA9",
  "030-project-management":
    "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30DE\u30CD\u30B8\u30E1\u30F3\u30C8",
  "040-product-change": "\u30D7\u30ED\u30C0\u30AF\u30C8\u5909\u66F4",
  controls: "\u7BA1\u7406\u53F0\u5E33\u30FB\u7BA1\u7406\u30D3\u30E5\u30FC",
  "project-register": "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u767B\u9332\u7C3F",
  reporting: "\u30EC\u30DD\u30FC\u30C8",
  "progress-reports": "\u9032\u6357\u5831\u544A",
  "meeting-minutes": "\u8B70\u4E8B\u9332",
  execution: "\u5B9F\u884C\u7BA1\u7406",
  exec: "\u5B9F\u884C\u30EF\u30FC\u30AF\u30B9\u30DA\u30FC\u30B9",
  events: "\u30A4\u30D9\u30F3\u30C8\u30ED\u30B0",
  plans: "\u5B9F\u884C\u30D7\u30E9\u30F3",
  results: "\u5B9F\u884C\u7D50\u679C",
  generated: "\u751F\u6210\u7269",
  reviews: "\u30EC\u30D3\u30E5\u30FC",
  schedule: "\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB",
  routines: "\u30EB\u30FC\u30C1\u30F3",
  "010-as-is": "\u73FE\u72B6\u5B9A\u7FA9",
  "010-business-specifications": "\u696D\u52D9\u4ED5\u69D8",
  "020-impact-analysis": "\u5F71\u97FF\u8ABF\u67FB",
  "030-traceability": "\u30C8\u30EC\u30FC\u30B5\u30D3\u30EA\u30C6\u30A3",
  "040-migration": "\u79FB\u884C",
  // 非推奨化した成果物ファイルの置き場所（id-and-file-naming-standard.md 9.1）。
  trash: "\u5EC3\u6B62\u6E08\u307F",
};
var PROJECTS_FILE_TEXT = {
  index: "\u4E00\u89A7",
  "task-catalog": "\u30BF\u30B9\u30AF\u30AB\u30BF\u30ED\u30B0",
};
var PRODUCT_SEGMENT_TEXT = {
  product: "\u30D7\u30ED\u30C0\u30AF\u30C8",
  "010-business-specs": "\u696D\u52D9\u4ED5\u69D8",
  "010-data-flow": "\u6982\u5FF5\u30C7\u30FC\u30BF\u30D5\u30ED\u30FC",
  "030-architecture": "\u30A2\u30FC\u30AD\u30C6\u30AF\u30C1\u30E3",
  "020-infrastructure": "\u30A4\u30F3\u30D5\u30E9\u30FB\u6280\u8853\u9078\u5B9A",
  "040-system-design": "\u30B7\u30B9\u30C6\u30E0\u8A2D\u8A08",
  // 非推奨化した成果物ファイルの置き場所（id-and-file-naming-standard.md 9.1）。
  trash: "\u5EC3\u6B62\u6E08\u307F",
};
var PRODUCT_FILE_MENU = {
  "cdfd-overview": { text: "\u5168\u4F53\u6982\u8981", order: 0 },
  "cdfd-uc-register": { text: "register \u7CFB", order: 1 },
  "cdfd-uc-schedule": { text: "schedule \u7CFB", order: 2 },
  "cdfd-uc-routine": { text: "routine \u7CFB", order: 3 },
  // 廃止済み（PJR-SJQC）。プロセスグループ別 CDFD と、cdfd-uc-schedule に引き継いだ旧ユースケース別 CDFD。
  "cdfd-onboarding": { text: "\uFF08\u65E7\uFF09Onboarding\uFF08P-01\uFF09", order: 200 },
  "cdfd-plan": { text: "\uFF08\u65E7\uFF09Plan\uFF08P-02\u301CP-06\uFF09", order: 210 },
  "cdfd-do": { text: "\uFF08\u65E7\uFF09Do\uFF08P-07\uFF09", order: 220 },
  "cdfd-check": { text: "\uFF08\u65E7\uFF09Check\uFF08P-08\u301CP-10\uFF09", order: 230 },
  "cdfd-action": { text: "\uFF08\u65E7\uFF09Action\uFF08P-11\u301CP-13\uFF09", order: 240 },
  "cdfd-orchestrator": { text: "\uFF08\u65E7\uFF09Orchestrator\uFF08P-14\uFF09", order: 250 },
  "cdfd-uc-deliverable": {
    text: "\uFF08\u65E7\uFF09\u6210\u679C\u7269\u306E\u4F5C\u6210\u304B\u3089\u5B8C\u4E86\u307E\u3067",
    order: 260,
  },
  "cdfd-init": {
    text: "\u521D\u671F\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\uFF08P-01\uFF09",
    order: 10,
  },
  "cdfd-register-lifecycle": {
    text: "\u767B\u9332\u7C3F\u30E9\u30A4\u30D5\u30B5\u30A4\u30AF\u30EB\uFF08P-02\uFF09",
    order: 20,
  },
  "cdfd-catalog-planning": { text: "\u8A08\u753B\u5C55\u958B\uFF08P-03\uFF09", order: 30 },
  "cdfd-task-execution": { text: "\u30BF\u30B9\u30AF\u5B9F\u884C\uFF08P-04\uFF09", order: 40 },
  "cdfd-routine": { text: "\u5B9A\u671F\u51E6\u7406\uFF08P-05\uFF09", order: 50 },
  "cdfd-multi-project": { text: "\u4E26\u884C\u51E6\u7406\uFF08P-06\uFF09", order: 60 },
  "cdfd-agent-config-operation": { text: "\u69CB\u6210\u5909\u66F4\uFF08P-07\uFF09", order: 70 },
  "cdfd-derived-content": { text: "\u6D3E\u751F\u751F\u6210\uFF08P-08\uFF09", order: 80 },
  "cdfd-reporting": { text: "\u5831\u544A\uFF08P-09\uFF09", order: 90 },
  "cdfd-deprecation": {
    text: "\u975E\u63A8\u5968\u5316\u30FB\u4FDD\u7BA1\uFF08P-10\uFF09",
    order: 100,
  },
  // 廃止済み（id-and-file-naming-standard.md 9.2 経路B）。cdfd-register-lifecycle の後継に
  // 移行済みだが、Schedule の過去タスクID参照整合性のためファイルは維持する。
  "cdfd-register-operation": {
    text: "\u767B\u9332\u7C3F\u904B\u7528\uFF08\u5EC3\u6B62\u30FB\u65E7\u7248\uFF09",
    order: 999,
  },
};
var PROJECTS_FILE_MENU = {
  README: { text: "\u6982\u8981" },
  // 010-deliverables-catalog
  "dct-index": { text: "\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0\u306E\u7D22\u5F15", order: 10 },
  "dct-project-definition": {
    text: "\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0\uFF08\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u5B9A\u7FA9\uFF09",
    order: 20,
  },
  "dct-project-management": {
    text: "\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0\uFF08\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30DE\u30CD\u30B8\u30E1\u30F3\u30C8\uFF09",
    order: 30,
  },
  "dct-planning": {
    text: "\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0\uFF08\u8A08\u753B\uFF09",
    order: 40,
  },
  // 020-project-definition
  "prj-overview": { text: "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u6982\u8981", order: 10 },
  "prj-stakeholder-register": {
    text: "\u30B9\u30C6\u30FC\u30AF\u30DB\u30EB\u30C0\u30FC\u767B\u9332\u7C3F",
    order: 20,
  },
  "prj-charter": { text: "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u61B2\u7AE0", order: 30 },
  "prj-scope": { text: "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30B9\u30B3\u30FC\u30D7", order: 40 },
  "prj-success-criteria-and-acceptance-criteria": {
    text: "\u6210\u529F\u57FA\u6E96\u3068\u53D7\u5165\u6761\u4EF6",
    order: 50,
  },
  "prj-issues-and-approach": {
    text: "\u8AB2\u984C\u3068\u89E3\u6C7A\u30A2\u30D7\u30ED\u30FC\u30C1",
    order: 60,
  },
  "prj-assumptions-constraints-dependencies": {
    text: "\u524D\u63D0\u30FB\u5236\u7D04\u30FB\u4F9D\u5B58\u95A2\u4FC2",
    order: 70,
  },
  "prj-comparison-of-alternatives": { text: "\u4EE3\u66FF\u6848\u306E\u6BD4\u8F03", order: 80 },
  // 030-project-management（管理計画 → 組織体制の順。同一ディレクトリなので通し番号）
  "pm-plan": { text: "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u7BA1\u7406\u8A08\u753B", order: 10 },
  "pm-communication-plan": {
    text: "\u30B3\u30DF\u30E5\u30CB\u30B1\u30FC\u30B7\u30E7\u30F3\u8A08\u753B",
    order: 20,
  },
  "pm-quality-management-plan": { text: "\u54C1\u8CEA\u7BA1\u7406\u8A08\u753B", order: 30 },
  "pm-review-viewpoints": { text: "\u30EC\u30D3\u30E5\u30FC\u89B3\u70B9", order: 40 },
  "pm-organization": { text: "\u7D44\u7E54\u3068\u30ED\u30FC\u30EB\u306E\u5B9A\u7FA9", order: 50 },
  "pm-roles": { text: "\u30ED\u30FC\u30EB\u5B9A\u7FA9", order: 60 },
  "pm-members": { text: "\u30E1\u30F3\u30D0\u30FC\u5B9A\u7FA9", order: 70 },
  "pm-raci": { text: "\u7D44\u7E54\u4F53\u5236\u3068RACI", order: 80 },
  // controls
  "pjr-index": { text: "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u767B\u9332\u53F0\u5E33", order: 10 },
  "pjr-views-by-status": {
    text: "\u53F0\u5E33\u30D3\u30E5\u30FC\uFF08\u72B6\u614B\u5225\uFF09",
    order: 11,
  },
  "pjr-views-by-priority": {
    text: "\u53F0\u5E33\u30D3\u30E5\u30FC\uFF08\u512A\u5148\u5EA6\u5225\uFF09",
    order: 12,
  },
  "pjr-views-by-owner": {
    text: "\u53F0\u5E33\u30D3\u30E5\u30FC\uFF08\u62C5\u5F53\u8005\u5225\uFF09",
    order: 13,
  },
  "pm-risk-register": { text: "\u30EA\u30B9\u30AF\u767B\u9332\u7C3F", order: 10 },
  "pm-issue-log": { text: "\u8AB2\u984C\u30ED\u30B0", order: 20 },
  "pm-change-request-log": { text: "\u5909\u66F4\u8981\u6C42\u30ED\u30B0", order: 30 },
  "pm-decision-log": { text: "\u610F\u601D\u6C7A\u5B9A\u30ED\u30B0", order: 40 },
  // execution / generated（進捗ビュー）
  ready: { text: "\u7740\u624B\u53EF\u80FD\u30BF\u30B9\u30AF", order: 10 },
  timeline: { text: "\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3", order: 20 },
  "critical-path": { text: "\u30AF\u30EA\u30C6\u30A3\u30AB\u30EB\u30D1\u30B9", order: 30 },
  cpm: { text: "\u30AF\u30EA\u30C6\u30A3\u30AB\u30EB\u30D1\u30B9\u5206\u6790", order: 40 },
  "schedule-diff": { text: "\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u5DEE\u5206", order: 50 },
  dashboard: { text: "\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9", order: 60 },
  // 実行プラン・実行結果はサイドバーに載せず、この一覧から辿る。
  "exec-records": { text: "\u5B9F\u884C\u8A18\u9332\u4E00\u89A7", order: 70 },
};
var PROJECTS_GROUP_ORDER = {
  // 非推奨化した文書（trash）は現行の文書の後ろに置く。
  廃止済み: 900,
  "\u7BA1\u7406\u53F0\u5E33\u30FB\u7BA1\u7406\u30D3\u30E5\u30FC": 10,
  スケジュール: 20,
  ルーチン: 30,
  実行管理: 40,
  レポート: 50,
  実行プラン: 90,
  実行結果: 95,
};
var FLATTENED_GROUP_TEXTS = /* @__PURE__ */ new Set([
  "\u751F\u6210\u7269",
  "\u5B9F\u884C\u30EF\u30FC\u30AF\u30B9\u30DA\u30FC\u30B9",
]);

// packages/docs-site/src/gen-mermaid-svg.ts
import * as fs from "node:fs";
import * as path from "node:path";
import { execFileSync } from "node:child_process";
import * as crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
var __vite_injected_original_import_meta_url =
  "file:///workspaces/specdojo-workspace/specdojo/packages/docs-site/src/gen-mermaid-svg.ts";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var WORKSPACE_ROOT = path.resolve(process.env.SPECDOJO_DOCS_ROOT ?? process.cwd());
var PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(__vite_injected_original_import_meta_url)),
  "..",
);
var DEFAULT_ROOT = path.join(WORKSPACE_ROOT, "docs");
var DEFAULT_OUT_DIR = path.join(WORKSPACE_ROOT, ".vitepress", "mermaid");
var PUPPETEER_CONFIG = path.join(PACKAGE_ROOT, "puppeteer-config.json");
var MERMAID_CONFIG = path.join(PACKAGE_ROOT, "mermaid-config.json");
var MERMAID_CLI = path.join(path.dirname(require2.resolve("@mermaid-js/mermaid-cli")), "cli.js");
var MERMAID_CLI_PKG_PATH = path.join(
  path.dirname(require2.resolve("@mermaid-js/mermaid-cli")),
  "..",
  "package.json",
);
var MERMAID_CLI_VERSION = String(JSON.parse(fs.readFileSync(MERMAID_CLI_PKG_PATH, "utf8")).version);
var MERMAID_CONFIG_CONTENT = fs.readFileSync(MERMAID_CONFIG, "utf8");
var MERMAID_CONFIG_HASH = crypto.createHash("md5").update(MERMAID_CONFIG_CONTENT).digest("hex");
var MANIFEST_FILE = ".manifest.json";
var MANIFEST_VERSION = 1;
var SVG_NAME_PATTERN = /^[0-9a-f]{8}\.svg$/;
function mermaidSvgId(code) {
  return crypto
    .createHash("md5")
    .update(
      `${MERMAID_CLI_VERSION}
${MERMAID_CONFIG_CONTENT}
${code}`,
    )
    .digest("hex")
    .slice(0, 8);
}
function createManifestEntry(stat, hashes, hasErrors = false) {
  return {
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    hashes,
    ...(hasErrors ? { hasErrors: true } : {}),
    mermaidCliVersion: MERMAID_CLI_VERSION,
    mermaidConfigHash: MERMAID_CONFIG_HASH,
  };
}
function isRenderedWithCurrentSettings(entry) {
  return (
    entry.mermaidCliVersion === MERMAID_CLI_VERSION &&
    entry.mermaidConfigHash === MERMAID_CONFIG_HASH
  );
}
function svgPathFor(outDir, id) {
  return path.join(outDir, `${id}.svg`);
}
function manifestPath(outDir) {
  return path.join(outDir, MANIFEST_FILE);
}
function loadManifest(outDir) {
  try {
    const raw = fs.readFileSync(manifestPath(outDir), "utf8");
    const parsed = JSON.parse(raw);
    if (parsed.version === MANIFEST_VERSION && parsed.files && typeof parsed.files === "object") {
      return { version: MANIFEST_VERSION, files: parsed.files };
    }
  } catch {}
  return { version: MANIFEST_VERSION, files: {} };
}
function saveManifest(outDir, manifest) {
  fs.mkdirSync(outDir, { recursive: true });
  const files = Object.keys(manifest.files)
    .sort()
    .reduce((acc, key) => {
      acc[key] = manifest.files[key];
      return acc;
    }, {});
  fs.writeFileSync(
    manifestPath(outDir),
    JSON.stringify({ version: MANIFEST_VERSION, files }, null, 2),
    "utf8",
  );
}
function extractMermaidBlocks(markdown) {
  const mermaidBlocks = [...markdown.matchAll(/^```mermaid[^\n]*\n([\s\S]*?)^```/gm)];
  return mermaidBlocks.map((m) => m[1]?.trim()).filter((v) => !!v);
}
function relativePathWithinRoot(file, rootDir) {
  const rel = path.relative(path.resolve(rootDir), path.resolve(file));
  if (rel === "" || rel === ".." || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    return void 0;
  }
  return rel;
}
function shouldGenerateMermaidForFile(file, rootDir = DEFAULT_ROOT) {
  if (!file.endsWith(".md")) return false;
  const rel = relativePathWithinRoot(file, rootDir);
  return rel !== void 0 && !rel.split(path.sep).includes("generated");
}
function isFileNotFoundError(error) {
  return error instanceof Error && error.code === "ENOENT";
}
function collectMarkdownFiles(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === ".vitepress" ||
        entry.name === "public" ||
        entry.name === "node_modules" ||
        entry.name === "generated"
      ) {
        continue;
      }
      collectMarkdownFiles(full, acc);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      acc.push(full);
    }
  }
  return acc.sort();
}
function normalizeSvgSize(svgPath) {
  let svg = fs.readFileSync(svgPath, "utf8");
  const vbMatch = svg.match(/viewBox="([^"]+)"/);
  if (!vbMatch) {
    return;
  }
  const parts = vbMatch[1].trim().split(/\s+/);
  if (parts.length !== 4) {
    return;
  }
  const [, , w, h] = parts;
  const tagMatch = svg.match(/<svg[^>]*>/);
  if (!tagMatch) {
    return;
  }
  const originalTag = tagMatch[0];
  const attrs = originalTag.slice("<svg".length, -1);
  const cleanedAttrs = attrs.replace(/\swidth="[^"]*"/, "").replace(/\sheight="[^"]*"/, "");
  const newTag = `<svg width="${w}" height="${h}"${cleanedAttrs}>`;
  svg = svg.replace(originalTag, newTag);
  fs.writeFileSync(svgPath, svg, "utf8");
}
function renderSvg(outDir, code) {
  const id = mermaidSvgId(code);
  const svgPath = svgPathFor(outDir, id);
  if (fs.existsSync(svgPath)) {
    return id;
  }
  const tmpMmd = path.join(outDir, `.tmp-${id}.mmd`);
  fs.writeFileSync(tmpMmd, code, "utf8");
  console.log(`\u{1F300} Generating mermaid SVG: ${path.relative(process.cwd(), svgPath)}`);
  try {
    execFileSync(
      process.execPath,
      [MERMAID_CLI, "-p", PUPPETEER_CONFIG, "-c", MERMAID_CONFIG, "-i", tmpMmd, "-o", svgPath],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    normalizeSvgSize(svgPath);
  } catch (error) {
    fs.rmSync(svgPath, { force: true });
    throw error;
  } finally {
    fs.rmSync(tmpMmd, { force: true });
  }
  return id;
}
function renderErrorSummary(error) {
  const stderr = error?.stderr;
  const detail =
    typeof stderr === "string" || Buffer.isBuffer(stderr) ? stderr.toString().trim() : "";
  return (detail || (error instanceof Error ? error.message : String(error)))
    .split(/\n\s+at /)[0]
    .trim();
}
function finishGeneration(errors, errorMode) {
  if (errors.length > 0 && errorMode === "throw") {
    throw new AggregateError(
      errors,
      `[mermaid] ${errors.length} diagram(s) failed:
${errors.map((error) => error.message).join("\n")}`,
    );
  }
}
function processMarkdown(mdPath, rootDir, outDir, errors, prevManifest) {
  const stat = fs.statSync(mdPath);
  if (prevManifest) {
    const relKey = path.relative(rootDir, mdPath);
    const prev = prevManifest.files[relKey];
    if (
      prev &&
      !prev.hasErrors &&
      prev.mtimeMs === stat.mtimeMs &&
      prev.size === stat.size &&
      isRenderedWithCurrentSettings(prev) &&
      prev.hashes.every((id) => fs.existsSync(svgPathFor(outDir, id)))
    ) {
      return { hashes: prev.hashes, hasErrors: false };
    }
  }
  const text = fs.readFileSync(mdPath, "utf8");
  const mermaidBlocks = extractMermaidBlocks(text);
  if (mermaidBlocks.length === 0) {
    return { hashes: [], hasErrors: false };
  }
  console.log(`\u{1F300} Generating mermaid SVG from: ${path.relative(process.cwd(), mdPath)}`);
  fs.mkdirSync(outDir, { recursive: true });
  const hashes = [];
  let hasErrors = false;
  for (const [index, code] of mermaidBlocks.entries()) {
    try {
      hashes.push(renderSvg(outDir, code));
    } catch (error) {
      hasErrors = true;
      const failure = new Error(
        `${path.relative(process.cwd(), mdPath)} (diagram ${index + 1}, ${mermaidSvgId(code)}): ${renderErrorSummary(error)}`,
        { cause: error },
      );
      errors.push(failure);
      console.warn(`[mermaid] skipping failed diagram: ${failure.message}`);
    }
  }
  return { hashes, hasErrors };
}
function pruneOrphanSvgs(outDir, manifest) {
  if (!fs.existsSync(outDir)) return;
  const referenced = /* @__PURE__ */ new Set();
  for (const entry of Object.values(manifest.files)) {
    for (const id of entry.hashes) referenced.add(`${id}.svg`);
  }
  for (const name of fs.readdirSync(outDir)) {
    if (!SVG_NAME_PATTERN.test(name)) continue;
    if (referenced.has(name)) continue;
    fs.rmSync(path.join(outDir, name), { force: true });
    console.log(`\u{1F9F9} Removing orphan mermaid SVG: ${name}`);
  }
}
function generateMermaidSvgs(options) {
  const rootDir = options?.rootDir ?? DEFAULT_ROOT;
  const outDir = options?.outDir ?? DEFAULT_OUT_DIR;
  const markdownFiles = [rootDir, ...(options?.additionalRootDirs ?? [])]
    .filter((dir) => fs.existsSync(dir))
    .flatMap((dir) => collectMarkdownFiles(dir));
  console.log("\u{1F50D} Scanning docs for mermaid code blocks...");
  const prevManifest = loadManifest(outDir);
  const nextManifest = { version: MANIFEST_VERSION, files: {} };
  const errors = [];
  for (const mdPath of markdownFiles) {
    try {
      const stat = fs.statSync(mdPath);
      const { hashes, hasErrors } = processMarkdown(mdPath, rootDir, outDir, errors, prevManifest);
      if (hashes.length > 0) {
        nextManifest.files[path.relative(rootDir, mdPath)] = createManifestEntry(
          stat,
          hashes,
          hasErrors,
        );
      }
    } catch (error) {
      if (!isFileNotFoundError(error)) throw error;
      console.warn(`[mermaid] skipping missing Markdown: ${path.relative(process.cwd(), mdPath)}`);
    }
  }
  pruneOrphanSvgs(outDir, nextManifest);
  saveManifest(outDir, nextManifest);
  finishGeneration(errors, options?.errorMode ?? "throw");
  console.log("\u2705 Mermaid SVG generation done.");
}
function generateMermaidSvgsForFile(mdPath, options) {
  const rootDir = options?.rootDir ?? DEFAULT_ROOT;
  const outDir = options?.outDir ?? DEFAULT_OUT_DIR;
  if (!mdPath.endsWith(".md")) return;
  const relKey = relativePathWithinRoot(mdPath, rootDir);
  if (relKey === void 0) return;
  const manifest = loadManifest(outDir);
  const errors = [];
  const removeManifestEntry = () => {
    delete manifest.files[relKey];
    pruneOrphanSvgs(outDir, manifest);
    saveManifest(outDir, manifest);
  };
  if (!shouldGenerateMermaidForFile(mdPath, rootDir) || !fs.existsSync(mdPath)) {
    console.warn(`[mermaid] skipping missing or generated Markdown: ${relKey}`);
    removeManifestEntry();
    return;
  }
  try {
    const { hashes, hasErrors } = processMarkdown(mdPath, rootDir, outDir, errors);
    if (hashes.length > 0) {
      const stat = fs.statSync(mdPath);
      manifest.files[relKey] = createManifestEntry(stat, hashes, hasErrors);
    } else {
      delete manifest.files[relKey];
    }
    pruneOrphanSvgs(outDir, manifest);
    saveManifest(outDir, manifest);
  } catch (error) {
    if (!isFileNotFoundError(error)) throw error;
    console.warn(`[mermaid] skipping missing Markdown: ${relKey}`);
    removeManifestEntry();
  }
  finishGeneration(errors, options?.errorMode ?? "throw");
}
function isDirectRun() {
  const selfPath = fileURLToPath(__vite_injected_original_import_meta_url);
  const invoked = process.argv[1] ? path.resolve(process.argv[1]) : "";
  return invoked === path.resolve(selfPath);
}
if (isDirectRun()) {
  generateMermaidSvgs();
}

// packages/docs-site/src/gen-d2-svg.ts
import {
  existsSync as existsSync2,
  mkdirSync as mkdirSync2,
  readdirSync as readdirSync2,
  readFileSync as readFileSync2,
  rmSync as rmSync2,
  writeFileSync as writeFileSync2,
} from "node:fs";
import path2 from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";

// packages/docs-site/src/d2.mjs
import { execFileSync as execFileSync2 } from "node:child_process";
import { createHash as createHash2 } from "node:crypto";
import { createRequire as createRequire2 } from "node:module";
var __vite_injected_original_import_meta_url2 =
  "file:///workspaces/specdojo-workspace/specdojo/packages/docs-site/src/d2.mjs";
var D2_VERSION = "0.9.0";
var D2_LAYOUT = "elk";
var require3 = createRequire2(__vite_injected_original_import_meta_url2);
var vitepressRequire = createRequire2(require3.resolve("vitepress/package.json"));
var MarkdownIt = vitepressRequire("markdown-it");
var parser = new MarkdownIt({ html: true });
function extractD2Blocks(markdown, file = "") {
  const source = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, (value) =>
    value.replace(/[^\n]/gu, ""),
  );
  return parser
    .parse(source, {})
    .filter((token) => token.type === "fence" && token.info.trim().split(/\s/u)[0] === "d2")
    .map((token) => ({ file, line: token.map[0] + 1, code: token.content.trim() }));
}
function d2SvgId(code) {
  return createHash2("sha256")
    .update(
      `${D2_VERSION}
${D2_LAYOUT}
${code.trim()}`,
    )
    .digest("hex")
    .slice(0, 8);
}
function runD2(args, input) {
  try {
    return execFileSync2("d2", args, {
      input,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 12e4,
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`D2 CLI not found: install d2 v${D2_VERSION} and add it to PATH.`, {
        cause: error,
      });
    }
    throw new Error(error.stderr?.toString().trim() || error.message, { cause: error });
  }
}
function assertD2Version() {
  const actual = runD2(["version"]).trim().replace(/^v/u, "");
  if (actual !== D2_VERSION) {
    throw new Error(
      `D2 CLI version mismatch: expected ${D2_VERSION}, got ${actual}. Install d2 v${D2_VERSION}.`,
    );
  }
}
function renderD2(code) {
  const svg = runD2(
    ["--layout", D2_LAYOUT, "--theme", "0", "--scale", "1", "--target", "", "-", "-"],
    code,
  );
  if (!/<svg\b/u.test(svg)) throw new Error("D2 CLI did not produce SVG output.");
  return svg;
}

// packages/docs-site/src/gen-d2-svg.ts
var __vite_injected_original_import_meta_url3 =
  "file:///workspaces/specdojo-workspace/specdojo/packages/docs-site/src/gen-d2-svg.ts";
function collectMarkdown(dir) {
  if (!existsSync2(dir)) return [];
  return readdirSync2(dir, { withFileTypes: true })
    .flatMap((entry) => {
      if (
        entry.name.startsWith(".") ||
        ["generated", "node_modules", "public", "secrets"].includes(entry.name)
      )
        return [];
      const file = path2.join(dir, entry.name);
      if (entry.isDirectory()) return collectMarkdown(file);
      return entry.isFile() && file.endsWith(".md") ? [file] : [];
    })
    .sort();
}
function generateD2Svgs(options = {}) {
  const workspace = path2.resolve(process.env.SPECDOJO_DOCS_ROOT ?? process.cwd());
  const rootDir = options.rootDir ?? path2.join(workspace, "docs");
  const outDir = options.outDir ?? path2.join(workspace, ".vitepress", "d2");
  const blocks = collectMarkdown(rootDir).flatMap((file) =>
    extractD2Blocks(readFileSync2(file, "utf8"), file),
  );
  if (blocks.length > 0) assertD2Version();
  const referenced = /* @__PURE__ */ new Set();
  const errors = [];
  for (const block of blocks) {
    const name = `${d2SvgId(block.code)}.svg`;
    referenced.add(name);
    const output = path2.join(outDir, name);
    if (existsSync2(output)) continue;
    try {
      const svg = renderD2(block.code);
      mkdirSync2(outDir, { recursive: true });
      writeFileSync2(output, svg, "utf8");
    } catch (error) {
      rmSync2(output, { force: true });
      errors.push(
        new Error(
          `${block.file}:${block.line} [d2] ${error instanceof Error ? error.message : String(error)}`,
          { cause: error },
        ),
      );
    }
  }
  if (existsSync2(outDir)) {
    for (const name of readdirSync2(outDir)) {
      if (/^[0-9a-f]{8}\.svg$/u.test(name) && !referenced.has(name))
        rmSync2(path2.join(outDir, name));
    }
  }
  if (errors.length > 0)
    throw new AggregateError(errors, errors.map((error) => error.message).join("\n"));
}
if (
  process.argv[1] &&
  path2.resolve(process.argv[1]) === fileURLToPath2(__vite_injected_original_import_meta_url3)
)
  generateD2Svgs();

// packages/docs-site/.vitepress/d2-auto-generate.ts
import path3 from "node:path";
function d2SvgAutoGenerate(options) {
  let ssr = false;
  const generate = () => generateD2Svgs(options);
  return {
    name: "d2-svg-auto-generate",
    configResolved(config) {
      ssr = Boolean(config.build.ssr);
    },
    buildStart() {
      if (!ssr) generate();
    },
    configureServer(server) {
      server.watcher.add(options.contentRoot);
      for (const event of ["add", "change", "unlink"]) {
        server.watcher.on(event, (file) => {
          const relative5 = path3.relative(options.contentRoot, file);
          if (
            !relative5 ||
            relative5.startsWith("..") ||
            path3.isAbsolute(relative5) ||
            !file.endsWith(".md")
          )
            return;
          options.syncFile(file);
          try {
            generate();
          } catch (error) {
            server.config.logger.error(
              `[d2] ${error instanceof Error ? error.message : String(error)}`,
            );
          }
          server.ws.send({ type: "full-reload" });
        });
      }
    },
  };
}

// packages/docs-site/.vitepress/kata-staging.ts
import {
  copyFileSync,
  existsSync as existsSync3,
  mkdirSync as mkdirSync3,
  readFileSync as readFileSync3,
  readdirSync as readdirSync3,
  realpathSync,
  rmSync as rmSync3,
  writeFileSync as writeFileSync3,
} from "node:fs";
import * as path4 from "node:path";
var KATA_STAGING_DIR_NAME = ".vitepress/kata-staging";
var KATA_RELATIVE_DIRS = ["docs/ja/specdojo"];
var PACKAGE_NAME = "specdojo";
var STAGED_PACKAGE_DEAD_LINK_PATTERNS = [/^(\.\/)?(\.\.\/)+product\//];
function readPackageName(packageJsonPath) {
  try {
    const parsed = JSON.parse(readFileSync3(packageJsonPath, "utf8"));
    if (typeof parsed === "object" && parsed !== null && "name" in parsed) {
      const name = parsed.name;
      return typeof name === "string" ? name : void 0;
    }
  } catch {}
  return void 0;
}
function sameDirectory(first, second) {
  return realPathOrResolved(first) === realPathOrResolved(second);
}
function resolveKataPackageRoot(workspaceRoot) {
  const override = process.env.SPECDOJO_PACKAGE_ROOT;
  const candidate =
    override && override.trim() !== ""
      ? path4.resolve(override)
      : findInstalledPackage(workspaceRoot);
  if (!candidate || sameDirectory(candidate, workspaceRoot)) return void 0;
  return candidate;
}
function findInstalledPackage(workspaceRoot) {
  if (readPackageName(path4.join(workspaceRoot, "package.json")) === PACKAGE_NAME) {
    return workspaceRoot;
  }
  let current = path4.resolve(workspaceRoot);
  for (;;) {
    const candidate = path4.join(current, "node_modules", PACKAGE_NAME);
    if (readPackageName(path4.join(candidate, "package.json")) === PACKAGE_NAME) return candidate;
    const parent = path4.dirname(current);
    if (parent === current) return void 0;
    current = parent;
  }
}
function relativeFilesBelow(root) {
  if (!existsSync3(root)) return [];
  const files = [];
  const visit = (current) => {
    const relativeDirectory = path4.relative(root, current).split(path4.sep).join("/");
    const coreKataDirectory = /* @__PURE__ */ new Set([
      "rulebooks",
      "standards",
      "recipes",
      "samples",
      "templates",
    ]).has(relativeDirectory);
    for (const entry of readdirSync3(current, { withFileTypes: true })) {
      if (entry.name === "generated") continue;
      const absolutePath = path4.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!coreKataDirectory) visit(absolutePath);
      } else if (entry.isFile()) files.push(path4.relative(root, absolutePath));
    }
  };
  visit(root);
  return files.sort();
}
function copyDocs(source, destination) {
  if (!existsSync3(source)) return;
  mkdirSync3(destination, { recursive: true });
  for (const entry of readdirSync3(source, { withFileTypes: true })) {
    const from = path4.join(source, entry.name);
    const to = path4.join(destination, entry.name);
    if (entry.isDirectory()) copyDocs(from, to);
    else if (entry.isFile()) copyFileSync(from, to);
  }
}
function stageBundledKata(workspaceRoot) {
  const stagingRoot = path4.join(workspaceRoot, KATA_STAGING_DIR_NAME);
  rmSync3(stagingRoot, { recursive: true, force: true });
  mkdirSync3(path4.join(stagingRoot, "docs"), { recursive: true });
  const workspaceDocs = path4.join(workspaceRoot, "docs");
  copyDocs(workspaceDocs, path4.join(stagingRoot, "docs"));
  const packageRoot = resolveKataPackageRoot(workspaceRoot);
  const bundledFiles = /* @__PURE__ */ new Map();
  let staged = 0;
  let ejected = 0;
  for (const relativeDir of KATA_RELATIVE_DIRS) {
    if (!packageRoot) break;
    const bundledDir = path4.join(packageRoot, relativeDir);
    const repositoryDir = path4.join(workspaceRoot, relativeDir);
    for (const file of relativeFilesBelow(bundledDir)) {
      bundledFiles.set(path4.join(relativeDir, file), path4.join(bundledDir, file));
      if (existsSync3(path4.join(repositoryDir, file))) {
        ejected += 1;
        continue;
      }
      const destination = path4.join(stagingRoot, relativeDir, file);
      mkdirSync3(path4.dirname(destination), { recursive: true });
      copyFileSync(path4.join(bundledDir, file), destination);
      staged += 1;
    }
  }
  writeFileSync3(
    path4.join(stagingRoot, ".gitignore"),
    "# @specdojo/docs-site \u304C\u751F\u6210\u3059\u308B\u30B9\u30C6\u30FC\u30B8\u30F3\u30B0\u3002Git \u7BA1\u7406\u3057\u306A\u3044\u3002\n*\n",
    "utf8",
  );
  const syncFile = (file) => {
    const relativePath = path4.relative(workspaceRoot, file);
    const withinDocs = path4.relative(workspaceDocs, file);
    if (withinDocs === "" || withinDocs.startsWith("..") || path4.isAbsolute(withinDocs)) return;
    const destination = path4.join(stagingRoot, relativePath);
    const source = existsSync3(file) ? file : bundledFiles.get(relativePath);
    if (source) {
      mkdirSync3(path4.dirname(destination), { recursive: true });
      copyFileSync(source, destination);
    } else {
      rmSync3(destination, { force: true });
    }
  };
  return { stagingRoot, packageRoot, staged, ejected, syncFile };
}
function toSiteDocIndexEntry(entry, workspaceRoot, packageRoot) {
  if (!packageRoot) return entry;
  const colonIndex = entry.lastIndexOf(":");
  const hasLine = colonIndex > 0 && /^\d+$/.test(entry.slice(colonIndex + 1));
  const filePath = hasLine ? entry.slice(0, colonIndex) : entry;
  const suffix = hasLine ? entry.slice(colonIndex) : "";
  const packageDocsRoot = realPathOrResolved(path4.join(packageRoot, "docs"));
  const absolutePath = realPathOrResolved(path4.resolve(workspaceRoot, filePath));
  const relativePath = path4.relative(packageDocsRoot, absolutePath);
  if (relativePath === "" || relativePath.startsWith("..") || path4.isAbsolute(relativePath)) {
    return entry;
  }
  return `docs/${relativePath.split(path4.sep).join("/")}${suffix}`;
}
function realPathOrResolved(target) {
  try {
    return realpathSync(target);
  } catch {
    return path4.resolve(target);
  }
}

// packages/docs-site/.vitepress/locale-sidebar.ts
import { existsSync as existsSync4, statSync as statSync2 } from "node:fs";
import * as path5 from "node:path";
function shouldScanLocaleSidebar(workspaceRoot, documentRootPath, locale) {
  const scanPath = path5.join(workspaceRoot, documentRootPath, locale);
  if (!existsSync4(scanPath)) return false;
  return statSync2(scanPath).isDirectory();
}
function scanLocaleSidebar(workspaceRoot, documentRootPath, locale, scan) {
  if (!shouldScanLocaleSidebar(workspaceRoot, documentRootPath, locale)) return [];
  return scan();
}

// packages/docs-site/.vitepress/mermaid-assets.ts
import {
  existsSync as existsSync5,
  readdirSync as readdirSync4,
  readFileSync as readFileSync4,
} from "node:fs";
import * as path6 from "node:path";
function mermaidAssets(outDir, base2, kind = "mermaid") {
  let isSsrBuild = false;
  return {
    name: `specdojo-${kind}-assets`,
    configResolved(config) {
      isSsrBuild = Boolean(config.build.ssr);
    },
    generateBundle() {
      if (isSsrBuild || !existsSync5(outDir)) return;
      for (const name of readdirSync4(outDir)) {
        if (!/^[0-9a-f]{8}\.svg$/.test(name)) continue;
        this.emitFile({
          type: "asset",
          fileName: `${kind}/${name}`,
          source: readFileSync4(path6.join(outDir, name)),
        });
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split(/[?#]/)[0];
        const sitePath = url?.startsWith(base2) ? `/${url.slice(base2.length)}` : url;
        const name = sitePath?.match(new RegExp(`^/${kind}/([0-9a-f]{8}\\.svg)$`))?.[1];
        if (!name || !existsSync5(path6.join(outDir, name))) return next();
        res.setHeader("Content-Type", "image/svg+xml");
        res.end(readFileSync4(path6.join(outDir, name)));
      });
    },
  };
}

// packages/docs-site/.vitepress/mermaid-auto-generate.ts
import * as path7 from "node:path";
function mermaidSvgAutoGenerate(options) {
  let timer;
  let running = false;
  let pending = false;
  const pendingFiles = /* @__PURE__ */ new Set();
  let isSsrBuild = false;
  let errorMode = "throw";
  const run = (reason) => {
    if (running) {
      pending = true;
      return;
    }
    running = true;
    try {
      if (pendingFiles.size > 0) {
        const files = [...pendingFiles];
        pendingFiles.clear();
        console.log(`[mermaid] generating svgs for ${files.length} file(s) (${reason})`);
        for (const file of files) {
          try {
            generateMermaidSvgsForFile(file, {
              rootDir: options.rootDir,
              outDir: options.outDir,
              errorMode,
            });
          } catch (error) {
            console.error(`[mermaid] failed to generate SVGs for ${file}`, error);
          }
        }
      } else {
        console.log(`[mermaid] generating svgs (${reason})`);
        generateMermaidSvgs({
          rootDir: options.rootDir,
          outDir: options.outDir,
          errorMode,
        });
      }
    } finally {
      running = false;
      if (pending) {
        pending = false;
        run("pending");
      }
    }
  };
  const schedule = (reason, delayMs = 250) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => run(reason), delayMs);
  };
  const scheduleFile = (file, reason, delayMs = 250) => {
    pendingFiles.add(file);
    schedule(reason, delayMs);
  };
  const shouldHandle = (file) => {
    return shouldGenerateMermaidForFile(file, options.rootDir);
  };
  return {
    name: "mermaid-svg-auto-generate",
    configResolved(config) {
      errorMode = config.command === "serve" ? "warn" : "throw";
      isSsrBuild = Boolean(config.build?.ssr);
    },
    buildStart() {
      if (isSsrBuild) return;
      run("buildStart");
    },
    configureServer(server) {
      schedule("startup", 0);
      server.watcher.add(options.contentRoot);
      for (const event of ["add", "change", "unlink"]) {
        server.watcher.on(event, (file) => {
          const relative5 = path7.relative(options.contentRoot, file);
          if (relative5 && !relative5.startsWith("..") && !path7.isAbsolute(relative5)) {
            options.syncFile(file);
          }
        });
      }
      server.watcher.on("add", (file) => {
        if (!shouldHandle(file)) return;
        scheduleFile(file, "md:add");
      });
      server.watcher.on("unlink", (file) => {
        if (!shouldHandle(file)) return;
        scheduleFile(file, "md:unlink");
      });
    },
    handleHotUpdate(ctx) {
      if (!shouldHandle(ctx.file)) return;
      pendingFiles.add(ctx.file);
      run("hotUpdate");
      ctx.server.ws.send({ type: "full-reload" });
      return [];
    },
  };
}

// packages/docs-site/.vitepress/exec-record-links.ts
import { posix as path8 } from "node:path";
var EXEC_RECORD_PATH = /(^|\/)execution\/exec\/(?:plans|results)\/[^/]+\.md$/;
function stripEntryLineSuffix(entry) {
  const colonIndex = entry.lastIndexOf(":");
  const hasLine = colonIndex > 0 && /^\d+$/.test(entry.slice(colonIndex + 1));
  return hasLine ? entry.slice(0, colonIndex) : entry;
}
function isExecPlanOrResultPath(repositoryPath) {
  return EXEC_RECORD_PATH.test(repositoryPath);
}
function githubBlobUrl(repositoryPath, source) {
  const repositoryUrl = source.repositoryUrl.replace(/\/+$/, "");
  return `${repositoryUrl}/blob/${source.branch}/${repositoryPath}`;
}
function toRepositoryPath(currentRelPath, hrefPath) {
  const normalizedCurrentPath = currentRelPath.replace(/\\/g, "/");
  const normalizedHrefPath = hrefPath.replace(/\\/g, "/");
  const sitePath = normalizedHrefPath.startsWith("/")
    ? path8.normalize(normalizedHrefPath.slice(1))
    : path8.normalize(path8.join(path8.dirname(normalizedCurrentPath), normalizedHrefPath));
  if (sitePath === ".." || sitePath.startsWith("../")) return void 0;
  return sitePath.startsWith("docs/") ? sitePath : `docs/${sitePath}`;
}
function rewriteExecRecordMarkdownHref(href, currentRelPath, source) {
  if (
    href === "" ||
    href.startsWith("#") ||
    href.startsWith("//") ||
    /^[a-z][a-z+.-]*:/i.test(href)
  ) {
    return href;
  }
  const match = href.match(/^([^?#]*)([?#].*)?$/);
  if (!match || match[1] === "") return href;
  const repositoryPath = toRepositoryPath(currentRelPath, match[1]);
  if (!repositoryPath || !isExecPlanOrResultPath(repositoryPath)) return href;
  return `${githubBlobUrl(repositoryPath, source)}${match[2] ?? ""}`;
}
function resolveExecRecordWikilink(inner, docIndex2, source) {
  const pipeIndex = inner.indexOf("|");
  const id = pipeIndex === -1 ? inner : inner.slice(0, pipeIndex);
  const displayText = pipeIndex === -1 ? id : inner.slice(pipeIndex + 1);
  if (!/^[a-z][a-z0-9:_-]+$/.test(id)) return void 0;
  const entry = docIndex2[id];
  if (!entry) return void 0;
  const repositoryPath = stripEntryLineSuffix(entry).replace(/\\/g, "/").replace(/^\.\//, "");
  if (!isExecPlanOrResultPath(repositoryPath)) return void 0;
  return {
    displayText,
    href: githubBlobUrl(repositoryPath, source),
  };
}

// packages/docs-site/.vitepress/config.mts
import * as path9 from "path";
import {
  existsSync as existsSync6,
  readFileSync as readFileSync5,
  readdirSync as readdirSync5,
} from "node:fs";
var WORKSPACE_ROOT2 = path9.resolve(process.env.SPECDOJO_DOCS_ROOT ?? process.cwd());
var CONTENT_ROOT = path9.join(WORKSPACE_ROOT2, "docs");
var MERMAID_OUT_DIR = path9.join(WORKSPACE_ROOT2, ".vitepress", "mermaid");
var D2_OUT_DIR = path9.join(WORKSPACE_ROOT2, ".vitepress", "d2");
var GITHUB_SOURCE = {
  repositoryUrl: "https://github.com/specdojo/specdojo",
  branch: "main",
};
var kataStaging = stageBundledKata(WORKSPACE_ROOT2);
if (kataStaging.packageRoot) {
  console.log(
    `[kata] staged ${kataStaging.staged} file(s) from ${kataStaging.packageRoot} (ejected: ${kataStaging.ejected})`,
  );
}
var SITE_CONTENT_ROOT = path9.join(kataStaging.stagingRoot, "docs");
function loadDocIndex(workspaceRoot) {
  const p = path9.join(workspaceRoot, ".specdojo", "doc-index.json");
  if (!existsSync6(p)) return {};
  try {
    const entries = JSON.parse(readFileSync5(p, "utf8")).entries;
    return Object.fromEntries(
      Object.entries(entries).map(([id, entry]) => [
        id,
        toSiteDocIndexEntry(entry, workspaceRoot, kataStaging.packageRoot),
      ]),
    );
  } catch {
    return {};
  }
}
var docIndex = loadDocIndex(WORKSPACE_ROOT2);
function stripEntryLineSuffix2(entry) {
  const colonIndex = entry.lastIndexOf(":");
  const hasLine = colonIndex > 0 && /^\d+$/.test(entry.slice(colonIndex + 1));
  return hasLine ? entry.slice(0, colonIndex) : entry;
}
function toRenderableEntryPath(entryPath) {
  if (entryPath.endsWith(".md")) return entryPath;
  if (!/\.ya?ml$/.test(entryPath)) return void 0;
  const pagePath = path9.posix.join(
    path9.posix.dirname(entryPath),
    "generated",
    path9.posix.basename(entryPath).replace(/\.ya?ml$/, ".md"),
  );
  return existsSync6(path9.join(WORKSPACE_ROOT2, pagePath)) ? pagePath : void 0;
}
function resolveDocRelPath(id) {
  const entry = docIndex[id];
  if (!entry) return void 0;
  const renderablePath = toRenderableEntryPath(stripEntryLineSuffix2(entry));
  if (!renderablePath) return void 0;
  return renderablePath.startsWith("docs/") ? renderablePath.slice(5) : renderablePath;
}
var FRONTMATTER_LINK_MAX_DEPTH = 5;
function collectFrontmatterDocLinks(frontmatter, currentRelPath) {
  const links = {};
  const addCandidate = (candidate) => {
    if (links[candidate]) return;
    const docsRelPath = resolveDocRelPath(candidate);
    if (!docsRelPath || docsRelPath === currentRelPath) return;
    links[candidate] = "/" + docsRelPath.replace(/\.md$/, ".html");
  };
  const visit = (value, depth) => {
    if (typeof value === "string") {
      addCandidate(value);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") addCandidate(item);
      }
      return;
    }
    if (value !== null && typeof value === "object" && depth < FRONTMATTER_LINK_MAX_DEPTH) {
      for (const childValue of Object.values(value)) visit(childValue, depth + 1);
    }
  };
  for (const value of Object.values(frontmatter)) visit(value, 1);
  return links;
}
function getSpecdojoDocId(frontmatter) {
  const specdojo = frontmatter?.specdojo;
  if (!specdojo || typeof specdojo !== "object" || Array.isArray(specdojo)) return void 0;
  const id = specdojo.id;
  if (typeof id !== "string") return void 0;
  const trimmedId = id.trim();
  return trimmedId.length > 0 ? trimmedId : void 0;
}
function readGradeSummary(docId) {
  const projectsRoot = path9.join(WORKSPACE_ROOT2, "docs", "ja", "projects");
  if (!existsSync6(projectsRoot)) return void 0;
  for (const entry of readdirSync5(projectsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const resultPath = path9.join(
      projectsRoot,
      entry.name,
      "execution",
      "grade",
      "results",
      // src/grade-result.ts の gradeResultFileName と同じ規則（":" を "." に置換）。
      `${docId.replace(/:/g, ".")}.yaml`,
    );
    if (!existsSync6(resultPath)) continue;
    const content = readFileSync5(resultPath, "utf8");
    const verdict = content.match(/^verdict:\s*(\S+)\s*$/m)?.[1];
    const score = Number(content.match(/^score:\s*(\d+)\s*$/m)?.[1]);
    const gradedAt = content.match(/^graded_at:\s*["']?([^"'\s]+)["']?\s*$/m)?.[1];
    const gradedBy = content.match(/^graded_by:\s*["']?(.+?)["']?\s*$/m)?.[1];
    const counts = [...content.matchAll(/^  (?:blocker|major|minor|note):\s*(\d+)\s*$/gm)];
    if (!verdict || !Number.isFinite(score) || !gradedAt || !gradedBy || counts.length !== 4) {
      return void 0;
    }
    return {
      verdict,
      score,
      findings: counts.reduce((sum, match) => sum + Number(match[1]), 0),
      gradedAt,
      gradedBy,
    };
  }
  return void 0;
}
function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function makeSearchDocIdText(docId) {
  const aliases = [docId];
  const localId = docId.includes(":") ? docId.slice(docId.lastIndexOf(":") + 1) : void 0;
  if (localId && localId !== docId) aliases.push(localId);
  const weightedAliases = aliases.flatMap((alias, index) =>
    Array(index === 0 ? 80 : 40).fill(alias),
  );
  return `\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8ID Document ID ${weightedAliases.join(" ")}`;
}
function tokenizeSearchText(text) {
  const terms = text.split(/[\s\p{P}\p{S}]+/u).filter(Boolean);
  const idTokens =
    text.match(/[A-Za-z0-9][A-Za-z0-9-]*(?::[A-Za-z0-9][A-Za-z0-9-]*|(?:-[A-Za-z0-9]+)+)/g) ?? [];
  return [...terms, ...idTokens];
}
function injectSearchDocId(html, docId) {
  const searchText = escapeHtml(makeSearchDocIdText(docId));
  const hiddenDocId = `<p hidden class="vp-search-doc-id">${searchText}</p>`;
  if (/<h1\b/i.test(html)) {
    return html.replace(
      /(<h1\b[\s\S]*?<\/h1>)/i,
      `$1
${hiddenDocId}`,
    );
  }
  return `${html}
${hiddenDocId}`;
}
var isExecRecordPath = (relativePath) =>
  relativePath !== void 0 &&
  /(^|\/)execution\/exec\/(events|plans|results)(\/|$)/.test(relativePath.replace(/\\/g, "/"));
var isExcludedSearchPath = (relativePath) => {
  if (!relativePath) return false;
  const path10 = relativePath.replace(/\\/g, "/");
  if (/(^|\/)execution\/exec\/(events|plans|results)(\/|$)/.test(path10)) return true;
  if (/(^|\/)controls\/project-register\/pjr-[^/]+\.md$/.test(path10)) return true;
  if (/(^|\/)controls\/project-register\/generated\/pjr-views-by-[^/]+\.md$/.test(path10))
    return true;
  if (/(^|\/)controls\/generated\/pm-[^/]+\.md$/.test(path10)) return true;
  return false;
};
function renderSearchHtml(src, env, md) {
  if (env.frontmatter?.search === false || isExcludedSearchPath(env.relativePath)) return "";
  const html = md.render(src, env);
  const docId = getSpecdojoDocId(env.frontmatter);
  return docId ? injectSearchDocId(html, docId) : html;
}
var specdojoItems = {
  ja: {
    text: "specdojo",
    link: "/ja/specdojo/",
    collapsed: false,
    items: specdojoSidebarItems,
  },
};
var base = "/specdojo/";
var LOCALES = [
  { locale: "ja", label: "\u65E5\u672C\u8A9E", lang: "ja" },
  { locale: "en", label: "English", lang: "en" },
];
var getBaseFromLink = (link) => {
  if (!link) return "";
  const clean = link.split("#")[0].replace(/\/+$/, "");
  return clean.split("/").pop() ?? "";
};
var isReadme = (item) => {
  return getBaseFromLink(item.link).toLowerCase() === "readme";
};
var isRulebook = (item) => {
  return getBaseFromLink(item.link).toLowerCase().endsWith("rulebook");
};
var isAlreadyPrefixedByAnyLocale = (path10) => {
  return LOCALES.some(({ locale }) => path10 === `/${locale}` || path10.startsWith(`/${locale}/`));
};
var sortKey = (item) => {
  if (isReadme(item)) return { bucket: 0, name: "" };
  if (isRulebook(item)) return { bucket: 1, name: getBaseFromLink(item.link).toLowerCase() };
  if (!item.link) {
    const groupOrder = PROJECTS_GROUP_ORDER[item.text ?? ""];
    if (groupOrder !== void 0) return { bucket: 2, name: String(groupOrder).padStart(4, "0") };
    return { bucket: 2, name: "" };
  }
  const catalogOrder = catalogSidebarOrder(item.link);
  if (catalogOrder !== void 0) return { bucket: 2, name: String(catalogOrder).padStart(4, "0") };
  const base2 = getBaseFromLink(item.link).toLowerCase();
  const order = PROJECTS_FILE_MENU[base2]?.order ?? PRODUCT_FILE_MENU[base2]?.order;
  if (order !== void 0) return { bucket: 2, name: String(order).padStart(4, "0") };
  if (item.link && isExecResultLink(item.link)) {
    const startedAt = readExecResultStartedAt(item.link);
    if (startedAt) return { bucket: 2, name: startedAt };
  }
  return { bucket: 2, name: base2 };
};
var normalizeAndPrefixLink = (link, locale) => {
  const [path0, hash] = link.split("#");
  const path10 = path0.startsWith("/") ? path0 : `/${path0}`;
  const prefixedPath = isAlreadyPrefixedByAnyLocale(path10)
    ? path10
    : path10 === "/"
      ? `/${locale}/`
      : `/${locale}${path10}`;
  return hash ? `${prefixedPath}#${hash}` : prefixedPath;
};
var stripMarkdownFrontmatter = (content) =>
  content.startsWith("---\n") ? content.replace(/^---\n[\s\S]*?\n---\n?/, "") : content;
var readFrontmatterString = (content, key) => {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return void 0;
  const line = match[1].match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"))?.[1];
  if (!line || line.startsWith("[") || line.startsWith("{")) return void 0;
  return line.replace(/^['"]|['"]$/g, "").trim() || void 0;
};
var readMarkdownTitle = (content) => {
  const body = stripMarkdownFrontmatter(content);
  return body.match(/^#\s+(.+?)\s*$/m)?.[1]?.trim();
};
var docsPathFromLink = (link) => {
  const clean = link.split("#")[0].replace(/^\/+/, "").replace(/\/+$/, "");
  if (!clean) return void 0;
  return path9.join(WORKSPACE_ROOT2, "docs", `${clean}.md`);
};
var isExecPlanLink = (link) => link.includes("/exec/plans/");
var isExecResultLink = (link) => link.includes("/exec/results/");
var execResultStartedAtCache = /* @__PURE__ */ new Map();
var readExecResultStartedAt = (link) => {
  if (execResultStartedAtCache.has(link)) return execResultStartedAtCache.get(link);
  const filePath = docsPathFromLink(link);
  const startedAt =
    filePath && existsSync6(filePath)
      ? readFileSync5(filePath, "utf8").match(/^\s+started_at:\s*"?([^"\s]+)"?\s*$/m)?.[1]
      : void 0;
  execResultStartedAtCache.set(link, startedAt);
  return startedAt;
};
var toExecMenuText = (link) => {
  const base2 = getBaseFromLink(link);
  if (isExecPlanLink(link)) return base2.replace(/-plan$/, "");
  if (isExecResultLink(link)) {
    const taskId = base2.replace(/-result$/, "");
    const startedAt = readExecResultStartedAt(link);
    return startedAt ? `${startedAt.slice(5, 10).replace("-", "/")} ${taskId}` : taskId;
  }
  return void 0;
};
var readProjectsMenuTextFromMarkdown = (link) => {
  const filePath = docsPathFromLink(link);
  if (!filePath || !existsSync6(filePath)) return void 0;
  const content = readFileSync5(filePath, "utf8");
  const frontmatterTitle = readFrontmatterString(content, "title");
  if (frontmatterTitle) return frontmatterTitle;
  const frontmatterName = readFrontmatterString(content, "name");
  if (frontmatterName) {
    const type = readFrontmatterString(content, "type");
    if (type === "exec-plan") return `\u5B9F\u884C\u8A08\u753B: ${frontmatterName}`;
    if (type === "exec-result") return `\u5B9F\u884C\u7D50\u679C: ${frontmatterName}`;
    return frontmatterName;
  }
  return readMarkdownTitle(content);
};
var YAML_VIEWER_PAGE_NOTE =
  "\u304B\u3089\u751F\u6210\u3055\u308C\u305F\u8868\u793A\u7528\u30DA\u30FC\u30B8\u3067\u3059";
var isCatalogYamlViewerPage = (link) => {
  if (!link || !isDeliverablesCatalogLink(link)) return false;
  const filePath = docsPathFromLink(link);
  if (!filePath || !existsSync6(filePath)) return false;
  return readFileSync5(filePath, "utf8").includes(YAML_VIEWER_PAGE_NOTE);
};
var DELIVERABLES_CATALOG_SEGMENT = "010-deliverables-catalog";
var isDeliverablesCatalogLink = (link) =>
  !!link && link.includes(`/${DELIVERABLES_CATALOG_SEGMENT}/`);
var catalogIndexPathFromLink = (link) => {
  const clean = link.split("#")[0].replace(/^\/+/, "");
  const segments = clean.split("/");
  const index = segments.indexOf(DELIVERABLES_CATALOG_SEGMENT);
  if (index < 0) return void 0;
  return path9.join(WORKSPACE_ROOT2, "docs", ...segments.slice(0, index + 1), "dct-index.yaml");
};
var catalogDomainCache = /* @__PURE__ */ new Map();
var readCatalogDomains = (indexPath) => {
  const cached = catalogDomainCache.get(indexPath);
  if (cached) return cached;
  const names = /* @__PURE__ */ new Map();
  if (existsSync6(indexPath)) {
    const lines = readFileSync5(indexPath, "utf8").split(/\r?\n/);
    let domain;
    for (const line of lines) {
      const domainMatch = line.match(/^\s*-\s+domain:\s*(\S+)\s*$/);
      if (domainMatch) {
        domain = domainMatch[1].replace(/^["']|["']$/g, "");
        continue;
      }
      const nameMatch = line.match(/^\s+name:\s*(.+?)\s*$/);
      if (domain && nameMatch) {
        names.set(domain, {
          name: nameMatch[1].replace(/^["']|["']$/g, ""),
          order: names.size + 1,
        });
        domain = void 0;
      }
    }
  }
  catalogDomainCache.set(indexPath, names);
  return names;
};
var catalogSidebarOrder = (link) => {
  if (!link || !isDeliverablesCatalogLink(link)) return void 0;
  const base2 = getBaseFromLink(link);
  if (base2 === "dct-index") return 0;
  if (!base2.startsWith("dct-")) return void 0;
  const indexPath = catalogIndexPathFromLink(link);
  if (!indexPath) return void 0;
  return readCatalogDomains(indexPath).get(base2.slice("dct-".length))?.order;
};
var stripCatalogPrefix = (text) => {
  const matched = text.match(/^成果物カタログ(?:の|[:：]\s*)?[（(]?(.+?)[)）]?$/);
  return matched?.[1]?.trim() || text;
};
var toDeliverablesCatalogMenuText = (link, resolved) => {
  const base2 = getBaseFromLink(link);
  const domain = base2.startsWith("dct-") ? base2.slice("dct-".length) : "";
  if (domain) {
    const indexPath = catalogIndexPathFromLink(link);
    const name = indexPath ? readCatalogDomains(indexPath).get(domain)?.name : void 0;
    if (name) return name;
  }
  return stripCatalogPrefix(resolved);
};
var isProjectsLink = (link, locale) => {
  return link === `/${locale}/projects` || link.startsWith(`/${locale}/projects/`);
};
var isProductLink = (link, locale) => {
  return link === `/${locale}/product` || link.startsWith(`/${locale}/product/`);
};
var detectContentTree = (item, locale) => {
  const text = (item.text ?? "").toString();
  if (text === "projects" || (item.link && isProjectsLink(item.link, locale))) return "projects";
  if (text === "product" || (item.link && isProductLink(item.link, locale))) return "product";
  return void 0;
};
var toContentTreeMenuText = (item, locale, segmentText, fileMenu, fileText = {}) => {
  if (item.link) {
    const base2 = getBaseFromLink(item.link);
    const known = fileMenu[base2];
    if (known) return known.text;
    const execText = toExecMenuText(item.link);
    if (execText) return execText;
    const markdownTitle = readProjectsMenuTextFromMarkdown(item.link);
    if (markdownTitle) return markdownTitle;
    return fileText[base2] ?? segmentText[base2];
  }
  const text = item.text ?? "";
  return segmentText[text];
};
var isHandbookTop = (item) => {
  const link = item.link ?? "";
  const text = (item.text ?? "").toString().toLowerCase();
  return link.includes("/specdojo/") || text === "specdojo";
};
var isProjectDashboardLink = (item) =>
  /\/projects\/[^/]+\/execution\/generated\/dashboard$/.test(item.link ?? "");
var extractSidebarItem = (items, predicate) => {
  let extracted;
  const remaining = [];
  for (const item of items) {
    if (!extracted && predicate(item)) {
      extracted = item;
      continue;
    }
    if (!extracted && item.items) {
      const nested = extractSidebarItem(item.items, predicate);
      extracted = nested.extracted;
      remaining.push({ ...item, items: nested.items });
      continue;
    }
    remaining.push(item);
  }
  return { items: remaining, extracted };
};
var promoteProjectDashboard = (items) => {
  if (!items.some((item) => item.text === "\u6210\u679C\u7269\u30AB\u30BF\u30ED\u30B0"))
    return items;
  const { items: remaining, extracted } = extractSidebarItem(items, isProjectDashboardLink);
  return extracted ? [extracted, ...remaining] : items;
};
var PROJECT_REGISTER_VIEW_FILES = [
  "pjr-index",
  "pjr-views-by-status",
  "pjr-views-by-priority",
  "pjr-views-by-owner",
];
var promoteProjectRegisterViews = (items) => {
  if (!items.some((item) => item.text === "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u767B\u9332\u7C3F"))
    return items;
  let remaining = items;
  const promoted = [];
  for (const file of PROJECT_REGISTER_VIEW_FILES) {
    const extracted = extractSidebarItem(
      remaining,
      (item) => item.link?.endsWith(`/controls/project-register/generated/${file}`) ?? false,
    );
    remaining = extracted.items;
    if (extracted.extracted) promoted.push(extracted.extracted);
  }
  const registerIndex = remaining.findIndex(
    (item) => item.text === "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u767B\u9332\u7C3F",
  );
  if (registerIndex < 0) return [...promoted, ...remaining];
  const register = remaining[registerIndex];
  const rest = remaining.filter((_, index) => index !== registerIndex);
  return [register, ...promoted, ...rest];
};
var transformSidebar = (items, locale, contentTree) => {
  const transformed = items
    .filter((it) => !isHandbookTop(it))
    .filter((it) => !isExecRecordPath(it.link))
    .map((it) => {
      const next = { ...it };
      if (next.link) next.link = normalizeAndPrefixLink(next.link, locale);
      const currentTree = contentTree ?? detectContentTree(next, locale);
      if (currentTree === "projects") {
        const text = toContentTreeMenuText(
          next,
          locale,
          PROJECTS_SEGMENT_TEXT,
          PROJECTS_FILE_MENU,
          PROJECTS_FILE_TEXT,
        );
        if (text) {
          next.text = isDeliverablesCatalogLink(next.link)
            ? toDeliverablesCatalogMenuText(next.link, text)
            : text;
        }
      } else if (currentTree === "product") {
        const text = toContentTreeMenuText(next, locale, PRODUCT_SEGMENT_TEXT, PRODUCT_FILE_MENU);
        if (text) next.text = text;
      }
      if (next.items) {
        next.items = transformSidebar(next.items, locale, currentTree);
        if (currentTree === "projects") {
          next.items = promoteProjectRegisterViews(next.items);
          next.items = promoteProjectDashboard(next.items);
        }
      }
      return next;
    })
    .filter((it) => !isCatalogYamlViewerPage(it.link))
    .filter((it) => it.link || !it.items || it.items.length > 0);
  const flattened = transformed.flatMap((it) =>
    !it.link && it.items && FLATTENED_GROUP_TEXTS.has(it.text ?? "") ? it.items : [it],
  );
  flattened.sort((a, b) => {
    const ka = sortKey(a);
    const kb = sortKey(b);
    if (ka.bucket !== kb.bucket) return ka.bucket - kb.bucket;
    return ka.name.localeCompare(kb.name, "ja");
  });
  return flattened;
};
var SIDEBAR_DOCUMENT_ROOT = "docs";
var makeSidebar = (locale) =>
  transformSidebar(
    scanLocaleSidebar(process.cwd(), SIDEBAR_DOCUMENT_ROOT, locale, () =>
      generateSidebar({
        documentRootPath: SIDEBAR_DOCUMENT_ROOT,
        scanStartPath: locale,
        // locale の中をスキャン
        useTitleFromFileHeading: false,
        collapseDepth: 2,
        collapsed: true,
      }),
    ),
    locale,
  );
var sidebarJaAuto = makeSidebar("ja");
var sidebarEnAuto = makeSidebar("en");
var firstSidebarLink = (item) => {
  if (item.link) return item.link;
  for (const child of item.items ?? []) {
    const link = firstSidebarLink(child);
    if (link) return link;
  }
  return void 0;
};
var sidebarKeyFromLink = (link, depth) => {
  const segments = link.split("#")[0].split("/").filter(Boolean);
  if (segments.length <= depth) return void 0;
  return `/${segments.slice(0, depth).join("/")}/`;
};
var makeSidebarMulti = (locale, autoItems, handbookItem) => {
  const sections = [];
  if (handbookItem) {
    sections.push({
      key: `/${locale}/specdojo/`,
      items: [handbookItem],
      entry: { text: handbookItem.text, link: handbookItem.link },
    });
  }
  for (const item of autoItems) {
    const link = firstSidebarLink(item);
    const key = link ? sidebarKeyFromLink(link, 2) : void 0;
    if (!key) continue;
    if (key === `/${locale}/projects/` && item.items) {
      for (const project of item.items) {
        const projectLink = firstSidebarLink(project);
        const projectKey = projectLink ? sidebarKeyFromLink(projectLink, 3) : void 0;
        if (!projectKey) continue;
        sections.push({
          key: projectKey,
          items: [{ ...project, collapsed: false }],
          entry: { text: `${item.text ?? ""}: ${project.text ?? ""}`, link: projectLink },
        });
      }
      continue;
    }
    sections.push({
      key,
      items: [{ ...item, collapsed: false }],
      entry: { text: item.text, link: item.link ?? link },
    });
  }
  const multi = {};
  for (const section of sections) {
    multi[section.key] = [...(multi[section.key] ?? []), ...section.items];
  }
  if (sections.length > 0) {
    multi[`/${locale}/`] = sections.map((section) => section.entry);
  }
  return multi;
};
var sidebarJa = makeSidebarMulti("ja", sidebarJaAuto, specdojoItems.ja);
var sidebarEn = makeSidebarMulti("en", sidebarEnAuto);
var config_default = defineConfig({
  title: "SpecDojo",
  description: "Documentation for SpecDojo",
  base,
  // `.vitepress/**` を workspace から走査せず、docs と同梱文書を重ねたツリーだけを走査する。
  srcDir: kataStaging.stagingRoot,
  // ビルド結果と cache は package の中（node_modules 配下）ではなく、閲覧対象の workspace 側へ置く。
  // package の中に置くと利用者が出力を見つけにくく、npm ci で消え、package を共有する
  // 複数 workspace の出力が混ざる。置き場所は VitePress の既定と同じ <workspace>/.vitepress/ とする。
  outDir: path9.join(WORKSPACE_ROOT2, ".vitepress", "dist"),
  cacheDir: path9.join(WORKSPACE_ROOT2, ".vitepress", "cache"),
  // 閲覧用ツリーには docs/ だけを置く。出力・cache・利用者の設定はツリーの外にあり、
  // ページ走査に入らない。exec の plan / result は引き続き公開対象から外す。
  srcExclude: [
    "*.md",
    ".vitepress/**",
    "local/**",
    "workspaces/**",
    "templates/**",
    "logs/**",
    "packages/**",
    "docs/**/execution/exec/plans/**",
    "docs/**/execution/exec/results/**",
  ],
  // サイト設定（サイドバーを含む）とページのハッシュ表は、既定では全ページの HTML へ
  // インライン展開される。ページ数が多いため、共有の JS チャンクへ切り出して 1 回だけ配信する。
  metaChunk: true,
  // サイドバー折りたたみ状態の復元（初回描画前に同期実行し、ちらつきを防ぐ）
  head: [
    [
      "script",
      {},
      `(function(){try{if(localStorage.getItem('vp-sidebar-collapsed')==='true'){document.documentElement.classList.add('vp-sidebar-collapsed')}}catch(e){}})()`,
    ],
  ],
  // 物理パスは docs/ja, docs/en のままで、
  // 公開URL（および i18n のロケール判定）は /ja/, /en/ に揃える。
  // package 参照中の kata はステージングに置き、利用リポジトリの docs/ja と同じ URL へ写像する。
  rewrites: {
    "docs/index.md": "index.md",
    "docs/ja/:rest*": "ja/:rest*",
    "docs/en/:rest*": "en/:rest*",
  },
  // ステージングした package 文書から SpecDojo 開発リポジトリ固有の文書へのリンクだけを許容する。
  // ステージングしていない（SpecDojo 自身のリポジトリなど）場合は従来どおり全 dead link を検出する。
  ...(kataStaging.staged > 0 ? { ignoreDeadLinks: [...STAGED_PACKAGE_DEAD_LINK_PATTERNS] } : {}),
  themeConfig: {
    // ビルド時に生成したインデックスでブラウザ内検索を行う（外部サービス不要）
    search: {
      provider: "local",
      options: {
        _render: renderSearchHtml,
        miniSearch: {
          options: {
            tokenize: tokenizeSearchText,
          },
        },
        locales: {
          ja: {
            translations: {
              button: {
                buttonText: "\u691C\u7D22",
                buttonAriaLabel: "\u691C\u7D22",
              },
              modal: {
                displayDetails: "\u8A73\u7D30\u3092\u8868\u793A",
                resetButtonTitle: "\u691C\u7D22\u6761\u4EF6\u3092\u30EA\u30BB\u30C3\u30C8",
                backButtonTitle: "\u691C\u7D22\u3092\u9589\u3058\u308B",
                noResultsText:
                  "\u691C\u7D22\u7D50\u679C\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F",
                footer: {
                  selectText: "\u9078\u629E",
                  selectKeyAriaLabel: "enter",
                  navigateText: "\u79FB\u52D5",
                  navigateUpKeyAriaLabel: "\u4E0A\u77E2\u5370",
                  navigateDownKeyAriaLabel: "\u4E0B\u77E2\u5370",
                  closeText: "\u9589\u3058\u308B",
                  closeKeyAriaLabel: "esc",
                },
              },
            },
          },
        },
      },
    },
  },
  locales: {
    ja: {
      label: "\u65E5\u672C\u8A9E",
      lang: "ja",
      // 言語メニューで押したときのリンク先（日本語トップ）
      link: "/ja/",
      themeConfig: {
        nav: [
          { text: "\u30DB\u30FC\u30E0", link: "/ja/" },
          { text: "SpecDojo", link: "/ja/specdojo/guides/specdojo-overview-guide" },
          {
            text: "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8",
            link: "/ja/projects/prj-0001/020-project-definition/prj-overview",
          },
        ],
        sidebar: sidebarJa,
        langMenuLabel: "\u8A00\u8A9E",
      },
    },
    en: {
      label: "English",
      lang: "en",
      link: "/en/",
      themeConfig: {
        nav: [{ text: "Home", link: "/en/" }],
        sidebar: sidebarEn,
        langMenuLabel: "Language",
      },
    },
  },
  // FrontmatterTable が doc id をリンク表示できるよう、解決済み href を pageData へ載せる。
  transformPageData(pageData) {
    const frontmatterDocLinks = collectFrontmatterDocLinks(
      pageData.frontmatter,
      pageData.relativePath,
    );
    const docId = getSpecdojoDocId(pageData.frontmatter);
    const gradeSummary = docId ? readGradeSummary(docId) : void 0;
    if (Object.keys(frontmatterDocLinks).length > 0 || gradeSummary) {
      return {
        ...(Object.keys(frontmatterDocLinks).length > 0 ? { frontmatterDocLinks } : {}),
        ...(gradeSummary ? { gradeSummary } : {}),
      };
    }
  },
  markdown: {
    //
    // ```mermaid ... ``` のコードブロックを
    // <img src="/mermaid/<hash>.svg"> に差し替える
    // （Markdownファイルは書き換えない。HTML生成時だけ差し替え）
    //
    config: (md) => {
      md.core.ruler.after("block", "frontmatter-h1", (state) => {
        const fmTitle = state.env?.frontmatter?.title;
        if (!fmTitle) return;
        const hasH1 = state.tokens.some((t) => t.type === "heading_open" && t.tag === "h1");
        if (hasH1) return;
        const Token = state.Token;
        const open = new Token("heading_open", "h1", 1);
        open.markup = "#";
        open.block = true;
        const inline = new Token("inline", "", 0);
        inline.content = String(fmTitle);
        inline.children = [];
        const close = new Token("heading_close", "h1", -1);
        close.markup = "#";
        close.block = true;
        state.tokens.unshift(close);
        state.tokens.unshift(inline);
        state.tokens.unshift(open);
      });
      md.renderer.rules.code_inline = (tokens, idx) => {
        const token = tokens[idx];
        const content = md.utils.escapeHtml(token.content);
        return `<code v-pre>${content}</code>`;
      };
      const defaultLinkOpen = md.renderer.rules.link_open;
      md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const href = token.attrGet("href");
        const currentRelPath = env?.relativePath;
        if (href && currentRelPath) {
          token.attrSet("href", rewriteExecRecordMarkdownHref(href, currentRelPath, GITHUB_SOURCE));
        }
        return defaultLinkOpen
          ? defaultLinkOpen(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options);
      };
      const defaultFence = md.renderer.rules.fence;
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const info = (token.info || "").trim();
        const snippet = token;
        if (snippet.src?.[0]) {
          const relative5 = path9.relative(kataStaging.stagingRoot, snippet.src[0]);
          const original = path9.join(WORKSPACE_ROOT2, relative5);
          if (
            !relative5.startsWith("..") &&
            !path9.isAbsolute(relative5) &&
            existsSync6(original)
          ) {
            snippet.src[0] = original;
          }
        }
        if (info === "mermaid" || info.split(/\s/)[0] === "d2") {
          const code = token.content.trim();
          const kind = info === "mermaid" ? "mermaid" : "d2";
          const id = kind === "mermaid" ? mermaidSvgId(code) : d2SvgId(code);
          const src = `${base}${kind}/${id}.svg`;
          return `
              <p class="mermaid-container">
                <img :src="'${src}'" alt="${kind} diagram" loading="lazy" class="mermaid-image">
              </p>
`;
        }
        return defaultFence
          ? defaultFence(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options);
      };
      md.inline.ruler.before("link", "specdojo_wikilink", (state, silent) => {
        const pos = state.pos;
        if (state.src.charCodeAt(pos) !== 91 || state.src.charCodeAt(pos + 1) !== 91) return false;
        const closeIndex = state.src.indexOf("]]", pos + 2);
        if (closeIndex === -1 || closeIndex > state.posMax) return false;
        const inner = state.src.slice(pos + 2, closeIndex);
        const pipeIdx = inner.indexOf("|");
        const id = pipeIdx === -1 ? inner : inner.slice(0, pipeIdx);
        const displayText = pipeIdx === -1 ? id : inner.slice(pipeIdx + 1);
        if (!/^[a-z][a-z0-9:_-]+$/.test(id)) return false;
        if (!silent) {
          const entry = docIndex[id];
          const execRecordLink = resolveExecRecordWikilink(inner, docIndex, GITHUB_SOURCE);
          if (execRecordLink) {
            let token = state.push("link_open", "a", 1);
            token.attrSet("href", execRecordLink.href);
            token = state.push("text", "", 0);
            token.content = execRecordLink.displayText;
            state.push("link_close", "a", -1);
          } else if (entry) {
            const entryPath = stripEntryLineSuffix2(entry);
            const renderablePath = toRenderableEntryPath(entryPath) ?? entryPath;
            const docsRelTarget = renderablePath.startsWith("docs/")
              ? renderablePath.slice(5)
              : renderablePath;
            const currentRelPath = state.env?.relativePath;
            let href;
            if (currentRelPath) {
              const rel = path9
                .relative(path9.dirname(currentRelPath), docsRelTarget)
                .replace(/\\/g, "/");
              href = rel.startsWith(".") ? rel : "./" + rel;
            } else {
              href = "/" + docsRelTarget;
            }
            let token = state.push("link_open", "a", 1);
            token.attrSet("href", href);
            token = state.push("text", "", 0);
            token.content = displayText;
            state.push("link_close", "a", -1);
          } else {
            const token = state.push("text", "", 0);
            token.content = `[[${inner}]]`;
          }
        }
        state.pos = closeIndex + 2;
        return true;
      });
    },
  },
  vite: {
    publicDir: path9.join(WORKSPACE_ROOT2, "public"),
    plugins: [
      mermaidSvgAutoGenerate({
        rootDir: SITE_CONTENT_ROOT,
        outDir: MERMAID_OUT_DIR,
        contentRoot: CONTENT_ROOT,
        syncFile: (file) => kataStaging.syncFile(file),
      }),
      mermaidAssets(MERMAID_OUT_DIR, base),
      d2SvgAutoGenerate({
        rootDir: SITE_CONTENT_ROOT,
        outDir: D2_OUT_DIR,
        contentRoot: CONTENT_ROOT,
        syncFile: (file) => kataStaging.syncFile(file),
      }),
      mermaidAssets(D2_OUT_DIR, base, "d2"),
    ],
    build: {
      // 最大のチャンクはローカル検索インデックス（@localSearchIndex*）で、
      // 検索モーダルを開いたときだけ動的 import される遅延ロード対象。
      // ドキュメント増加に伴い 500kB を超えるが初期表示には影響しないため、
      // 警告しきい値を引き上げて誤検知を抑制する。
      chunkSizeWarningLimit: 3e3,
    },
  },
});
export { config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3MvY29uZmlnLm10cyIsICJwYWNrYWdlcy9kb2NzLXNpdGUvLnZpdGVwcmVzcy9zaWRlYmFyLWNvbmZpZy50cyIsICJwYWNrYWdlcy9kb2NzLXNpdGUvc3JjL2dlbi1tZXJtYWlkLXN2Zy50cyIsICJwYWNrYWdlcy9kb2NzLXNpdGUvc3JjL2dlbi1kMi1zdmcudHMiLCAicGFja2FnZXMvZG9jcy1zaXRlL3NyYy9kMi5tanMiLCAicGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3MvZDItYXV0by1nZW5lcmF0ZS50cyIsICJwYWNrYWdlcy9kb2NzLXNpdGUvLnZpdGVwcmVzcy9rYXRhLXN0YWdpbmcudHMiLCAicGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3MvbG9jYWxlLXNpZGViYXIudHMiLCAicGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3MvbWVybWFpZC1hc3NldHMudHMiLCAicGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3MvbWVybWFpZC1hdXRvLWdlbmVyYXRlLnRzIiwgInBhY2thZ2VzL2RvY3Mtc2l0ZS8udml0ZXByZXNzL2V4ZWMtcmVjb3JkLWxpbmtzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya3NwYWNlcy9zcGVjZG9qby13b3Jrc3BhY2Uvc3BlY2Rvam8vcGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya3NwYWNlcy9zcGVjZG9qby13b3Jrc3BhY2Uvc3BlY2Rvam8vcGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlcHJlc3NcIjtcbmltcG9ydCB7IGdlbmVyYXRlU2lkZWJhciB9IGZyb20gXCJ2aXRlcHJlc3Mtc2lkZWJhclwiO1xuaW1wb3J0IHtcbiAgc3BlY2Rvam9TaWRlYmFySXRlbXMsXG4gIFBST0pFQ1RTX1NFR01FTlRfVEVYVCxcbiAgUFJPSkVDVFNfRklMRV9URVhULFxuICBQUk9KRUNUU19GSUxFX01FTlUsXG4gIFBST0pFQ1RTX0dST1VQX09SREVSLFxuICBQUk9EVUNUX1NFR01FTlRfVEVYVCxcbiAgUFJPRFVDVF9GSUxFX01FTlUsXG4gIEZMQVRURU5FRF9HUk9VUF9URVhUUyxcbn0gZnJvbSBcIi4vc2lkZWJhci1jb25maWdcIjtcbmltcG9ydCB0eXBlIHsgU2lkZWJhckl0ZW0gfSBmcm9tIFwiLi9zaWRlYmFyLWNvbmZpZ1wiO1xuaW1wb3J0IHsgbWVybWFpZFN2Z0lkIH0gZnJvbSBcIi4uL3NyYy9nZW4tbWVybWFpZC1zdmdcIjtcbmltcG9ydCB7IGQyU3ZnSWQgfSBmcm9tIFwiLi4vc3JjL2dlbi1kMi1zdmdcIjtcbmltcG9ydCB7IGQyU3ZnQXV0b0dlbmVyYXRlIH0gZnJvbSBcIi4vZDItYXV0by1nZW5lcmF0ZVwiO1xuaW1wb3J0IHtcbiAgU1RBR0VEX1BBQ0tBR0VfREVBRF9MSU5LX1BBVFRFUk5TLFxuICBzdGFnZUJ1bmRsZWRLYXRhLFxuICB0b1NpdGVEb2NJbmRleEVudHJ5LFxufSBmcm9tIFwiLi9rYXRhLXN0YWdpbmdcIjtcbmltcG9ydCB7IHNjYW5Mb2NhbGVTaWRlYmFyIH0gZnJvbSBcIi4vbG9jYWxlLXNpZGViYXJcIjtcbmltcG9ydCB7IG1lcm1haWRBc3NldHMgfSBmcm9tIFwiLi9tZXJtYWlkLWFzc2V0c1wiO1xuaW1wb3J0IHsgbWVybWFpZFN2Z0F1dG9HZW5lcmF0ZSB9IGZyb20gXCIuL21lcm1haWQtYXV0by1nZW5lcmF0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZUV4ZWNSZWNvcmRXaWtpbGluaywgcmV3cml0ZUV4ZWNSZWNvcmRNYXJrZG93bkhyZWYgfSBmcm9tIFwiLi9leGVjLXJlY29yZC1saW5rc1wiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jLCByZWFkZGlyU3luYyB9IGZyb20gXCJub2RlOmZzXCI7XG5cbmNvbnN0IFdPUktTUEFDRV9ST09UID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuZW52LlNQRUNET0pPX0RPQ1NfUk9PVCA/PyBwcm9jZXNzLmN3ZCgpKTtcbmNvbnN0IENPTlRFTlRfUk9PVCA9IHBhdGguam9pbihXT1JLU1BBQ0VfUk9PVCwgXCJkb2NzXCIpO1xuY29uc3QgTUVSTUFJRF9PVVRfRElSID0gcGF0aC5qb2luKFdPUktTUEFDRV9ST09ULCBcIi52aXRlcHJlc3NcIiwgXCJtZXJtYWlkXCIpO1xuY29uc3QgRDJfT1VUX0RJUiA9IHBhdGguam9pbihXT1JLU1BBQ0VfUk9PVCwgXCIudml0ZXByZXNzXCIsIFwiZDJcIik7XG5cbi8vIFx1MzBCNVx1MzBBNFx1MzBDOFx1MzA0Qlx1MzA4OVx1OTY2NFx1NTkxNlx1MzA1N1x1MzA1RiBleGVjIFx1MzA2RSBwbGFuIC8gcmVzdWx0IFx1MzA2Rlx1MzAwMVx1MzBFQVx1MzBERFx1MzBCOFx1MzBDOFx1MzBFQVx1NEUwQVx1MzA2RVx1NkI2M1x1NjcyQ1x1MzA3OFx1MzBFQVx1MzBGM1x1MzBBRlx1MzA1OVx1MzA4Qlx1MzAwMlxuLy8gVVJMIFx1MzA2RVx1N0Q0NFx1MzA3Rlx1N0FDQlx1MzA2Nlx1NTE0M1x1MzA5Mlx1MzA1M1x1MzA1M1x1MzA2Qlx1OTZDNlx1N0QwNFx1MzA1N1x1MzAwMU1hcmtkb3duIFx1NjcyQ1x1NjU4N1x1MzA4NCBkb2MtaW5kZXggXHUzMDZCXHUzMDZGIEdpdEh1YiBcdTU2RkFcdTY3MDlcdTUwMjRcdTMwOTJcdTYzMDFcdTMwNUZcdTMwNUJcdTMwNkFcdTMwNDRcdTMwMDJcbmNvbnN0IEdJVEhVQl9TT1VSQ0UgPSB7XG4gIHJlcG9zaXRvcnlVcmw6IFwiaHR0cHM6Ly9naXRodWIuY29tL3NwZWNkb2pvL3NwZWNkb2pvXCIsXG4gIGJyYW5jaDogXCJtYWluXCIsXG59IGFzIGNvbnN0O1xuXG4vLyBwYWNrYWdlIFx1NTNDMlx1NzE2N1x1NEUyRFx1MzA2RSBrYXRhIFx1MzA5Mlx1MzBEQVx1MzBGQ1x1MzBCOFx1OEQ3MFx1NjdGQlx1MzA4OFx1MzA4QVx1NTI0RFx1MzA2Qlx1MzBCOVx1MzBDNlx1MzBGQ1x1MzBCOFx1MzBGM1x1MzBCMFx1MzA3OFx1ODkwN1x1ODhGRFx1MzA1OVx1MzA4Qlx1MzAwMlxuLy8gVml0ZVByZXNzIFx1MzA2Rlx1OEEyRFx1NUI5QVx1MzA2RVx1OEFBRFx1MzA3Rlx1OEZCQ1x1MzA3Rlx1NUY4Q1x1MzA2Qlx1MzBEQVx1MzBGQ1x1MzBCOFx1MzA5Mlx1OEQ3MFx1NjdGQlx1MzA1OVx1MzA4Qlx1MzA1Rlx1MzA4MVx1MzAwMWJ1aWxkIC8gZGV2IFx1MzA2RVx1NEUyMVx1NjVCOVx1MzA2N1x1MzA1M1x1MzA1M1x1MzA0Q1x1NTE0OFx1MzA2Qlx1NTJENVx1MzA0Rlx1MzAwMlxuY29uc3Qga2F0YVN0YWdpbmcgPSBzdGFnZUJ1bmRsZWRLYXRhKFdPUktTUEFDRV9ST09UKTtcbmlmIChrYXRhU3RhZ2luZy5wYWNrYWdlUm9vdCkge1xuICBjb25zb2xlLmxvZyhcbiAgICBgW2thdGFdIHN0YWdlZCAke2thdGFTdGFnaW5nLnN0YWdlZH0gZmlsZShzKSBmcm9tICR7a2F0YVN0YWdpbmcucGFja2FnZVJvb3R9IChlamVjdGVkOiAke2thdGFTdGFnaW5nLmVqZWN0ZWR9KWAsXG4gICk7XG59XG5jb25zdCBTSVRFX0NPTlRFTlRfUk9PVCA9IHBhdGguam9pbihrYXRhU3RhZ2luZy5zdGFnaW5nUm9vdCwgXCJkb2NzXCIpO1xuXG4vLyBbW2lkXV0gd2lraWxpbmsgaW5kZXggXHUyMDE0IGxvYWRlZCBvbmNlIGF0IGJ1aWxkL2RldiBzdGFydHVwXG5mdW5jdGlvbiBsb2FkRG9jSW5kZXgod29ya3NwYWNlUm9vdDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gIGNvbnN0IHAgPSBwYXRoLmpvaW4od29ya3NwYWNlUm9vdCwgXCIuc3BlY2Rvam9cIiwgXCJkb2MtaW5kZXguanNvblwiKTtcbiAgaWYgKCFleGlzdHNTeW5jKHApKSByZXR1cm4ge307XG4gIHRyeSB7XG4gICAgY29uc3QgZW50cmllcyA9IChKU09OLnBhcnNlKHJlYWRGaWxlU3luYyhwLCBcInV0ZjhcIikpIGFzIHsgZW50cmllczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9KVxuICAgICAgLmVudHJpZXM7XG4gICAgLy8gcGFja2FnZSBcdTUwNzQga2F0YSBcdTMwNkVcdTMwQThcdTMwRjNcdTMwQzhcdTMwRUFcdTMwNkZcdTMwQjlcdTMwQzZcdTMwRkNcdTMwQjhcdTMwRjNcdTMwQjBcdTdENENcdTc1MzFcdTMwNkVcdTUxNkNcdTk1OEJcdTMwRDFcdTMwQjlcdTMwNzhcdTRFRDhcdTMwNTFcdTY2RkZcdTMwNDhcdTMwOEJcdTMwMDJcbiAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgT2JqZWN0LmVudHJpZXMoZW50cmllcykubWFwKChbaWQsIGVudHJ5XSkgPT4gW1xuICAgICAgICBpZCxcbiAgICAgICAgdG9TaXRlRG9jSW5kZXhFbnRyeShlbnRyeSwgd29ya3NwYWNlUm9vdCwga2F0YVN0YWdpbmcucGFja2FnZVJvb3QpLFxuICAgICAgXSksXG4gICAgKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG5jb25zdCBkb2NJbmRleCA9IGxvYWREb2NJbmRleChXT1JLU1BBQ0VfUk9PVCk7XG5cbi8vIGRvYy1pbmRleCBcdTMwQThcdTMwRjNcdTMwQzhcdTMwRUFcdTMwNEJcdTMwODlcdTg4NENcdTc1NkFcdTUzRjdcdTMwQjVcdTMwRDVcdTMwQTNcdTMwQzNcdTMwQUZcdTMwQjlcdTMwOTJcdTk2NjRcdTUzQkJcdTMwNTlcdTMwOEJcdUZGMDhcdTRGOEI6IFwiZG9jcy9qYS9mb28ueWFtbDo0MlwiIFx1MjE5MiBcImRvY3MvamEvZm9vLnlhbWxcIlx1RkYwOVxuZnVuY3Rpb24gc3RyaXBFbnRyeUxpbmVTdWZmaXgoZW50cnk6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGNvbG9uSW5kZXggPSBlbnRyeS5sYXN0SW5kZXhPZihcIjpcIik7XG4gIGNvbnN0IGhhc0xpbmUgPSBjb2xvbkluZGV4ID4gMCAmJiAvXlxcZCskLy50ZXN0KGVudHJ5LnNsaWNlKGNvbG9uSW5kZXggKyAxKSk7XG4gIHJldHVybiBoYXNMaW5lID8gZW50cnkuc2xpY2UoMCwgY29sb25JbmRleCkgOiBlbnRyeTtcbn1cblxuLy8gXHUzMEE4XHUzMEYzXHUzMEM4XHUzMEVBXHUzMEQxXHUzMEI5XHUzMDkyXHUzMERBXHUzMEZDXHUzMEI4XHUzMDY4XHUzMDU3XHUzMDY2XHU4ODY4XHU3OTNBXHUzMDY3XHUzMDREXHUzMDhCIE1hcmtkb3duIFx1MzBEMVx1MzBCOVx1MzA3OFx1ODlFM1x1NkM3QVx1MzA1OVx1MzA4Qlx1MzAwMlxuLy8gWUFNTCBcdTMwNkYgVml0ZVByZXNzIFx1MzA2RVx1MzBEQVx1MzBGQ1x1MzBCOFx1MzA2Qlx1MzA2QVx1MzA4OVx1MzA2QVx1MzA0NFx1MzA1Rlx1MzA4MVx1MzAwMXlhbWwtcGFnZXMgYnVpbGQgXHUzMDRDXHU3NTFGXHU2MjEwXHUzMDU3XHUzMDVGXG4vLyBcdTU0MENcdTk2OEVcdTVDNjRcdTMwNkUgZ2VuZXJhdGVkLzxuYW1lPi5tZCBcdTMwNENcdTMwNDJcdTMwOENcdTMwNzBcdTMwNURcdTMwNjFcdTMwODlcdTMwNzhcdTRFRDhcdTMwNTFcdTY2RkZcdTMwNDhcdTMwOEJcdTMwMDJcbmZ1bmN0aW9uIHRvUmVuZGVyYWJsZUVudHJ5UGF0aChlbnRyeVBhdGg6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGlmIChlbnRyeVBhdGguZW5kc1dpdGgoXCIubWRcIikpIHJldHVybiBlbnRyeVBhdGg7XG4gIGlmICghL1xcLnlhP21sJC8udGVzdChlbnRyeVBhdGgpKSByZXR1cm4gdW5kZWZpbmVkO1xuICBjb25zdCBwYWdlUGF0aCA9IHBhdGgucG9zaXguam9pbihcbiAgICBwYXRoLnBvc2l4LmRpcm5hbWUoZW50cnlQYXRoKSxcbiAgICBcImdlbmVyYXRlZFwiLFxuICAgIHBhdGgucG9zaXguYmFzZW5hbWUoZW50cnlQYXRoKS5yZXBsYWNlKC9cXC55YT9tbCQvLCBcIi5tZFwiKSxcbiAgKTtcbiAgcmV0dXJuIGV4aXN0c1N5bmMocGF0aC5qb2luKFdPUktTUEFDRV9ST09ULCBwYWdlUGF0aCkpID8gcGFnZVBhdGggOiB1bmRlZmluZWQ7XG59XG5cbi8vIGRvYyBpZCBcdTMwOTIgZG9jLWluZGV4IFx1MzA2NyBkb2NzIFx1MzBFQlx1MzBGQ1x1MzBDOFx1NzZGOFx1NUJGRVx1MzBEMVx1MzBCOVx1RkYwOFwiamEvLi4uXCJcdUZGMDlcdTMwNzhcdTg5RTNcdTZDN0FcdTMwNTlcdTMwOEJcdTMwMDJcbi8vIFx1ODg2OFx1NzkzQVx1NTNFRlx1ODBGRFx1MzA2QSBNYXJrZG93blx1RkYwOFlBTUwgXHUzMDZFXHU1ODM0XHU1NDA4XHUzMDZGXHU4ODY4XHU3OTNBXHU3NTI4XHU3NTFGXHU2MjEwXHUzMERBXHUzMEZDXHUzMEI4XHVGRjA5XHUzMDc4XHU4OUUzXHU2QzdBXHUzMDY3XHUzMDREXHUzMDZBXHUzMDQ0IGlkIFx1MzA2Rlx1NUJGRVx1OEM2MVx1NTkxNlx1MzAwMlxuZnVuY3Rpb24gcmVzb2x2ZURvY1JlbFBhdGgoaWQ6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGVudHJ5ID0gZG9jSW5kZXhbaWRdO1xuICBpZiAoIWVudHJ5KSByZXR1cm4gdW5kZWZpbmVkO1xuICBjb25zdCByZW5kZXJhYmxlUGF0aCA9IHRvUmVuZGVyYWJsZUVudHJ5UGF0aChzdHJpcEVudHJ5TGluZVN1ZmZpeChlbnRyeSkpO1xuICBpZiAoIXJlbmRlcmFibGVQYXRoKSByZXR1cm4gdW5kZWZpbmVkO1xuICByZXR1cm4gcmVuZGVyYWJsZVBhdGguc3RhcnRzV2l0aChcImRvY3MvXCIpID8gcmVuZGVyYWJsZVBhdGguc2xpY2UoNSkgOiByZW5kZXJhYmxlUGF0aDtcbn1cblxuLy8gZnJvbnRtYXR0ZXJcdUZGMDhGcm9udG1hdHRlclRhYmxlIFx1MzA0Q1x1NUM1NVx1OTU4Qlx1MzA1OVx1MzA4Qlx1NEU5NFx1OTY4RVx1NUM2NFx1MzA3RVx1MzA2N1x1RkYwOVx1MzA2RVx1NjU4N1x1NUI1N1x1NTIxN1x1NTAyNFx1MzBGQlx1NjU4N1x1NUI1N1x1NTIxN1x1OTE0RFx1NTIxN1x1ODk4MVx1N0QyMFx1MzA2RVx1MzA0Nlx1MzA2MVxuLy8gZG9jLWluZGV4IFx1MzA2Qlx1NUI1OFx1NTcyOFx1MzA1OVx1MzA4QiBpZCBcdTMwOTJcdTMwQjVcdTMwQTRcdTMwQzhcdTMwRUJcdTMwRkNcdTMwQzhcdTc2RjhcdTVCRkVcdTMwNkUgaHJlZlx1RkYwOGRvYyBpZCBcdTIxOTIgXCIvamEvLi4uLmh0bWxcIlx1RkYwOVx1MzA3OFx1ODlFM1x1NkM3QVx1MzA1OVx1MzA4Qlx1MzAwMlxuLy8gXHU4MUVBXHUzMERBXHUzMEZDXHUzMEI4XHUzMDc4XHUzMDZFIGlkIFx1MzA2Rlx1OTY2NFx1NTkxNlx1MzA1OVx1MzA4Qlx1MzAwMlxuY29uc3QgRlJPTlRNQVRURVJfTElOS19NQVhfREVQVEggPSA1O1xuXG5mdW5jdGlvbiBjb2xsZWN0RnJvbnRtYXR0ZXJEb2NMaW5rcyhcbiAgZnJvbnRtYXR0ZXI6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICBjdXJyZW50UmVsUGF0aDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gIGNvbnN0IGxpbmtzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG5cbiAgY29uc3QgYWRkQ2FuZGlkYXRlID0gKGNhbmRpZGF0ZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgaWYgKGxpbmtzW2NhbmRpZGF0ZV0pIHJldHVybjtcbiAgICBjb25zdCBkb2NzUmVsUGF0aCA9IHJlc29sdmVEb2NSZWxQYXRoKGNhbmRpZGF0ZSk7XG4gICAgaWYgKCFkb2NzUmVsUGF0aCB8fCBkb2NzUmVsUGF0aCA9PT0gY3VycmVudFJlbFBhdGgpIHJldHVybjtcbiAgICBsaW5rc1tjYW5kaWRhdGVdID0gXCIvXCIgKyBkb2NzUmVsUGF0aC5yZXBsYWNlKC9cXC5tZCQvLCBcIi5odG1sXCIpO1xuICB9O1xuXG4gIGNvbnN0IHZpc2l0ID0gKHZhbHVlOiB1bmtub3duLCBkZXB0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgYWRkQ2FuZGlkYXRlKHZhbHVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiKSBhZGRDYW5kaWRhdGUoaXRlbSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgZGVwdGggPCBGUk9OVE1BVFRFUl9MSU5LX01BWF9ERVBUSCkge1xuICAgICAgZm9yIChjb25zdCBjaGlsZFZhbHVlIG9mIE9iamVjdC52YWx1ZXModmFsdWUpKSB2aXNpdChjaGlsZFZhbHVlLCBkZXB0aCArIDEpO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGNvbnN0IHZhbHVlIG9mIE9iamVjdC52YWx1ZXMoZnJvbnRtYXR0ZXIpKSB2aXNpdCh2YWx1ZSwgMSk7XG5cbiAgcmV0dXJuIGxpbmtzO1xufVxuXG5mdW5jdGlvbiBnZXRTcGVjZG9qb0RvY0lkKGZyb250bWF0dGVyOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHNwZWNkb2pvID0gZnJvbnRtYXR0ZXI/LnNwZWNkb2pvO1xuICBpZiAoIXNwZWNkb2pvIHx8IHR5cGVvZiBzcGVjZG9qbyAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KHNwZWNkb2pvKSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICBjb25zdCBpZCA9IChzcGVjZG9qbyBhcyB7IGlkPzogdW5rbm93biB9KS5pZDtcbiAgaWYgKHR5cGVvZiBpZCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIHVuZGVmaW5lZDtcblxuICBjb25zdCB0cmltbWVkSWQgPSBpZC50cmltKCk7XG4gIHJldHVybiB0cmltbWVkSWQubGVuZ3RoID4gMCA/IHRyaW1tZWRJZCA6IHVuZGVmaW5lZDtcbn1cblxudHlwZSBHcmFkZVN1bW1hcnkgPSB7XG4gIHZlcmRpY3Q6IHN0cmluZztcbiAgc2NvcmU6IG51bWJlcjtcbiAgZmluZGluZ3M6IG51bWJlcjtcbiAgZ3JhZGVkQXQ6IHN0cmluZztcbiAgZ3JhZGVkQnk6IHN0cmluZztcbn07XG5cbmZ1bmN0aW9uIHJlYWRHcmFkZVN1bW1hcnkoZG9jSWQ6IHN0cmluZyk6IEdyYWRlU3VtbWFyeSB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHByb2plY3RzUm9vdCA9IHBhdGguam9pbihXT1JLU1BBQ0VfUk9PVCwgXCJkb2NzXCIsIFwiamFcIiwgXCJwcm9qZWN0c1wiKTtcbiAgaWYgKCFleGlzdHNTeW5jKHByb2plY3RzUm9vdCkpIHJldHVybiB1bmRlZmluZWQ7XG4gIGZvciAoY29uc3QgZW50cnkgb2YgcmVhZGRpclN5bmMocHJvamVjdHNSb290LCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSkpIHtcbiAgICBpZiAoIWVudHJ5LmlzRGlyZWN0b3J5KCkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHJlc3VsdFBhdGggPSBwYXRoLmpvaW4oXG4gICAgICBwcm9qZWN0c1Jvb3QsXG4gICAgICBlbnRyeS5uYW1lLFxuICAgICAgXCJleGVjdXRpb25cIixcbiAgICAgIFwiZ3JhZGVcIixcbiAgICAgIFwicmVzdWx0c1wiLFxuICAgICAgLy8gc3JjL2dyYWRlLXJlc3VsdC50cyBcdTMwNkUgZ3JhZGVSZXN1bHRGaWxlTmFtZSBcdTMwNjhcdTU0MENcdTMwNThcdTg5OEZcdTUyNDdcdUZGMDhcIjpcIiBcdTMwOTIgXCIuXCIgXHUzMDZCXHU3RjZFXHU2M0RCXHVGRjA5XHUzMDAyXG4gICAgICBgJHtkb2NJZC5yZXBsYWNlKC86L2csIFwiLlwiKX0ueWFtbGAsXG4gICAgKTtcbiAgICBpZiAoIWV4aXN0c1N5bmMocmVzdWx0UGF0aCkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbnRlbnQgPSByZWFkRmlsZVN5bmMocmVzdWx0UGF0aCwgXCJ1dGY4XCIpO1xuICAgIGNvbnN0IHZlcmRpY3QgPSBjb250ZW50Lm1hdGNoKC9edmVyZGljdDpcXHMqKFxcUyspXFxzKiQvbSk/LlsxXTtcbiAgICBjb25zdCBzY29yZSA9IE51bWJlcihjb250ZW50Lm1hdGNoKC9ec2NvcmU6XFxzKihcXGQrKVxccyokL20pPy5bMV0pO1xuICAgIGNvbnN0IGdyYWRlZEF0ID0gY29udGVudC5tYXRjaCgvXmdyYWRlZF9hdDpcXHMqW1wiJ10/KFteXCInXFxzXSspW1wiJ10/XFxzKiQvbSk/LlsxXTtcbiAgICBjb25zdCBncmFkZWRCeSA9IGNvbnRlbnQubWF0Y2goL15ncmFkZWRfYnk6XFxzKltcIiddPyguKz8pW1wiJ10/XFxzKiQvbSk/LlsxXTtcbiAgICBjb25zdCBjb3VudHMgPSBbLi4uY29udGVudC5tYXRjaEFsbCgvXiAgKD86YmxvY2tlcnxtYWpvcnxtaW5vcnxub3RlKTpcXHMqKFxcZCspXFxzKiQvZ20pXTtcbiAgICBpZiAoIXZlcmRpY3QgfHwgIU51bWJlci5pc0Zpbml0ZShzY29yZSkgfHwgIWdyYWRlZEF0IHx8ICFncmFkZWRCeSB8fCBjb3VudHMubGVuZ3RoICE9PSA0KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgdmVyZGljdCxcbiAgICAgIHNjb3JlLFxuICAgICAgZmluZGluZ3M6IGNvdW50cy5yZWR1Y2UoKHN1bSwgbWF0Y2gpID0+IHN1bSArIE51bWJlcihtYXRjaFsxXSksIDApLFxuICAgICAgZ3JhZGVkQXQsXG4gICAgICBncmFkZWRCeSxcbiAgICB9O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZUh0bWwodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB2YWx1ZVxuICAgIC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAucmVwbGFjZSgvJy9nLCBcIiYjMzk7XCIpO1xufVxuXG5mdW5jdGlvbiBtYWtlU2VhcmNoRG9jSWRUZXh0KGRvY0lkOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBhbGlhc2VzID0gW2RvY0lkXTtcbiAgY29uc3QgbG9jYWxJZCA9IGRvY0lkLmluY2x1ZGVzKFwiOlwiKSA/IGRvY0lkLnNsaWNlKGRvY0lkLmxhc3RJbmRleE9mKFwiOlwiKSArIDEpIDogdW5kZWZpbmVkO1xuICBpZiAobG9jYWxJZCAmJiBsb2NhbElkICE9PSBkb2NJZCkgYWxpYXNlcy5wdXNoKGxvY2FsSWQpO1xuXG4gIGNvbnN0IHdlaWdodGVkQWxpYXNlcyA9IGFsaWFzZXMuZmxhdE1hcCgoYWxpYXMsIGluZGV4KSA9PlxuICAgIEFycmF5KGluZGV4ID09PSAwID8gODAgOiA0MCkuZmlsbChhbGlhcyksXG4gICk7XG4gIHJldHVybiBgXHUzMEM5XHUzMEFEXHUzMEU1XHUzMEUxXHUzMEYzXHUzMEM4SUQgRG9jdW1lbnQgSUQgJHt3ZWlnaHRlZEFsaWFzZXMuam9pbihcIiBcIil9YDtcbn1cblxuZnVuY3Rpb24gdG9rZW5pemVTZWFyY2hUZXh0KHRleHQ6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgdGVybXMgPSB0ZXh0LnNwbGl0KC9bXFxzXFxwe1B9XFxwe1N9XSsvdSkuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBpZFRva2VucyA9XG4gICAgdGV4dC5tYXRjaCgvW0EtWmEtejAtOV1bQS1aYS16MC05LV0qKD86OltBLVphLXowLTldW0EtWmEtejAtOS1dKnwoPzotW0EtWmEtejAtOV0rKSspL2cpID8/IFtdO1xuXG4gIHJldHVybiBbLi4udGVybXMsIC4uLmlkVG9rZW5zXTtcbn1cblxuZnVuY3Rpb24gaW5qZWN0U2VhcmNoRG9jSWQoaHRtbDogc3RyaW5nLCBkb2NJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3Qgc2VhcmNoVGV4dCA9IGVzY2FwZUh0bWwobWFrZVNlYXJjaERvY0lkVGV4dChkb2NJZCkpO1xuICBjb25zdCBoaWRkZW5Eb2NJZCA9IGA8cCBoaWRkZW4gY2xhc3M9XCJ2cC1zZWFyY2gtZG9jLWlkXCI+JHtzZWFyY2hUZXh0fTwvcD5gO1xuXG4gIGlmICgvPGgxXFxiL2kudGVzdChodG1sKSkge1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UoLyg8aDFcXGJbXFxzXFxTXSo/PFxcL2gxPikvaSwgYCQxXFxuJHtoaWRkZW5Eb2NJZH1gKTtcbiAgfVxuXG4gIHJldHVybiBgJHtodG1sfVxcbiR7aGlkZGVuRG9jSWR9YDtcbn1cblxudHlwZSBTZWFyY2hSZW5kZXJFbnYgPSB7XG4gIGZyb250bWF0dGVyPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIHJlbGF0aXZlUGF0aD86IHN0cmluZztcbn07XG5cbmNvbnN0IGlzRXhlY1JlY29yZFBhdGggPSAocmVsYXRpdmVQYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBib29sZWFuID0+XG4gIHJlbGF0aXZlUGF0aCAhPT0gdW5kZWZpbmVkICYmXG4gIC8oXnxcXC8pZXhlY3V0aW9uXFwvZXhlY1xcLyhldmVudHN8cGxhbnN8cmVzdWx0cykoXFwvfCQpLy50ZXN0KHJlbGF0aXZlUGF0aC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKSk7XG5cbmNvbnN0IGlzRXhjbHVkZWRTZWFyY2hQYXRoID0gKHJlbGF0aXZlUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkKTogYm9vbGVhbiA9PiB7XG4gIGlmICghcmVsYXRpdmVQYXRoKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHBhdGggPSByZWxhdGl2ZVBhdGgucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG5cbiAgaWYgKC8oXnxcXC8pZXhlY3V0aW9uXFwvZXhlY1xcLyhldmVudHN8cGxhbnN8cmVzdWx0cykoXFwvfCQpLy50ZXN0KHBhdGgpKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKC8oXnxcXC8pY29udHJvbHNcXC9wcm9qZWN0LXJlZ2lzdGVyXFwvcGpyLVteL10rXFwubWQkLy50ZXN0KHBhdGgpKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKC8oXnxcXC8pY29udHJvbHNcXC9wcm9qZWN0LXJlZ2lzdGVyXFwvZ2VuZXJhdGVkXFwvcGpyLXZpZXdzLWJ5LVteL10rXFwubWQkLy50ZXN0KHBhdGgpKVxuICAgIHJldHVybiB0cnVlO1xuICBpZiAoLyhefFxcLyljb250cm9sc1xcL2dlbmVyYXRlZFxcL3BtLVteL10rXFwubWQkLy50ZXN0KHBhdGgpKSByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5mdW5jdGlvbiByZW5kZXJTZWFyY2hIdG1sKFxuICBzcmM6IHN0cmluZyxcbiAgZW52OiBTZWFyY2hSZW5kZXJFbnYsXG4gIG1kOiB7IHJlbmRlcjogKHNyYzogc3RyaW5nLCBlbnY6IHVua25vd24pID0+IHN0cmluZyB9LFxuKTogc3RyaW5nIHtcbiAgaWYgKGVudi5mcm9udG1hdHRlcj8uc2VhcmNoID09PSBmYWxzZSB8fCBpc0V4Y2x1ZGVkU2VhcmNoUGF0aChlbnYucmVsYXRpdmVQYXRoKSkgcmV0dXJuIFwiXCI7XG5cbiAgY29uc3QgaHRtbCA9IG1kLnJlbmRlcihzcmMsIGVudik7XG4gIGNvbnN0IGRvY0lkID0gZ2V0U3BlY2Rvam9Eb2NJZChlbnYuZnJvbnRtYXR0ZXIpO1xuICByZXR1cm4gZG9jSWQgPyBpbmplY3RTZWFyY2hEb2NJZChodG1sLCBkb2NJZCkgOiBodG1sO1xufVxuXG5jb25zdCBzcGVjZG9qb0l0ZW1zID0ge1xuICBqYToge1xuICAgIHRleHQ6IFwic3BlY2Rvam9cIixcbiAgICBsaW5rOiBcIi9qYS9zcGVjZG9qby9cIixcbiAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgIGl0ZW1zOiBzcGVjZG9qb1NpZGViYXJJdGVtcyxcbiAgfSxcbn07XG5cbi8vIEdpdEh1YiBQYWdlcyBcdTMwNkVcdTUxNkNcdTk1OEJcdTMwRDFcdTMwQjk6IGh0dHBzOi8vc3BlY2Rvam8uZ2l0aHViLmlvL3NwZWNkb2pvL1xuY29uc3QgYmFzZSA9IFwiL3NwZWNkb2pvL1wiO1xuXG4vKipcbiAqIFx1OEZGRFx1NTJBMFx1MzA1N1x1MzA1Rlx1MzA0NFx1MzBFRFx1MzBCMVx1MzBGQ1x1MzBFQlx1MzA2Rlx1MzA1M1x1MzA1M1x1MzA2Qlx1OERCM1x1MzA1OVx1MzA2MFx1MzA1MVx1MzA2N09LXG4gKiAtIGxvY2FsZTogVVJMIFx1MzA2OCBkb2NzLzxsb2NhbGU+LyBcdTMwNkVcdTMwQzdcdTMwQTNcdTMwRUNcdTMwQUZcdTMwQzhcdTMwRUFcdTU0MERcdTMwNkJcdTRGN0ZcdTMwNDZcbiAqIC0gbGFiZWw6IFx1OEEwMFx1OEE5RVx1MzBCQlx1MzBFQ1x1MzBBRlx1MzBCRlx1MzBGQ1x1ODg2OFx1NzkzQVx1NTQwRFxuICogLSBsYW5nOiA8aHRtbCBsYW5nPVwiLi4uXCI+IFx1MzA2Qlx1NEY3Rlx1MzA0NlxuICovXG5jb25zdCBMT0NBTEVTID0gW1xuICB7IGxvY2FsZTogXCJqYVwiLCBsYWJlbDogXCJcdTY1RTVcdTY3MkNcdThBOUVcIiwgbGFuZzogXCJqYVwiIH0sXG4gIHsgbG9jYWxlOiBcImVuXCIsIGxhYmVsOiBcIkVuZ2xpc2hcIiwgbGFuZzogXCJlblwiIH0sXG5dIGFzIGNvbnN0O1xudHlwZSBMb2NhbGUgPSAodHlwZW9mIExPQ0FMRVMpW251bWJlcl1bXCJsb2NhbGVcIl07XG5cbi8vIGxpbmsgXHUzMDRCXHUzMDg5XHU2NzJCXHU1QzNFXHU4OTgxXHU3RDIwXHVGRjA4XHU2MkUxXHU1RjM1XHU1QjUwXHUzMDZBXHUzMDU3XHU2MEYzXHU1QjlBXHVGRjA5XHUzMDkyXHU1M0Q2XHUzMDhBXHU1MUZBXHUzMDU5XHVGRjFBXCIvZm9vLzAxMC1iYXJcIiAtPiBcIjAxMC1iYXJcIlxuY29uc3QgZ2V0QmFzZUZyb21MaW5rID0gKGxpbms/OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICBpZiAoIWxpbmspIHJldHVybiBcIlwiO1xuICBjb25zdCBjbGVhbiA9IGxpbmsuc3BsaXQoXCIjXCIpWzBdLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XG4gIHJldHVybiBjbGVhbi5zcGxpdChcIi9cIikucG9wKCkgPz8gXCJcIjtcbn07XG5cbi8vIFx1NTIyNFx1NUI5QVx1RkYxQVJFQURNRSAvICpydWxlYm9va1xuY29uc3QgaXNSZWFkbWUgPSAoaXRlbTogU2lkZWJhckl0ZW0pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGdldEJhc2VGcm9tTGluayhpdGVtLmxpbmspLnRvTG93ZXJDYXNlKCkgPT09IFwicmVhZG1lXCI7XG59O1xuXG5jb25zdCBpc1J1bGVib29rID0gKGl0ZW06IFNpZGViYXJJdGVtKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBnZXRCYXNlRnJvbUxpbmsoaXRlbS5saW5rKS50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKFwicnVsZWJvb2tcIik7XG59O1xuXG4vLyBcdTY1RTJcdTMwNkIgLzxsb2NhbGU+LyBcdTMwNENcdTRFRDhcdTMwNDRcdTMwNjZcdTMwNDRcdTMwOEJcdTMwNEJcdTMwOTIgTE9DQUxFUyBcdTMwNEJcdTMwODlcdTUyMjRcdTVCOUFcdUZGMDhcdTVDMDZcdTY3NjVcdTU4OTdcdTMwNDhcdTMwNjZcdTMwODJPS1x1RkYwOVxuY29uc3QgaXNBbHJlYWR5UHJlZml4ZWRCeUFueUxvY2FsZSA9IChwYXRoOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIExPQ0FMRVMuc29tZSgoeyBsb2NhbGUgfSkgPT4gcGF0aCA9PT0gYC8ke2xvY2FsZX1gIHx8IHBhdGguc3RhcnRzV2l0aChgLyR7bG9jYWxlfS9gKSk7XG59O1xuXG4vLyBcdTMwQkRcdTMwRkNcdTMwQzhcdTc1MjhcdTMwNkVcdTMwQURcdTMwRkNcdUZGMUFcbi8vIDEpIFJFQURNRVx1RkYwOFx1NjcwMFx1NTEyQVx1NTE0OFx1RkYwOVxuLy8gMikgKnJ1bGVib29rXHVGRjA4XHU2QjIxXHVGRjA5XG4vLyAzKSBcdTY1RTJcdTc3RTVcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdUZGMDhQUk9KRUNUU19GSUxFX01FTlUgXHUzMDZFIG9yZGVyIFx1OTgwNlx1MzAwMlx1MzBCQ1x1MzBFRFx1NTdDQlx1MzA4MVx1MzA2N1x1NjcyQVx1NzY3Qlx1OTMzMlx1NTQwRFx1MzA4OFx1MzA4QVx1NTE0OFx1MzA2Qlx1NEUyNlx1MzA3Nlx1RkYwOVxuLy8gNCkgZXhlYyBcdTMwNkUgcmVzdWx0XHVGRjA4c3RhcnRlZF9hdCBcdTMwNkVcdTY2NDJcdTdDRkJcdTUyMTdcdTk4MDZcdUZGMDlcbi8vIDUpIFx1MzA1RFx1MzA2RVx1NEVENlx1RkYxQVx1MzBENVx1MzBBMVx1MzBBNFx1MzBFQlx1NTQwRFx1OTgwNlxuY29uc3Qgc29ydEtleSA9IChpdGVtOiBTaWRlYmFySXRlbSk6IHsgYnVja2V0OiBudW1iZXI7IG5hbWU6IHN0cmluZyB9ID0+IHtcbiAgaWYgKGlzUmVhZG1lKGl0ZW0pKSByZXR1cm4geyBidWNrZXQ6IDAsIG5hbWU6IFwiXCIgfTtcbiAgaWYgKGlzUnVsZWJvb2soaXRlbSkpIHJldHVybiB7IGJ1Y2tldDogMSwgbmFtZTogZ2V0QmFzZUZyb21MaW5rKGl0ZW0ubGluaykudG9Mb3dlckNhc2UoKSB9O1xuICBpZiAoIWl0ZW0ubGluaykge1xuICAgIC8vIFx1MzBCMFx1MzBFQlx1MzBGQ1x1MzBEN1x1RkYwOFx1MzBFQVx1MzBGM1x1MzBBRlx1MzA2QVx1MzA1N1x1RkYwOVx1MzA2Rlx1NjVFMlx1NUI5QVx1MzA2N1x1NTE0OFx1OTgyRFx1MzAwMlBST0pFQ1RTX0dST1VQX09SREVSIFx1MzA2N1x1NTAwQlx1NTIyNVx1MzA2Qlx1NUY4Q1x1MzA4RFx1MzA3OFx1NTJENVx1MzA0Qlx1MzA1Qlx1MzA4QlxuICAgIGNvbnN0IGdyb3VwT3JkZXIgPSBQUk9KRUNUU19HUk9VUF9PUkRFUltpdGVtLnRleHQgPz8gXCJcIl07XG4gICAgaWYgKGdyb3VwT3JkZXIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHsgYnVja2V0OiAyLCBuYW1lOiBTdHJpbmcoZ3JvdXBPcmRlcikucGFkU3RhcnQoNCwgXCIwXCIpIH07XG4gICAgcmV0dXJuIHsgYnVja2V0OiAyLCBuYW1lOiBcIlwiIH07XG4gIH1cbiAgY29uc3QgY2F0YWxvZ09yZGVyID0gY2F0YWxvZ1NpZGViYXJPcmRlcihpdGVtLmxpbmspO1xuICBpZiAoY2F0YWxvZ09yZGVyICE9PSB1bmRlZmluZWQpIHJldHVybiB7IGJ1Y2tldDogMiwgbmFtZTogU3RyaW5nKGNhdGFsb2dPcmRlcikucGFkU3RhcnQoNCwgXCIwXCIpIH07XG4gIGNvbnN0IGJhc2UgPSBnZXRCYXNlRnJvbUxpbmsoaXRlbS5saW5rKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBvcmRlciA9IFBST0pFQ1RTX0ZJTEVfTUVOVVtiYXNlXT8ub3JkZXIgPz8gUFJPRFVDVF9GSUxFX01FTlVbYmFzZV0/Lm9yZGVyO1xuICBpZiAob3JkZXIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHsgYnVja2V0OiAyLCBuYW1lOiBTdHJpbmcob3JkZXIpLnBhZFN0YXJ0KDQsIFwiMFwiKSB9O1xuICBpZiAoaXRlbS5saW5rICYmIGlzRXhlY1Jlc3VsdExpbmsoaXRlbS5saW5rKSkge1xuICAgIC8vIElTTyA4NjAxIFx1MzA2QVx1MzA2RVx1MzA2N1x1NjU4N1x1NUI1N1x1NTIxN1x1NkJENFx1OEYwM1x1MzA2N1x1NjY0Mlx1N0NGQlx1NTIxN1x1OTgwNlx1MzA2Qlx1MzA2QVx1MzA4Qlx1MzAwMlx1NTNENlx1NUY5N1x1MzA2N1x1MzA0RFx1MzA2QVx1MzA0NFx1NTgzNFx1NTQwOFx1MzA2Rlx1MzBENVx1MzBBMVx1MzBBNFx1MzBFQlx1NTQwRFx1OTgwNlxuICAgIGNvbnN0IHN0YXJ0ZWRBdCA9IHJlYWRFeGVjUmVzdWx0U3RhcnRlZEF0KGl0ZW0ubGluayk7XG4gICAgaWYgKHN0YXJ0ZWRBdCkgcmV0dXJuIHsgYnVja2V0OiAyLCBuYW1lOiBzdGFydGVkQXQgfTtcbiAgfVxuICByZXR1cm4geyBidWNrZXQ6IDIsIG5hbWU6IGJhc2UgfTtcbn07XG5cbmNvbnN0IG5vcm1hbGl6ZUFuZFByZWZpeExpbmsgPSAobGluazogc3RyaW5nLCBsb2NhbGU6IExvY2FsZSk6IHN0cmluZyA9PiB7XG4gIC8vIGhhc2ggXHUzMDZGXHU0RkREXHU2MzAxXHUzMDU3XHUzMDY2XHUzMDAxXHUzMEQxXHUzMEI5XHU5MEU4XHU1MjA2XHUzMDYwXHUzMDUxXHU2QjYzXHU4OThGXHU1MzE2XG4gIGNvbnN0IFtwYXRoMCwgaGFzaF0gPSBsaW5rLnNwbGl0KFwiI1wiKTtcbiAgY29uc3QgcGF0aCA9IHBhdGgwLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aDAgOiBgLyR7cGF0aDB9YDtcblxuICBjb25zdCBwcmVmaXhlZFBhdGggPSBpc0FscmVhZHlQcmVmaXhlZEJ5QW55TG9jYWxlKHBhdGgpXG4gICAgPyBwYXRoXG4gICAgOiBwYXRoID09PSBcIi9cIlxuICAgICAgPyBgLyR7bG9jYWxlfS9gXG4gICAgICA6IGAvJHtsb2NhbGV9JHtwYXRofWA7XG5cbiAgcmV0dXJuIGhhc2ggPyBgJHtwcmVmaXhlZFBhdGh9IyR7aGFzaH1gIDogcHJlZml4ZWRQYXRoO1xufTtcblxuY29uc3Qgc3RyaXBNYXJrZG93bkZyb250bWF0dGVyID0gKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyA9PlxuICBjb250ZW50LnN0YXJ0c1dpdGgoXCItLS1cXG5cIikgPyBjb250ZW50LnJlcGxhY2UoL14tLS1cXG5bXFxzXFxTXSo/XFxuLS0tXFxuPy8sIFwiXCIpIDogY29udGVudDtcblxuY29uc3QgcmVhZEZyb250bWF0dGVyU3RyaW5nID0gKGNvbnRlbnQ6IHN0cmluZywga2V5OiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICBjb25zdCBtYXRjaCA9IGNvbnRlbnQubWF0Y2goL14tLS1cXG4oW1xcc1xcU10qPylcXG4tLS0vKTtcbiAgaWYgKCFtYXRjaCkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICBjb25zdCBsaW5lID0gbWF0Y2hbMV0ubWF0Y2gobmV3IFJlZ0V4cChgXiR7a2V5fTpcXFxccyooLis/KVxcXFxzKiRgLCBcIm1cIikpPy5bMV07XG4gIGlmICghbGluZSB8fCBsaW5lLnN0YXJ0c1dpdGgoXCJbXCIpIHx8IGxpbmUuc3RhcnRzV2l0aChcIntcIikpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIGxpbmUucmVwbGFjZSgvXlsnXCJdfFsnXCJdJC9nLCBcIlwiKS50cmltKCkgfHwgdW5kZWZpbmVkO1xufTtcblxuY29uc3QgcmVhZE1hcmtkb3duVGl0bGUgPSAoY29udGVudDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgY29uc3QgYm9keSA9IHN0cmlwTWFya2Rvd25Gcm9udG1hdHRlcihjb250ZW50KTtcbiAgcmV0dXJuIGJvZHkubWF0Y2goL14jXFxzKyguKz8pXFxzKiQvbSk/LlsxXT8udHJpbSgpO1xufTtcblxuY29uc3QgZG9jc1BhdGhGcm9tTGluayA9IChsaW5rOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICBjb25zdCBjbGVhbiA9IGxpbmsuc3BsaXQoXCIjXCIpWzBdLnJlcGxhY2UoL15cXC8rLywgXCJcIikucmVwbGFjZSgvXFwvKyQvLCBcIlwiKTtcbiAgaWYgKCFjbGVhbikgcmV0dXJuIHVuZGVmaW5lZDtcblxuICByZXR1cm4gcGF0aC5qb2luKFdPUktTUEFDRV9ST09ULCBcImRvY3NcIiwgYCR7Y2xlYW59Lm1kYCk7XG59O1xuXG4vLyBleGVjIFx1OTE0RFx1NEUwQlx1MzA2RSBwbGFuIC8gcmVzdWx0IFx1NTIyNFx1NUI5QVx1MzAwMkgxIFx1MzA0Q1x1NUI5QVx1NTc4Qlx1NjU4N1x1RkYwOFwiRWRpdCBQbGFuOiAuLi5cIiBcdTdCNDlcdUZGMDlcdTMwNkVcdTMwNUZcdTMwODFcdTMwMDFcbi8vIFx1MzBFMVx1MzBDQlx1MzBFNVx1MzBGQ1x1MzA2Rlx1MzBCRlx1MzBCOVx1MzBBRklEXHUzMEQ5XHUzMEZDXHUzMEI5XHUzMDZFXHU4ODY4XHU3OTNBXHU1NDBEXHUzMDZCXHUzMDU5XHUzMDhCXG5jb25zdCBpc0V4ZWNQbGFuTGluayA9IChsaW5rOiBzdHJpbmcpOiBib29sZWFuID0+IGxpbmsuaW5jbHVkZXMoXCIvZXhlYy9wbGFucy9cIik7XG5jb25zdCBpc0V4ZWNSZXN1bHRMaW5rID0gKGxpbms6IHN0cmluZyk6IGJvb2xlYW4gPT4gbGluay5pbmNsdWRlcyhcIi9leGVjL3Jlc3VsdHMvXCIpO1xuXG4vLyByZXN1bHQgZnJvbnRtYXR0ZXJcdUZGMDhzcGVjZG9qbzogXHU1NDBEXHU1MjREXHU3QTdBXHU5NTkzXHU5MTREXHU0RTBCXHVGRjA5XHUzMDZFIHN0YXJ0ZWRfYXQgXHUzMDkyXHU4QUFEXHUzMDgwXHUzMDAyXG4vLyBcdTg4NjhcdTc5M0FcdTU0MERcdTMwNjhcdTMwQkRcdTMwRkNcdTMwQzhcdTMwNkVcdTRFMjFcdTY1QjlcdTMwNjdcdTRGN0ZcdTMwNDZcdTMwNUZcdTMwODFcdTMwQURcdTMwRTNcdTMwQzNcdTMwQjdcdTMwRTVcdTMwNTlcdTMwOEJcbmNvbnN0IGV4ZWNSZXN1bHRTdGFydGVkQXRDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmcgfCB1bmRlZmluZWQ+KCk7XG5jb25zdCByZWFkRXhlY1Jlc3VsdFN0YXJ0ZWRBdCA9IChsaW5rOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoZXhlY1Jlc3VsdFN0YXJ0ZWRBdENhY2hlLmhhcyhsaW5rKSkgcmV0dXJuIGV4ZWNSZXN1bHRTdGFydGVkQXRDYWNoZS5nZXQobGluayk7XG5cbiAgY29uc3QgZmlsZVBhdGggPSBkb2NzUGF0aEZyb21MaW5rKGxpbmspO1xuICBjb25zdCBzdGFydGVkQXQgPVxuICAgIGZpbGVQYXRoICYmIGV4aXN0c1N5bmMoZmlsZVBhdGgpXG4gICAgICA/IHJlYWRGaWxlU3luYyhmaWxlUGF0aCwgXCJ1dGY4XCIpLm1hdGNoKC9eXFxzK3N0YXJ0ZWRfYXQ6XFxzKlwiPyhbXlwiXFxzXSspXCI/XFxzKiQvbSk/LlsxXVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgZXhlY1Jlc3VsdFN0YXJ0ZWRBdENhY2hlLnNldChsaW5rLCBzdGFydGVkQXQpO1xuICByZXR1cm4gc3RhcnRlZEF0O1xufTtcblxuY29uc3QgdG9FeGVjTWVudVRleHQgPSAobGluazogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgY29uc3QgYmFzZSA9IGdldEJhc2VGcm9tTGluayhsaW5rKTtcbiAgaWYgKGlzRXhlY1BsYW5MaW5rKGxpbmspKSByZXR1cm4gYmFzZS5yZXBsYWNlKC8tcGxhbiQvLCBcIlwiKTtcbiAgaWYgKGlzRXhlY1Jlc3VsdExpbmsobGluaykpIHtcbiAgICBjb25zdCB0YXNrSWQgPSBiYXNlLnJlcGxhY2UoLy1yZXN1bHQkLywgXCJcIik7XG4gICAgY29uc3Qgc3RhcnRlZEF0ID0gcmVhZEV4ZWNSZXN1bHRTdGFydGVkQXQobGluayk7XG4gICAgLy8gXHU1QjlGXHU4ODRDXHU2NUU1XHUzMDY3XHU2NjQyXHU3Q0ZCXHU1MjE3XHUzMDkyXHU4RkZEXHUzMDQ4XHUzMDhCXHUzMDg4XHUzMDQ2IFwiTU0vREQgPFx1MzBCRlx1MzBCOVx1MzBBRklEPlwiIFx1MzA2N1x1ODg2OFx1NzkzQVx1MzA1OVx1MzA4QlxuICAgIHJldHVybiBzdGFydGVkQXQgPyBgJHtzdGFydGVkQXQuc2xpY2UoNSwgMTApLnJlcGxhY2UoXCItXCIsIFwiL1wiKX0gJHt0YXNrSWR9YCA6IHRhc2tJZDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuY29uc3QgcmVhZFByb2plY3RzTWVudVRleHRGcm9tTWFya2Rvd24gPSAobGluazogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgY29uc3QgZmlsZVBhdGggPSBkb2NzUGF0aEZyb21MaW5rKGxpbmspO1xuICBpZiAoIWZpbGVQYXRoIHx8ICFleGlzdHNTeW5jKGZpbGVQYXRoKSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICBjb25zdCBjb250ZW50ID0gcmVhZEZpbGVTeW5jKGZpbGVQYXRoLCBcInV0ZjhcIik7XG4gIGNvbnN0IGZyb250bWF0dGVyVGl0bGUgPSByZWFkRnJvbnRtYXR0ZXJTdHJpbmcoY29udGVudCwgXCJ0aXRsZVwiKTtcbiAgaWYgKGZyb250bWF0dGVyVGl0bGUpIHJldHVybiBmcm9udG1hdHRlclRpdGxlO1xuXG4gIGNvbnN0IGZyb250bWF0dGVyTmFtZSA9IHJlYWRGcm9udG1hdHRlclN0cmluZyhjb250ZW50LCBcIm5hbWVcIik7XG4gIGlmIChmcm9udG1hdHRlck5hbWUpIHtcbiAgICBjb25zdCB0eXBlID0gcmVhZEZyb250bWF0dGVyU3RyaW5nKGNvbnRlbnQsIFwidHlwZVwiKTtcbiAgICBpZiAodHlwZSA9PT0gXCJleGVjLXBsYW5cIikgcmV0dXJuIGBcdTVCOUZcdTg4NENcdThBMDhcdTc1M0I6ICR7ZnJvbnRtYXR0ZXJOYW1lfWA7XG4gICAgaWYgKHR5cGUgPT09IFwiZXhlYy1yZXN1bHRcIikgcmV0dXJuIGBcdTVCOUZcdTg4NENcdTdENTBcdTY3OUM6ICR7ZnJvbnRtYXR0ZXJOYW1lfWA7XG4gICAgcmV0dXJuIGZyb250bWF0dGVyTmFtZTtcbiAgfVxuXG4gIHJldHVybiByZWFkTWFya2Rvd25UaXRsZShjb250ZW50KTtcbn07XG5cbi8vIFx1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFx1MzA2RVx1MzBCNVx1MzBBNFx1MzBDOVx1MzBEMFx1MzBGQ1x1ODg2OFx1NzkzQVx1NTQwRFx1MzAwMlx1ODlBQVx1MzBDRVx1MzBGQ1x1MzBDOVx1MzA0Q1x1MzAwQ1x1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFx1MzAwRFx1MzA2QVx1MzA2RVx1MzA2N1x1MzAwMVx1NTQwNFx1MzBBMlx1MzBBNFx1MzBDNlx1MzBFMFx1MzA2N1x1MzA2RlxuLy8gXHU2M0E1XHU5ODJEXHU4RjlFXHUzMDkyXHU3RTcwXHUzMDhBXHU4RkQ0XHUzMDU1XHUzMDVBXHU1MTg1XHU1QkI5XHUzMDYwXHUzMDUxXHUzMDkyXHU4OThCXHUzMDVCXHUzMDhCXHUzMDAyXHU4ODY4XHU3OTNBXHU1NDBEXHUzMDZFXHU2QjYzXHU2NzJDXHUzMDZGIGRjdC1pbmRleC55YW1sIFx1MzA2RSBuYW1lXHVGRjA4UEpSLTI2OVogXHUzMDY3XG4vLyBcdTVCQTNcdThBMDBcdTUzMTZcdTMwNTdcdTMwNUZcdUZGMDlcdTMwNjdcdTMwMDFcdTc1MUZcdTYyMTBcdTcyNjlcdTMwNkUgSDEgXHUzMDZGIGBcdTYyMTBcdTY3OUNcdTcyNjlcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjA6IDxkb21haW4+YCBcdTMwNjggc2x1ZyBcdTg4NjhcdThBMThcdTMwNkVcdTMwNUZcdTMwODFcdTRGN0ZcdTMwOEZcdTMwNkFcdTMwNDRcdTMwMDJcbi8vIFx1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFx1MzA2RVx1NzI2OVx1NzQwNlx1NTIwNlx1NTI3Mlx1MzBENVx1MzBBMVx1MzBBNFx1MzBFQlx1RkYwOGRjdC08ZG9tYWluPi08cGFydD4ueWFtbFx1RkYwOVx1MzA2RiB5YW1sLXBhZ2VzIGJ1aWxkIFx1MzA0Q1xuLy8gXHU4ODY4XHU3OTNBXHU3NTI4XHUzMERBXHUzMEZDXHUzMEI4XHUzMDkyXHU3NTFGXHU2MjEwXHUzMDU5XHUzMDhCXHUzMDAyXHU1MTg1XHU1QkI5XHUzMDZGXHU3RDcxXHU1NDA4XHUzMEQzXHUzMEU1XHUzMEZDXHVGRjA4ZGN0LTxkb21haW4+Lm1kXHVGRjA5XHUzMDZCXHU1NDJCXHUzMDdFXHUzMDhDXHUzMDhCXHUzMDVGXHUzMDgxXHUzMDAxXHUzMEI1XHUzMEE0XHUzMEM5XHUzMEQwXHUzMEZDXHUzMDc4XG4vLyBcdTRFMjZcdTMwNzlcdTMwOEJcdTMwNjhcdTU0MENcdTMwNThcdTYyMTBcdTY3OUNcdTcyNjlcdTMwNENcdTRFOENcdTkxQ0RcdTMwNkJcdTg5OEJcdTMwNDhcdTMwOEJcdTMwMDJcdTMwRUFcdTMwRjNcdTMwQUZcdTMwNTVcdTMwOENcdTMwNUZcdTMwNjhcdTMwNERcdTMwNkVcdTUzRDdcdTMwNTFcdTc2QkZcdTMwNjhcdTMwNTdcdTMwNjZcdTMwREFcdTMwRkNcdTMwQjhcdTgxRUFcdTRGNTNcdTMwNkZcdTZCOEJcdTMwNTdcdTMwMDFcbi8vIFx1NEUwMFx1ODlBN1x1MzA0Qlx1MzA4OVx1MzA2MFx1MzA1MVx1NTkxNlx1MzA1OVx1MzAwMlx1NTIyNFx1NUI5QVx1MzA2RiB5YW1sLXBhZ2VzIFx1MzA0Q1x1NjcyQ1x1NjU4N1x1MzA3OFx1NTE2NVx1MzA4Q1x1MzA4Qlx1NkNFOFx1OEExOFx1MzA2N1x1ODg0Q1x1MzA0Nlx1MzAwMlxuY29uc3QgWUFNTF9WSUVXRVJfUEFHRV9OT1RFID0gXCJcdTMwNEJcdTMwODlcdTc1MUZcdTYyMTBcdTMwNTVcdTMwOENcdTMwNUZcdTg4NjhcdTc5M0FcdTc1MjhcdTMwREFcdTMwRkNcdTMwQjhcdTMwNjdcdTMwNTlcIjtcblxuY29uc3QgaXNDYXRhbG9nWWFtbFZpZXdlclBhZ2UgPSAobGluaz86IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICBpZiAoIWxpbmsgfHwgIWlzRGVsaXZlcmFibGVzQ2F0YWxvZ0xpbmsobGluaykpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgZmlsZVBhdGggPSBkb2NzUGF0aEZyb21MaW5rKGxpbmspO1xuICBpZiAoIWZpbGVQYXRoIHx8ICFleGlzdHNTeW5jKGZpbGVQYXRoKSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gcmVhZEZpbGVTeW5jKGZpbGVQYXRoLCBcInV0ZjhcIikuaW5jbHVkZXMoWUFNTF9WSUVXRVJfUEFHRV9OT1RFKTtcbn07XG5cbmNvbnN0IERFTElWRVJBQkxFU19DQVRBTE9HX1NFR01FTlQgPSBcIjAxMC1kZWxpdmVyYWJsZXMtY2F0YWxvZ1wiO1xuXG5jb25zdCBpc0RlbGl2ZXJhYmxlc0NhdGFsb2dMaW5rID0gKGxpbms/OiBzdHJpbmcpOiBib29sZWFuID0+XG4gICEhbGluayAmJiBsaW5rLmluY2x1ZGVzKGAvJHtERUxJVkVSQUJMRVNfQ0FUQUxPR19TRUdNRU5UfS9gKTtcblxuLy8gbGluayBcdTMwNEJcdTMwODkgZGN0LWluZGV4LnlhbWwgXHUzMDZFXHU3RDc2XHU1QkZFXHUzMEQxXHUzMEI5XHUzMDkyXHU3RDQ0XHUzMDdGXHU3QUNCXHUzMDY2XHUzMDhCXHUzMDAyZ2VuZXJhdGVkLyBcdTMwNkVcdTY3MDlcdTcxMjFcdTMwNkJcdTRGOURcdTVCNThcdTMwNTdcdTMwNkFcdTMwNDRcdTMwODhcdTMwNDZcdTMwMDFcbi8vIFx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFx1MzBDN1x1MzBBM1x1MzBFQ1x1MzBBRlx1MzBDOFx1MzBFQVx1MzA3RVx1MzA2N1x1MzA2N1x1NTIwN1x1MzA4QVx1OEE3MFx1MzA4MVx1MzA4Qlx1MzAwMlxuY29uc3QgY2F0YWxvZ0luZGV4UGF0aEZyb21MaW5rID0gKGxpbms6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gIGNvbnN0IGNsZWFuID0gbGluay5zcGxpdChcIiNcIilbMF0ucmVwbGFjZSgvXlxcLysvLCBcIlwiKTtcbiAgY29uc3Qgc2VnbWVudHMgPSBjbGVhbi5zcGxpdChcIi9cIik7XG4gIGNvbnN0IGluZGV4ID0gc2VnbWVudHMuaW5kZXhPZihERUxJVkVSQUJMRVNfQ0FUQUxPR19TRUdNRU5UKTtcbiAgaWYgKGluZGV4IDwgMCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgcmV0dXJuIHBhdGguam9pbihXT1JLU1BBQ0VfUk9PVCwgXCJkb2NzXCIsIC4uLnNlZ21lbnRzLnNsaWNlKDAsIGluZGV4ICsgMSksIFwiZGN0LWluZGV4LnlhbWxcIik7XG59O1xuXG4vLyBkb21haW4gLT4gXHU4ODY4XHU3OTNBXHU1NDBEXHUzMDAyXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHUzMDU0XHUzMDY4XHUzMDZCMVx1NTZERVx1MzA2MFx1MzA1MVx1OEFBRFx1MzA4MFx1MzAwMlxudHlwZSBDYXRhbG9nRG9tYWluRW50cnkgPSB7IG5hbWU6IHN0cmluZzsgb3JkZXI6IG51bWJlciB9O1xuXG5jb25zdCBjYXRhbG9nRG9tYWluQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgUmVhZG9ubHlNYXA8c3RyaW5nLCBDYXRhbG9nRG9tYWluRW50cnk+PigpO1xuXG4vLyBkb21haW4gLT4gXHU4ODY4XHU3OTNBXHU1NDBEXHUzMDY4XHU1QkEzXHU4QTAwXHU5ODA2XHUzMDAyXHUzMEI1XHUzMEE0XHUzMEM5XHUzMEQwXHUzMEZDXHUzMDZFXHU0RTI2XHUzMDczXHUzMDkyXHU3RDIyXHU1RjE1XHVGRjA4ZGN0LWluZGV4LnlhbWxcdUZGMDlcdTMwNkVcdTVCQTNcdThBMDBcdTk4MDZcdTMwNkJcdTU0MDhcdTMwOEZcdTMwNUJcdTMwOEJcdTMwNUZcdTMwODFcdTMwMDFcbi8vIFx1NTQwRFx1NTI0RFx1MzA2OFx1OTgwNlx1NUU4Rlx1MzA5Mlx1NTQwQ1x1MzA1OFx1OEQ3MFx1NjdGQlx1MzA2N1x1OEFBRFx1MzA4MFx1MzAwMmdyb3Vwc1tdLmdyb3Vwc1tdLmRvbWFpbnNbXSBcdTMwNkVcdTMwNjlcdTMwNkVcdTk2OEVcdTVDNjRcdTMwNjdcdTMwODJcdTUxRkFcdTczRkVcdTk4MDZcdTMwNkJcdTYzQTFcdTc1NkFcdTMwNTlcdTMwOEJcdTMwMDJcbmNvbnN0IHJlYWRDYXRhbG9nRG9tYWlucyA9IChpbmRleFBhdGg6IHN0cmluZyk6IFJlYWRvbmx5TWFwPHN0cmluZywgQ2F0YWxvZ0RvbWFpbkVudHJ5PiA9PiB7XG4gIGNvbnN0IGNhY2hlZCA9IGNhdGFsb2dEb21haW5DYWNoZS5nZXQoaW5kZXhQYXRoKTtcbiAgaWYgKGNhY2hlZCkgcmV0dXJuIGNhY2hlZDtcblxuICBjb25zdCBuYW1lcyA9IG5ldyBNYXA8c3RyaW5nLCBDYXRhbG9nRG9tYWluRW50cnk+KCk7XG4gIGlmIChleGlzdHNTeW5jKGluZGV4UGF0aCkpIHtcbiAgICAvLyBZQU1MIFx1MzBEMVx1MzBGQ1x1MzBCNVx1MzA5Mlx1NjMwMVx1MzA2MVx1OEZCQ1x1MzA3RVx1MzA1QVx1MzAwMVx1MzBBNFx1MzBGM1x1MzBDN1x1MzBGM1x1MzBDOFx1OTY4RVx1NUM2NFx1MzA2Qlx1NEY5RFx1NUI1OFx1MzA1N1x1MzA2QVx1MzA0NCBgLSBkb21haW46YCBcdTMwNjhcdTc2RjRcdTVGOENcdTMwNkVcbiAgICAvLyBgbmFtZTpgIFx1MzA2RVx1NUJGRVx1NUZEQ1x1MzA2MFx1MzA1MVx1MzA5Mlx1OEFBRFx1MzA4MFx1MzAwMmdyb3Vwc1tdLmdyb3Vwc1tdLmRvbWFpbnNbXSBcdTMwNjdcdTMwODJcdTU0MENcdTMwNThcdTg5OEZcdTUyNDdcdTMwNjdcdTg5RTNcdTZDN0FcdTMwNjdcdTMwNERcdTMwOEJcdTMwMDJcbiAgICBjb25zdCBsaW5lcyA9IHJlYWRGaWxlU3luYyhpbmRleFBhdGgsIFwidXRmOFwiKS5zcGxpdCgvXFxyP1xcbi8pO1xuICAgIGxldCBkb21haW46IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcbiAgICAgIGNvbnN0IGRvbWFpbk1hdGNoID0gbGluZS5tYXRjaCgvXlxccyotXFxzK2RvbWFpbjpcXHMqKFxcUyspXFxzKiQvKTtcbiAgICAgIGlmIChkb21haW5NYXRjaCkge1xuICAgICAgICBkb21haW4gPSBkb21haW5NYXRjaFsxXS5yZXBsYWNlKC9eW1wiJ118W1wiJ10kL2csIFwiXCIpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5hbWVNYXRjaCA9IGxpbmUubWF0Y2goL15cXHMrbmFtZTpcXHMqKC4rPylcXHMqJC8pO1xuICAgICAgaWYgKGRvbWFpbiAmJiBuYW1lTWF0Y2gpIHtcbiAgICAgICAgbmFtZXMuc2V0KGRvbWFpbiwge1xuICAgICAgICAgIG5hbWU6IG5hbWVNYXRjaFsxXS5yZXBsYWNlKC9eW1wiJ118W1wiJ10kL2csIFwiXCIpLFxuICAgICAgICAgIG9yZGVyOiBuYW1lcy5zaXplICsgMSxcbiAgICAgICAgfSk7XG4gICAgICAgIGRvbWFpbiA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0YWxvZ0RvbWFpbkNhY2hlLnNldChpbmRleFBhdGgsIG5hbWVzKTtcbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuLy8gXHU3RDIyXHU1RjE1XHUzMDkyXHU1MTQ4XHU5ODJEXHUzMDZCXHU3RjZFXHUzMDREXHUzMDAxXHU0RUU1XHU5NjREXHUzMDZGXHU3RDIyXHU1RjE1XHUzMDZFXHU1QkEzXHU4QTAwXHU5ODA2XHUzMDY3XHU0RTI2XHUzMDc5XHUzMDhCXHUzMDAyXHU3RDIyXHU1RjE1XHUzMDZCXHU3MTIxXHUzMDQ0XHUzMERBXHUzMEZDXHUzMEI4XHUzMDZGIHVuZGVmaW5lZCBcdTMwOTJcdThGRDRcdTMwNTdcdTMwMDFcbi8vIFx1NjVFMlx1NUI5QVx1MzA2RVx1NEUyNlx1MzA3M1x1RkYwOFx1ODg2OFx1NzkzQVx1NTQwRFx1OTgwNlx1RkYwOVx1MzA2Qlx1NTlENFx1MzA2RFx1MzA4Qlx1MzAwMlxuY29uc3QgY2F0YWxvZ1NpZGViYXJPcmRlciA9IChsaW5rPzogc3RyaW5nKTogbnVtYmVyIHwgdW5kZWZpbmVkID0+IHtcbiAgaWYgKCFsaW5rIHx8ICFpc0RlbGl2ZXJhYmxlc0NhdGFsb2dMaW5rKGxpbmspKSByZXR1cm4gdW5kZWZpbmVkO1xuICBjb25zdCBiYXNlID0gZ2V0QmFzZUZyb21MaW5rKGxpbmspO1xuICBpZiAoYmFzZSA9PT0gXCJkY3QtaW5kZXhcIikgcmV0dXJuIDA7XG4gIGlmICghYmFzZS5zdGFydHNXaXRoKFwiZGN0LVwiKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgY29uc3QgaW5kZXhQYXRoID0gY2F0YWxvZ0luZGV4UGF0aEZyb21MaW5rKGxpbmspO1xuICBpZiAoIWluZGV4UGF0aCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgcmV0dXJuIHJlYWRDYXRhbG9nRG9tYWlucyhpbmRleFBhdGgpLmdldChiYXNlLnNsaWNlKFwiZGN0LVwiLmxlbmd0aCkpPy5vcmRlcjtcbn07XG5cbi8vIFx1MzAwQ1x1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFx1RkYwOFx1MzBDN1x1MzBGQ1x1MzBCRlx1MzBFMlx1MzBDN1x1MzBFQlx1RkYwOVx1MzAwRFx1MzAwQ1x1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMDogZGF0YS1tb2RlbFx1MzAwRFx1MzAwQ1x1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFx1MzA2RVx1N0QyMlx1NUYxNVx1MzAwRFx1MzA0Qlx1MzA4OVxuLy8gXHU1MTg1XHU1QkI5XHU5MEU4XHU1MjA2XHUzMDYwXHUzMDUxXHUzMDkyXHU1M0Q2XHUzMDhBXHU1MUZBXHUzMDU5XHUzMDAyXHU1M0Q2XHUzMDhBXHU1MUZBXHUzMDVCXHUzMDZBXHUzMDQ0XHU1ODM0XHU1NDA4XHUzMDZGXHU1MTQzXHUzMDZFXHU4ODY4XHU3OTNBXHU1NDBEXHUzMDkyXHUzMDVEXHUzMDZFXHUzMDdFXHUzMDdFXHU4RkQ0XHUzMDU5XHUzMDAyXG5jb25zdCBzdHJpcENhdGFsb2dQcmVmaXggPSAodGV4dDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgY29uc3QgbWF0Y2hlZCA9IHRleHQubWF0Y2goL15cdTYyMTBcdTY3OUNcdTcyNjlcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjAoPzpcdTMwNkV8WzpcdUZGMUFdXFxzKik/W1x1RkYwOChdPyguKz8pWylcdUZGMDldPyQvKTtcbiAgcmV0dXJuIG1hdGNoZWQ/LlsxXT8udHJpbSgpIHx8IHRleHQ7XG59O1xuXG5jb25zdCB0b0RlbGl2ZXJhYmxlc0NhdGFsb2dNZW51VGV4dCA9IChsaW5rOiBzdHJpbmcsIHJlc29sdmVkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBiYXNlID0gZ2V0QmFzZUZyb21MaW5rKGxpbmspO1xuICBjb25zdCBkb21haW4gPSBiYXNlLnN0YXJ0c1dpdGgoXCJkY3QtXCIpID8gYmFzZS5zbGljZShcImRjdC1cIi5sZW5ndGgpIDogXCJcIjtcbiAgaWYgKGRvbWFpbikge1xuICAgIGNvbnN0IGluZGV4UGF0aCA9IGNhdGFsb2dJbmRleFBhdGhGcm9tTGluayhsaW5rKTtcbiAgICBjb25zdCBuYW1lID0gaW5kZXhQYXRoID8gcmVhZENhdGFsb2dEb21haW5zKGluZGV4UGF0aCkuZ2V0KGRvbWFpbik/Lm5hbWUgOiB1bmRlZmluZWQ7XG4gICAgaWYgKG5hbWUpIHJldHVybiBuYW1lO1xuICB9XG4gIHJldHVybiBzdHJpcENhdGFsb2dQcmVmaXgocmVzb2x2ZWQpO1xufTtcblxuY29uc3QgaXNQcm9qZWN0c0xpbmsgPSAobGluazogc3RyaW5nLCBsb2NhbGU6IExvY2FsZSk6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gbGluayA9PT0gYC8ke2xvY2FsZX0vcHJvamVjdHNgIHx8IGxpbmsuc3RhcnRzV2l0aChgLyR7bG9jYWxlfS9wcm9qZWN0cy9gKTtcbn07XG5cbmNvbnN0IGlzUHJvZHVjdExpbmsgPSAobGluazogc3RyaW5nLCBsb2NhbGU6IExvY2FsZSk6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gbGluayA9PT0gYC8ke2xvY2FsZX0vcHJvZHVjdGAgfHwgbGluay5zdGFydHNXaXRoKGAvJHtsb2NhbGV9L3Byb2R1Y3QvYCk7XG59O1xuXG4vLyBcdTMwQjVcdTMwQTRcdTMwQzlcdTMwRDBcdTMwRkNcdTg4NjhcdTc5M0FcdTU0MERcdTMwOTJcdTY1RTVcdTY3MkNcdThBOUVcdTUzMTZcdTMwNTlcdTMwOEJcdTMwQjNcdTMwRjNcdTMwQzZcdTMwRjNcdTMwQzRcdTMwQzRcdTMwRUFcdTMwRkNcdTMwMDJwcm9qZWN0cyBcdTMwNjggcHJvZHVjdCBcdTMwNkZcdTMwQzdcdTMwQTNcdTMwRUNcdTMwQUZcdTMwQzhcdTMwRUFcbi8vIFx1MzA1NFx1MzA2OFx1MzA2Qlx1ODg2OFx1NzkzQVx1NTQwRFx1MzBDNlx1MzBGQ1x1MzBENlx1MzBFQlx1RkYwOFx1MzBCQlx1MzBCMFx1MzBFMVx1MzBGM1x1MzBDOFx1NTQwRFx1MzBGQlx1NjVFMlx1NzdFNVx1MzBENVx1MzBBMVx1MzBBNFx1MzBFQlx1RkYwOVx1MzA0Q1x1NzU3MFx1MzA2QVx1MzA4Qlx1MzA1Rlx1MzA4MVx1NTMzQVx1NTIyNVx1MzA1OVx1MzA4Qlx1MzAwMlxudHlwZSBDb250ZW50VHJlZSA9IFwicHJvamVjdHNcIiB8IFwicHJvZHVjdFwiO1xuXG5jb25zdCBkZXRlY3RDb250ZW50VHJlZSA9IChpdGVtOiBTaWRlYmFySXRlbSwgbG9jYWxlOiBMb2NhbGUpOiBDb250ZW50VHJlZSB8IHVuZGVmaW5lZCA9PiB7XG4gIGNvbnN0IHRleHQgPSAoaXRlbS50ZXh0ID8/IFwiXCIpLnRvU3RyaW5nKCk7XG4gIGlmICh0ZXh0ID09PSBcInByb2plY3RzXCIgfHwgKGl0ZW0ubGluayAmJiBpc1Byb2plY3RzTGluayhpdGVtLmxpbmssIGxvY2FsZSkpKSByZXR1cm4gXCJwcm9qZWN0c1wiO1xuICBpZiAodGV4dCA9PT0gXCJwcm9kdWN0XCIgfHwgKGl0ZW0ubGluayAmJiBpc1Byb2R1Y3RMaW5rKGl0ZW0ubGluaywgbG9jYWxlKSkpIHJldHVybiBcInByb2R1Y3RcIjtcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IHRvQ29udGVudFRyZWVNZW51VGV4dCA9IChcbiAgaXRlbTogU2lkZWJhckl0ZW0sXG4gIGxvY2FsZTogTG9jYWxlLFxuICBzZWdtZW50VGV4dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgZmlsZU1lbnU6IFJlY29yZDxzdHJpbmcsIHsgdGV4dDogc3RyaW5nOyBvcmRlcj86IG51bWJlciB9PixcbiAgZmlsZVRleHQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fSxcbik6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gIGlmIChpdGVtLmxpbmspIHtcbiAgICBjb25zdCBiYXNlID0gZ2V0QmFzZUZyb21MaW5rKGl0ZW0ubGluayk7XG4gICAgY29uc3Qga25vd24gPSBmaWxlTWVudVtiYXNlXTtcbiAgICBpZiAoa25vd24pIHJldHVybiBrbm93bi50ZXh0O1xuXG4gICAgY29uc3QgZXhlY1RleHQgPSB0b0V4ZWNNZW51VGV4dChpdGVtLmxpbmspO1xuICAgIGlmIChleGVjVGV4dCkgcmV0dXJuIGV4ZWNUZXh0O1xuXG4gICAgY29uc3QgbWFya2Rvd25UaXRsZSA9IHJlYWRQcm9qZWN0c01lbnVUZXh0RnJvbU1hcmtkb3duKGl0ZW0ubGluayk7XG4gICAgaWYgKG1hcmtkb3duVGl0bGUpIHJldHVybiBtYXJrZG93blRpdGxlO1xuXG4gICAgcmV0dXJuIGZpbGVUZXh0W2Jhc2VdID8/IHNlZ21lbnRUZXh0W2Jhc2VdO1xuICB9XG5cbiAgY29uc3QgdGV4dCA9IGl0ZW0udGV4dCA/PyBcIlwiO1xuICByZXR1cm4gc2VnbWVudFRleHRbdGV4dF07XG59O1xuXG5jb25zdCBpc0hhbmRib29rVG9wID0gKGl0ZW06IFNpZGViYXJJdGVtKTogYm9vbGVhbiA9PiB7XG4gIGNvbnN0IGxpbmsgPSBpdGVtLmxpbmsgPz8gXCJcIjtcbiAgY29uc3QgdGV4dCA9IChpdGVtLnRleHQgPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gbGluay5pbmNsdWRlcyhcIi9zcGVjZG9qby9cIikgfHwgdGV4dCA9PT0gXCJzcGVjZG9qb1wiO1xufTtcblxuY29uc3QgaXNQcm9qZWN0RGFzaGJvYXJkTGluayA9IChpdGVtOiBTaWRlYmFySXRlbSk6IGJvb2xlYW4gPT5cbiAgL1xcL3Byb2plY3RzXFwvW14vXStcXC9leGVjdXRpb25cXC9nZW5lcmF0ZWRcXC9kYXNoYm9hcmQkLy50ZXN0KGl0ZW0ubGluayA/PyBcIlwiKTtcblxuLy8gXHU1QjUwXHU1QjZCXHUzMDRCXHUzMDg5XHU2NzAwXHU1MjFEXHUzMDZCXHU0RTAwXHU4MUY0XHUzMDU5XHUzMDhCXHU5ODA1XHU3NkVFXHUzMDkyXHU1M0Q2XHUzMDhBXHU1MUZBXHUzMDU5XHUzMDAyXHUzMEMwXHUzMEMzXHUzMEI3XHUzMEU1XHUzMERDXHUzMEZDXHUzMEM5XHUzMDkyXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU3NkY0XHU0RTBCXHUzMDc4XHU2NjA3XHU2ODNDXHUzMDU5XHUzMDhCXHUzMDY4XHUzMDREXHUzMDAxXG4vLyBcdTUxNDNcdTMwNkUgZXhlY3V0aW9uL2dlbmVyYXRlZCBcdTUwNzRcdTMwNkJcdTU0MENcdTMwNThcdTMwRUFcdTMwRjNcdTMwQUZcdTMwOTJcdTkxQ0RcdTg5MDdcdTg4NjhcdTc5M0FcdTMwNTdcdTMwNkFcdTMwNDRcdTMwNUZcdTMwODFcdTMwNkJcdTRGN0ZcdTMwNDZcdTMwMDJcbmNvbnN0IGV4dHJhY3RTaWRlYmFySXRlbSA9IChcbiAgaXRlbXM6IFNpZGViYXJJdGVtW10sXG4gIHByZWRpY2F0ZTogKGl0ZW06IFNpZGViYXJJdGVtKSA9PiBib29sZWFuLFxuKTogeyBpdGVtczogU2lkZWJhckl0ZW1bXTsgZXh0cmFjdGVkPzogU2lkZWJhckl0ZW0gfSA9PiB7XG4gIGxldCBleHRyYWN0ZWQ6IFNpZGViYXJJdGVtIHwgdW5kZWZpbmVkO1xuICBjb25zdCByZW1haW5pbmc6IFNpZGViYXJJdGVtW10gPSBbXTtcblxuICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICBpZiAoIWV4dHJhY3RlZCAmJiBwcmVkaWNhdGUoaXRlbSkpIHtcbiAgICAgIGV4dHJhY3RlZCA9IGl0ZW07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoIWV4dHJhY3RlZCAmJiBpdGVtLml0ZW1zKSB7XG4gICAgICBjb25zdCBuZXN0ZWQgPSBleHRyYWN0U2lkZWJhckl0ZW0oaXRlbS5pdGVtcywgcHJlZGljYXRlKTtcbiAgICAgIGV4dHJhY3RlZCA9IG5lc3RlZC5leHRyYWN0ZWQ7XG4gICAgICByZW1haW5pbmcucHVzaCh7IC4uLml0ZW0sIGl0ZW1zOiBuZXN0ZWQuaXRlbXMgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZW1haW5pbmcucHVzaChpdGVtKTtcbiAgfVxuXG4gIHJldHVybiB7IGl0ZW1zOiByZW1haW5pbmcsIGV4dHJhY3RlZCB9O1xufTtcblxuY29uc3QgcHJvbW90ZVByb2plY3REYXNoYm9hcmQgPSAoaXRlbXM6IFNpZGViYXJJdGVtW10pOiBTaWRlYmFySXRlbVtdID0+IHtcbiAgLy8gXHUzMDBDXHU2MjEwXHU2NzlDXHU3MjY5XHUzMEFCXHUzMEJGXHUzMEVEXHUzMEIwXHUzMDBEXHUzMDkyXHU3NkY0XHU2M0E1XHU2MzAxXHUzMDY0XHUzMEIwXHUzMEVCXHUzMEZDXHUzMEQ3XHUzMDkyXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHUzMEVCXHUzMEZDXHUzMEM4XHUzMDY4XHUzMDU3XHUzMDY2XHU2MjcxXHUzMDQ2XHUzMDAyXG4gIGlmICghaXRlbXMuc29tZSgoaXRlbSkgPT4gaXRlbS50ZXh0ID09PSBcIlx1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFwiKSkgcmV0dXJuIGl0ZW1zO1xuXG4gIGNvbnN0IHsgaXRlbXM6IHJlbWFpbmluZywgZXh0cmFjdGVkIH0gPSBleHRyYWN0U2lkZWJhckl0ZW0oaXRlbXMsIGlzUHJvamVjdERhc2hib2FyZExpbmspO1xuICByZXR1cm4gZXh0cmFjdGVkID8gW2V4dHJhY3RlZCwgLi4ucmVtYWluaW5nXSA6IGl0ZW1zO1xufTtcblxuY29uc3QgUFJPSkVDVF9SRUdJU1RFUl9WSUVXX0ZJTEVTID0gW1xuICBcInBqci1pbmRleFwiLFxuICBcInBqci12aWV3cy1ieS1zdGF0dXNcIixcbiAgXCJwanItdmlld3MtYnktcHJpb3JpdHlcIixcbiAgXCJwanItdmlld3MtYnktb3duZXJcIixcbl0gYXMgY29uc3Q7XG5cbmNvbnN0IHByb21vdGVQcm9qZWN0UmVnaXN0ZXJWaWV3cyA9IChpdGVtczogU2lkZWJhckl0ZW1bXSk6IFNpZGViYXJJdGVtW10gPT4ge1xuICAvLyBcdTUwMEJcdTUyMjVQSlJcdTMwNkZcdTMwMENcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcdTc2N0JcdTkzMzJcdTdDM0ZcdTMwMERcdTMwNkJcdTZCOEJcdTMwNTdcdTMwMDFcdTc2N0JcdTkzMzJcdTUzRjBcdTVFMzNcdTMwNjhcdTk2QzZcdThBMDhcdTMwRDNcdTMwRTVcdTMwRkNcdTMwNjBcdTMwNTFcdTMwOTJcdTdCQTFcdTc0MDZcdTMwRDNcdTMwRTVcdTMwRkNcdTc2RjRcdTRFMEJcdTMwNzhcdTUxRkFcdTMwNTlcdTMwMDJcbiAgaWYgKCFpdGVtcy5zb21lKChpdGVtKSA9PiBpdGVtLnRleHQgPT09IFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU3NjdCXHU5MzMyXHU3QzNGXCIpKSByZXR1cm4gaXRlbXM7XG5cbiAgbGV0IHJlbWFpbmluZyA9IGl0ZW1zO1xuICBjb25zdCBwcm9tb3RlZDogU2lkZWJhckl0ZW1bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGZpbGUgb2YgUFJPSkVDVF9SRUdJU1RFUl9WSUVXX0ZJTEVTKSB7XG4gICAgY29uc3QgZXh0cmFjdGVkID0gZXh0cmFjdFNpZGViYXJJdGVtKFxuICAgICAgcmVtYWluaW5nLFxuICAgICAgKGl0ZW0pID0+IGl0ZW0ubGluaz8uZW5kc1dpdGgoYC9jb250cm9scy9wcm9qZWN0LXJlZ2lzdGVyL2dlbmVyYXRlZC8ke2ZpbGV9YCkgPz8gZmFsc2UsXG4gICAgKTtcbiAgICByZW1haW5pbmcgPSBleHRyYWN0ZWQuaXRlbXM7XG4gICAgaWYgKGV4dHJhY3RlZC5leHRyYWN0ZWQpIHByb21vdGVkLnB1c2goZXh0cmFjdGVkLmV4dHJhY3RlZCk7XG4gIH1cblxuICBjb25zdCByZWdpc3RlckluZGV4ID0gcmVtYWluaW5nLmZpbmRJbmRleCgoaXRlbSkgPT4gaXRlbS50ZXh0ID09PSBcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1NzY3Qlx1OTMzMlx1N0MzRlwiKTtcbiAgaWYgKHJlZ2lzdGVySW5kZXggPCAwKSByZXR1cm4gWy4uLnByb21vdGVkLCAuLi5yZW1haW5pbmddO1xuXG4gIGNvbnN0IHJlZ2lzdGVyID0gcmVtYWluaW5nW3JlZ2lzdGVySW5kZXhdO1xuICBjb25zdCByZXN0ID0gcmVtYWluaW5nLmZpbHRlcigoXywgaW5kZXgpID0+IGluZGV4ICE9PSByZWdpc3RlckluZGV4KTtcbiAgcmV0dXJuIFtyZWdpc3RlciwgLi4ucHJvbW90ZWQsIC4uLnJlc3RdO1xufTtcblxuLy8gXHU1MThEXHU1RTMwXHU3Njg0XHUzMDZCOiBcdTg4NjhcdTc5M0FcdTU0MERcdTY1NzRcdTVGNjJcdUZGMDh4eHgtXHU1MjRBXHU5NjY0XHVGRjA5XHUzMDAxXHU0RTI2XHUzMDczXHU2NkZGXHUzMDQ4XG5jb25zdCB0cmFuc2Zvcm1TaWRlYmFyID0gKFxuICBpdGVtczogU2lkZWJhckl0ZW1bXSxcbiAgbG9jYWxlOiBMb2NhbGUsXG4gIGNvbnRlbnRUcmVlPzogQ29udGVudFRyZWUsXG4pOiBTaWRlYmFySXRlbVtdID0+IHtcbiAgY29uc3QgdHJhbnNmb3JtZWQgPSBpdGVtc1xuICAgIC5maWx0ZXIoKGl0KSA9PiAhaXNIYW5kYm9va1RvcChpdCkpIC8vIGhhbmRib29rIFx1MzBDOFx1MzBDM1x1MzBEN1x1MzA2Rlx1ODFFQVx1NTJENVx1NzUxRlx1NjIxMFx1NTA3NFx1MzA2Qlx1NTQyQlx1MzA4MVx1MzA2QVx1MzA0NFxuICAgIC8vIFx1NUI5Rlx1ODg0Q1x1OEExOFx1OTMzMlx1RkYwOHBsYW4gLyByZXN1bHQgLyBldmVudHNcdUZGMDlcdTMwNkZcdTRFRjZcdTY1NzBcdTMwNENcdTU5MUFcdTMwNEZcdTMwMDFcdTMwQjVcdTMwQTRcdTMwQzlcdTMwRDBcdTMwRkNcdTMwNkJcdThGMDlcdTMwNUJcdTMwOEJcdTMwNjhcdTUxNjhcdTMwREFcdTMwRkNcdTMwQjhcdTMwNkUgSFRNTCBcdTMwNENcbiAgICAvLyBcdTgwQTVcdTU5MjdcdTUzMTZcdTMwNTdcdTMwNjZcdTMwRDNcdTMwRUJcdTMwQzlcdTMwNENcdTMwRTFcdTMwRTJcdTMwRUFcdTRFMERcdThEQjNcdTMwNkJcdTMwNkFcdTMwOEJcdTMwMDJcdTMwREFcdTMwRkNcdTMwQjhcdTMwNkZcdTUxNkNcdTk1OEJcdTMwNTdcdTMwNUZcdTMwN0VcdTMwN0VcdTMwMDFcdTc1MUZcdTYyMTBcdTRFMDBcdTg5QTdcdUZGMDhleGVjLXJlY29yZHNcdUZGMDlcdTMwNEJcdTMwODlcdThGQkZcdTMwOEJcdTMwMDJcbiAgICAvLyBcdTg4NjhcdTc5M0FcdTU0MERcdTMwNkVcdTg5RTNcdTZDN0FcdUZGMDhcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdThBQURcdTMwN0ZcdThGQkNcdTMwN0ZcdUZGMDlcdTMwODhcdTMwOEFcdTUyNERcdTMwNkJcdTk2NjRcdTU5MTZcdTMwNTdcdTMwMDFcdTRFMERcdTg5ODFcdTMwNkEgSS9PIFx1MzA4Mlx1OTA3Rlx1MzA1MVx1MzA4Qlx1MzAwMlxuICAgIC5maWx0ZXIoKGl0KSA9PiAhaXNFeGVjUmVjb3JkUGF0aChpdC5saW5rKSlcbiAgICAubWFwKChpdCkgPT4ge1xuICAgICAgY29uc3QgbmV4dDogU2lkZWJhckl0ZW0gPSB7IC4uLml0IH07XG5cbiAgICAgIC8vIHByZXYvbmV4dCBcdTg5RTNcdTZDN0FcbiAgICAgIGlmIChuZXh0LmxpbmspIG5leHQubGluayA9IG5vcm1hbGl6ZUFuZFByZWZpeExpbmsobmV4dC5saW5rLCBsb2NhbGUpO1xuXG4gICAgICBjb25zdCBjdXJyZW50VHJlZSA9IGNvbnRlbnRUcmVlID8/IGRldGVjdENvbnRlbnRUcmVlKG5leHQsIGxvY2FsZSk7XG4gICAgICBpZiAoY3VycmVudFRyZWUgPT09IFwicHJvamVjdHNcIikge1xuICAgICAgICBjb25zdCB0ZXh0ID0gdG9Db250ZW50VHJlZU1lbnVUZXh0KFxuICAgICAgICAgIG5leHQsXG4gICAgICAgICAgbG9jYWxlLFxuICAgICAgICAgIFBST0pFQ1RTX1NFR01FTlRfVEVYVCxcbiAgICAgICAgICBQUk9KRUNUU19GSUxFX01FTlUsXG4gICAgICAgICAgUFJPSkVDVFNfRklMRV9URVhULFxuICAgICAgICApO1xuICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgIG5leHQudGV4dCA9IGlzRGVsaXZlcmFibGVzQ2F0YWxvZ0xpbmsobmV4dC5saW5rKVxuICAgICAgICAgICAgPyB0b0RlbGl2ZXJhYmxlc0NhdGFsb2dNZW51VGV4dChuZXh0LmxpbmshLCB0ZXh0KVxuICAgICAgICAgICAgOiB0ZXh0O1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnRUcmVlID09PSBcInByb2R1Y3RcIikge1xuICAgICAgICBjb25zdCB0ZXh0ID0gdG9Db250ZW50VHJlZU1lbnVUZXh0KG5leHQsIGxvY2FsZSwgUFJPRFVDVF9TRUdNRU5UX1RFWFQsIFBST0RVQ1RfRklMRV9NRU5VKTtcbiAgICAgICAgaWYgKHRleHQpIG5leHQudGV4dCA9IHRleHQ7XG4gICAgICB9XG5cbiAgICAgIC8vIFx1NUI1MFx1MzA4Mlx1NTQwQ1x1MzA1OFx1MzBFQlx1MzBGQ1x1MzBFQlx1MzA2N1x1NTFFNlx1NzQwNlxuICAgICAgaWYgKG5leHQuaXRlbXMpIHtcbiAgICAgICAgbmV4dC5pdGVtcyA9IHRyYW5zZm9ybVNpZGViYXIobmV4dC5pdGVtcywgbG9jYWxlLCBjdXJyZW50VHJlZSk7XG4gICAgICAgIGlmIChjdXJyZW50VHJlZSA9PT0gXCJwcm9qZWN0c1wiKSB7XG4gICAgICAgICAgbmV4dC5pdGVtcyA9IHByb21vdGVQcm9qZWN0UmVnaXN0ZXJWaWV3cyhuZXh0Lml0ZW1zKTtcbiAgICAgICAgICBuZXh0Lml0ZW1zID0gcHJvbW90ZVByb2plY3REYXNoYm9hcmQobmV4dC5pdGVtcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfSlcbiAgICAvLyBsaW5rIFx1MzA2RVx1NkI2M1x1ODk4Rlx1NTMxNlx1NUY4Q1x1MzA2Qlx1NTIyNFx1NUI5QVx1MzA1OVx1MzA4Qlx1RkYwOFx1NkI2M1x1ODk4Rlx1NTMxNlx1NTI0RFx1MzA2RSByYXcgbGluayBcdTMwNjdcdTMwNkYgZG9jcyBcdTkxNERcdTRFMEJcdTMwNkVcdTMwRDFcdTMwQjlcdTMwOTJcdTg5RTNcdTZDN0FcdTMwNjdcdTMwNERcdTMwNkFcdTMwNDRcdUZGMDlcbiAgICAuZmlsdGVyKChpdCkgPT4gIWlzQ2F0YWxvZ1lhbWxWaWV3ZXJQYWdlKGl0LmxpbmspKVxuICAgIC8vIFx1NUI5Rlx1ODg0Q1x1OEExOFx1OTMzMlx1MzA2RVx1OTY2NFx1NTkxNlx1MzA2N1x1NUI1MFx1MzA0Q1x1N0E3QVx1MzA2Qlx1MzA2QVx1MzA2M1x1MzA1Rlx1MzBCMFx1MzBFQlx1MzBGQ1x1MzBEN1x1RkYwOFx1NUI5Rlx1ODg0Q1x1MzBEN1x1MzBFOVx1MzBGM1x1MzBGQlx1NUI5Rlx1ODg0Q1x1N0Q1MFx1Njc5Q1x1MzA2QVx1MzA2OVx1RkYwOVx1MzA2Rlx1ODg2OFx1NzkzQVx1MzA1N1x1MzA2QVx1MzA0NFxuICAgIC5maWx0ZXIoKGl0KSA9PiBpdC5saW5rIHx8ICFpdC5pdGVtcyB8fCBpdC5pdGVtcy5sZW5ndGggPiAwKTtcblxuICBjb25zdCBmbGF0dGVuZWQgPSB0cmFuc2Zvcm1lZC5mbGF0TWFwKChpdCkgPT5cbiAgICAhaXQubGluayAmJiBpdC5pdGVtcyAmJiBGTEFUVEVORURfR1JPVVBfVEVYVFMuaGFzKGl0LnRleHQgPz8gXCJcIikgPyBpdC5pdGVtcyA6IFtpdF0sXG4gICk7XG5cbiAgZmxhdHRlbmVkLnNvcnQoKGEsIGIpID0+IHtcbiAgICBjb25zdCBrYSA9IHNvcnRLZXkoYSk7XG4gICAgY29uc3Qga2IgPSBzb3J0S2V5KGIpO1xuICAgIGlmIChrYS5idWNrZXQgIT09IGtiLmJ1Y2tldCkgcmV0dXJuIGthLmJ1Y2tldCAtIGtiLmJ1Y2tldDtcbiAgICByZXR1cm4ga2EubmFtZS5sb2NhbGVDb21wYXJlKGtiLm5hbWUsIFwiamFcIik7XG4gIH0pO1xuXG4gIHJldHVybiBmbGF0dGVuZWQ7XG59O1xuXG4vLyBcdTI2MDVcdTMwNTNcdTMwNTNcdTkxQ0RcdTg5ODFcdUZGMUFcdThBMDBcdThBOUVcdTMwRDVcdTMwQTlcdTMwRUJcdTMwQzBcdTMwOTIgZG9jdW1lbnRSb290UGF0aCBcdTMwNkJcdTMwNTlcdTMwOEJcbi8vIGdlbmVyYXRlU2lkZWJhciBcdTMwNkZcdThENzBcdTY3RkJcdTUxNDhcdTMwOTIgcHJvY2Vzcy5jd2QoKSBcdTMwNEJcdTMwODlcdTg5RTNcdTZDN0FcdTMwNTlcdTMwOEJcdTMwNUZcdTMwODFcdTMwMDFcdTVCNThcdTU3MjhcdTUyMjRcdTVCOUFcdTMwODJcdTU0MENcdTMwNThcdTU3RkFcdTZFOTZcdTMwNjdcdTg4NENcdTMwNDZcdTMwMDJcbi8vIGRvY3MvPGxvY2FsZT4gXHUzMDRDXHU3MTIxXHUzMDQ0IHdvcmtzcGFjZVx1RkYwOGNvbmZpZyBpbml0IFx1NzZGNFx1NUY4Q1x1MzA2RiBkb2NzL2phIFx1MzA2MFx1MzA1MVx1RkYwOVx1MzA2N1x1MzA2Rlx1OEQ3MFx1NjdGQlx1MzA1Qlx1MzA1QVx1N0E3QVx1MzA2Qlx1MzA1OVx1MzA4Qlx1MzAwMlxuY29uc3QgU0lERUJBUl9ET0NVTUVOVF9ST09UID0gXCJkb2NzXCI7XG5jb25zdCBtYWtlU2lkZWJhciA9IChsb2NhbGU6IExvY2FsZSk6IFNpZGViYXJJdGVtW10gPT5cbiAgdHJhbnNmb3JtU2lkZWJhcihcbiAgICBzY2FuTG9jYWxlU2lkZWJhcihcbiAgICAgIHByb2Nlc3MuY3dkKCksXG4gICAgICBTSURFQkFSX0RPQ1VNRU5UX1JPT1QsXG4gICAgICBsb2NhbGUsXG4gICAgICAoKSA9PlxuICAgICAgICBnZW5lcmF0ZVNpZGViYXIoe1xuICAgICAgICAgIGRvY3VtZW50Um9vdFBhdGg6IFNJREVCQVJfRE9DVU1FTlRfUk9PVCxcbiAgICAgICAgICBzY2FuU3RhcnRQYXRoOiBsb2NhbGUsIC8vIGxvY2FsZSBcdTMwNkVcdTRFMkRcdTMwOTJcdTMwQjlcdTMwQURcdTMwRTNcdTMwRjNcbiAgICAgICAgICB1c2VUaXRsZUZyb21GaWxlSGVhZGluZzogZmFsc2UsXG4gICAgICAgICAgY29sbGFwc2VEZXB0aDogMixcbiAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXG4gICAgICAgIH0pIGFzIFNpZGViYXJJdGVtW10sXG4gICAgKSxcbiAgICBsb2NhbGUsXG4gICk7XG5cbmNvbnN0IHNpZGViYXJKYUF1dG8gPSBtYWtlU2lkZWJhcihcImphXCIpO1xuY29uc3Qgc2lkZWJhckVuQXV0byA9IG1ha2VTaWRlYmFyKFwiZW5cIik7XG5cbnR5cGUgU2lkZWJhck11bHRpID0gUmVjb3JkPHN0cmluZywgU2lkZWJhckl0ZW1bXT47XG5cbi8vIFx1NUI1MFx1NUI2Qlx1MzA5Mlx1NTQyQlx1MzA4MVx1MzA2Nlx1NjcwMFx1NTIxRFx1MzA2Qlx1ODk4Qlx1MzA2NFx1MzA0Qlx1MzA4Qlx1MzBFQVx1MzBGM1x1MzBBRlx1MzAwMlx1MzBFQVx1MzBGM1x1MzBBRlx1MzA5Mlx1NjMwMVx1MzA1Rlx1MzA2QVx1MzA0NFx1MzBCMFx1MzBFQlx1MzBGQ1x1MzBEN1x1MzA2RVx1OTE0RFx1N0Y2RVx1NTE0OFx1MzBEMVx1MzBCOVx1MzA5Mlx1NkM3QVx1MzA4MVx1MzA4Qlx1MzA2RVx1MzA2Qlx1NEY3Rlx1MzA0Nlx1MzAwMlxuY29uc3QgZmlyc3RTaWRlYmFyTGluayA9IChpdGVtOiBTaWRlYmFySXRlbSk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gIGlmIChpdGVtLmxpbmspIHJldHVybiBpdGVtLmxpbms7XG4gIGZvciAoY29uc3QgY2hpbGQgb2YgaXRlbS5pdGVtcyA/PyBbXSkge1xuICAgIGNvbnN0IGxpbmsgPSBmaXJzdFNpZGViYXJMaW5rKGNoaWxkKTtcbiAgICBpZiAobGluaykgcmV0dXJuIGxpbms7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbi8vIFwiL2phL3Byb2plY3RzL3Byai0wMDAxLy4uLlwiIFx1MzA0Qlx1MzA4OVx1NTE0OFx1OTgyRCBkZXB0aCBcdTUwMEJcdTMwNkVcdTMwQkJcdTMwQjBcdTMwRTFcdTMwRjNcdTMwQzhcdTMwOTJcdTUzRDZcdTMwOEFcdTMwMDFcIi9qYS9wcm9qZWN0cy9wcmotMDAwMS9cIiBcdTMwOTJcdThGRDRcdTMwNTlcdTMwMDJcbmNvbnN0IHNpZGViYXJLZXlGcm9tTGluayA9IChsaW5rOiBzdHJpbmcsIGRlcHRoOiBudW1iZXIpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICBjb25zdCBzZWdtZW50cyA9IGxpbmsuc3BsaXQoXCIjXCIpWzBdLnNwbGl0KFwiL1wiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGlmIChzZWdtZW50cy5sZW5ndGggPD0gZGVwdGgpIHJldHVybiB1bmRlZmluZWQ7XG4gIHJldHVybiBgLyR7c2VnbWVudHMuc2xpY2UoMCwgZGVwdGgpLmpvaW4oXCIvXCIpfS9gO1xufTtcblxuLy8gXHUzMEI1XHUzMEE0XHUzMEM5XHUzMEQwXHUzMEZDXHUzMDkyXHUzMEQxXHUzMEI5XHUzMDU0XHUzMDY4XHUzMDZCXHU1MjA2XHU1MjcyXHUzMDU5XHUzMDhCXHUzMDAyMSBcdTMwNjRcdTMwNkVcdTkxNERcdTUyMTdcdTMwNkJcdTMwNTlcdTMwOEJcdTMwNjhcdTMwMDFcdTUxNjhcdTMwREFcdTMwRkNcdTMwQjhcdTMwNENcdTUxNjhcdTdCQzBcdTMwNkVcdTMwQjVcdTMwQTRcdTMwQzlcdTMwRDBcdTMwRkNcdTMwOTJcbi8vIFx1NjNDRlx1NzUzQlx1MzBGQlx1NEZERFx1NjMwMVx1MzA1N1x1MzA2Nlx1MzBEM1x1MzBFQlx1MzBDOVx1MzA0Q1x1ODBBNVx1NTkyN1x1NTMxNlx1MzA1OVx1MzA4Qlx1MzA1Rlx1MzA4MVx1MzAwMVx1ODg2OFx1NzkzQVx1NEUyRFx1MzA2RVx1MzBEQVx1MzBGQ1x1MzBCOFx1MzA0Q1x1NUM1RVx1MzA1OVx1MzA4Qlx1N0JDMFx1MzA2MFx1MzA1MVx1MzA5Mlx1NTFGQVx1MzA1OVx1MzAwMlxuLy8gLSAvPGxvY2FsZT4vc3BlY2Rvam8vIFx1OTE0RFx1NEUwQjogc3BlY2Rvam8gXHUzMDZFXHU3QkMwXHUzMDYwXHUzMDUxXG4vLyAtIC88bG9jYWxlPi9wcm9qZWN0cy88aWQ+LyBcdTkxNERcdTRFMEI6IFx1MzA1RFx1MzA2RSBwcm9qZWN0IFx1MzA2RVx1N0JDMFx1MzA2MFx1MzA1MVxuLy8gLSBcdTMwNURcdTMwOENcdTRFRTVcdTU5MTZcdTMwNkVcdTMwQzhcdTMwQzNcdTMwRDdcdTMwRUNcdTMwRDlcdTMwRUJcdUZGMDhwcm9kdWN0IFx1MzA2QVx1MzA2OVx1RkYwOTogXHUzMDVEXHUzMDZFXHUzMEM3XHUzMEEzXHUzMEVDXHUzMEFGXHUzMEM4XHUzMEVBXHUzMDZFXHU3QkMwXHUzMDYwXHUzMDUxXG4vLyAtIFx1MzA2OVx1MzA4Q1x1MzA2Qlx1MzA4Mlx1NUY1M1x1MzA1Rlx1MzA4OVx1MzA2QVx1MzA0NFx1MzBEQVx1MzBGQ1x1MzBCOFx1RkYwOC88bG9jYWxlPi8gXHUzMDZFXHUzMEM4XHUzMEMzXHUzMEQ3XHUzMDZBXHUzMDY5XHVGRjA5OiBcdTU0MDRcdTdCQzBcdTMwNkVcdTUxNjVcdTUzRTNcdTMwRUFcdTMwRjNcdTMwQUZcdTMwNjBcdTMwNTFcbmNvbnN0IG1ha2VTaWRlYmFyTXVsdGkgPSAoXG4gIGxvY2FsZTogTG9jYWxlLFxuICBhdXRvSXRlbXM6IFNpZGViYXJJdGVtW10sXG4gIGhhbmRib29rSXRlbT86IFNpZGViYXJJdGVtLFxuKTogU2lkZWJhck11bHRpID0+IHtcbiAgY29uc3Qgc2VjdGlvbnM6IHsga2V5OiBzdHJpbmc7IGl0ZW1zOiBTaWRlYmFySXRlbVtdOyBlbnRyeTogU2lkZWJhckl0ZW0gfVtdID0gW107XG5cbiAgaWYgKGhhbmRib29rSXRlbSkge1xuICAgIHNlY3Rpb25zLnB1c2goe1xuICAgICAga2V5OiBgLyR7bG9jYWxlfS9zcGVjZG9qby9gLFxuICAgICAgaXRlbXM6IFtoYW5kYm9va0l0ZW1dLFxuICAgICAgZW50cnk6IHsgdGV4dDogaGFuZGJvb2tJdGVtLnRleHQsIGxpbms6IGhhbmRib29rSXRlbS5saW5rIH0sXG4gICAgfSk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGl0ZW0gb2YgYXV0b0l0ZW1zKSB7XG4gICAgY29uc3QgbGluayA9IGZpcnN0U2lkZWJhckxpbmsoaXRlbSk7XG4gICAgY29uc3Qga2V5ID0gbGluayA/IHNpZGViYXJLZXlGcm9tTGluayhsaW5rLCAyKSA6IHVuZGVmaW5lZDtcbiAgICBpZiAoIWtleSkgY29udGludWU7XG5cbiAgICBpZiAoa2V5ID09PSBgLyR7bG9jYWxlfS9wcm9qZWN0cy9gICYmIGl0ZW0uaXRlbXMpIHtcbiAgICAgIGZvciAoY29uc3QgcHJvamVjdCBvZiBpdGVtLml0ZW1zKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3RMaW5rID0gZmlyc3RTaWRlYmFyTGluayhwcm9qZWN0KTtcbiAgICAgICAgY29uc3QgcHJvamVjdEtleSA9IHByb2plY3RMaW5rID8gc2lkZWJhcktleUZyb21MaW5rKHByb2plY3RMaW5rLCAzKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKCFwcm9qZWN0S2V5KSBjb250aW51ZTtcbiAgICAgICAgc2VjdGlvbnMucHVzaCh7XG4gICAgICAgICAga2V5OiBwcm9qZWN0S2V5LFxuICAgICAgICAgIGl0ZW1zOiBbeyAuLi5wcm9qZWN0LCBjb2xsYXBzZWQ6IGZhbHNlIH1dLFxuICAgICAgICAgIGVudHJ5OiB7IHRleHQ6IGAke2l0ZW0udGV4dCA/PyBcIlwifTogJHtwcm9qZWN0LnRleHQgPz8gXCJcIn1gLCBsaW5rOiBwcm9qZWN0TGluayB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHNlY3Rpb25zLnB1c2goe1xuICAgICAga2V5LFxuICAgICAgaXRlbXM6IFt7IC4uLml0ZW0sIGNvbGxhcHNlZDogZmFsc2UgfV0sXG4gICAgICBlbnRyeTogeyB0ZXh0OiBpdGVtLnRleHQsIGxpbms6IGl0ZW0ubGluayA/PyBsaW5rIH0sXG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBtdWx0aTogU2lkZWJhck11bHRpID0ge307XG4gIGZvciAoY29uc3Qgc2VjdGlvbiBvZiBzZWN0aW9ucykge1xuICAgIG11bHRpW3NlY3Rpb24ua2V5XSA9IFsuLi4obXVsdGlbc2VjdGlvbi5rZXldID8/IFtdKSwgLi4uc2VjdGlvbi5pdGVtc107XG4gIH1cbiAgaWYgKHNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICBtdWx0aVtgLyR7bG9jYWxlfS9gXSA9IHNlY3Rpb25zLm1hcCgoc2VjdGlvbikgPT4gc2VjdGlvbi5lbnRyeSk7XG4gIH1cbiAgcmV0dXJuIG11bHRpO1xufTtcblxuY29uc3Qgc2lkZWJhckphID0gbWFrZVNpZGViYXJNdWx0aShcImphXCIsIHNpZGViYXJKYUF1dG8sIHNwZWNkb2pvSXRlbXMuamEpO1xuY29uc3Qgc2lkZWJhckVuID0gbWFrZVNpZGViYXJNdWx0aShcImVuXCIsIHNpZGViYXJFbkF1dG8pO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICB0aXRsZTogXCJTcGVjRG9qb1wiLFxuICBkZXNjcmlwdGlvbjogXCJEb2N1bWVudGF0aW9uIGZvciBTcGVjRG9qb1wiLFxuICBiYXNlLFxuXG4gIC8vIGAudml0ZXByZXNzLyoqYCBcdTMwOTIgd29ya3NwYWNlIFx1MzA0Qlx1MzA4OVx1OEQ3MFx1NjdGQlx1MzA1Qlx1MzA1QVx1MzAwMWRvY3MgXHUzMDY4XHU1NDBDXHU2OEIxXHU2NTg3XHU2NkY4XHUzMDkyXHU5MUNEXHUzMDZEXHUzMDVGXHUzMEM0XHUzMEVBXHUzMEZDXHUzMDYwXHUzMDUxXHUzMDkyXHU4RDcwXHU2N0ZCXHUzMDU5XHUzMDhCXHUzMDAyXG4gIHNyY0Rpcjoga2F0YVN0YWdpbmcuc3RhZ2luZ1Jvb3QsXG4gIC8vIFx1MzBEM1x1MzBFQlx1MzBDOVx1N0Q1MFx1Njc5Q1x1MzA2OCBjYWNoZSBcdTMwNkYgcGFja2FnZSBcdTMwNkVcdTRFMkRcdUZGMDhub2RlX21vZHVsZXMgXHU5MTREXHU0RTBCXHVGRjA5XHUzMDY3XHUzMDZGXHUzMDZBXHUzMDRGXHUzMDAxXHU5NUIyXHU4OUE3XHU1QkZFXHU4QzYxXHUzMDZFIHdvcmtzcGFjZSBcdTUwNzRcdTMwNzhcdTdGNkVcdTMwNEZcdTMwMDJcbiAgLy8gcGFja2FnZSBcdTMwNkVcdTRFMkRcdTMwNkJcdTdGNkVcdTMwNEZcdTMwNjhcdTUyMjlcdTc1MjhcdTgwMDVcdTMwNENcdTUxRkFcdTUyOUJcdTMwOTJcdTg5OEJcdTMwNjRcdTMwNTFcdTMwNkJcdTMwNEZcdTMwNEZcdTMwMDFucG0gY2kgXHUzMDY3XHU2RDg4XHUzMDQ4XHUzMDAxcGFja2FnZSBcdTMwOTJcdTUxNzFcdTY3MDlcdTMwNTlcdTMwOEJcbiAgLy8gXHU4OTA3XHU2NTcwIHdvcmtzcGFjZSBcdTMwNkVcdTUxRkFcdTUyOUJcdTMwNENcdTZERjdcdTMwNTZcdTMwOEJcdTMwMDJcdTdGNkVcdTMwNERcdTU4MzRcdTYyNDBcdTMwNkYgVml0ZVByZXNzIFx1MzA2RVx1NjVFMlx1NUI5QVx1MzA2OFx1NTQwQ1x1MzA1OCA8d29ya3NwYWNlPi8udml0ZXByZXNzLyBcdTMwNjhcdTMwNTlcdTMwOEJcdTMwMDJcbiAgb3V0RGlyOiBwYXRoLmpvaW4oV09SS1NQQUNFX1JPT1QsIFwiLnZpdGVwcmVzc1wiLCBcImRpc3RcIiksXG4gIGNhY2hlRGlyOiBwYXRoLmpvaW4oV09SS1NQQUNFX1JPT1QsIFwiLnZpdGVwcmVzc1wiLCBcImNhY2hlXCIpLFxuXG4gIC8vIFx1OTVCMlx1ODlBN1x1NzUyOFx1MzBDNFx1MzBFQVx1MzBGQ1x1MzA2Qlx1MzA2RiBkb2NzLyBcdTMwNjBcdTMwNTFcdTMwOTJcdTdGNkVcdTMwNEZcdTMwMDJcdTUxRkFcdTUyOUJcdTMwRkJjYWNoZVx1MzBGQlx1NTIyOVx1NzUyOFx1ODAwNVx1MzA2RVx1OEEyRFx1NUI5QVx1MzA2Rlx1MzBDNFx1MzBFQVx1MzBGQ1x1MzA2RVx1NTkxNlx1MzA2Qlx1MzA0Mlx1MzA4QVx1MzAwMVxuICAvLyBcdTMwREFcdTMwRkNcdTMwQjhcdThENzBcdTY3RkJcdTMwNkJcdTUxNjVcdTMwODlcdTMwNkFcdTMwNDRcdTMwMDJleGVjIFx1MzA2RSBwbGFuIC8gcmVzdWx0IFx1MzA2Rlx1NUYxNVx1MzA0RFx1N0Q5QVx1MzA0RFx1NTE2Q1x1OTU4Qlx1NUJGRVx1OEM2MVx1MzA0Qlx1MzA4OVx1NTkxNlx1MzA1OVx1MzAwMlxuICBzcmNFeGNsdWRlOiBbXG4gICAgXCIqLm1kXCIsXG4gICAgXCIudml0ZXByZXNzLyoqXCIsXG4gICAgXCJsb2NhbC8qKlwiLFxuICAgIFwid29ya3NwYWNlcy8qKlwiLFxuICAgIFwidGVtcGxhdGVzLyoqXCIsXG4gICAgXCJsb2dzLyoqXCIsXG4gICAgXCJwYWNrYWdlcy8qKlwiLFxuICAgIFwiZG9jcy8qKi9leGVjdXRpb24vZXhlYy9wbGFucy8qKlwiLFxuICAgIFwiZG9jcy8qKi9leGVjdXRpb24vZXhlYy9yZXN1bHRzLyoqXCIsXG4gIF0sXG5cbiAgLy8gXHUzMEI1XHUzMEE0XHUzMEM4XHU4QTJEXHU1QjlBXHVGRjA4XHUzMEI1XHUzMEE0XHUzMEM5XHUzMEQwXHUzMEZDXHUzMDkyXHU1NDJCXHUzMDgwXHVGRjA5XHUzMDY4XHUzMERBXHUzMEZDXHUzMEI4XHUzMDZFXHUzMENGXHUzMEMzXHUzMEI3XHUzMEU1XHU4ODY4XHUzMDZGXHUzMDAxXHU2NUUyXHU1QjlBXHUzMDY3XHUzMDZGXHU1MTY4XHUzMERBXHUzMEZDXHUzMEI4XHUzMDZFIEhUTUwgXHUzMDc4XG4gIC8vIFx1MzBBNFx1MzBGM1x1MzBFOVx1MzBBNFx1MzBGM1x1NUM1NVx1OTU4Qlx1MzA1NVx1MzA4Q1x1MzA4Qlx1MzAwMlx1MzBEQVx1MzBGQ1x1MzBCOFx1NjU3MFx1MzA0Q1x1NTkxQVx1MzA0NFx1MzA1Rlx1MzA4MVx1MzAwMVx1NTE3MVx1NjcwOVx1MzA2RSBKUyBcdTMwQzFcdTMwRTNcdTMwRjNcdTMwQUZcdTMwNzhcdTUyMDdcdTMwOEFcdTUxRkFcdTMwNTdcdTMwNjYgMSBcdTU2REVcdTMwNjBcdTMwNTFcdTkxNERcdTRGRTFcdTMwNTlcdTMwOEJcdTMwMDJcbiAgbWV0YUNodW5rOiB0cnVlLFxuXG4gIC8vIFx1MzBCNVx1MzBBNFx1MzBDOVx1MzBEMFx1MzBGQ1x1NjI5OFx1MzA4QVx1MzA1Rlx1MzA1Rlx1MzA3Rlx1NzJCNlx1NjE0Qlx1MzA2RVx1NUZBOVx1NTE0M1x1RkYwOFx1NTIxRFx1NTZERVx1NjNDRlx1NzUzQlx1NTI0RFx1MzA2Qlx1NTQwQ1x1NjcxRlx1NUI5Rlx1ODg0Q1x1MzA1N1x1MzAwMVx1MzA2MVx1MzA4OVx1MzA2NFx1MzA0RFx1MzA5Mlx1OTYzMlx1MzA1MFx1RkYwOVxuICBoZWFkOiBbXG4gICAgW1xuICAgICAgXCJzY3JpcHRcIixcbiAgICAgIHt9LFxuICAgICAgYChmdW5jdGlvbigpe3RyeXtpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndnAtc2lkZWJhci1jb2xsYXBzZWQnKT09PSd0cnVlJyl7ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZwLXNpZGViYXItY29sbGFwc2VkJyl9fWNhdGNoKGUpe319KSgpYCxcbiAgICBdLFxuICBdLFxuXG4gIC8vIFx1NzI2OVx1NzQwNlx1MzBEMVx1MzBCOVx1MzA2RiBkb2NzL2phLCBkb2NzL2VuIFx1MzA2RVx1MzA3RVx1MzA3RVx1MzA2N1x1MzAwMVxuICAvLyBcdTUxNkNcdTk1OEJVUkxcdUZGMDhcdTMwNEFcdTMwODhcdTMwNzMgaTE4biBcdTMwNkVcdTMwRURcdTMwQjFcdTMwRkNcdTMwRUJcdTUyMjRcdTVCOUFcdUZGMDlcdTMwNkYgL2phLywgL2VuLyBcdTMwNkJcdTYzQzNcdTMwNDhcdTMwOEJcdTMwMDJcbiAgLy8gcGFja2FnZSBcdTUzQzJcdTcxNjdcdTRFMkRcdTMwNkUga2F0YSBcdTMwNkZcdTMwQjlcdTMwQzZcdTMwRkNcdTMwQjhcdTMwRjNcdTMwQjBcdTMwNkJcdTdGNkVcdTMwNERcdTMwMDFcdTUyMjlcdTc1MjhcdTMwRUFcdTMwRERcdTMwQjhcdTMwQzhcdTMwRUFcdTMwNkUgZG9jcy9qYSBcdTMwNjhcdTU0MENcdTMwNTggVVJMIFx1MzA3OFx1NTE5OVx1NTBDRlx1MzA1OVx1MzA4Qlx1MzAwMlxuICByZXdyaXRlczoge1xuICAgIFwiZG9jcy9pbmRleC5tZFwiOiBcImluZGV4Lm1kXCIsXG4gICAgXCJkb2NzL2phLzpyZXN0KlwiOiBcImphLzpyZXN0KlwiLFxuICAgIFwiZG9jcy9lbi86cmVzdCpcIjogXCJlbi86cmVzdCpcIixcbiAgfSxcblxuICAvLyBcdTMwQjlcdTMwQzZcdTMwRkNcdTMwQjhcdTMwRjNcdTMwQjBcdTMwNTdcdTMwNUYgcGFja2FnZSBcdTY1ODdcdTY2RjhcdTMwNEJcdTMwODkgU3BlY0Rvam8gXHU5NThCXHU3NjdBXHUzMEVBXHUzMEREXHUzMEI4XHUzMEM4XHUzMEVBXHU1NkZBXHU2NzA5XHUzMDZFXHU2NTg3XHU2NkY4XHUzMDc4XHUzMDZFXHUzMEVBXHUzMEYzXHUzMEFGXHUzMDYwXHUzMDUxXHUzMDkyXHU4QTMxXHU1QkI5XHUzMDU5XHUzMDhCXHUzMDAyXG4gIC8vIFx1MzBCOVx1MzBDNlx1MzBGQ1x1MzBCOFx1MzBGM1x1MzBCMFx1MzA1N1x1MzA2Nlx1MzA0NFx1MzA2QVx1MzA0NFx1RkYwOFNwZWNEb2pvIFx1ODFFQVx1OEVBQlx1MzA2RVx1MzBFQVx1MzBERFx1MzBCOFx1MzBDOFx1MzBFQVx1MzA2QVx1MzA2OVx1RkYwOVx1NTgzNFx1NTQwOFx1MzA2Rlx1NUY5M1x1Njc2NVx1MzA2OVx1MzA0QVx1MzA4QVx1NTE2OCBkZWFkIGxpbmsgXHUzMDkyXHU2OTFDXHU1MUZBXHUzMDU5XHUzMDhCXHUzMDAyXG4gIC4uLihrYXRhU3RhZ2luZy5zdGFnZWQgPiAwID8geyBpZ25vcmVEZWFkTGlua3M6IFsuLi5TVEFHRURfUEFDS0FHRV9ERUFEX0xJTktfUEFUVEVSTlNdIH0gOiB7fSksXG5cbiAgdGhlbWVDb25maWc6IHtcbiAgICAvLyBcdTMwRDNcdTMwRUJcdTMwQzlcdTY2NDJcdTMwNkJcdTc1MUZcdTYyMTBcdTMwNTdcdTMwNUZcdTMwQTRcdTMwRjNcdTMwQzdcdTMwQzNcdTMwQUZcdTMwQjlcdTMwNjdcdTMwRDZcdTMwRTlcdTMwQTZcdTMwQjZcdTUxODVcdTY5MUNcdTdEMjJcdTMwOTJcdTg4NENcdTMwNDZcdUZGMDhcdTU5MTZcdTkwRThcdTMwQjVcdTMwRkNcdTMwRDNcdTMwQjlcdTRFMERcdTg5ODFcdUZGMDlcbiAgICBzZWFyY2g6IHtcbiAgICAgIHByb3ZpZGVyOiBcImxvY2FsXCIsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIF9yZW5kZXI6IHJlbmRlclNlYXJjaEh0bWwsXG4gICAgICAgIG1pbmlTZWFyY2g6IHtcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB0b2tlbml6ZTogdG9rZW5pemVTZWFyY2hUZXh0LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGxvY2FsZXM6IHtcbiAgICAgICAgICBqYToge1xuICAgICAgICAgICAgdHJhbnNsYXRpb25zOiB7XG4gICAgICAgICAgICAgIGJ1dHRvbjoge1xuICAgICAgICAgICAgICAgIGJ1dHRvblRleHQ6IFwiXHU2OTFDXHU3RDIyXCIsXG4gICAgICAgICAgICAgICAgYnV0dG9uQXJpYUxhYmVsOiBcIlx1NjkxQ1x1N0QyMlwiLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtb2RhbDoge1xuICAgICAgICAgICAgICAgIGRpc3BsYXlEZXRhaWxzOiBcIlx1OEE3M1x1N0QzMFx1MzA5Mlx1ODg2OFx1NzkzQVwiLFxuICAgICAgICAgICAgICAgIHJlc2V0QnV0dG9uVGl0bGU6IFwiXHU2OTFDXHU3RDIyXHU2NzYxXHU0RUY2XHUzMDkyXHUzMEVBXHUzMEJCXHUzMEMzXHUzMEM4XCIsXG4gICAgICAgICAgICAgICAgYmFja0J1dHRvblRpdGxlOiBcIlx1NjkxQ1x1N0QyMlx1MzA5Mlx1OTU4OVx1MzA1OFx1MzA4QlwiLFxuICAgICAgICAgICAgICAgIG5vUmVzdWx0c1RleHQ6IFwiXHU2OTFDXHU3RDIyXHU3RDUwXHU2NzlDXHUzMDRDXHU4OThCXHUzMDY0XHUzMDRCXHUzMDhBXHUzMDdFXHUzMDVCXHUzMDkzXHUzMDY3XHUzMDU3XHUzMDVGXCIsXG4gICAgICAgICAgICAgICAgZm9vdGVyOiB7XG4gICAgICAgICAgICAgICAgICBzZWxlY3RUZXh0OiBcIlx1OTA3OFx1NjI5RVwiLFxuICAgICAgICAgICAgICAgICAgc2VsZWN0S2V5QXJpYUxhYmVsOiBcImVudGVyXCIsXG4gICAgICAgICAgICAgICAgICBuYXZpZ2F0ZVRleHQ6IFwiXHU3OUZCXHU1MkQ1XCIsXG4gICAgICAgICAgICAgICAgICBuYXZpZ2F0ZVVwS2V5QXJpYUxhYmVsOiBcIlx1NEUwQVx1NzdFMlx1NTM3MFwiLFxuICAgICAgICAgICAgICAgICAgbmF2aWdhdGVEb3duS2V5QXJpYUxhYmVsOiBcIlx1NEUwQlx1NzdFMlx1NTM3MFwiLFxuICAgICAgICAgICAgICAgICAgY2xvc2VUZXh0OiBcIlx1OTU4OVx1MzA1OFx1MzA4QlwiLFxuICAgICAgICAgICAgICAgICAgY2xvc2VLZXlBcmlhTGFiZWw6IFwiZXNjXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICBsb2NhbGVzOiB7XG4gICAgamE6IHtcbiAgICAgIGxhYmVsOiBcIlx1NjVFNVx1NjcyQ1x1OEE5RVwiLFxuICAgICAgbGFuZzogXCJqYVwiLFxuICAgICAgLy8gXHU4QTAwXHU4QTlFXHUzMEUxXHUzMENCXHUzMEU1XHUzMEZDXHUzMDY3XHU2MkJDXHUzMDU3XHUzMDVGXHUzMDY4XHUzMDREXHUzMDZFXHUzMEVBXHUzMEYzXHUzMEFGXHU1MTQ4XHVGRjA4XHU2NUU1XHU2NzJDXHU4QTlFXHUzMEM4XHUzMEMzXHUzMEQ3XHVGRjA5XG4gICAgICBsaW5rOiBcIi9qYS9cIixcbiAgICAgIHRoZW1lQ29uZmlnOiB7XG4gICAgICAgIG5hdjogW1xuICAgICAgICAgIHsgdGV4dDogXCJcdTMwREJcdTMwRkNcdTMwRTBcIiwgbGluazogXCIvamEvXCIgfSxcbiAgICAgICAgICB7IHRleHQ6IFwiU3BlY0Rvam9cIiwgbGluazogXCIvamEvc3BlY2Rvam8vZ3VpZGVzL3NwZWNkb2pvLW92ZXJ2aWV3LWd1aWRlXCIgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFwiLFxuICAgICAgICAgICAgbGluazogXCIvamEvcHJvamVjdHMvcHJqLTAwMDEvMDIwLXByb2plY3QtZGVmaW5pdGlvbi9wcmotb3ZlcnZpZXdcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBzaWRlYmFyOiBzaWRlYmFySmEsXG4gICAgICAgIGxhbmdNZW51TGFiZWw6IFwiXHU4QTAwXHU4QTlFXCIsXG4gICAgICB9LFxuICAgIH0sXG4gICAgZW46IHtcbiAgICAgIGxhYmVsOiBcIkVuZ2xpc2hcIixcbiAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgIGxpbms6IFwiL2VuL1wiLFxuICAgICAgdGhlbWVDb25maWc6IHtcbiAgICAgICAgbmF2OiBbeyB0ZXh0OiBcIkhvbWVcIiwgbGluazogXCIvZW4vXCIgfV0sXG4gICAgICAgIHNpZGViYXI6IHNpZGViYXJFbixcbiAgICAgICAgbGFuZ01lbnVMYWJlbDogXCJMYW5ndWFnZVwiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuXG4gIC8vIEZyb250bWF0dGVyVGFibGUgXHUzMDRDIGRvYyBpZCBcdTMwOTJcdTMwRUFcdTMwRjNcdTMwQUZcdTg4NjhcdTc5M0FcdTMwNjdcdTMwNERcdTMwOEJcdTMwODhcdTMwNDZcdTMwMDFcdTg5RTNcdTZDN0FcdTZFMDhcdTMwN0YgaHJlZiBcdTMwOTIgcGFnZURhdGEgXHUzMDc4XHU4RjA5XHUzMDVCXHUzMDhCXHUzMDAyXG4gIHRyYW5zZm9ybVBhZ2VEYXRhKHBhZ2VEYXRhKSB7XG4gICAgY29uc3QgZnJvbnRtYXR0ZXJEb2NMaW5rcyA9IGNvbGxlY3RGcm9udG1hdHRlckRvY0xpbmtzKFxuICAgICAgcGFnZURhdGEuZnJvbnRtYXR0ZXIsXG4gICAgICBwYWdlRGF0YS5yZWxhdGl2ZVBhdGgsXG4gICAgKTtcbiAgICBjb25zdCBkb2NJZCA9IGdldFNwZWNkb2pvRG9jSWQocGFnZURhdGEuZnJvbnRtYXR0ZXIpO1xuICAgIGNvbnN0IGdyYWRlU3VtbWFyeSA9IGRvY0lkID8gcmVhZEdyYWRlU3VtbWFyeShkb2NJZCkgOiB1bmRlZmluZWQ7XG4gICAgaWYgKE9iamVjdC5rZXlzKGZyb250bWF0dGVyRG9jTGlua3MpLmxlbmd0aCA+IDAgfHwgZ3JhZGVTdW1tYXJ5KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi4oT2JqZWN0LmtleXMoZnJvbnRtYXR0ZXJEb2NMaW5rcykubGVuZ3RoID4gMCA/IHsgZnJvbnRtYXR0ZXJEb2NMaW5rcyB9IDoge30pLFxuICAgICAgICAuLi4oZ3JhZGVTdW1tYXJ5ID8geyBncmFkZVN1bW1hcnkgfSA6IHt9KSxcbiAgICAgIH07XG4gICAgfVxuICB9LFxuXG4gIG1hcmtkb3duOiB7XG4gICAgLy9cbiAgICAvLyBgYGBtZXJtYWlkIC4uLiBgYGAgXHUzMDZFXHUzMEIzXHUzMEZDXHUzMEM5XHUzMEQ2XHUzMEVEXHUzMEMzXHUzMEFGXHUzMDkyXG4gICAgLy8gPGltZyBzcmM9XCIvbWVybWFpZC88aGFzaD4uc3ZnXCI+IFx1MzA2Qlx1NURFRVx1MzA1N1x1NjZGRlx1MzA0OFx1MzA4QlxuICAgIC8vIFx1RkYwOE1hcmtkb3duXHUzMEQ1XHUzMEExXHUzMEE0XHUzMEVCXHUzMDZGXHU2NkY4XHUzMDREXHU2M0RCXHUzMDQ4XHUzMDZBXHUzMDQ0XHUzMDAySFRNTFx1NzUxRlx1NjIxMFx1NjY0Mlx1MzA2MFx1MzA1MVx1NURFRVx1MzA1N1x1NjZGRlx1MzA0OFx1RkYwOVxuICAgIC8vXG4gICAgY29uZmlnOiAobWQpID0+IHtcbiAgICAgIC8vIGZyb250IG1hdHRlciBcdTMwNkUgdGl0bGUgXHUzMDkyXHU1MTQ4XHU5ODJESDFcdTMwNjhcdTMwNTdcdTMwNjZcdTZDRThcdTUxNjVcdUZGMDhcdTY1RTJcdTMwNkJIMVx1MzA0Q1x1MzA0Mlx1MzA4Q1x1MzA3MFx1NEY1NVx1MzA4Mlx1MzA1N1x1MzA2QVx1MzA0NFx1RkYwOVxuICAgICAgbWQuY29yZS5ydWxlci5hZnRlcihcImJsb2NrXCIsIFwiZnJvbnRtYXR0ZXItaDFcIiwgKHN0YXRlOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgZm1UaXRsZSA9IHN0YXRlLmVudj8uZnJvbnRtYXR0ZXI/LnRpdGxlO1xuICAgICAgICBpZiAoIWZtVGl0bGUpIHJldHVybjtcblxuICAgICAgICBjb25zdCBoYXNIMSA9IHN0YXRlLnRva2Vucy5zb21lKCh0OiBhbnkpID0+IHQudHlwZSA9PT0gXCJoZWFkaW5nX29wZW5cIiAmJiB0LnRhZyA9PT0gXCJoMVwiKTtcbiAgICAgICAgaWYgKGhhc0gxKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgVG9rZW4gPSBzdGF0ZS5Ub2tlbjtcbiAgICAgICAgY29uc3Qgb3BlbiA9IG5ldyBUb2tlbihcImhlYWRpbmdfb3BlblwiLCBcImgxXCIsIDEpO1xuICAgICAgICBvcGVuLm1hcmt1cCA9IFwiI1wiO1xuICAgICAgICBvcGVuLmJsb2NrID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBpbmxpbmUgPSBuZXcgVG9rZW4oXCJpbmxpbmVcIiwgXCJcIiwgMCk7XG4gICAgICAgIGlubGluZS5jb250ZW50ID0gU3RyaW5nKGZtVGl0bGUpO1xuICAgICAgICBpbmxpbmUuY2hpbGRyZW4gPSBbXTtcblxuICAgICAgICBjb25zdCBjbG9zZSA9IG5ldyBUb2tlbihcImhlYWRpbmdfY2xvc2VcIiwgXCJoMVwiLCAtMSk7XG4gICAgICAgIGNsb3NlLm1hcmt1cCA9IFwiI1wiO1xuICAgICAgICBjbG9zZS5ibG9jayA9IHRydWU7XG5cbiAgICAgICAgLy8gXHU2NTg3XHU2NkY4XHUzMDZFXHU1MTQ4XHU5ODJEXHUzMDZCIEgxIFx1MzA5Mlx1NURFRVx1MzA1N1x1OEZCQ1x1MzA4MFxuICAgICAgICBzdGF0ZS50b2tlbnMudW5zaGlmdChjbG9zZSk7XG4gICAgICAgIHN0YXRlLnRva2Vucy51bnNoaWZ0KGlubGluZSk7XG4gICAgICAgIHN0YXRlLnRva2Vucy51bnNoaWZ0KG9wZW4pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFx1MzBBNFx1MzBGM1x1MzBFOVx1MzBBNFx1MzBGM1x1MzBCM1x1MzBGQ1x1MzBDOSBgLi4uYCBcdTMwNkZcdTVGQzVcdTMwNUEgdi1wcmUgXHUzMDkyXHU0RUQ4XHUzMDUxXHUzMDY2XHU1MUZBXHU1MjlCXG4gICAgICAvLyAgICBcdTIxOTIgYHt7IC4uLiB9fWAgXHUzMDkyIFZ1ZSBcdTMwNENcdTMwRDFcdTMwRkNcdTMwQjlcdTMwNTdcdTMwNkFcdTMwNEZcdTMwNkFcdTMwOEJcbiAgICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfaW5saW5lID0gKHRva2VucywgaWR4KSA9PiB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2lkeF07XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBtZC51dGlscy5lc2NhcGVIdG1sKHRva2VuLmNvbnRlbnQpO1xuICAgICAgICByZXR1cm4gYDxjb2RlIHYtcHJlPiR7Y29udGVudH08L2NvZGU+YDtcbiAgICAgIH07XG5cbiAgICAgIC8vIHNyY0V4Y2x1ZGUgXHUzMDU3XHUzMDVGIHBsYW4gLyByZXN1bHQgXHUzMDc4XHUzMDZFIE1hcmtkb3duIFx1MzBFQVx1MzBGM1x1MzBBRlx1MzA2Rlx1MzAwMVx1NTE0M1x1NjU4N1x1NjZGOFx1MzA5Mlx1NjZGOFx1MzA0RFx1NjNEQlx1MzA0OFx1MzA1QVxuICAgICAgLy8gR2l0SHViIFx1MzA2RVx1MzBENVx1MzBBMVx1MzBBNFx1MzBFQlx1ODg2OFx1NzkzQVx1MzA3OFx1NEVEOFx1MzA1MVx1NjZGRlx1MzA0OFx1MzA4Qlx1MzAwMlx1NTkxNlx1OTBFOCBVUkwgXHU1MzE2XHUzMDZCXHUzMDg4XHUzMDhBIGRlYWQgbGluayBcdTY5MUNcdTY3RkJcdTMwODJcdTdEQURcdTYzMDFcdTMwNjdcdTMwNERcdTMwOEJcdTMwMDJcbiAgICAgIGNvbnN0IGRlZmF1bHRMaW5rT3BlbiA9IG1kLnJlbmRlcmVyLnJ1bGVzLmxpbmtfb3BlbjtcbiAgICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmxpbmtfb3BlbiA9ICh0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52LCBzZWxmKSA9PiB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2lkeF07XG4gICAgICAgIGNvbnN0IGhyZWYgPSB0b2tlbi5hdHRyR2V0KFwiaHJlZlwiKTtcbiAgICAgICAgY29uc3QgY3VycmVudFJlbFBhdGggPSAoZW52IGFzIHsgcmVsYXRpdmVQYXRoPzogc3RyaW5nIH0gfCB1bmRlZmluZWQpPy5yZWxhdGl2ZVBhdGg7XG4gICAgICAgIGlmIChocmVmICYmIGN1cnJlbnRSZWxQYXRoKSB7XG4gICAgICAgICAgdG9rZW4uYXR0clNldChcImhyZWZcIiwgcmV3cml0ZUV4ZWNSZWNvcmRNYXJrZG93bkhyZWYoaHJlZiwgY3VycmVudFJlbFBhdGgsIEdJVEhVQl9TT1VSQ0UpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdExpbmtPcGVuXG4gICAgICAgICAgPyBkZWZhdWx0TGlua09wZW4odG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiwgc2VsZilcbiAgICAgICAgICA6IHNlbGYucmVuZGVyVG9rZW4odG9rZW5zLCBpZHgsIG9wdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgZGVmYXVsdEZlbmNlID0gbWQucmVuZGVyZXIucnVsZXMuZmVuY2U7XG5cbiAgICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlID0gKHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYsIHNlbGYpID0+IHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XTtcbiAgICAgICAgY29uc3QgaW5mbyA9ICh0b2tlbi5pbmZvIHx8IFwiXCIpLnRyaW0oKTtcblxuICAgICAgICAvLyBzcmNEaXIgXHUzMDZFXHU1MjA3XHUzMDhBXHU2NkZGXHUzMDQ4XHU1RjhDXHUzMDgyXHUzMDAxQC9zcmMvLi4uIFx1MzA2QVx1MzA2OVx1NTIyOVx1NzUyOFx1NTA3NFx1MzA2RVx1MzBCM1x1MzBGQ1x1MzBDOVx1MzBCOVx1MzBDQlx1MzBEQVx1MzBDM1x1MzBDOFx1MzA5Mlx1ODlFM1x1NkM3QVx1MzA1OVx1MzA4Qlx1MzAwMlxuICAgICAgICBjb25zdCBzbmlwcGV0ID0gdG9rZW4gYXMgdHlwZW9mIHRva2VuICYgeyBzcmM/OiBzdHJpbmdbXSB9O1xuICAgICAgICBpZiAoc25pcHBldC5zcmM/LlswXSkge1xuICAgICAgICAgIGNvbnN0IHJlbGF0aXZlID0gcGF0aC5yZWxhdGl2ZShrYXRhU3RhZ2luZy5zdGFnaW5nUm9vdCwgc25pcHBldC5zcmNbMF0pO1xuICAgICAgICAgIGNvbnN0IG9yaWdpbmFsID0gcGF0aC5qb2luKFdPUktTUEFDRV9ST09ULCByZWxhdGl2ZSk7XG4gICAgICAgICAgaWYgKCFyZWxhdGl2ZS5zdGFydHNXaXRoKFwiLi5cIikgJiYgIXBhdGguaXNBYnNvbHV0ZShyZWxhdGl2ZSkgJiYgZXhpc3RzU3luYyhvcmlnaW5hbCkpIHtcbiAgICAgICAgICAgIHNuaXBwZXQuc3JjWzBdID0gb3JpZ2luYWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZm8gPT09IFwibWVybWFpZFwiIHx8IGluZm8uc3BsaXQoL1xccy8pWzBdID09PSBcImQyXCIpIHtcbiAgICAgICAgICBjb25zdCBjb2RlID0gdG9rZW4uY29udGVudC50cmltKCk7XG4gICAgICAgICAgLy8gXHU3NTFGXHU2MjEwXHU1MDc0XHUzMDY4XHU1NDBDXHUzMDU4XHUzMEFEXHUzMEZDXHVGRjA4Q0xJIFx1MzA2RVx1NzI0OFx1MzBGQlx1OTE0RFx1N0Y2RVx1OEEyRFx1NUI5QVx1MzBGQlx1MzBCM1x1MzBGQ1x1MzBDOVx1RkYwOVx1MzA2NyBTVkcgXHU1NDBEXHUzMDkyXHU2QzQyXHUzMDgxXHUzMDhCXG4gICAgICAgICAgY29uc3Qga2luZCA9IGluZm8gPT09IFwibWVybWFpZFwiID8gXCJtZXJtYWlkXCIgOiBcImQyXCI7XG4gICAgICAgICAgY29uc3QgaWQgPSBraW5kID09PSBcIm1lcm1haWRcIiA/IG1lcm1haWRTdmdJZChjb2RlKSA6IGQyU3ZnSWQoY29kZSk7XG4gICAgICAgICAgY29uc3Qgc3JjID0gYCR7YmFzZX0ke2tpbmR9LyR7aWR9LnN2Z2A7XG5cbiAgICAgICAgICAvLyA4MDB4ODAwIFx1MzA5Mlx1OEQ4NVx1MzA0OFx1MzA4Qlx1NTgzNFx1NTQwOFx1MzA2Rlx1MzBCOVx1MzBBRlx1MzBFRFx1MzBGQ1x1MzBFQlx1MzA1NVx1MzA1Qlx1MzA4Qlx1MzA1Rlx1MzA4MVx1MzA2RVx1MzBFOVx1MzBDM1x1MzBEMVx1MzBGQ1x1MzA5Mlx1NzUyOFx1NjEwRlxuICAgICAgICAgIC8vIFx1NTE3N1x1NEY1M1x1NzY4NFx1MzA2QVx1NTIyNFx1NUI5QVx1MzA2RiBDU1MgLyBKUyBcdTUwNzRcdTMwNjdcdTg4NENcdTMwNDZcdTYwRjNcdTVCOUFcdUZGMDhcdTMwNTNcdTMwNTNcdTMwNjdcdTMwNkZcdTMwQUZcdTMwRTlcdTMwQjlcdTMwNjBcdTMwNTFcdTRFRDhcdTRFMEVcdUZGMDlcbiAgICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgICA8cCBjbGFzcz1cIm1lcm1haWQtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGltZyA6c3JjPVwiJyR7c3JjfSdcIiBhbHQ9XCIke2tpbmR9IGRpYWdyYW1cIiBsb2FkaW5nPVwibGF6eVwiIGNsYXNzPVwibWVybWFpZC1pbWFnZVwiPlxuICAgICAgICAgICAgICA8L3A+XFxuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFx1MzA1RFx1MzA4Q1x1NEVFNVx1NTkxNlx1MzA2RVx1MzBCM1x1MzBGQ1x1MzBDOVx1MzBENlx1MzBFRFx1MzBDM1x1MzBBRlx1MzA2Rlx1MzBDN1x1MzBENVx1MzBBOVx1MzBFQlx1MzBDOFx1MzA2RVx1NjNDRlx1NzUzQlxuICAgICAgICByZXR1cm4gZGVmYXVsdEZlbmNlXG4gICAgICAgICAgPyBkZWZhdWx0RmVuY2UodG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiwgc2VsZilcbiAgICAgICAgICA6IHNlbGYucmVuZGVyVG9rZW4odG9rZW5zLCBpZHgsIG9wdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgLy8gW1tpZF1dIHdpa2lsaW5rIFx1MjE5MiBWaXRlUHJlc3MgXHU1MTg1XHU5MEU4XHUzMEVBXHUzMEYzXHUzMEFGXG4gICAgICBtZC5pbmxpbmUucnVsZXIuYmVmb3JlKFwibGlua1wiLCBcInNwZWNkb2pvX3dpa2lsaW5rXCIsIChzdGF0ZTogYW55LCBzaWxlbnQ6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgY29uc3QgcG9zID0gc3RhdGUucG9zO1xuICAgICAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gMHg1YiB8fCBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MgKyAxKSAhPT0gMHg1YilcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgY2xvc2VJbmRleCA9IHN0YXRlLnNyYy5pbmRleE9mKFwiXV1cIiwgcG9zICsgMik7XG4gICAgICAgIGlmIChjbG9zZUluZGV4ID09PSAtMSB8fCBjbG9zZUluZGV4ID4gc3RhdGUucG9zTWF4KSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgaW5uZXIgPSBzdGF0ZS5zcmMuc2xpY2UocG9zICsgMiwgY2xvc2VJbmRleCk7XG4gICAgICAgIGNvbnN0IHBpcGVJZHggPSBpbm5lci5pbmRleE9mKFwifFwiKTtcbiAgICAgICAgY29uc3QgaWQgPSBwaXBlSWR4ID09PSAtMSA/IGlubmVyIDogaW5uZXIuc2xpY2UoMCwgcGlwZUlkeCk7XG4gICAgICAgIGNvbnN0IGRpc3BsYXlUZXh0ID0gcGlwZUlkeCA9PT0gLTEgPyBpZCA6IGlubmVyLnNsaWNlKHBpcGVJZHggKyAxKTtcbiAgICAgICAgaWYgKCEvXlthLXpdW2EtejAtOTpfLV0rJC8udGVzdChpZCkpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZiAoIXNpbGVudCkge1xuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZG9jSW5kZXhbaWRdO1xuICAgICAgICAgIGNvbnN0IGV4ZWNSZWNvcmRMaW5rID0gcmVzb2x2ZUV4ZWNSZWNvcmRXaWtpbGluayhpbm5lciwgZG9jSW5kZXgsIEdJVEhVQl9TT1VSQ0UpO1xuICAgICAgICAgIGlmIChleGVjUmVjb3JkTGluaykge1xuICAgICAgICAgICAgbGV0IHRva2VuID0gc3RhdGUucHVzaChcImxpbmtfb3BlblwiLCBcImFcIiwgMSk7XG4gICAgICAgICAgICB0b2tlbi5hdHRyU2V0KFwiaHJlZlwiLCBleGVjUmVjb3JkTGluay5ocmVmKTtcbiAgICAgICAgICAgIHRva2VuID0gc3RhdGUucHVzaChcInRleHRcIiwgXCJcIiwgMCk7XG4gICAgICAgICAgICB0b2tlbi5jb250ZW50ID0gZXhlY1JlY29yZExpbmsuZGlzcGxheVRleHQ7XG4gICAgICAgICAgICBzdGF0ZS5wdXNoKFwibGlua19jbG9zZVwiLCBcImFcIiwgLTEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5UGF0aCA9IHN0cmlwRW50cnlMaW5lU3VmZml4KGVudHJ5KTtcblxuICAgICAgICAgICAgLy8gWUFNTCBcdTMwNkZcdTg4NjhcdTc5M0FcdTc1MjhcdTc1MUZcdTYyMTBcdTMwREFcdTMwRkNcdTMwQjhcdTMwNENcdTMwNDJcdTMwOENcdTMwNzBcdTMwNURcdTMwNjFcdTMwODlcdTMwNzhcdTRFRDhcdTMwNTFcdTY2RkZcdTMwNDhcdTMwOEJcdUZGMDhcdTMwNkFcdTMwNTFcdTMwOENcdTMwNzBcdTUxNDNcdTMwRDFcdTMwQjlcdTMwNkVcdTMwN0VcdTMwN0VcdUZGMDlcdTMwMDJcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmFibGVQYXRoID0gdG9SZW5kZXJhYmxlRW50cnlQYXRoKGVudHJ5UGF0aCkgPz8gZW50cnlQYXRoO1xuXG4gICAgICAgICAgICAvLyBJbmRleCBlbnRyaWVzIGFyZSB3b3Jrc3BhY2Utcm9vdC1yZWxhdGl2ZSAoXCJkb2NzL2phLy4uLlwiKS5cbiAgICAgICAgICAgIC8vIFN0cmlwIFwiZG9jcy9cIiB0byBnZXQgZG9jcy1yb290LXJlbGF0aXZlIHBhdGggKFwiamEvLi4uXCIpLlxuICAgICAgICAgICAgY29uc3QgZG9jc1JlbFRhcmdldCA9IHJlbmRlcmFibGVQYXRoLnN0YXJ0c1dpdGgoXCJkb2NzL1wiKVxuICAgICAgICAgICAgICA/IHJlbmRlcmFibGVQYXRoLnNsaWNlKDUpXG4gICAgICAgICAgICAgIDogcmVuZGVyYWJsZVBhdGg7XG5cbiAgICAgICAgICAgIC8vIENvbXB1dGUgaHJlZiByZWxhdGl2ZSB0byB0aGUgY3VycmVudCBmaWxlIChWaXRlUHJlc3Mgc2V0cyBlbnYucmVsYXRpdmVQYXRoKVxuICAgICAgICAgICAgY29uc3QgY3VycmVudFJlbFBhdGggPSBzdGF0ZS5lbnY/LnJlbGF0aXZlUGF0aCBhcyBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICAgICAgICBsZXQgaHJlZjogc3RyaW5nO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRSZWxQYXRoKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlbCA9IHBhdGhcbiAgICAgICAgICAgICAgICAucmVsYXRpdmUocGF0aC5kaXJuYW1lKGN1cnJlbnRSZWxQYXRoKSwgZG9jc1JlbFRhcmdldClcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG4gICAgICAgICAgICAgIGhyZWYgPSByZWwuc3RhcnRzV2l0aChcIi5cIikgPyByZWwgOiBcIi4vXCIgKyByZWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBocmVmID0gXCIvXCIgKyBkb2NzUmVsVGFyZ2V0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdG9rZW4gPSBzdGF0ZS5wdXNoKFwibGlua19vcGVuXCIsIFwiYVwiLCAxKTtcbiAgICAgICAgICAgIHRva2VuLmF0dHJTZXQoXCJocmVmXCIsIGhyZWYpO1xuICAgICAgICAgICAgdG9rZW4gPSBzdGF0ZS5wdXNoKFwidGV4dFwiLCBcIlwiLCAwKTtcbiAgICAgICAgICAgIHRva2VuLmNvbnRlbnQgPSBkaXNwbGF5VGV4dDtcbiAgICAgICAgICAgIHN0YXRlLnB1c2goXCJsaW5rX2Nsb3NlXCIsIFwiYVwiLCAtMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gc3RhdGUucHVzaChcInRleHRcIiwgXCJcIiwgMCk7XG4gICAgICAgICAgICB0b2tlbi5jb250ZW50ID0gYFtbJHtpbm5lcn1dXWA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUucG9zID0gY2xvc2VJbmRleCArIDI7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcblxuICB2aXRlOiB7XG4gICAgcHVibGljRGlyOiBwYXRoLmpvaW4oV09SS1NQQUNFX1JPT1QsIFwicHVibGljXCIpLFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIG1lcm1haWRTdmdBdXRvR2VuZXJhdGUoe1xuICAgICAgICByb290RGlyOiBTSVRFX0NPTlRFTlRfUk9PVCxcbiAgICAgICAgb3V0RGlyOiBNRVJNQUlEX09VVF9ESVIsXG4gICAgICAgIGNvbnRlbnRSb290OiBDT05URU5UX1JPT1QsXG4gICAgICAgIHN5bmNGaWxlOiAoZmlsZSkgPT4ga2F0YVN0YWdpbmcuc3luY0ZpbGUoZmlsZSksXG4gICAgICB9KSxcbiAgICAgIG1lcm1haWRBc3NldHMoTUVSTUFJRF9PVVRfRElSLCBiYXNlKSxcbiAgICAgIGQyU3ZnQXV0b0dlbmVyYXRlKHtcbiAgICAgICAgcm9vdERpcjogU0lURV9DT05URU5UX1JPT1QsXG4gICAgICAgIG91dERpcjogRDJfT1VUX0RJUixcbiAgICAgICAgY29udGVudFJvb3Q6IENPTlRFTlRfUk9PVCxcbiAgICAgICAgc3luY0ZpbGU6IChmaWxlKSA9PiBrYXRhU3RhZ2luZy5zeW5jRmlsZShmaWxlKSxcbiAgICAgIH0pLFxuICAgICAgbWVybWFpZEFzc2V0cyhEMl9PVVRfRElSLCBiYXNlLCBcImQyXCIpLFxuICAgIF0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIC8vIFx1NjcwMFx1NTkyN1x1MzA2RVx1MzBDMVx1MzBFM1x1MzBGM1x1MzBBRlx1MzA2Rlx1MzBFRFx1MzBGQ1x1MzBBQlx1MzBFQlx1NjkxQ1x1N0QyMlx1MzBBNFx1MzBGM1x1MzBDN1x1MzBDM1x1MzBBRlx1MzBCOVx1RkYwOEBsb2NhbFNlYXJjaEluZGV4Klx1RkYwOVx1MzA2N1x1MzAwMVxuICAgICAgLy8gXHU2OTFDXHU3RDIyXHUzMEUyXHUzMEZDXHUzMEMwXHUzMEVCXHUzMDkyXHU5NThCXHUzMDQ0XHUzMDVGXHUzMDY4XHUzMDREXHUzMDYwXHUzMDUxXHU1MkQ1XHU3Njg0IGltcG9ydCBcdTMwNTVcdTMwOENcdTMwOEJcdTkwNDVcdTVFRjZcdTMwRURcdTMwRkNcdTMwQzlcdTVCRkVcdThDNjFcdTMwMDJcbiAgICAgIC8vIFx1MzBDOVx1MzBBRFx1MzBFNVx1MzBFMVx1MzBGM1x1MzBDOFx1NTg5N1x1NTJBMFx1MzA2Qlx1NEYzNFx1MzA0NCA1MDBrQiBcdTMwOTJcdThEODVcdTMwNDhcdTMwOEJcdTMwNENcdTUyMURcdTY3MUZcdTg4NjhcdTc5M0FcdTMwNkJcdTMwNkZcdTVGNzFcdTk3RkZcdTMwNTdcdTMwNkFcdTMwNDRcdTMwNUZcdTMwODFcdTMwMDFcbiAgICAgIC8vIFx1OEI2Nlx1NTQ0QVx1MzA1N1x1MzA0RFx1MzA0NFx1NTAyNFx1MzA5Mlx1NUYxNVx1MzA0RFx1NEUwQVx1MzA1Mlx1MzA2Nlx1OEFBNFx1NjkxQ1x1NzdFNVx1MzA5Mlx1NjI5MVx1NTIzNlx1MzA1OVx1MzA4Qlx1MzAwMlxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAzMDAwLFxuICAgIH0sXG4gIH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya3NwYWNlcy9zcGVjZG9qby13b3Jrc3BhY2Uvc3BlY2Rvam8vcGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3Mvc2lkZWJhci1jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS8udml0ZXByZXNzL3NpZGViYXItY29uZmlnLnRzXCI7Ly8gVml0ZVByZXNzIFx1MzBCNVx1MzBBNFx1MzBDOVx1MzBEMFx1MzBGQ1x1MzA2RVx1NTZGQVx1NUI5QVx1MzBDN1x1MzBGQ1x1MzBCRlx1RkYwOFx1NjI0Qlx1NTJENVx1MzBFMVx1MzBDQlx1MzBFNVx1MzBGQ1x1NjlDQlx1NjIxMFx1MzBGQlx1ODg2OFx1NzkzQVx1NTQwRFx1MzBGQlx1ODg2OFx1NzkzQVx1OTgwNlx1RkYwOVx1MzA5Mlx1OTZDNlx1N0QwNFx1MzA1OVx1MzA4Qlx1MzAwMlxuLy8gXHU1OTA5XHU2M0RCXHUzMEVEXHUzMEI4XHUzMEMzXHUzMEFGXHVGRjA4dHJhbnNmb3JtU2lkZWJhciBcdTdCNDlcdUZGMDlcdTMwNkYgY29uZmlnLm10cyBcdTUwNzRcdTMwNkJcdTdGNkVcdTMwNEZcdTMwMDJcblxuZXhwb3J0IHR5cGUgU2lkZWJhckl0ZW0gPSB7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIGxpbms/OiBzdHJpbmc7XG4gIGNvbGxhcHNlZD86IGJvb2xlYW47XG4gIGl0ZW1zPzogU2lkZWJhckl0ZW1bXTtcbn07XG5cbmNvbnN0IHNwZWNkb2pvTGluayA9IChkaXI6IHN0cmluZywgaWQ6IHN0cmluZykgPT4gYC9qYS9zcGVjZG9qby8ke2Rpcn0vJHtpZH1gO1xuY29uc3QgZ3VpZGUgPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nKTogU2lkZWJhckl0ZW0gPT4gKHtcbiAgdGV4dCxcbiAgbGluazogc3BlY2Rvam9MaW5rKFwiZ3VpZGVzXCIsIGlkKSxcbn0pO1xuY29uc3QgcmVmZXJlbmNlID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IFNpZGViYXJJdGVtID0+ICh7XG4gIHRleHQsXG4gIGxpbms6IHNwZWNkb2pvTGluayhcInJlZmVyZW5jZXNcIiwgaWQpLFxufSk7XG5jb25zdCBzdGFuZGFyZCA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBTaWRlYmFySXRlbSA9PiAoe1xuICB0ZXh0LFxuICBsaW5rOiBzcGVjZG9qb0xpbmsoXCJzdGFuZGFyZHNcIiwgaWQpLFxufSk7XG5jb25zdCBwaGlsb3NvcGh5ID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IFNpZGViYXJJdGVtID0+ICh7XG4gIHRleHQsXG4gIGxpbms6IHNwZWNkb2pvTGluayhcInBoaWxvc29waHlcIiwgaWQpLFxufSk7XG5jb25zdCBydWxlYm9vayA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGl0ZW1zPzogU2lkZWJhckl0ZW1bXSk6IFNpZGViYXJJdGVtID0+ICh7XG4gIHRleHQsXG4gIGxpbms6IHNwZWNkb2pvTGluayhcInJ1bGVib29rc1wiLCBgJHtpZH0tcnVsZWJvb2tgKSxcbiAgLi4uKGl0ZW1zID8geyBjb2xsYXBzZWQ6IHRydWUsIGl0ZW1zIH0gOiB7fSksXG59KTtcbmNvbnN0IHJlY2lwZSA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGl0ZW1zPzogU2lkZWJhckl0ZW1bXSk6IFNpZGViYXJJdGVtID0+ICh7XG4gIHRleHQsXG4gIGxpbms6IHNwZWNkb2pvTGluayhcInJlY2lwZXNcIiwgYCR7aWR9LXJlY2lwZWApLFxuICAuLi4oaXRlbXMgPyB7IGNvbGxhcHNlZDogdHJ1ZSwgaXRlbXMgfSA6IHt9KSxcbn0pO1xuY29uc3Qgc2FtcGxlID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgaXRlbXM/OiBTaWRlYmFySXRlbVtdKTogU2lkZWJhckl0ZW0gPT4gKHtcbiAgdGV4dCxcbiAgbGluazogc3BlY2Rvam9MaW5rKFwic2FtcGxlc1wiLCBgJHtpZH0tc2FtcGxlYCksXG4gIC4uLihpdGVtcyA/IHsgY29sbGFwc2VkOiB0cnVlLCBpdGVtcyB9IDoge30pLFxufSk7XG5jb25zdCBzYW1wbGVZYW1sID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgaXRlbXM/OiBTaWRlYmFySXRlbVtdKTogU2lkZWJhckl0ZW0gPT4gKHtcbiAgdGV4dCxcbiAgbGluazogc3BlY2Rvam9MaW5rKFwic2FtcGxlc1wiLCBgZ2VuZXJhdGVkLyR7aWR9LXNhbXBsZWApLFxuICAuLi4oaXRlbXMgPyB7IGNvbGxhcHNlZDogdHJ1ZSwgaXRlbXMgfSA6IHt9KSxcbn0pO1xuY29uc3QgdGVtcGxhdGUgPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBpdGVtcz86IFNpZGViYXJJdGVtW10pOiBTaWRlYmFySXRlbSA9PiAoe1xuICB0ZXh0LFxuICBsaW5rOiBzcGVjZG9qb0xpbmsoXCJ0ZW1wbGF0ZXNcIiwgYCR7aWR9LXRlbXBsYXRlYCksXG4gIC4uLihpdGVtcyA/IHsgY29sbGFwc2VkOiB0cnVlLCBpdGVtcyB9IDoge30pLFxufSk7XG5jb25zdCB0ZW1wbGF0ZVlhbWwgPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBpdGVtcz86IFNpZGViYXJJdGVtW10pOiBTaWRlYmFySXRlbSA9PiAoe1xuICB0ZXh0LFxuICBsaW5rOiBzcGVjZG9qb0xpbmsoXCJ0ZW1wbGF0ZXNcIiwgYGdlbmVyYXRlZC8ke2lkfS10ZW1wbGF0ZWApLFxuICAuLi4oaXRlbXMgPyB7IGNvbGxhcHNlZDogdHJ1ZSwgaXRlbXMgfSA6IHt9KSxcbn0pO1xuY29uc3QgZ3JvdXAgPSAodGV4dDogc3RyaW5nLCBpdGVtczogU2lkZWJhckl0ZW1bXSwgY29sbGFwc2VkID0gdHJ1ZSk6IFNpZGViYXJJdGVtID0+ICh7XG4gIHRleHQsXG4gIGNvbGxhcHNlZCxcbiAgaXRlbXMsXG59KTtcblxuLy8gLS0tIFx1MzBFQlx1MzBGQ1x1MzBFQlx1RkYwOFJ1bGVib29rc1x1RkYwOSAtLS1cbmNvbnN0IHByb2plY3REZWZpbml0aW9uUnVsZWJvb2tzID0gW1xuICBydWxlYm9vayhcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1Njk4Mlx1ODk4MVwiLCBcInByai1vdmVydmlld1wiKSxcbiAgcnVsZWJvb2soXCJcdTMwQjlcdTMwQzZcdTMwRkNcdTMwQUZcdTMwREJcdTMwRUJcdTMwQzBcdTMwRkNcdTc2N0JcdTkzMzJcdTdDM0ZcIiwgXCJwcmotc3Rha2Vob2xkZXItcmVnaXN0ZXJcIiksXG4gIHJ1bGVib29rKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU2MUIyXHU3QUUwXCIsIFwicHJqLWNoYXJ0ZXJcIiksXG4gIHJ1bGVib29rKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHUzMEI5XHUzMEIzXHUzMEZDXHUzMEQ3XCIsIFwicHJqLXNjb3BlXCIpLFxuICBydWxlYm9vayhcIlx1NjIxMFx1NTI5Rlx1NTdGQVx1NkU5Nlx1MzA2OFx1NTNEN1x1NTE2NVx1Njc2MVx1NEVGNlwiLCBcInByai1zdWNjZXNzLWNyaXRlcmlhLWFuZC1hY2NlcHRhbmNlLWNyaXRlcmlhXCIpLFxuICBydWxlYm9vayhcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1OEFCMlx1OTg0Q1x1MzA2OFx1ODlFM1x1NkM3QVx1MzBBMlx1MzBEN1x1MzBFRFx1MzBGQ1x1MzBDMVwiLCBcInByai1pc3N1ZXMtYW5kLWFwcHJvYWNoXCIpLFxuICBydWxlYm9vayhcIlx1NTI0RFx1NjNEMFx1MzBGQlx1NTIzNlx1N0QwNFx1MzBGQlx1NEY5RFx1NUI1OFx1OTVBMlx1NEZDMlwiLCBcInByai1hc3N1bXB0aW9ucy1jb25zdHJhaW50cy1kZXBlbmRlbmNpZXNcIiksXG4gIHJ1bGVib29rKFwiXHU0RUUzXHU2NkZGXHU2ODQ4XHUzMDZFXHU2QkQ0XHU4RjAzXCIsIFwicHJqLWNvbXBhcmlzb24tb2YtYWx0ZXJuYXRpdmVzXCIpLFxuXTtcblxuY29uc3QgcHJvamVjdE1hbmFnZW1lbnRSdWxlYm9va3MgPSBbXG4gIGdyb3VwKFwiXHU2MjEwXHU2NzlDXHU3MjY5XHUzMEFCXHUzMEJGXHUzMEVEXHUzMEIwXCIsIFtcbiAgICBydWxlYm9vayhcIlx1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFx1MzA2RVx1N0QyMlx1NUYxNVwiLCBcImRjdC1pbmRleFwiKSxcbiAgICBydWxlYm9vayhcIlx1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFwiLCBcImRjdFwiKSxcbiAgXSksXG4gIGdyb3VwKFwiXHU3QkExXHU3NDA2XHU4QTA4XHU3NTNCXCIsIFtcbiAgICBydWxlYm9vayhcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1N0JBMVx1NzQwNlx1OEEwOFx1NzUzQlwiLCBcInBtLXBsYW5cIiksXG4gICAgcnVsZWJvb2soXCJcdTMwQjNcdTMwREZcdTMwRTVcdTMwQ0JcdTMwQjFcdTMwRkNcdTMwQjdcdTMwRTdcdTMwRjNcdThBMDhcdTc1M0JcIiwgXCJwbS1jb21tdW5pY2F0aW9uLXBsYW5cIiksXG4gICAgcnVsZWJvb2soXCJcdTU0QzFcdThDRUFcdTdCQTFcdTc0MDZcdThBMDhcdTc1M0JcIiwgXCJwbS1xdWFsaXR5LW1hbmFnZW1lbnQtcGxhblwiKSxcbiAgXSksXG4gIGdyb3VwKFwiXHU3RDQ0XHU3RTU0XHU0RjUzXHU1MjM2XCIsIFtcbiAgICBydWxlYm9vayhcIlx1N0Q0NFx1N0U1NFx1MzA2OFx1MzBFRFx1MzBGQ1x1MzBFQlx1MzA2RVx1NUI5QVx1N0ZBOVwiLCBcInBtLW9yZ2FuaXphdGlvblwiKSxcbiAgICBydWxlYm9vayhcIlx1MzBFRFx1MzBGQ1x1MzBFQlx1NUI5QVx1N0ZBOVwiLCBcInBtLXJvbGVzXCIpLFxuICAgIHJ1bGVib29rKFwiXHUzMEUxXHUzMEYzXHUzMEQwXHUzMEZDXHU1QjlBXHU3RkE5XCIsIFwicG0tbWVtYmVyc1wiKSxcbiAgICBydWxlYm9vayhcIlx1N0Q0NFx1N0U1NFx1NEY1M1x1NTIzNlx1MzA2OFJBQ0lcIiwgXCJwbS1yYWNpXCIpLFxuICBdKSxcbiAgZ3JvdXAoXCJcdTdCQTFcdTc0MDZcdTUzRjBcdTVFMzNcdTMwRkJcdTdCQTFcdTc0MDZcdTMwRDNcdTMwRTVcdTMwRkNcIiwgW1xuICAgIHJ1bGVib29rKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU3NjdCXHU5MzMyXHU3QzNGXCIsIFwicGpyXCIpLFxuICAgIHJ1bGVib29rKFwiXHUzMEVBXHUzMEI5XHUzMEFGXHU3NjdCXHU5MzMyXHU3QzNGXCIsIFwicG0tcmlzay1yZWdpc3RlclwiKSxcbiAgICBydWxlYm9vayhcIlx1OEFCMlx1OTg0Q1x1MzBFRFx1MzBCMFwiLCBcInBtLWlzc3VlLWxvZ1wiKSxcbiAgICBydWxlYm9vayhcIlx1NTkwOVx1NjZGNFx1ODk4MVx1NkM0Mlx1MzBFRFx1MzBCMFwiLCBcInBtLWNoYW5nZS1yZXF1ZXN0LWxvZ1wiKSxcbiAgICBydWxlYm9vayhcIlx1NjEwRlx1NjAxRFx1NkM3QVx1NUI5QVx1MzBFRFx1MzBCMFwiLCBcImRlY1wiKSxcbiAgXSksXG4gIHJ1bGVib29rKFwiXHUzMEI5XHUzMEIxXHUzMEI4XHUzMEU1XHUzMEZDXHUzMEVCXCIsIFwic2NoXCIpLFxuICBydWxlYm9vayhcIlx1MzBCRlx1MzBBNFx1MzBFMFx1MzBFOVx1MzBBNFx1MzBGM1wiLCBcInRtbFwiKSxcbiAgcnVsZWJvb2soXCJcdTkwMzJcdTYzNTdcdTU4MzFcdTU0NEFcIiwgXCJwclwiKSxcbiAgcnVsZWJvb2soXCJcdThCNzBcdTRFOEJcdTkzMzJcIiwgXCJtbVwiKSxcbl07XG5cbmNvbnN0IHByb2R1Y3RDaGFuZ2VSdWxlYm9va3MgPSBbXG4gIGdyb3VwKFwiXHU1RjcxXHU5N0ZGXHU4QUJGXHU2N0ZCXCIsIFtcbiAgICBydWxlYm9vayhcIlx1Njk2RFx1NTJEOVx1NUY3MVx1OTdGRlwiLCBcImltcC1idXNpbmVzc1wiKSxcbiAgICBydWxlYm9vayhcIlx1MzBDN1x1MzBGQ1x1MzBCRlx1NUY3MVx1OTdGRlwiLCBcImltcC1kYXRhXCIpLFxuICAgIHJ1bGVib29rKFwiXHUzMEE0XHUzMEYzXHUzMEJGXHUzMEZDXHUzMEQ1XHUzMEE3XHUzMEZDXHUzMEI5XHU1RjcxXHU5N0ZGXCIsIFwiaW1wLWludGVyZmFjZVwiKSxcbiAgICBydWxlYm9vayhcIlx1MzBDNlx1MzBCOVx1MzBDOFx1NUY3MVx1OTdGRlwiLCBcImltcC10ZXN0XCIpLFxuICAgIHJ1bGVib29rKFwiXHU5MDRCXHU3NTI4XHU1RjcxXHU5N0ZGXCIsIFwiaW1wLW9wZXJhdGlvbnNcIiksXG4gIF0pLFxuICBncm91cChcIlx1MzBDOFx1MzBFQ1x1MzBGQ1x1MzBCNVx1MzBEM1x1MzBFQVx1MzBDNlx1MzBBM1wiLCBbXG4gICAgcnVsZWJvb2soXCJcdTg5ODFcdTZDNDJcdTMwNjhcdTRFRDVcdTY5RDhcdTMwNkVcdTMwQzhcdTMwRUNcdTMwRkNcdTMwQjlcIiwgXCJ0cmMtcmVxdWlyZW1lbnRzLXRvLXNwZWNzXCIpLFxuICAgIHJ1bGVib29rKFwiXHU4OTgxXHU2QzQyXHUzMDY4XHUzMEM2XHUzMEI5XHUzMEM4XHUzMDZFXHUzMEM4XHUzMEVDXHUzMEZDXHUzMEI5XCIsIFwidHJjLXJlcXVpcmVtZW50cy10by10ZXN0c1wiKSxcbiAgXSksXG5dO1xuXG5jb25zdCBidXNpbmVzc1NwZWNpZmljYXRpb25SdWxlYm9va3MgPSBbXG4gIGdyb3VwKFwiXHU2OTgyXHU1RkY1XHUzMEM3XHUzMEZDXHUzMEJGXHUzMEQ1XHUzMEVEXHUzMEZDXHU1NkYzXCIsIFtcbiAgICBydWxlYm9vayhcIlx1NTE2OFx1NEY1M1x1Njk4Mlx1ODk4MVwiLCBcImNkZmQtb3ZlcnZpZXdcIiksXG4gICAgcnVsZWJvb2soXCJcdTMwRTZcdTMwRkNcdTMwQjlcdTMwQjFcdTMwRkNcdTMwQjlcdTUyMjVcIiwgXCJjZGZkLXVjXCIpLFxuICAgIHJ1bGVib29rKFwiXHUzMEQ3XHUzMEVEXHUzMEJCXHUzMEI5XHUzMEIwXHUzMEVCXHUzMEZDXHUzMEQ3XHU1MjI1XCIsIFwiY2RmZFwiKSxcbiAgICBydWxlYm9vayhcIlx1NTZGM1x1MzA2RVx1OEExOFx1NkNENVx1MzBFQlx1MzBGQ1x1MzBFQlx1RkYwOE1lcm1haWRcdUZGMDlcIiwgXCJjZGZkLW1lcm1haWRcIiksXG4gICAgcnVsZWJvb2soXCJcdTU2RjNcdTMwNkVcdThBMThcdTZDRDVcdTMwRUJcdTMwRkNcdTMwRUJcdUZGMDhEMlx1RkYwOVwiLCBcImNkZmQtZDJcIiksXG4gIF0pLFxuICBncm91cChcIlx1MzBDN1x1MzBGQ1x1MzBCRlx1MzBFMlx1MzBDN1x1MzBFQlwiLCBbXG4gICAgcnVsZWJvb2soXCJcdTY5NkRcdTUyRDlcdTMwQzdcdTMwRkNcdTMwQkZcdThGOUVcdTY2RjhcIiwgXCJiZGRcIiksXG4gICAgcnVsZWJvb2soXCJcdTY5ODJcdTVGRjVcdTMwQzdcdTMwRkNcdTMwQkZcdTMwQjlcdTMwQzhcdTMwQTJcdTVCOUFcdTdGQTlcIiwgXCJjZHNkXCIpLFxuICAgIHJ1bGVib29rKFwiXHU0RkREXHU3QkExXHU1ODM0XHU2MjQwXHU1QjlBXHU3RkE5XCIsIFwic2xkXCIpLFxuICAgIHJ1bGVib29rKFwiXHUzMEI5XHUzMEM2XHUzMEZDXHUzMEJGXHUzMEI5XHU1QjlBXHU3RkE5XCIsIFwic3RzZFwiLCBbcnVsZWJvb2soXCJcdTcyQjZcdTYxNEJcdTkwNzdcdTc5RkJcdTU2RjNcdUZGMDhNZXJtYWlkXHVGRjA5XCIsIFwic3RzZC1tZXJtYWlkXCIpXSksXG4gICAgcnVsZWJvb2soXCJcdTUyMDZcdTk4NUVcdTVCOUFcdTdGQTlcIiwgXCJjbGRcIiksXG4gICAgcnVsZWJvb2soXCJcdTY5ODJcdTVGRjVcdTMwQUZcdTMwRTlcdTMwQjlcdTU2RjNcIiwgXCJjY2QtbWVybWFpZFwiKSxcbiAgXSksXG4gIGdyb3VwKFwiXHU2OTZEXHU1MkQ5XHUzMEUyXHUzMEM3XHUzMEVCXCIsIFtcbiAgICBydWxlYm9vayhcIlx1Njk2RFx1NTJEOVx1MzBEN1x1MzBFRFx1MzBCQlx1MzBCOVx1NEVENVx1NjlEOFwiLCBcImJwc1wiKSxcbiAgICBydWxlYm9vayhcIlx1MzBEM1x1MzBCOFx1MzBDRFx1MzBCOVx1MzBFQlx1MzBGQ1x1MzBFQlwiLCBcImJyXCIpLFxuICAgIHJ1bGVib29rKFwiXHU2OTZEXHU1MkQ5XHUzMEE0XHUzMEQ5XHUzMEYzXHUzMEM4XHU0RTAwXHU4OUE3XCIsIFwiYmVzLWluZGV4XCIpLFxuICAgIHJ1bGVib29rKFwiXHU2OTZEXHU1MkQ5XHUzMEE0XHUzMEQ5XHUzMEYzXHUzMEM4XHU0RUQ1XHU2OUQ4XCIsIFwiYmVzXCIpLFxuICBdKSxcbiAgZ3JvdXAoXCJcdTMwQTRcdTMwRjNcdTMwQkZcdTMwRkNcdTMwRDVcdTMwQTdcdTMwRkNcdTMwQjlcdTMwRTJcdTMwQzdcdTMwRUJcIiwgW3J1bGVib29rKFwiXHU3NTNCXHU5NzYyXHU0RUQ1XHU2OUQ4XCIsIFwidWlzXCIpLCBydWxlYm9vayhcIlx1NUUzM1x1Nzk2OFx1NEVENVx1NjlEOFwiLCBcImJkc1wiKV0pLFxuICBncm91cChcIlx1NTE3MVx1OTAxQVwiLCBbXG4gICAgcnVsZWJvb2soXCJcdTMwQjdcdTMwQjlcdTMwQzZcdTMwRTBcdTUzMTZcdTZBNUZcdTgwRkRcdTRFMDBcdTg5QTdcIiwgXCJzZi1pbmRleFwiKSxcbiAgICBydWxlYm9vayhcIlx1MzBCN1x1MzBCOVx1MzBDNlx1MzBFMFx1NTMxNlx1NkE1Rlx1ODBGRFwiLCBcInNmXCIpLFxuICAgIHJ1bGVib29rKFwiXHU3NTI4XHU4QTlFXHU5NkM2XCIsIFwiZ2xcIiksXG4gIF0pLFxuXTtcblxuY29uc3QgZXh0ZXJuYWxJZlJ1bGVib29rcyA9IFtcbiAgcnVsZWJvb2soXCJcdTU5MTZcdTkwRThcdTMwQjdcdTMwQjlcdTMwQzZcdTMwRTBJL0ZcdTRFMDBcdTg5QTdcIiwgXCJpZngtaW5kZXhcIiksXG4gIHJ1bGVib29rKFwiXHU1OTE2XHU5MEU4QVBJXHU0RUQ1XHU2OUQ4XCIsIFwiaWZ4LWFwaVwiKSxcbiAgcnVsZWJvb2soXCJcdTU5MTZcdTkwRThcdTMwQjNcdTMwREVcdTMwRjNcdTMwQzlcdTkwMjNcdTY0M0FcdTRFRDVcdTY5RDhcIiwgXCJpZngtY21kXCIpLFxuICBydWxlYm9vayhcIlx1NTkxNlx1OTBFOFx1MzBENVx1MzBBMVx1MzBBNFx1MzBFQlx1NEVENVx1NjlEOFwiLCBcImlmeC1maWxlXCIpLFxuICBydWxlYm9vayhcIlx1NTkxNlx1OTBFOFx1MzBFMVx1MzBDM1x1MzBCQlx1MzBGQ1x1MzBCOFx1NEVENVx1NjlEOFwiLCBcImlmeC1tc2dcIiksXG5dO1xuXG5jb25zdCBhcmNoaXRlY3R1cmVSdWxlYm9va3MgPSBbXG4gIGdyb3VwKFwiQzRcIiwgW1xuICAgIHJ1bGVib29rKFwiXHUzMEIzXHUzMEYzXHUzMEM2XHUzMEFEXHUzMEI5XHUzMEM4XHU1NkYzXCIsIFwiY3hkXCIsIFtydWxlYm9vayhcIlx1NTZGM1x1MzA2RVx1OEExOFx1NkNENVx1MzBFQlx1MzBGQ1x1MzBFQlwiLCBcImN4ZC1tZXJtYWlkXCIpXSksXG4gICAgcnVsZWJvb2soXCJcdTMwQjNcdTMwRjNcdTMwQzZcdTMwQ0FcdTU2RjNcIiwgXCJjbmRcIiwgW3J1bGVib29rKFwiXHU1NkYzXHUzMDZFXHU4QTE4XHU2Q0Q1XHUzMEVCXHUzMEZDXHUzMEVCXCIsIFwiY25kLW1lcm1haWRcIildKSxcbiAgICBydWxlYm9vayhcIlx1MzBCM1x1MzBGM1x1MzBERFx1MzBGQ1x1MzBDRFx1MzBGM1x1MzBDOFx1NTZGM1wiLCBcImNwZFwiLCBbcnVsZWJvb2soXCJcdTU2RjNcdTMwNkVcdThBMThcdTZDRDVcdTMwRUJcdTMwRkNcdTMwRUJcIiwgXCJjcGQtbWVybWFpZFwiKV0pLFxuICBdKSxcbiAgZ3JvdXAoXCJcdTMwQTRcdTMwRjNcdTMwRDVcdTMwRTlcdTMwRkJcdTYyODBcdTg4NTNcdTkwNzhcdTVCOUFcIiwgW1xuICAgIHJ1bGVib29rKFwiXHUzMEE0XHUzMEYzXHUzMEQ1XHUzMEU5XHU2OUNCXHU2MjEwXHU1NkYzXCIsIFwiaWZkLW1lcm1haWRcIiksXG4gICAgcnVsZWJvb2soXCJcdTYyODBcdTg4NTNcdTMwQjlcdTMwQkZcdTMwQzNcdTMwQUZcdTRFMDBcdTg5QTdcIiwgXCJ0c2QtaW5kZXhcIiksXG4gICAgcnVsZWJvb2soXCJcdTYyODBcdTg4NTNcdTMwQjlcdTMwQkZcdTMwQzNcdTMwQUZcIiwgXCJ0c2RcIiksXG4gIF0pLFxuXTtcblxuY29uc3Qgc3lzdGVtRGVzaWduUnVsZWJvb2tzID0gW1xuICBydWxlYm9vayhcIlx1MzBCN1x1MzBCOVx1MzBDNlx1MzBFMFx1OEEyRFx1OEEwOCBcdTUxNjhcdTRGNTNcdTY5Q0JcdTYyMTBcIiwgXCJzeXNkLWluZGV4XCIpLFxuICBydWxlYm9vayhcIlx1NTAwQlx1NTIyNVx1MzBCN1x1MzBCOVx1MzBDNlx1MzBFMFx1OEEyRFx1OEEwOFwiLCBcInN5c2RcIiksXG4gIHJ1bGVib29rKFwiXHU5MUNEXHU4OTgxXHUzMEQ1XHUzMEVEXHUzMEZDXCIsIFwic3lzZC1jcml0aWNhbC1mbG93c1wiKSxcbiAgcnVsZWJvb2soXCJcdTZBMkFcdTY1QURcdTMwRUJcdTMwRkNcdTMwRUJcIiwgXCJzeXNkLWNyb3NzLWN1dHRpbmctcG9saWN5XCIpLFxuXTtcblxuY29uc3Qgbm9uRnVuY3Rpb25hbFJlcXVpcmVtZW50UnVsZWJvb2tzID0gW1xuICBydWxlYm9vayhcIlx1OTc1RVx1NkE1Rlx1ODBGRFx1ODk4MVx1NEVGNiBcdTUxNjhcdTRGNTNcdTY5Q0JcdTYyMTBcIiwgXCJuZnItaW5kZXhcIiksXG4gIHJ1bGVib29rKFwiXHU0RkUxXHU5ODNDXHU2MDI3XCIsIFwibmZyLXJlbGlhYmlsaXR5XCIpLFxuICBydWxlYm9vayhcIlx1NTNFRlx1NzUyOFx1NjAyN1wiLCBcIm5mci1hdmFpbGFiaWxpdHlcIiksXG4gIHJ1bGVib29rKFwiXHU0RkREXHU1Qjg4XHU2MDI3XCIsIFwibmZyLW1haW50YWluYWJpbGl0eVwiKSxcbiAgcnVsZWJvb2soXCJcdTVCOENcdTUxNjhcdTYwMjdcIiwgXCJuZnItaW50ZWdyaXR5XCIpLFxuICBydWxlYm9vayhcIlx1NkE1Rlx1NUJDNlx1NjAyN1x1MzBGQlx1NUI4OVx1NTE2OFx1NjAyN1wiLCBcIm5mci1zZWN1cml0eS1zYWZldHlcIiksXG4gIHJ1bGVib29rKFwiXHU2MDI3XHU4MEZEXCIsIFwibmZyLXBlcmZvcm1hbmNlXCIpLFxuICBydWxlYm9vayhcIlx1OTA0Qlx1NzUyOFwiLCBcIm5mci1vcGVyYXRpb25zXCIpLFxuICBydWxlYm9vayhcIlx1NjRDRFx1NEY1Q1x1NjAyN1wiLCBcIm5mci11c2FiaWxpdHlcIiksXG5dO1xuXG5jb25zdCB0ZXN0aW5nUnVsZWJvb2tzID0gW1xuICBydWxlYm9vayhcIlx1MzBDNlx1MzBCOVx1MzBDOFx1NjIyNlx1NzU2NVx1MzBGQlx1NjVCOVx1OTFERFwiLCBcInRzcC1pbmRleFwiKSxcbiAgZ3JvdXAoXCJcdTUzNThcdTRGNTNcdTMwQzZcdTMwQjlcdTMwQzhcIiwgW1xuICAgIHJ1bGVib29rKFwiXHU1MzU4XHU0RjUzXHUzMEM2XHUzMEI5XHUzMEM4XHUzMEFCXHUzMEJGXHUzMEVEXHUzMEIwIFx1Njk4Mlx1ODk4MVwiLCBcInV0Yy1pbmRleFwiKSxcbiAgICBydWxlYm9vayhcIlx1NTM1OFx1NEY1M1x1MzBDNlx1MzBCOVx1MzBDOFx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMCBcdTVCRkVcdThDNjFcdTUyMjVcIiwgXCJ1dGNcIiksXG4gIF0pLFxuICBncm91cChcIlx1NTE4NVx1OTBFOFx1N0Q1MFx1NTQwOFx1MzBDNlx1MzBCOVx1MzBDOFwiLCBbXG4gICAgcnVsZWJvb2soXCJcdTUxODVcdTkwRThcdTdENTBcdTU0MDhcdTMwQzZcdTMwQjlcdTMwQzhcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjAgXHU2OTgyXHU4OTgxXCIsIFwiaXRjLWluZGV4XCIpLFxuICAgIHJ1bGVib29rKFwiXHU1MTg1XHU5MEU4XHU3RDUwXHU1NDA4XHUzMEM2XHUzMEI5XHUzMEM4XHUzMEFCXHUzMEJGXHUzMEVEXHUzMEIwIFx1NUJGRVx1OEM2MVx1NTIyNVwiLCBcIml0Y1wiKSxcbiAgXSksXG4gIGdyb3VwKFwiXHU1OTE2XHU5MEU4XHU3RDUwXHU1NDA4XHUzMEM2XHUzMEI5XHUzMEM4XCIsIFtcbiAgICBydWxlYm9vayhcIlx1NTkxNlx1OTBFOFx1N0Q1MFx1NTQwOFx1MzBDNlx1MzBCOVx1MzBDOFx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMCBcdTY5ODJcdTg5ODFcIiwgXCJldGMtaW5kZXhcIiksXG4gICAgcnVsZWJvb2soXCJcdTU5MTZcdTkwRThcdTdENTBcdTU0MDhcdTMwQzZcdTMwQjlcdTMwQzhcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjAgXHU1QkZFXHU4QzYxXHU1MjI1XCIsIFwiZXRjXCIpLFxuICBdKSxcbiAgZ3JvdXAoXCJcdTdEQ0ZcdTU0MDhcdTMwQzZcdTMwQjlcdTMwQzhcIiwgW1xuICAgIHJ1bGVib29rKFwiXHU3RENGXHU1NDA4XHUzMEM2XHUzMEI5XHUzMEM4XHUzMEFCXHUzMEJGXHUzMEVEXHUzMEIwIFx1Njk4Mlx1ODk4MVwiLCBcInN0Yy1pbmRleFwiKSxcbiAgICBydWxlYm9vayhcIlx1N0RDRlx1NTQwOFx1MzBDNlx1MzBCOVx1MzBDOFx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMCBcdTVCRkVcdThDNjFcdTUyMjVcIiwgXCJzdGNcIiksXG4gIF0pLFxuICBncm91cChcIlx1NTNEN1x1NTE2NVx1MzBDNlx1MzBCOVx1MzBDOFwiLCBbXG4gICAgcnVsZWJvb2soXCJcdTUzRDdcdTUxNjVcdTMwQzZcdTMwQjlcdTMwQzhcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjAgXHU2OTgyXHU4OTgxXCIsIFwiYXRjLWluZGV4XCIpLFxuICAgIHJ1bGVib29rKFwiXHU1M0Q3XHU1MTY1XHUzMEM2XHUzMEI5XHUzMEM4XHUzMEFCXHUzMEJGXHUzMEVEXHUzMEIwIFx1NUJGRVx1OEM2MVx1NTIyNVwiLCBcImF0Y1wiKSxcbiAgXSksXG5dO1xuXG5jb25zdCBtaWdyYXRpb25SdWxlYm9va3MgPSBbXG4gIHJ1bGVib29rKFwiXHU3OUZCXHU4ODRDXHU4QTA4XHU3NTNCXCIsIFwibWlwLWluZGV4XCIpLFxuICBydWxlYm9vayhcIlx1MzBDN1x1MzBGQ1x1MzBCRlx1NzlGQlx1ODg0Q1x1OEEyRFx1OEEwOCBcdTUxNjhcdTRGNTNcdTY5Q0JcdTYyMTBcIiwgXCJkbWQtaW5kZXhcIiksXG4gIHJ1bGVib29rKFwiXHUzMEM3XHUzMEZDXHUzMEJGXHU3OUZCXHU4ODRDXHU4QTJEXHU4QTA4XCIsIFwiZG1kXCIpLFxuICBydWxlYm9vayhcIlx1NzlGQlx1ODg0Q1x1MzBDNlx1MzBCOVx1MzBDOFx1OEEwOFx1NzUzQlwiLCBcIm10cFwiKSxcbiAgcnVsZWJvb2soXCJcdTc5RkJcdTg4NENcdTMwQzZcdTMwQjlcdTMwQzhcdThBMDhcdTc1M0JcdUZGMDhcdTMwRUFcdTMwQ0ZcdTMwRkNcdTMwQjVcdTMwRUJcdThBMDhcdTc1M0JcdUZGMDlcIiwgXCJudHBcIiksXG4gIHJ1bGVib29rKFwiXHUzMEFCXHUzMEMzXHUzMEM4XHUzMEFBXHUzMEZDXHUzMEQwXHUzMEZDXHU4QTA4XHU3NTNCIFx1NTE2OFx1NEY1M1x1NjlDQlx1NjIxMFwiLCBcImNvcC1pbmRleFwiKSxcbiAgcnVsZWJvb2soXCJcdTMwQUJcdTMwQzNcdTMwQzhcdTMwQUFcdTMwRkNcdTMwRDBcdTMwRkNcdThBMDhcdTc1M0JcIiwgXCJjb3BcIiksXG4gIHJ1bGVib29rKFwiXHU5MDRCXHU3NTI4XHU1MjA3XHU2NkZGXHU4QTA4XHU3NTNCIFx1NTE2OFx1NEY1M1x1NjlDQlx1NjIxMFwiLCBcIm90cC1pbmRleFwiKSxcbiAgcnVsZWJvb2soXCJcdTkwNEJcdTc1MjhcdTUyMDdcdTY2RkZcdThBMDhcdTc1M0JcIiwgXCJvdHBcIiksXG5dO1xuXG5jb25zdCBvcGVyYXRpb25zUnVsZWJvb2tzID0gW1xuICBydWxlYm9vayhcIlx1OTA0Qlx1NzUyOFx1NjVCOVx1OTFERFx1MzBGQlx1OEEyRFx1OEEwOCBcdTUxNjhcdTRGNTNcdTY5Q0JcdTYyMTBcIiwgXCJvcGQtaW5kZXhcIiksXG4gIHJ1bGVib29rKFwiXHU5MDRCXHU3NTI4XHU2NUI5XHU5MUREXHUzMEZCXHU4QTJEXHU4QTA4XCIsIFwib3BkXCIpLFxuICBydWxlYm9vayhcIlx1OTA0Qlx1NzUyOFx1NjI0Qlx1OTgwNiBcdTUxNjhcdTRGNTNcdTY5Q0JcdTYyMTBcIiwgXCJvcHItaW5kZXhcIiksXG4gIHJ1bGVib29rKFwiXHU5MDRCXHU3NTI4XHU2MjRCXHU5ODA2XCIsIFwib3ByXCIpLFxuXTtcblxuLy8gLS0tIFx1MzBFQ1x1MzBCN1x1MzBENFx1RkYwOFJlY2lwZXNcdUZGMDkgLS0tXG4vLyByZWNpcGUgXHUzMDZGIHJ1bGVib29rIFx1MzA2OFx1NTQwQ1x1MzA1OFx1NEUyNlx1MzA3M1x1OTgwNlx1MzA2Qlx1MzA1N1x1MzAwMVx1NjIxMFx1Njc5Q1x1NzI2OVx1MzA1NFx1MzA2OFx1MzA2QiBydWxlYm9vayAvIHJlY2lwZSBcdTMwOTJcdTVCRkVcdTMwNjdcdThGQkZcdTMwOENcdTMwOEJcdTMwODhcdTMwNDZcdTMwNkJcdTMwNTlcdTMwOEJcdTMwMDJcbmNvbnN0IHByb2plY3REZWZpbml0aW9uUmVjaXBlcyA9IFtcbiAgcmVjaXBlKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU2OTgyXHU4OTgxXCIsIFwicHJqLW92ZXJ2aWV3XCIpLFxuICByZWNpcGUoXCJcdTMwQjlcdTMwQzZcdTMwRkNcdTMwQUZcdTMwREJcdTMwRUJcdTMwQzBcdTMwRkNcdTc2N0JcdTkzMzJcdTdDM0ZcIiwgXCJwcmotc3Rha2Vob2xkZXItcmVnaXN0ZXJcIiksXG4gIHJlY2lwZShcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1NjFCMlx1N0FFMFwiLCBcInByai1jaGFydGVyXCIpLFxuICByZWNpcGUoXCJcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcdTMwQjlcdTMwQjNcdTMwRkNcdTMwRDdcIiwgXCJwcmotc2NvcGVcIiksXG4gIHJlY2lwZShcIlx1NjIxMFx1NTI5Rlx1NTdGQVx1NkU5Nlx1MzA2OFx1NTNEN1x1NTE2NVx1Njc2MVx1NEVGNlwiLCBcInByai1zdWNjZXNzLWNyaXRlcmlhLWFuZC1hY2NlcHRhbmNlLWNyaXRlcmlhXCIpLFxuICByZWNpcGUoXCJcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcdThBQjJcdTk4NENcdTMwNjhcdTg5RTNcdTZDN0FcdTMwQTJcdTMwRDdcdTMwRURcdTMwRkNcdTMwQzFcIiwgXCJwcmotaXNzdWVzLWFuZC1hcHByb2FjaFwiKSxcbiAgcmVjaXBlKFwiXHU1MjREXHU2M0QwXHUzMEZCXHU1MjM2XHU3RDA0XHUzMEZCXHU0RjlEXHU1QjU4XHU5NUEyXHU0RkMyXCIsIFwicHJqLWFzc3VtcHRpb25zLWNvbnN0cmFpbnRzLWRlcGVuZGVuY2llc1wiKSxcbiAgcmVjaXBlKFwiXHU0RUUzXHU2NkZGXHU2ODQ4XHUzMDZFXHU2QkQ0XHU4RjAzXCIsIFwicHJqLWNvbXBhcmlzb24tb2YtYWx0ZXJuYXRpdmVzXCIpLFxuXTtcblxuY29uc3QgcHJvamVjdE1hbmFnZW1lbnRSZWNpcGVzID0gW1xuICBncm91cChcIlx1N0JBMVx1NzQwNlx1OEEwOFx1NzUzQlwiLCBbXG4gICAgcmVjaXBlKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU3QkExXHU3NDA2XHU4QTA4XHU3NTNCXCIsIFwicG0tcGxhblwiKSxcbiAgICByZWNpcGUoXCJcdTMwQjNcdTMwREZcdTMwRTVcdTMwQ0JcdTMwQjFcdTMwRkNcdTMwQjdcdTMwRTdcdTMwRjNcdThBMDhcdTc1M0JcIiwgXCJwbS1jb21tdW5pY2F0aW9uLXBsYW5cIiksXG4gICAgcmVjaXBlKFwiXHU1NEMxXHU4Q0VBXHU3QkExXHU3NDA2XHU4QTA4XHU3NTNCXCIsIFwicG0tcXVhbGl0eS1tYW5hZ2VtZW50LXBsYW5cIiksXG4gIF0pLFxuICBncm91cChcIlx1N0Q0NFx1N0U1NFx1NEY1M1x1NTIzNlwiLCBbXG4gICAgcmVjaXBlKFwiXHU3RDQ0XHU3RTU0XHUzMDY4XHUzMEVEXHUzMEZDXHUzMEVCXHUzMDZFXHU1QjlBXHU3RkE5XCIsIFwicG0tb3JnYW5pemF0aW9uXCIpLFxuICAgIHJlY2lwZShcIlx1MzBFRFx1MzBGQ1x1MzBFQlx1NUI5QVx1N0ZBOVwiLCBcInBtLXJvbGVzXCIpLFxuICAgIHJlY2lwZShcIlx1MzBFMVx1MzBGM1x1MzBEMFx1MzBGQ1x1NUI5QVx1N0ZBOVwiLCBcInBtLW1lbWJlcnNcIiksXG4gICAgcmVjaXBlKFwiXHU3RDQ0XHU3RTU0XHU0RjUzXHU1MjM2XHUzMDY4UkFDSVwiLCBcInBtLXJhY2lcIiksXG4gIF0pLFxuXTtcblxuY29uc3QgYnVzaW5lc3NTcGVjaWZpY2F0aW9uUmVjaXBlcyA9IFtcbiAgZ3JvdXAoXCJcdTY5ODJcdTVGRjVcdTMwQzdcdTMwRkNcdTMwQkZcdTMwRDVcdTMwRURcdTMwRkNcdTU2RjNcIiwgW1xuICAgIHJlY2lwZShcIlx1NTE2OFx1NEY1M1x1Njk4Mlx1ODk4MVwiLCBcImNkZmQtb3ZlcnZpZXdcIiksXG4gICAgcmVjaXBlKFwiXHUzMEU2XHUzMEZDXHUzMEI5XHUzMEIxXHUzMEZDXHUzMEI5XHU1MjI1XCIsIFwiY2RmZC11Y1wiKSxcbiAgICByZWNpcGUoXCJcdTMwRDdcdTMwRURcdTMwQkJcdTMwQjlcdTMwQjBcdTMwRUJcdTMwRkNcdTMwRDdcdTUyMjVcIiwgXCJjZGZkXCIpLFxuICBdKSxcbiAgZ3JvdXAoXCJcdTMwQzdcdTMwRkNcdTMwQkZcdTMwRTJcdTMwQzdcdTMwRUJcIiwgW3JlY2lwZShcIlx1MzBCOVx1MzBDNlx1MzBGQ1x1MzBCRlx1MzBCOVx1NUI5QVx1N0ZBOVwiLCBcInN0c2RcIildKSxcbiAgZ3JvdXAoXCJcdTY5NkRcdTUyRDlcdTMwRTJcdTMwQzdcdTMwRUJcIiwgW3JlY2lwZShcIlx1Njk2RFx1NTJEOVx1MzBEN1x1MzBFRFx1MzBCQlx1MzBCOVx1NEVENVx1NjlEOFwiLCBcImJwc1wiKV0pLFxuXTtcblxuY29uc3QgZXh0ZXJuYWxJZlJlY2lwZXMgPSBbcmVjaXBlKFwiXHU1OTE2XHU5MEU4XHUzMEIzXHUzMERFXHUzMEYzXHUzMEM5XHU5MDIzXHU2NDNBXHU0RUQ1XHU2OUQ4XCIsIFwiaWZ4LWNtZFwiKV07XG5cbmNvbnN0IGFyY2hpdGVjdHVyZVJlY2lwZXMgPSBbZ3JvdXAoXCJcdTMwQTRcdTMwRjNcdTMwRDVcdTMwRTlcdTMwRkJcdTYyODBcdTg4NTNcdTkwNzhcdTVCOUFcIiwgW3JlY2lwZShcIlx1NjI4MFx1ODg1M1x1MzBCOVx1MzBCRlx1MzBDM1x1MzBBRlwiLCBcInRzZFwiKV0pXTtcblxuY29uc3QgZXhlY1JlY2lwZXMgPSBbcmVjaXBlKFwiaHVtYW5cdTMwQkZcdTMwQjlcdTMwQUZcdTMwNkVcdTc4QkFcdTVCOUFcIiwgXCJleGVjLWh1bWFuLWZpbmFsaXplXCIpXTtcblxuLy8gLS0tIFx1MzBCNVx1MzBGM1x1MzBEN1x1MzBFQlx1RkYwOFNhbXBsZXNcdUZGMDkgLS0tXG5jb25zdCBwcm9qZWN0RGVmaW5pdGlvblNhbXBsZXMgPSBbXG4gIHNhbXBsZShcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1Njk4Mlx1ODk4MVwiLCBcInByai1vdmVydmlld1wiKSxcbiAgc2FtcGxlKFwiXHUzMEI5XHUzMEM2XHUzMEZDXHUzMEFGXHUzMERCXHUzMEVCXHUzMEMwXHUzMEZDXHU3NjdCXHU5MzMyXHU3QzNGXCIsIFwicHJqLXN0YWtlaG9sZGVyLXJlZ2lzdGVyXCIpLFxuICBzYW1wbGUoXCJcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcdTYxQjJcdTdBRTBcIiwgXCJwcmotY2hhcnRlclwiKSxcbiAgc2FtcGxlKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHUzMEI5XHUzMEIzXHUzMEZDXHUzMEQ3XCIsIFwicHJqLXNjb3BlXCIpLFxuICBzYW1wbGUoXCJcdTYyMTBcdTUyOUZcdTU3RkFcdTZFOTZcdTMwNjhcdTUzRDdcdTUxNjVcdTY3NjFcdTRFRjZcIiwgXCJwcmotc3VjY2Vzcy1jcml0ZXJpYS1hbmQtYWNjZXB0YW5jZS1jcml0ZXJpYVwiKSxcbiAgc2FtcGxlKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU4QUIyXHU5ODRDXHUzMDY4XHU4OUUzXHU2QzdBXHUzMEEyXHUzMEQ3XHUzMEVEXHUzMEZDXHUzMEMxXCIsIFwicHJqLWlzc3Vlcy1hbmQtYXBwcm9hY2hcIiksXG4gIHNhbXBsZShcIlx1NTI0RFx1NjNEMFx1MzBGQlx1NTIzNlx1N0QwNFx1MzBGQlx1NEY5RFx1NUI1OFx1OTVBMlx1NEZDMlwiLCBcInByai1hc3N1bXB0aW9ucy1jb25zdHJhaW50cy1kZXBlbmRlbmNpZXNcIiksXG4gIHNhbXBsZShcIlx1NEVFM1x1NjZGRlx1Njg0OFx1MzA2RVx1NkJENFx1OEYwM1wiLCBcInByai1jb21wYXJpc29uLW9mLWFsdGVybmF0aXZlc1wiKSxcbl07XG5cbmNvbnN0IHByb2plY3RNYW5hZ2VtZW50U2FtcGxlcyA9IFtcbiAgZ3JvdXAoXCJcdTYyMTBcdTY3OUNcdTcyNjlcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjBcIiwgW1xuICAgIHNhbXBsZVlhbWwoXCJcdTYyMTBcdTY3OUNcdTcyNjlcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjBcdTMwNkVcdTdEMjJcdTVGMTVcIiwgXCJkY3QtaW5kZXhcIiksXG4gICAgc2FtcGxlWWFtbChcIlx1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFwiLCBcImRjdFwiKSxcbiAgXSksXG4gIGdyb3VwKFwiXHU3QkExXHU3NDA2XHU4QTA4XHU3NTNCXCIsIFtcbiAgICBzYW1wbGUoXCJcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcdTdCQTFcdTc0MDZcdThBMDhcdTc1M0JcIiwgXCJwbS1wbGFuXCIpLFxuICAgIHNhbXBsZShcIlx1MzBCM1x1MzBERlx1MzBFNVx1MzBDQlx1MzBCMVx1MzBGQ1x1MzBCN1x1MzBFN1x1MzBGM1x1OEEwOFx1NzUzQlwiLCBcInBtLWNvbW11bmljYXRpb24tcGxhblwiKSxcbiAgICBzYW1wbGUoXCJcdTU0QzFcdThDRUFcdTdCQTFcdTc0MDZcdThBMDhcdTc1M0JcIiwgXCJwbS1xdWFsaXR5LW1hbmFnZW1lbnQtcGxhblwiKSxcbiAgXSksXG4gIGdyb3VwKFwiXHU3RDQ0XHU3RTU0XHU0RjUzXHU1MjM2XCIsIFtcbiAgICBzYW1wbGUoXCJcdTdENDRcdTdFNTRcdTMwNjhcdTMwRURcdTMwRkNcdTMwRUJcdTMwNkVcdTVCOUFcdTdGQTlcIiwgXCJwbS1vcmdhbml6YXRpb25cIiksXG4gICAgc2FtcGxlWWFtbChcIlx1MzBFRFx1MzBGQ1x1MzBFQlx1NUI5QVx1N0ZBOVwiLCBcInBtLXJvbGVzXCIpLFxuICAgIHNhbXBsZVlhbWwoXCJcdTMwRTFcdTMwRjNcdTMwRDBcdTMwRkNcdTVCOUFcdTdGQTlcIiwgXCJwbS1tZW1iZXJzXCIpLFxuICAgIHNhbXBsZShcIlx1N0Q0NFx1N0U1NFx1NEY1M1x1NTIzNlx1MzA2OFJBQ0lcIiwgXCJwbS1yYWNpXCIpLFxuICBdKSxcbiAgZ3JvdXAoXCJcdTdCQTFcdTc0MDZcdTUzRjBcdTVFMzNcdTMwRkJcdTdCQTFcdTc0MDZcdTMwRDNcdTMwRTVcdTMwRkNcIiwgW1xuICAgIHNhbXBsZShcIlx1MzBFQVx1MzBCOVx1MzBBRlx1NzY3Qlx1OTMzMlx1N0MzRlwiLCBcInBtLXJpc2stcmVnaXN0ZXJcIiksXG4gICAgc2FtcGxlKFwiXHU4QUIyXHU5ODRDXHUzMEVEXHUzMEIwXCIsIFwicG0taXNzdWUtbG9nXCIpLFxuICAgIHNhbXBsZShcIlx1NTkwOVx1NjZGNFx1ODk4MVx1NkM0Mlx1MzBFRFx1MzBCMFwiLCBcInBtLWNoYW5nZS1yZXF1ZXN0LWxvZ1wiKSxcbiAgICBzYW1wbGUoXCJcdTYxMEZcdTYwMURcdTZDN0FcdTVCOUFcdTMwRURcdTMwQjBcIiwgXCJkZWNcIiksXG4gIF0pLFxuICBzYW1wbGVZYW1sKFwiXHUzMEJGXHUzMEE0XHUzMEUwXHUzMEU5XHUzMEE0XHUzMEYzXCIsIFwidG1sXCIpLFxuICBzYW1wbGUoXCJcdTkwMzJcdTYzNTdcdTU4MzFcdTU0NEFcIiwgXCJwclwiKSxcbiAgc2FtcGxlKFwiXHU4QjcwXHU0RThCXHU5MzMyXCIsIFwibW1cIiksXG5dO1xuXG5jb25zdCBwcm9kdWN0Q2hhbmdlU2FtcGxlcyA9IFtcbiAgZ3JvdXAoXCJcdTVGNzFcdTk3RkZcdThBQkZcdTY3RkJcIiwgW1xuICAgIHNhbXBsZShcIlx1Njk2RFx1NTJEOVx1NUY3MVx1OTdGRlwiLCBcImltcC1idXNpbmVzc1wiKSxcbiAgICBzYW1wbGUoXCJcdTMwQzdcdTMwRkNcdTMwQkZcdTVGNzFcdTk3RkZcIiwgXCJpbXAtZGF0YVwiKSxcbiAgICBzYW1wbGUoXCJcdTMwQTRcdTMwRjNcdTMwQkZcdTMwRkNcdTMwRDVcdTMwQTdcdTMwRkNcdTMwQjlcdTVGNzFcdTk3RkZcIiwgXCJpbXAtaW50ZXJmYWNlXCIpLFxuICAgIHNhbXBsZShcIlx1MzBDNlx1MzBCOVx1MzBDOFx1NUY3MVx1OTdGRlwiLCBcImltcC10ZXN0XCIpLFxuICAgIHNhbXBsZShcIlx1OTA0Qlx1NzUyOFx1NUY3MVx1OTdGRlwiLCBcImltcC1vcGVyYXRpb25zXCIpLFxuICBdKSxcbiAgZ3JvdXAoXCJcdTMwQzhcdTMwRUNcdTMwRkNcdTMwQjVcdTMwRDNcdTMwRUFcdTMwQzZcdTMwQTNcIiwgW1xuICAgIHNhbXBsZShcIlx1ODk4MVx1NkM0Mlx1MzA2OFx1NEVENVx1NjlEOFx1MzA2RVx1MzBDOFx1MzBFQ1x1MzBGQ1x1MzBCOVwiLCBcInRyYy1yZXF1aXJlbWVudHMtdG8tc3BlY3NcIiksXG4gICAgc2FtcGxlKFwiXHU4OTgxXHU2QzQyXHUzMDY4XHUzMEM2XHUzMEI5XHUzMEM4XHUzMDZFXHUzMEM4XHUzMEVDXHUzMEZDXHUzMEI5XCIsIFwidHJjLXJlcXVpcmVtZW50cy10by10ZXN0c1wiKSxcbiAgXSksXG5dO1xuXG5jb25zdCBidXNpbmVzc1NwZWNpZmljYXRpb25TYW1wbGVzID0gW1xuICBncm91cChcIlx1Njk4Mlx1NUZGNVx1MzBDN1x1MzBGQ1x1MzBCRlx1MzBENVx1MzBFRFx1MzBGQ1x1NTZGM1wiLCBbXG4gICAgc2FtcGxlKFwiXHU1MTY4XHU0RjUzXHU2OTgyXHU4OTgxXCIsIFwiY2RmZC1vdmVydmlld1wiKSxcbiAgICBzYW1wbGUoXCJcdTMwRTZcdTMwRkNcdTMwQjlcdTMwQjFcdTMwRkNcdTMwQjlcdTUyMjVcIiwgXCJjZGZkLXVjXCIpLFxuICAgIHNhbXBsZShcIlx1MzBEN1x1MzBFRFx1MzBCQlx1MzBCOVx1MzBCMFx1MzBFQlx1MzBGQ1x1MzBEN1x1NTIyNVwiLCBcImNkZmRcIiksXG4gIF0pLFxuICBncm91cChcIlx1MzBDN1x1MzBGQ1x1MzBCRlx1MzBFMlx1MzBDN1x1MzBFQlwiLCBbXG4gICAgc2FtcGxlWWFtbChcIlx1Njk2RFx1NTJEOVx1MzBDN1x1MzBGQ1x1MzBCRlx1OEY5RVx1NjZGOFwiLCBcImJkZFwiKSxcbiAgICBzYW1wbGUoXCJcdTY5ODJcdTVGRjVcdTMwQzdcdTMwRkNcdTMwQkZcdTMwQjlcdTMwQzhcdTMwQTJcdTVCOUFcdTdGQTlcIiwgXCJjZHNkXCIpLFxuICAgIHNhbXBsZShcIlx1NEZERFx1N0JBMVx1NTgzNFx1NjI0MFx1NUI5QVx1N0ZBOVwiLCBcInNsZFwiKSxcbiAgICBzYW1wbGUoXCJcdTMwQjlcdTMwQzZcdTMwRkNcdTMwQkZcdTMwQjlcdTVCOUFcdTdGQTlcIiwgXCJzdHNkXCIpLFxuICAgIHNhbXBsZShcIlx1NTIwNlx1OTg1RVx1NUI5QVx1N0ZBOVwiLCBcImNsZFwiKSxcbiAgICBzYW1wbGUoXCJcdTY5ODJcdTVGRjVcdTMwQUZcdTMwRTlcdTMwQjlcdTU2RjNcIiwgXCJjY2RcIiksXG4gIF0pLFxuICBncm91cChcIlx1Njk2RFx1NTJEOVx1MzBFMlx1MzBDN1x1MzBFQlwiLCBbXG4gICAgc2FtcGxlKFwiXHU2OTZEXHU1MkQ5XHUzMEQ3XHUzMEVEXHUzMEJCXHUzMEI5XHU0RUQ1XHU2OUQ4XCIsIFwiYnBzXCIpLFxuICAgIHNhbXBsZShcIlx1MzBEM1x1MzBCOFx1MzBDRFx1MzBCOVx1MzBFQlx1MzBGQ1x1MzBFQlwiLCBcImJyXCIpLFxuICAgIHNhbXBsZShcIlx1Njk2RFx1NTJEOVx1MzBBNFx1MzBEOVx1MzBGM1x1MzBDOFx1NEUwMFx1ODlBN1wiLCBcImJlcy1pbmRleFwiKSxcbiAgICBzYW1wbGUoXCJcdTY5NkRcdTUyRDlcdTMwQTRcdTMwRDlcdTMwRjNcdTMwQzhcdTRFRDVcdTY5RDhcIiwgXCJiZXNcIiksXG4gIF0pLFxuICBncm91cChcIlx1MzBBNFx1MzBGM1x1MzBCRlx1MzBGQ1x1MzBENVx1MzBBN1x1MzBGQ1x1MzBCOVx1MzBFMlx1MzBDN1x1MzBFQlwiLCBbc2FtcGxlKFwiXHU3NTNCXHU5NzYyXHU0RUQ1XHU2OUQ4XCIsIFwidWlzXCIpLCBzYW1wbGUoXCJcdTVFMzNcdTc5NjhcdTRFRDVcdTY5RDhcIiwgXCJiZHNcIildKSxcbiAgZ3JvdXAoXCJcdTUxNzFcdTkwMUFcIiwgW1xuICAgIHNhbXBsZShcIlx1MzBCN1x1MzBCOVx1MzBDNlx1MzBFMFx1NTMxNlx1NkE1Rlx1ODBGRFx1NEUwMFx1ODlBN1wiLCBcInNmLWluZGV4XCIpLFxuICAgIHNhbXBsZShcIlx1MzBCN1x1MzBCOVx1MzBDNlx1MzBFMFx1NTMxNlx1NkE1Rlx1ODBGRFwiLCBcInNmXCIpLFxuICAgIHNhbXBsZVlhbWwoXCJcdTc1MjhcdThBOUVcdTk2QzZcIiwgXCJnbFwiKSxcbiAgXSksXG5dO1xuXG5jb25zdCBleHRlcm5hbElmU2FtcGxlcyA9IFtcbiAgc2FtcGxlWWFtbChcIlx1NTkxNlx1OTBFOFx1MzBCN1x1MzBCOVx1MzBDNlx1MzBFMEkvRlx1NEUwMFx1ODlBN1wiLCBcImlmeC1pbmRleFwiKSxcbiAgc2FtcGxlWWFtbChcIlx1NTkxNlx1OTBFOEFQSVx1NEVENVx1NjlEOFwiLCBcImlmeC1hcGlcIiksXG4gIHNhbXBsZVlhbWwoXCJcdTU5MTZcdTkwRThcdTMwQjNcdTMwREVcdTMwRjNcdTMwQzlcdTkwMjNcdTY0M0FcdTRFRDVcdTY5RDhcIiwgXCJpZngtY21kXCIpLFxuICBzYW1wbGUoXCJcdTU5MTZcdTkwRThcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdTRFRDVcdTY5RDhcIiwgXCJpZngtZmlsZVwiKSxcbiAgc2FtcGxlWWFtbChcIlx1NTkxNlx1OTBFOFx1MzBFMVx1MzBDM1x1MzBCQlx1MzBGQ1x1MzBCOFx1NEVENVx1NjlEOFwiLCBcImlmeC1tc2dcIiksXG5dO1xuXG5jb25zdCBhcmNoaXRlY3R1cmVTYW1wbGVzID0gW1xuICBncm91cChcIkM0XCIsIFtcbiAgICBzYW1wbGUoXCJcdTMwQjNcdTMwRjNcdTMwQzZcdTMwQURcdTMwQjlcdTMwQzhcdTU2RjNcIiwgXCJjeGRcIiksXG4gICAgc2FtcGxlKFwiXHUzMEIzXHUzMEYzXHUzMEM2XHUzMENBXHU1NkYzXCIsIFwiY25kXCIpLFxuICAgIHNhbXBsZShcIlx1MzBCM1x1MzBGM1x1MzBERFx1MzBGQ1x1MzBDRFx1MzBGM1x1MzBDOFx1NTZGM1wiLCBcImNwZFwiKSxcbiAgXSksXG4gIGdyb3VwKFwiXHUzMEE0XHUzMEYzXHUzMEQ1XHUzMEU5XHUzMEZCXHU2MjgwXHU4ODUzXHU5MDc4XHU1QjlBXCIsIFtcbiAgICBzYW1wbGUoXCJcdTMwQTRcdTMwRjNcdTMwRDVcdTMwRTlcdTY5Q0JcdTYyMTBcdTU2RjNcIiwgXCJpZmRcIiksXG4gICAgc2FtcGxlKFwiXHU2MjgwXHU4ODUzXHUzMEI5XHUzMEJGXHUzMEMzXHUzMEFGXHU0RTAwXHU4OUE3XCIsIFwidHNkLWluZGV4XCIpLFxuICAgIHNhbXBsZShcIlx1NjI4MFx1ODg1M1x1MzBCOVx1MzBCRlx1MzBDM1x1MzBBRlwiLCBcInRzZFwiKSxcbiAgXSksXG5dO1xuXG5jb25zdCBzeXN0ZW1EZXNpZ25TYW1wbGVzID0gW1xuICBzYW1wbGUoXCJcdTMwQjdcdTMwQjlcdTMwQzZcdTMwRTBcdThBMkRcdThBMDggXHU1MTY4XHU0RjUzXHU2OUNCXHU2MjEwXCIsIFwic3lzZC1pbmRleFwiKSxcbiAgc2FtcGxlKFwiXHU5MUNEXHU4OTgxXHUzMEQ1XHUzMEVEXHUzMEZDXCIsIFwic3lzZC1jcml0aWNhbC1mbG93c1wiKSxcbiAgc2FtcGxlKFwiXHU2QTJBXHU2NUFEXHUzMEVCXHUzMEZDXHUzMEVCXCIsIFwic3lzZC1jcm9zcy1jdXR0aW5nLXBvbGljeVwiKSxcbl07XG5cbmNvbnN0IG5vbkZ1bmN0aW9uYWxSZXF1aXJlbWVudFNhbXBsZXMgPSBbXG4gIHNhbXBsZShcIlx1OTc1RVx1NkE1Rlx1ODBGRFx1ODk4MVx1NEVGNiBcdTUxNjhcdTRGNTNcdTY5Q0JcdTYyMTBcIiwgXCJuZnItaW5kZXhcIiksXG4gIHNhbXBsZShcIlx1NEZFMVx1OTgzQ1x1NjAyN1wiLCBcIm5mci1yZWxpYWJpbGl0eVwiKSxcbiAgc2FtcGxlKFwiXHU1M0VGXHU3NTI4XHU2MDI3XCIsIFwibmZyLWF2YWlsYWJpbGl0eVwiKSxcbiAgc2FtcGxlKFwiXHU0RkREXHU1Qjg4XHU2MDI3XCIsIFwibmZyLW1haW50YWluYWJpbGl0eVwiKSxcbiAgc2FtcGxlKFwiXHU1QjhDXHU1MTY4XHU2MDI3XCIsIFwibmZyLWludGVncml0eVwiKSxcbiAgc2FtcGxlKFwiXHU2QTVGXHU1QkM2XHU2MDI3XHUzMEZCXHU1Qjg5XHU1MTY4XHU2MDI3XCIsIFwibmZyLXNlY3VyaXR5LXNhZmV0eVwiKSxcbiAgc2FtcGxlKFwiXHU2MDI3XHU4MEZEXCIsIFwibmZyLXBlcmZvcm1hbmNlXCIpLFxuICBzYW1wbGUoXCJcdTkwNEJcdTc1MjhcIiwgXCJuZnItb3BlcmF0aW9uc1wiKSxcbiAgc2FtcGxlKFwiXHU2NENEXHU0RjVDXHU2MDI3XCIsIFwibmZyLXVzYWJpbGl0eVwiKSxcbl07XG5cbmNvbnN0IHRlc3RpbmdTYW1wbGVzID0gW1xuICBzYW1wbGUoXCJcdTMwQzZcdTMwQjlcdTMwQzhcdTYyMjZcdTc1NjVcdTMwRkJcdTY1QjlcdTkxRERcIiwgXCJ0c3AtaW5kZXhcIiksXG4gIGdyb3VwKFwiXHU1MzU4XHU0RjUzXHUzMEM2XHUzMEI5XHUzMEM4XCIsIFtcbiAgICBzYW1wbGUoXCJcdTUzNThcdTRGNTNcdTMwQzZcdTMwQjlcdTMwQzhcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjAgXHU2OTgyXHU4OTgxXCIsIFwidXRjLWluZGV4XCIpLFxuICAgIHNhbXBsZShcIlx1NTM1OFx1NEY1M1x1MzBDNlx1MzBCOVx1MzBDOFx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMCBcdTVCRkVcdThDNjFcdTUyMjVcIiwgXCJ1dGNcIiksXG4gIF0pLFxuICBncm91cChcIlx1NTE4NVx1OTBFOFx1N0Q1MFx1NTQwOFx1MzBDNlx1MzBCOVx1MzBDOFwiLCBbXG4gICAgc2FtcGxlKFwiXHU1MTg1XHU5MEU4XHU3RDUwXHU1NDA4XHUzMEM2XHUzMEI5XHUzMEM4XHUzMEFCXHUzMEJGXHUzMEVEXHUzMEIwIFx1Njk4Mlx1ODk4MVwiLCBcIml0Yy1pbmRleFwiKSxcbiAgICBzYW1wbGUoXCJcdTUxODVcdTkwRThcdTdENTBcdTU0MDhcdTMwQzZcdTMwQjlcdTMwQzhcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjAgXHU1QkZFXHU4QzYxXHU1MjI1XCIsIFwiaXRjXCIpLFxuICBdKSxcbiAgZ3JvdXAoXCJcdTU5MTZcdTkwRThcdTdENTBcdTU0MDhcdTMwQzZcdTMwQjlcdTMwQzhcIiwgW1xuICAgIHNhbXBsZShcIlx1NTkxNlx1OTBFOFx1N0Q1MFx1NTQwOFx1MzBDNlx1MzBCOVx1MzBDOFx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMCBcdTY5ODJcdTg5ODFcIiwgXCJldGMtaW5kZXhcIiksXG4gICAgc2FtcGxlKFwiXHU1OTE2XHU5MEU4XHU3RDUwXHU1NDA4XHUzMEM2XHUzMEI5XHUzMEM4XHUzMEFCXHUzMEJGXHUzMEVEXHUzMEIwIFx1NUJGRVx1OEM2MVx1NTIyNVwiLCBcImV0Y1wiKSxcbiAgXSksXG4gIGdyb3VwKFwiXHU3RENGXHU1NDA4XHUzMEM2XHUzMEI5XHUzMEM4XCIsIFtcbiAgICBzYW1wbGUoXCJcdTdEQ0ZcdTU0MDhcdTMwQzZcdTMwQjlcdTMwQzhcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjAgXHU2OTgyXHU4OTgxXCIsIFwic3RjLWluZGV4XCIpLFxuICAgIHNhbXBsZShcIlx1N0RDRlx1NTQwOFx1MzBDNlx1MzBCOVx1MzBDOFx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMCBcdTVCRkVcdThDNjFcdTUyMjVcIiwgXCJzdGNcIiksXG4gIF0pLFxuICBncm91cChcIlx1NTNEN1x1NTE2NVx1MzBDNlx1MzBCOVx1MzBDOFwiLCBbXG4gICAgc2FtcGxlKFwiXHU1M0Q3XHU1MTY1XHUzMEM2XHUzMEI5XHUzMEM4XHUzMEFCXHUzMEJGXHUzMEVEXHUzMEIwIFx1Njk4Mlx1ODk4MVwiLCBcImF0Yy1pbmRleFwiKSxcbiAgICBzYW1wbGUoXCJcdTUzRDdcdTUxNjVcdTMwQzZcdTMwQjlcdTMwQzhcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjAgXHU1QkZFXHU4QzYxXHU1MjI1XCIsIFwiYXRjXCIpLFxuICBdKSxcbl07XG5cbmNvbnN0IG1pZ3JhdGlvblNhbXBsZXMgPSBbXG4gIHNhbXBsZShcIlx1NzlGQlx1ODg0Q1x1OEEwOFx1NzUzQlwiLCBcIm1pcC1pbmRleFwiKSxcbiAgc2FtcGxlKFwiXHUzMEM3XHUzMEZDXHUzMEJGXHU3OUZCXHU4ODRDXHU4QTJEXHU4QTA4IFx1NTE2OFx1NEY1M1x1NjlDQlx1NjIxMFwiLCBcImRtZC1pbmRleFwiKSxcbiAgc2FtcGxlKFwiXHUzMEM3XHUzMEZDXHUzMEJGXHU3OUZCXHU4ODRDXHU4QTJEXHU4QTA4XCIsIFwiZG1kXCIpLFxuICBzYW1wbGUoXCJcdTc5RkJcdTg4NENcdTMwQzZcdTMwQjlcdTMwQzhcdThBMDhcdTc1M0JcIiwgXCJtdHBcIiksXG4gIHNhbXBsZShcIlx1NzlGQlx1ODg0Q1x1MzBDNlx1MzBCOVx1MzBDOFx1OEEwOFx1NzUzQlx1RkYwOFx1MzBFQVx1MzBDRlx1MzBGQ1x1MzBCNVx1MzBFQlx1OEEwOFx1NzUzQlx1RkYwOVwiLCBcIm50cFwiKSxcbiAgc2FtcGxlKFwiXHUzMEFCXHUzMEMzXHUzMEM4XHUzMEFBXHUzMEZDXHUzMEQwXHUzMEZDXHU4QTA4XHU3NTNCIFx1NTE2OFx1NEY1M1x1NjlDQlx1NjIxMFwiLCBcImNvcC1pbmRleFwiKSxcbiAgc2FtcGxlKFwiXHUzMEFCXHUzMEMzXHUzMEM4XHUzMEFBXHUzMEZDXHUzMEQwXHUzMEZDXHU4QTA4XHU3NTNCXCIsIFwiY29wXCIpLFxuICBzYW1wbGUoXCJcdTkwNEJcdTc1MjhcdTUyMDdcdTY2RkZcdThBMDhcdTc1M0IgXHU1MTY4XHU0RjUzXHU2OUNCXHU2MjEwXCIsIFwib3RwLWluZGV4XCIpLFxuICBzYW1wbGUoXCJcdTkwNEJcdTc1MjhcdTUyMDdcdTY2RkZcdThBMDhcdTc1M0JcIiwgXCJvdHBcIiksXG5dO1xuXG5jb25zdCBvcGVyYXRpb25zU2FtcGxlcyA9IFtcbiAgZ3JvdXAoXCJcdTkwNEJcdTc1MjhcdTY1QjlcdTkxRERcdTMwRkJcdThBMkRcdThBMDhcIiwgW1xuICAgIHNhbXBsZShcIlx1NTE2OFx1NEY1M1x1NjlDQlx1NjIxMFwiLCBcIm9wZC1pbmRleFwiKSxcbiAgICBzYW1wbGUoXCJcdTkwNEJcdTc1MjhcdTY1QjlcdTkxRERcdTMwRkJcdThBMkRcdThBMDhcIiwgXCJvcGRcIiksXG4gICAgc2FtcGxlKFwiXHU2QTI5XHU5NjUwXHUzMEZCXHUzMEEyXHUzMEFCXHUzMEE2XHUzMEYzXHUzMEM4XCIsIFwib3BkLWFjY2Vzcy1jb250cm9sXCIpLFxuICAgIHNhbXBsZShcIlx1OTY5Q1x1NUJCM1x1NUJGRVx1NUZEQ1wiLCBcIm9wZC1pbmNpZGVudC1tYW5hZ2VtZW50XCIpLFxuICAgIHNhbXBsZShcIlx1NzZFM1x1ODk5NlwiLCBcIm9wZC1tb25pdG9yaW5nXCIpLFxuICBdKSxcbiAgZ3JvdXAoXCJcdTkwNEJcdTc1MjhcdTYyNEJcdTk4MDZcIiwgW1xuICAgIHNhbXBsZShcIlx1NTE2OFx1NEY1M1x1NjlDQlx1NjIxMFwiLCBcIm9wci1pbmRleFwiKSxcbiAgICBzYW1wbGUoXCJcdTkwNEJcdTc1MjhcdTYyNEJcdTk4MDZcIiwgXCJvcHJcIiksXG4gICAgc2FtcGxlKFwiXHUzMEEyXHUzMEFCXHUzMEE2XHUzMEYzXHUzMEM4XHU0RUQ4XHU0RTBFXHUzMEZCXHU1MjY1XHU1OTZBXCIsIFwib3ByLWFjY2Vzcy1jb250cm9sXCIpLFxuICAgIHNhbXBsZShcIlx1MzBEMFx1MzBDM1x1MzBBRlx1MzBBMlx1MzBDM1x1MzBEN1x1NzhCQVx1OEE4RFx1MzBGQlx1MzBFQVx1MzBCOVx1MzBDOFx1MzBBMlwiLCBcIm9wci1iYWNrdXAtcmVzdG9yZVwiKSxcbiAgICBzYW1wbGUoXCJcdTMwRDBcdTMwQzNcdTMwQzFcdTUxOERcdTVCOUZcdTg4NENcdTMwRkJcdTU5MzFcdTY1NTdcdTVCRkVcdTVGRENcIiwgXCJvcHItYmF0Y2hcIiksXG4gICAgc2FtcGxlKFwiXHU5MDRCXHU3NTI4XHU1OTA5XHU2NkY0XHVGRjA4XHU4QTJEXHU1QjlBXHU1OTA5XHU2NkY0XHUzMEZCXHUzMEM3XHUzMEQ3XHUzMEVEXHUzMEE0XHVGRjA5XCIsIFwib3ByLWNoYW5nZVwiKSxcbiAgICBzYW1wbGUoXCJcdTk2OUNcdTVCQjNcdTVCRkVcdTVGRENcIiwgXCJvcHItaW5jaWRlbnRcIiksXG4gICAgc2FtcGxlKFwiXHU3NkUzXHU4OTk2XHUzMEZCXHUzMEEyXHUzMEU5XHUzMEZDXHUzMEM4XHU1QkZFXHU1RkRDXCIsIFwib3ByLW1vbml0b3JpbmdcIiksXG4gICAgc2FtcGxlKFwiXHU1NTRGXHUzMDQ0XHU1NDA4XHUzMDhGXHUzMDVCXHU0RTAwXHU2QjIxXHU1QkZFXHU1RkRDXCIsIFwib3ByLXN1cHBvcnRcIiksXG4gIF0pLFxuXTtcblxuLy8gLS0tIFx1MzBDNlx1MzBGM1x1MzBEN1x1MzBFQ1x1MzBGQ1x1MzBDOFx1RkYwOFRlbXBsYXRlc1x1RkYwOSAtLS1cbmNvbnN0IHByb2plY3REZWZpbml0aW9uVGVtcGxhdGVzID0gW1xuICB0ZW1wbGF0ZShcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1Njk4Mlx1ODk4MVwiLCBcInByai1vdmVydmlld1wiKSxcbiAgdGVtcGxhdGUoXCJcdTMwQjlcdTMwQzZcdTMwRkNcdTMwQUZcdTMwREJcdTMwRUJcdTMwQzBcdTMwRkNcdTc2N0JcdTkzMzJcdTdDM0ZcIiwgXCJwcmotc3Rha2Vob2xkZXItcmVnaXN0ZXJcIiksXG4gIHRlbXBsYXRlKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU2MUIyXHU3QUUwXCIsIFwicHJqLWNoYXJ0ZXJcIiksXG4gIHRlbXBsYXRlKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHUzMEI5XHUzMEIzXHUzMEZDXHUzMEQ3XCIsIFwicHJqLXNjb3BlXCIpLFxuICB0ZW1wbGF0ZShcIlx1NjIxMFx1NTI5Rlx1NTdGQVx1NkU5Nlx1MzA2OFx1NTNEN1x1NTE2NVx1Njc2MVx1NEVGNlwiLCBcInByai1zdWNjZXNzLWNyaXRlcmlhLWFuZC1hY2NlcHRhbmNlLWNyaXRlcmlhXCIpLFxuICB0ZW1wbGF0ZShcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1OEFCMlx1OTg0Q1x1MzA2OFx1ODlFM1x1NkM3QVx1MzBBMlx1MzBEN1x1MzBFRFx1MzBGQ1x1MzBDMVwiLCBcInByai1pc3N1ZXMtYW5kLWFwcHJvYWNoXCIpLFxuICB0ZW1wbGF0ZShcIlx1NTI0RFx1NjNEMFx1MzBGQlx1NTIzNlx1N0QwNFx1MzBGQlx1NEY5RFx1NUI1OFx1OTVBMlx1NEZDMlwiLCBcInByai1hc3N1bXB0aW9ucy1jb25zdHJhaW50cy1kZXBlbmRlbmNpZXNcIiksXG4gIHRlbXBsYXRlKFwiXHU0RUUzXHU2NkZGXHU2ODQ4XHUzMDZFXHU2QkQ0XHU4RjAzXCIsIFwicHJqLWNvbXBhcmlzb24tb2YtYWx0ZXJuYXRpdmVzXCIpLFxuXTtcblxuY29uc3QgZGVsaXZlcmFibGVzQ2F0YWxvZ1RlbXBsYXRlcyA9IFtcbiAgdGVtcGxhdGUoXCJcdTYyMTBcdTY3OUNcdTcyNjlcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjBcdTMwNkVcdTdEMjJcdTVGMTVcIiwgXCJkY3QtaW5kZXhcIiksXG4gIHRlbXBsYXRlWWFtbChcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1NUI5QVx1N0ZBOVwiLCBcImRjdC1wcm9qZWN0LWRlZmluaXRpb25cIiksXG4gIHRlbXBsYXRlWWFtbChcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1N0JBMVx1NzQwNlwiLCBcImRjdC1wcm9qZWN0LW1hbmFnZW1lbnRcIiksXG4gIHRlbXBsYXRlWWFtbChcIlx1Njk2RFx1NTJEOVx1MzBEN1x1MzBFRFx1MzBCQlx1MzBCOVx1NEVENVx1NjlEOFwiLCBcImRjdC1idXNpbmVzcy1tb2RlbC1icHNcIiksXG4gIHRlbXBsYXRlWWFtbChcIlx1MzBEM1x1MzBCOFx1MzBDRFx1MzBCOVx1MzBFQlx1MzBGQ1x1MzBFQlwiLCBcImRjdC1idXNpbmVzcy1tb2RlbC1iclwiKSxcbiAgdGVtcGxhdGVZYW1sKFwiXHU2OTZEXHU1MkQ5XHUzMEE0XHUzMEQ5XHUzMEYzXHUzMEM4XHU0RUQ1XHU2OUQ4XCIsIFwiZGN0LWJ1c2luZXNzLW1vZGVsLWJlc1wiKSxcbiAgdGVtcGxhdGVZYW1sKFwiXHUzMEM3XHUzMEZDXHUzMEJGXHUzMEQ1XHUzMEVEXHUzMEZDXCIsIFwiZGN0LWRhdGEtZmxvd1wiKSxcbiAgdGVtcGxhdGVZYW1sKFwiXHU2OTZEXHU1MkQ5XHUzMEM3XHUzMEZDXHUzMEJGXHU4RjlFXHU2NkY4XCIsIFwiZGN0LWRhdGEtbW9kZWwtYmRkXCIpLFxuICB0ZW1wbGF0ZVlhbWwoXCJcdTY5ODJcdTVGRjVcdTMwQzdcdTMwRkNcdTMwQkZcdTMwQjlcdTMwQzhcdTMwQTJcdTVCOUFcdTdGQTlcIiwgXCJkY3QtZGF0YS1tb2RlbC1jZHNkXCIpLFxuICB0ZW1wbGF0ZVlhbWwoXCJcdTRGRERcdTdCQTFcdTU4MzRcdTYyNDBcdTVCOUFcdTdGQTlcIiwgXCJkY3QtZGF0YS1tb2RlbC1zbGRcIiksXG4gIHRlbXBsYXRlWWFtbChcIlx1MzBCOVx1MzBDNlx1MzBGQ1x1MzBCRlx1MzBCOVx1NUI5QVx1N0ZBOVx1MzBGQlx1NzJCNlx1NjE0Qlx1OTA3N1x1NzlGQlwiLCBcImRjdC1kYXRhLW1vZGVsLXN0c2RcIiksXG4gIHRlbXBsYXRlWWFtbChcIlx1NTIwNlx1OTg1RVx1NUI5QVx1N0ZBOVwiLCBcImRjdC1kYXRhLW1vZGVsLWNsZFwiKSxcbiAgdGVtcGxhdGVZYW1sKFwiXHU2OTgyXHU1RkY1XHUzMEFGXHUzMEU5XHUzMEI5XHU1NkYzXCIsIFwiZGN0LWRhdGEtbW9kZWwtY2NkXCIpLFxuICB0ZW1wbGF0ZVlhbWwoXCJcdTMwRTZcdTMwRkNcdTMwQjZcdTMwRkNcdTMwQTRcdTMwRjNcdTMwQkZcdTMwRkNcdTMwRDVcdTMwQTdcdTMwRkNcdTMwQjlcdTMwRTJcdTMwQzdcdTMwRUJcIiwgXCJkY3QtdXNlci1pbnRlcmZhY2UtbW9kZWxcIiksXG4gIHRlbXBsYXRlWWFtbChcIlx1MzBCN1x1MzBCOVx1MzBDNlx1MzBFMFx1NTMxNlx1NkE1Rlx1ODBGRFwiLCBcImRjdC1zeXN0ZW0tZnVuY3Rpb25zXCIpLFxuICB0ZW1wbGF0ZVlhbWwoXCJcdTc1MjhcdThBOUVcdTk2QzZcIiwgXCJkY3QtZ2xvc3NhcnlcIiksXG4gIHRlbXBsYXRlWWFtbChcIlx1NTkxNlx1OTBFOElGXHU0RUQ1XHU2OUQ4XCIsIFwiZGN0LWV4dGVybmFsLWludGVyZmFjZS1zcGVjc1wiKSxcbiAgdGVtcGxhdGVZYW1sKFwiXHUzMEEyXHUzMEZDXHUzMEFEXHUzMEM2XHUzMEFGXHUzMEMxXHUzMEUzXCIsIFwiZGN0LWFyY2hpdGVjdHVyZVwiKSxcbiAgdGVtcGxhdGVZYW1sKFwiXHUzMEI3XHUzMEI5XHUzMEM2XHUzMEUwXHU4QTJEXHU4QTA4XCIsIFwiZGN0LXN5c3RlbS1kZXNpZ25cIiksXG4gIHRlbXBsYXRlWWFtbChcIlx1Njk2RFx1NTJEOVx1NTNEN1x1NTE2NVx1NTdGQVx1NkU5NlwiLCBcImRjdC1idXNpbmVzcy1hY2NlcHRhbmNlLWNyaXRlcmlhXCIpLFxuICB0ZW1wbGF0ZVlhbWwoXCJcdTk3NUVcdTZBNUZcdTgwRkRcdTg5ODFcdTRFRjZcIiwgXCJkY3Qtbm9uLWZ1bmN0aW9uYWwtcmVxdWlyZW1lbnRzXCIpLFxuICB0ZW1wbGF0ZVlhbWwoXCJcdTMwQjdcdTMwQjlcdTMwQzZcdTMwRTBcdTUzRDdcdTUxNjVcdTU3RkFcdTZFOTZcIiwgXCJkY3Qtc3lzdGVtLWFjY2VwdGFuY2UtY3JpdGVyaWFcIiksXG4gIHRlbXBsYXRlWWFtbChcIlx1MzBDNlx1MzBCOVx1MzBDOFwiLCBcImRjdC10ZXN0LXNwZWNzXCIpLFxuICB0ZW1wbGF0ZVlhbWwoXCJcdTVGNzFcdTk3RkZcdThBQkZcdTY3RkJcIiwgXCJkY3QtaW1wYWN0LWFuYWx5c2lzXCIpLFxuICB0ZW1wbGF0ZVlhbWwoXCJcdTc5RkJcdTg4NENcdThBMDhcdTc1M0JcIiwgXCJkY3QtbWlncmF0aW9uLXBsYW5uaW5nXCIpLFxuICB0ZW1wbGF0ZVlhbWwoXCJcdTkwNEJcdTc1MjhcIiwgXCJkY3Qtb3BlcmF0aW9uc1wiKSxcbl07XG5cbmNvbnN0IHByb2plY3RNYW5hZ2VtZW50VGVtcGxhdGVzID0gW1xuICBncm91cChcIlx1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFwiLCBkZWxpdmVyYWJsZXNDYXRhbG9nVGVtcGxhdGVzKSxcbiAgZ3JvdXAoXCJcdTdCQTFcdTc0MDZcdThBMDhcdTc1M0JcIiwgW1xuICAgIHRlbXBsYXRlKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU3QkExXHU3NDA2XHU4QTA4XHU3NTNCXCIsIFwicG0tcGxhblwiKSxcbiAgICB0ZW1wbGF0ZShcIlx1MzBCM1x1MzBERlx1MzBFNVx1MzBDQlx1MzBCMVx1MzBGQ1x1MzBCN1x1MzBFN1x1MzBGM1x1OEEwOFx1NzUzQlwiLCBcInBtLWNvbW11bmljYXRpb24tcGxhblwiKSxcbiAgICB0ZW1wbGF0ZShcIlx1NTRDMVx1OENFQVx1N0JBMVx1NzQwNlx1OEEwOFx1NzUzQlwiLCBcInBtLXF1YWxpdHktbWFuYWdlbWVudC1wbGFuXCIpLFxuICBdKSxcbiAgZ3JvdXAoXCJcdTdENDRcdTdFNTRcdTRGNTNcdTUyMzZcIiwgW1xuICAgIHRlbXBsYXRlKFwiXHU3RDQ0XHU3RTU0XHUzMDY4XHUzMEVEXHUzMEZDXHUzMEVCXHUzMDZFXHU1QjlBXHU3RkE5XCIsIFwicG0tb3JnYW5pemF0aW9uXCIpLFxuICAgIHRlbXBsYXRlWWFtbChcIlx1MzBFRFx1MzBGQ1x1MzBFQlx1NUI5QVx1N0ZBOVwiLCBcInBtLXJvbGVzXCIpLFxuICAgIHRlbXBsYXRlWWFtbChcIlx1MzBFMVx1MzBGM1x1MzBEMFx1MzBGQ1x1NUI5QVx1N0ZBOVwiLCBcInBtLW1lbWJlcnNcIiksXG4gICAgdGVtcGxhdGVZYW1sKFwiXHU0RkREXHU4Qjc3XHUzMDU1XHUzMDhDXHUzMDVGIGFnZW50IFx1NUI5QVx1N0ZBOVwiLCBcImFnZW50LW1lbWJlcnNcIiksXG4gICAgdGVtcGxhdGUoXCJcdTdENDRcdTdFNTRcdTRGNTNcdTUyMzZcdTMwNjhSQUNJXCIsIFwicG0tcmFjaVwiKSxcbiAgXSksXG4gIGdyb3VwKFwiXHU3QkExXHU3NDA2XHU1M0YwXHU1RTMzXHUzMEZCXHU3QkExXHU3NDA2XHUzMEQzXHUzMEU1XHUzMEZDXCIsIFtcbiAgICB0ZW1wbGF0ZShcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1NzY3Qlx1OTMzMlx1N0MzRlwiLCBcInBqci1pbmRleFwiKSxcbiAgICB0ZW1wbGF0ZShcIlx1NTNGMFx1NUUzM1x1MzBEM1x1MzBFNVx1MzBGQ1x1RkYwOFx1NzJCNlx1NjE0Qlx1NTIyNVx1RkYwOVwiLCBcInBqci12aWV3cy1ieS1zdGF0dXNcIiksXG4gICAgdGVtcGxhdGUoXCJcdTUzRjBcdTVFMzNcdTMwRDNcdTMwRTVcdTMwRkNcdUZGMDhcdTUxMkFcdTUxNDhcdTVFQTZcdTUyMjVcdUZGMDlcIiwgXCJwanItdmlld3MtYnktcHJpb3JpdHlcIiksXG4gICAgdGVtcGxhdGUoXCJcdTUzRjBcdTVFMzNcdTMwRDNcdTMwRTVcdTMwRkNcdUZGMDhcdTYyQzVcdTVGNTNcdTgwMDVcdTUyMjVcdUZGMDlcIiwgXCJwanItdmlld3MtYnktb3duZXJcIiksXG4gICAgdGVtcGxhdGUoXCJcdTc2N0JcdTkzMzJcdTk4MDVcdTc2RUVcdTMwNkVcdTVCOUZcdTg4NENcdTRGOURcdTVCNThcIiwgXCJwanItZGVwZW5kZW50LWl0ZW1zXCIpLFxuICAgIHRlbXBsYXRlKFwiXHU3NjdCXHU5MzMyXHU5ODA1XHU3NkVFXHUzMDZFXHU2RDNFXHU3NTFGXHU5NUEyXHU0RkMyXCIsIFwicGpyLWRlcml2ZWQtaXRlbXNcIiksXG4gICAgdGVtcGxhdGUoXCJlcGljIFx1MzA1NFx1MzA2OFx1MzA2RVx1NUI1MFx1OTgwNVx1NzZFRVwiLCBcInBqci1lcGljLWl0ZW1zXCIpLFxuICAgIGdyb3VwKFwiXHU3NjdCXHU5MzMyXHU5ODA1XHU3NkVFXCIsIFtcbiAgICAgIHRlbXBsYXRlKFwiVE9ET1wiLCBcInBqci10b2RvXCIpLFxuICAgICAgdGVtcGxhdGUoXCJcdThBQjJcdTk4NENcIiwgXCJwanItaXNzdWVcIiksXG4gICAgICB0ZW1wbGF0ZShcIlx1MzBFQVx1MzBCOVx1MzBBRlwiLCBcInBqci1yaXNrXCIpLFxuICAgICAgdGVtcGxhdGUoXCJcdTU5MDlcdTY2RjRcdTg5ODFcdTZDNDJcIiwgXCJwanItY2hhbmdlLXJlcXVlc3RcIiksXG4gICAgICB0ZW1wbGF0ZShcIlx1NjEwRlx1NjAxRFx1NkM3QVx1NUI5QVwiLCBcInBqci1kZWNpc2lvblwiKSxcbiAgICAgIHRlbXBsYXRlKFwiXHUzMENFXHUzMEZDXHUzMEM4XCIsIFwicGpyLW5vdGVcIiksXG4gICAgICB0ZW1wbGF0ZShcIlx1OENFQVx1NTU0RlwiLCBcInBqci1xdWVzdGlvblwiKSxcbiAgICAgIHRlbXBsYXRlKFwiRVBJQ1wiLCBcInBqci1lcGljXCIpLFxuICAgIF0pLFxuICAgIHRlbXBsYXRlKFwiXHUzMEVBXHUzMEI5XHUzMEFGXHU3NjdCXHU5MzMyXHU3QzNGXCIsIFwicG0tcmlzay1yZWdpc3RlclwiKSxcbiAgICB0ZW1wbGF0ZShcIlx1OEFCMlx1OTg0Q1x1MzBFRFx1MzBCMFwiLCBcInBtLWlzc3VlLWxvZ1wiKSxcbiAgICB0ZW1wbGF0ZShcIlx1NTkwOVx1NjZGNFx1ODk4MVx1NkM0Mlx1MzBFRFx1MzBCMFwiLCBcInBtLWNoYW5nZS1yZXF1ZXN0LWxvZ1wiKSxcbiAgICB0ZW1wbGF0ZShcIlx1NjEwRlx1NjAxRFx1NkM3QVx1NUI5QVx1MzBFRFx1MzBCMFwiLCBcInBtLWRlY2lzaW9uLWxvZ1wiKSxcbiAgXSksXG5dO1xuXG5jb25zdCBidXNpbmVzc1NwZWNpZmljYXRpb25UZW1wbGF0ZXMgPSBbXG4gIGdyb3VwKFwiXHU2OTgyXHU1RkY1XHUzMEM3XHUzMEZDXHUzMEJGXHUzMEQ1XHUzMEVEXHUzMEZDXHU1NkYzXCIsIFtcbiAgICB0ZW1wbGF0ZShcIlx1NTE2OFx1NEY1M1x1Njk4Mlx1ODk4MVwiLCBcImNkZmQtb3ZlcnZpZXdcIiksXG4gICAgdGVtcGxhdGUoXCJcdTMwRTZcdTMwRkNcdTMwQjlcdTMwQjFcdTMwRkNcdTMwQjlcdTUyMjVcIiwgXCJjZGZkLXVjXCIpLFxuICAgIHRlbXBsYXRlKFwiXHUzMEQ3XHUzMEVEXHUzMEJCXHUzMEI5XHUzMEIwXHUzMEVCXHUzMEZDXHUzMEQ3XHU1MjI1XCIsIFwiY2RmZFwiKSxcbiAgXSksXG4gIGdyb3VwKFwiXHUzMEM3XHUzMEZDXHUzMEJGXHUzMEUyXHUzMEM3XHUzMEVCXCIsIFt0ZW1wbGF0ZShcIlx1MzBCOVx1MzBDNlx1MzBGQ1x1MzBCRlx1MzBCOVx1NUI5QVx1N0ZBOVwiLCBcInN0c2RcIildKSxcbiAgZ3JvdXAoXCJcdTY5NkRcdTUyRDlcdTMwRTJcdTMwQzdcdTMwRUJcIiwgW3RlbXBsYXRlKFwiXHU2OTZEXHU1MkQ5XHUzMEQ3XHUzMEVEXHUzMEJCXHUzMEI5XHU0RUQ1XHU2OUQ4XCIsIFwiYnBzXCIpXSksXG5dO1xuXG5jb25zdCBleHRlcm5hbElmVGVtcGxhdGVzID0gW3RlbXBsYXRlWWFtbChcIlx1NTkxNlx1OTBFOFx1MzBCM1x1MzBERVx1MzBGM1x1MzBDOVx1OTAyM1x1NjQzQVx1NEVENVx1NjlEOFwiLCBcImlmeC1jbWRcIildO1xuXG5jb25zdCBvcGVyYXRpb25zVGVtcGxhdGVzID0gW3RlbXBsYXRlKFwiXHU5MDRCXHU3NTI4XHU2MjRCXHU5ODA2XCIsIFwib3ByXCIpXTtcblxuLy8gXHUzMEI1XHUzMEE0XHUzMEM5XHUzMEQwXHUzMEZDXHUzMDZFXHU4ODY4XHU3OTNBXHU1NDBEXHUzMDZGXHU1QkZFXHU4QzYxXHUzMERBXHUzMEZDXHUzMEI4XHUzMDZFIEgxIFx1MzA2Qlx1NjNDM1x1MzA0OFx1MzA4Qlx1MzAwMmd1aWRlIFx1MzA2OCBwaGlsb3NvcGh5IFx1MzA2Rlx1MzBCMFx1MzBFQlx1MzBGQ1x1MzBEN1x1OTE0RFx1NEUwQlx1MzA2N1xuLy8gXHU3QTJFXHU1MjI1XHUzMDRDXHU4MUVBXHU2NjBFXHUzMDZBXHUzMDVGXHUzMDgxXHU2M0E1XHU1QzNFXHU4RjlFXHVGRjA4XHUzMDBDXHUzMEFDXHUzMEE0XHUzMEM5XHUzMDBEXHUzMDBDXHUzMDZFXHU4MDAzXHUzMDQ4XHU2NUI5XHUzMDBEXHVGRjA5XHUzMDkyXHU4NDNEXHUzMDY4XHUzMDU3XHUzMDAxcmVmZXJlbmNlIFx1MzA2RiBIMSBcdTMwOTJcdTMwNURcdTMwNkVcdTMwN0VcdTMwN0VcdTRGN0ZcdTMwNDZcdTMwMDJcbi8vIFx1MzBBRlx1MzBFQVx1MzBDM1x1MzBBRlx1NTI0RFx1NUY4Q1x1MzA2N1x1MzBCRlx1MzBBNFx1MzBDOFx1MzBFQlx1MzA0Q1x1NTkwOVx1MzA4Rlx1MzA4OVx1MzA2QVx1MzA0NFx1MzA4OFx1MzA0Nlx1MzA2Qlx1MzA1OVx1MzA4Qlx1MzA1Rlx1MzA4MVx1MzAwMUgxIFx1MzA5Mlx1NTkwOVx1NjZGNFx1MzA1N1x1MzA1Rlx1MzA4OVx1MzA1M1x1MzA1M1x1MzA4Mlx1NTQwOFx1MzA4Rlx1MzA1Qlx1MzA2Nlx1NjZGNFx1NjVCMFx1MzA1OVx1MzA4Qlx1MzAwMlxuLy8gcnVsZWJvb2sgLyByZWNpcGUgLyBzYW1wbGUgLyB0ZW1wbGF0ZSBcdTMwODJcdTMwQjBcdTMwRUJcdTMwRkNcdTMwRDdcdTkxNERcdTRFMEJcdTMwNjdcdTdBMkVcdTUyMjVcdTMwNENcdTgxRUFcdTY2MEVcdTMwNkFcdTMwNUZcdTMwODFcdTMwMDFcdTYzQTVcdTVDM0VcdThGOUVcdTMwODRcbi8vIFx1MzBCNVx1MzBENlx1MzBCRlx1MzBBNFx1MzBDOFx1MzBFQlx1RkYwOFx1NEY4QjogXHUzMDBDXHU0RjVDXHU2MjEwXHUzMEVCXHUzMEZDXHUzMEVCXHUzMDBEXHUzMDBDXHU0RjVDXHU2MjEwXHUzMEVDXHUzMEI3XHUzMEQ0XHUzMDBEXHUzMDBDOiBcdTk5QzRcdTgzRDNcdTVCNTBcdTVDNEJcdTMwNERcdTMwNkNcdTMwODQuLi5cdTMwMERcdTMwMEM6IF9QUk9KRUNUX05BTUVfXHUzMDBEXHU3QjQ5XHVGRjA5XG4vLyBcdTMwOTJcdTg0M0RcdTMwNjhcdTMwNTdcdTMwNjZcdTVCRkVcdThDNjFcdTYyMTBcdTY3OUNcdTcyNjlcdTMwNkVcdTU0MERcdTc5RjBcdTMwNkJcdTYzQzNcdTMwNDhcdTMwMDFcdTYyMTBcdTY3OUNcdTcyNjlcdTMwNTRcdTMwNjhcdTMwNkJcdTc2RjhcdTRFOTJcdTMwNkJcdThGQkZcdTMwOEFcdTMwODRcdTMwNTlcdTMwNEZcdTMwNTlcdTMwOEJcdTMwMDJcbmV4cG9ydCBjb25zdCBzcGVjZG9qb1NpZGViYXJJdGVtcyA9IFtcbiAge1xuICAgIHRleHQ6IFwiXHUzMEFDXHUzMEE0XHUzMEM5XCIsXG4gICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICBpdGVtczogW1xuICAgICAgZ3JvdXAoXG4gICAgICAgIFwiXHUzMDZGXHUzMDU4XHUzMDgxXHUzMDZCXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBndWlkZShcIlx1NTE2OFx1NEY1M1x1Njk4Mlx1ODk4MVwiLCBcInNwZWNkb2pvLW92ZXJ2aWV3LWd1aWRlXCIpLFxuICAgICAgICAgIGd1aWRlKFwiUXVpY2sgU3RhcnRcIiwgXCJxdWljay1zdGFydC1ndWlkZVwiKSxcbiAgICAgICAgICBndWlkZShcIlx1MzBFNlx1MzBGQ1x1MzBCOVx1MzBCMVx1MzBGQ1x1MzBCOVx1NTIyNVwiLCBcInVzZS1jYXNlLWd1aWRlXCIpLFxuICAgICAgICAgIGd1aWRlKFwiXHUzMEM5XHUzMEFEXHUzMEU1XHUzMEUxXHUzMEYzXHUzMEM4XHU2OUNCXHU2MjEwXCIsIFwiZG9jcy1zdHJ1Y3R1cmUtZ3VpZGVcIiksXG4gICAgICAgIF0sXG4gICAgICAgIGZhbHNlLFxuICAgICAgKSxcbiAgICAgIGdyb3VwKFxuICAgICAgICBcIlx1NTc4Qlx1MzA2N1x1NEY1Q1x1MzA4QlwiLFxuICAgICAgICBbXG4gICAgICAgICAgZ3VpZGUoXCJcdTU3OEJcdTMwNkVcdTY5Q0JcdTYyMTBcIiwgXCJwcmFjdGljZS1zeXN0ZW0tY29tcG9zaXRpb24tZ3VpZGVcIiksXG4gICAgICAgICAgZ3VpZGUoXCJcdTVCOUZcdThERjVcdTMwNkVcdTkwMzJcdTMwODFcdTY1QjlcIiwgXCJyeXUtZ3VpZGVcIiksXG4gICAgICAgICAgZ3VpZGUoXCJcdTVCOUZcdThERjVcdTMwNkVcdTU3OEJcdTZEM0JcdTc1MjhcIiwgXCJrYXRhLWd1aWRlXCIpLFxuICAgICAgICAgIGd1aWRlKFwiXHUzMEVDXHUzMEQzXHUzMEU1XHUzMEZDXCIsIFwicmV2aWV3LWd1aWRlXCIpLFxuICAgICAgICBdLFxuICAgICAgICBmYWxzZSxcbiAgICAgICksXG4gICAgICBncm91cChcbiAgICAgICAgXCJcdTYyODBcdTMwNjdcdTU2REVcdTMwNTlcIixcbiAgICAgICAgW1xuICAgICAgICAgIGd1aWRlKFwiXHU5MDQyXHU4ODRDXHUzMDZFXHU2MjgwXHU2RDNCXHU3NTI4XCIsIFwid2F6YS1ndWlkZVwiKSxcbiAgICAgICAgICBndWlkZShcIlx1MzBBQVx1MzBGQ1x1MzBCMVx1MzBCOVx1MzBDOFx1MzBFQ1x1MzBGQ1x1MzBCRlx1MzBGQ1x1OTA0Qlx1NzUyOFwiLCBcIm9yY2hlc3RyYXRvci1vcGVyYXRpb24tZ3VpZGVcIiksXG4gICAgICAgICAgZ3VpZGUoXCJleGVjXHU5MDRCXHU3NTI4XCIsIFwiZXhlYy1vcGVyYXRpb24tZ3VpZGVcIiksXG4gICAgICAgICAgZ3VpZGUoXCJcdTc2N0JcdTkzMzJcdTdDM0ZcdTkwNEJcdTc1MjhcIiwgXCJyZWdpc3Rlci1vcGVyYXRpb24tZ3VpZGVcIiksXG4gICAgICAgICAgZ3JvdXAoXCJTY2hlZHVsZVx1OEEyRFx1OEEwOFx1MzBGQlx1NUI5Rlx1ODg0Q1wiLCBbXG4gICAgICAgICAgICBndWlkZShcIlx1MzBDOFx1MzBFOVx1MzBDM1x1MzBBRlx1OEEyRFx1OEEwOFwiLCBcInRyYWNrLWRlc2lnbi1ndWlkZVwiKSxcbiAgICAgICAgICAgIGd1aWRlKFwiU2NoZWR1bGVcdThBMkRcdThBMDhcIiwgXCJzY2hlZHVsZS1kZXNpZ24tZ3VpZGVcIiksXG4gICAgICAgICAgICBndWlkZShcIlNjaGVkdWxlXHU1QjlGXHU4ODRDXHU5MDRCXHU3NTI4XCIsIFwic2NoZWR1bGUtb3BlcmF0aW9uLWd1aWRlXCIpLFxuICAgICAgICAgIF0pLFxuICAgICAgICAgIGd1aWRlKFwicm91dGluZVx1OTA0Qlx1NzUyOFwiLCBcInJvdXRpbmUtb3BlcmF0aW9uLWd1aWRlXCIpLFxuICAgICAgICAgIGd1aWRlKFwiXHU1RTM4XHU2NjQyXHU3QTNDXHU1MENEXHUzMERCXHUzMEI5XHUzMEM4XHU5MDRCXHU3NTI4XCIsIFwicmVtb3RlLWhvc3QtZGV2ZWxvcG1lbnQtZ3VpZGVcIiksXG4gICAgICAgICAgZ3JvdXAoXCJleGVjXHU1MTcxXHU5MDFBXCIsIFtcbiAgICAgICAgICAgIGd1aWRlKFwiZXhlY1x1OEEyRFx1NUI5QVwiLCBcImV4ZWMtY29uZmlnLWd1aWRlXCIpLFxuICAgICAgICAgICAgZ3VpZGUoXCJwbGFuL3Jlc3VsdFx1MzBFOVx1MzBBNFx1MzBENVx1MzBCNVx1MzBBNFx1MzBBRlx1MzBFQlwiLCBcInBsYW4tcmVzdWx0LWxpZmVjeWNsZS1ndWlkZVwiKSxcbiAgICAgICAgICAgIGd1aWRlKFwiZXhlYyB3b3JrdHJlZVx1OTA0Qlx1NzUyOFwiLCBcImV4ZWMtd29ya3RyZWUtZ3VpZGVcIiksXG4gICAgICAgICAgICBndWlkZShcIlx1MzBENlx1MzBFOVx1MzBGM1x1MzBDMVx1MzBFRlx1MzBGQ1x1MzBBRlx1MzBENVx1MzBFRFx1MzBGQ1wiLCBcImJyYW5jaC13b3JrZmxvdy1ndWlkZVwiKSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgXSxcbiAgICAgICAgZmFsc2UsXG4gICAgICApLFxuICAgICAgZ3JvdXAoXCJcdTRFRDhcdTkzMzJcIiwgW2d1aWRlKFwiXHUzMEM5XHUzMEFEXHUzMEU1XHUzMEUxXHUzMEYzXHUzMEM4XHU3REU4XHU5NkM2XCIsIFwiZG9jcy1lZGl0aW5nLWd1aWRlXCIpXSksXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIHRleHQ6IFwiXHUzMEVBXHUzMEQ1XHUzMEExXHUzMEVDXHUzMEYzXHUzMEI5XCIsXG4gICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICBpdGVtczogW1xuICAgICAgcmVmZXJlbmNlKFwiXHU2MjEwXHU2NzlDXHU3MjY5XHUzMEVBXHUzMEQ1XHUzMEExXHUzMEVDXHUzMEYzXHUzMEI5XCIsIFwiZGVsaXZlcmFibGVzLXJlZmVyZW5jZVwiKSxcbiAgICAgIHJlZmVyZW5jZShcIlx1MzBDN1x1MzBBM1x1MzBFQ1x1MzBBRlx1MzBDOFx1MzBFQVx1MzBFQ1x1MzBBNFx1MzBBMlx1MzBBNlx1MzBDOFx1MzBFQVx1MzBENVx1MzBBMVx1MzBFQ1x1MzBGM1x1MzBCOVwiLCBcImRpcmVjdG9yeS1sYXlvdXQtcmVmZXJlbmNlXCIpLFxuICAgICAgcmVmZXJlbmNlKFwiU3BlY0Rvam9cdThBMkRcdTVCOUFcdTMwRUFcdTMwRDVcdTMwQTFcdTMwRUNcdTMwRjNcdTMwQjlcIiwgXCJzcGVjZG9qby1jb25maWctcmVmZXJlbmNlXCIpLFxuICAgICAgcmVmZXJlbmNlKFwiQ0xJXHUzMEIzXHUzMERFXHUzMEYzXHUzMEM5XHUzMEVBXHUzMEQ1XHUzMEExXHUzMEVDXHUzMEYzXHUzMEI5XCIsIFwiY29tbWFuZC1yZWZlcmVuY2VcIiksXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIC8vIFx1ODk4Rlx1N0QwNFx1MzA2RVx1NTI0RFx1NjNEMFx1MzA2OFx1MzA2QVx1MzA4Qlx1ODAwM1x1MzA0OFx1NjVCOVx1MzAwMlx1NEUwMFx1NUVBNlx1OEFBRFx1MzA4MVx1MzA3MFx1OERCM1x1MzA4QVx1MzA4Qlx1MzA1Rlx1MzA4MVx1MzAwMVx1NUI5Rlx1NTJEOVx1MzA2N1x1NUYxNVx1MzA0RiBndWlkZSAvIHJlZmVyZW5jZSBcdTMwNkVcdTVGOENcdTMwOERcdTMwNzhcdTdGNkVcdTMwNEZcdTMwMDJcbiAgICB0ZXh0OiBcIlx1ODAwM1x1MzA0OFx1NjVCOVwiLFxuICAgIGNvbGxhcHNlZDogdHJ1ZSxcbiAgICBpdGVtczogW1xuICAgICAgcGhpbG9zb3BoeShcIlNwZWNEb2pvXCIsIFwic3BlY2Rvam8tcGhpbG9zb3BoeVwiKSxcbiAgICAgIHBoaWxvc29waHkoXCJcdTg5ODFcdTZDNDJcdTMwNEJcdTMwODlcdTVCOUZcdTg4QzVcdTMwN0VcdTMwNjdcIiwgXCJuZWVkcy10by1pbXBsZW1lbnRhdGlvbi1waGlsb3NvcGh5XCIpLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICB0ZXh0OiBcIlx1MzBFQ1x1MzBCN1x1MzBENFwiLFxuICAgIGNvbGxhcHNlZDogdHJ1ZSxcbiAgICBpdGVtczogW1xuICAgICAgZ3JvdXAoXCJcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcIiwgW1xuICAgICAgICBncm91cChcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1NUI5QVx1N0ZBOVwiLCBwcm9qZWN0RGVmaW5pdGlvblJlY2lwZXMpLFxuICAgICAgICBncm91cChcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1MzBERVx1MzBDRFx1MzBCOFx1MzBFMVx1MzBGM1x1MzBDOFwiLCBwcm9qZWN0TWFuYWdlbWVudFJlY2lwZXMpLFxuICAgICAgXSksXG4gICAgICBncm91cChcIlx1Njk2RFx1NTJEOVx1NEVENVx1NjlEOFwiLCBidXNpbmVzc1NwZWNpZmljYXRpb25SZWNpcGVzKSxcbiAgICAgIGdyb3VwKFwiXHU1OTE2XHU5MEU4SS9GXHU0RUQ1XHU2OUQ4XCIsIGV4dGVybmFsSWZSZWNpcGVzKSxcbiAgICAgIGdyb3VwKFwiXHUzMEEyXHUzMEZDXHUzMEFEXHUzMEM2XHUzMEFGXHUzMEMxXHUzMEUzXCIsIGFyY2hpdGVjdHVyZVJlY2lwZXMpLFxuICAgICAgZ3JvdXAoXCJcdTVCOUZcdTg4NENcIiwgZXhlY1JlY2lwZXMpLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICB0ZXh0OiBcIlx1MzBCNVx1MzBGM1x1MzBEN1x1MzBFQlwiLFxuICAgIGNvbGxhcHNlZDogdHJ1ZSxcbiAgICBpdGVtczogW1xuICAgICAgZ3JvdXAoXCJcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcIiwgW1xuICAgICAgICBncm91cChcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1NUI5QVx1N0ZBOVwiLCBwcm9qZWN0RGVmaW5pdGlvblNhbXBsZXMpLFxuICAgICAgICBncm91cChcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1MzBERVx1MzBDRFx1MzBCOFx1MzBFMVx1MzBGM1x1MzBDOFwiLCBwcm9qZWN0TWFuYWdlbWVudFNhbXBsZXMpLFxuICAgICAgICBncm91cChcIlx1MzBEN1x1MzBFRFx1MzBDMFx1MzBBRlx1MzBDOFx1NTkwOVx1NjZGNFwiLCBwcm9kdWN0Q2hhbmdlU2FtcGxlcyksXG4gICAgICBdKSxcbiAgICAgIGdyb3VwKFwiXHU2OTZEXHU1MkQ5XHU0RUQ1XHU2OUQ4XCIsIGJ1c2luZXNzU3BlY2lmaWNhdGlvblNhbXBsZXMpLFxuICAgICAgZ3JvdXAoXCJcdTU5MTZcdTkwRThJL0ZcdTRFRDVcdTY5RDhcIiwgZXh0ZXJuYWxJZlNhbXBsZXMpLFxuICAgICAgZ3JvdXAoXCJcdTMwQTJcdTMwRkNcdTMwQURcdTMwQzZcdTMwQUZcdTMwQzFcdTMwRTNcIiwgYXJjaGl0ZWN0dXJlU2FtcGxlcyksXG4gICAgICBncm91cChcIlx1MzBCN1x1MzBCOVx1MzBDNlx1MzBFMFx1OEEyRFx1OEEwOFwiLCBzeXN0ZW1EZXNpZ25TYW1wbGVzKSxcbiAgICAgIHNhbXBsZShcIlx1Njk2RFx1NTJEOVx1NTNEN1x1NTE2NVx1Njc2MVx1NEVGNlwiLCBcImJhY1wiKSxcbiAgICAgIGdyb3VwKFwiXHU5NzVFXHU2QTVGXHU4MEZEXHU4OTgxXHU0RUY2XCIsIG5vbkZ1bmN0aW9uYWxSZXF1aXJlbWVudFNhbXBsZXMpLFxuICAgICAgc2FtcGxlKFwiXHUzMEI3XHUzMEI5XHUzMEM2XHUzMEUwXHU1M0Q3XHU1MTY1XHU2NzYxXHU0RUY2XCIsIFwic2FjXCIpLFxuICAgICAgZ3JvdXAoXCJcdTMwQzZcdTMwQjlcdTMwQzhcIiwgdGVzdGluZ1NhbXBsZXMpLFxuICAgICAgZ3JvdXAoXCJcdTc5RkJcdTg4NENcIiwgbWlncmF0aW9uU2FtcGxlcyksXG4gICAgICBncm91cChcIlx1OTA0Qlx1NzUyOFwiLCBvcGVyYXRpb25zU2FtcGxlcyksXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIHRleHQ6IFwiXHUzMEM2XHUzMEYzXHUzMEQ3XHUzMEVDXHUzMEZDXHUzMEM4XCIsXG4gICAgY29sbGFwc2VkOiB0cnVlLFxuICAgIGl0ZW1zOiBbXG4gICAgICBncm91cChcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFwiLCBbXG4gICAgICAgIGdyb3VwKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU1QjlBXHU3RkE5XCIsIHByb2plY3REZWZpbml0aW9uVGVtcGxhdGVzKSxcbiAgICAgICAgZ3JvdXAoXCJcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcdTMwREVcdTMwQ0RcdTMwQjhcdTMwRTFcdTMwRjNcdTMwQzhcIiwgcHJvamVjdE1hbmFnZW1lbnRUZW1wbGF0ZXMpLFxuICAgICAgXSksXG4gICAgICBncm91cChcIlx1Njk2RFx1NTJEOVx1NEVENVx1NjlEOFwiLCBidXNpbmVzc1NwZWNpZmljYXRpb25UZW1wbGF0ZXMpLFxuICAgICAgZ3JvdXAoXCJcdTU5MTZcdTkwRThJL0ZcdTRFRDVcdTY5RDhcIiwgZXh0ZXJuYWxJZlRlbXBsYXRlcyksXG4gICAgICBncm91cChcIlx1OTA0Qlx1NzUyOFwiLCBvcGVyYXRpb25zVGVtcGxhdGVzKSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgdGV4dDogXCJcdTZBMTlcdTZFOTZcIixcbiAgICBjb2xsYXBzZWQ6IHRydWUsXG4gICAgaXRlbXM6IFtcbiAgICAgIHN0YW5kYXJkKFwiXHUzMEM5XHUzMEFEXHUzMEU1XHUzMEUxXHUzMEYzXHUzMEM4SURcdTMwRkJcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdTU0N0RcdTU0MERcIiwgXCJpZC1hbmQtZmlsZS1uYW1pbmctc3RhbmRhcmRcIiksXG4gICAgICBzdGFuZGFyZChcIlx1MzBDOVx1MzBBRFx1MzBFNVx1MzBFMVx1MzBGM1x1MzBDOFx1MzBFMVx1MzBCRlx1NjBDNVx1NTgzMVwiLCBcImRvY3VtZW50LW1ldGFkYXRhLXN0YW5kYXJkXCIpLFxuICAgICAgc3RhbmRhcmQoXCJHaXRcdTMwRDZcdTMwRTlcdTMwRjNcdTMwQzFcdTkwNEJcdTc1MjhcIiwgXCJnaXQtYnJhbmNoaW5nLXN0YW5kYXJkXCIpLFxuICAgICAgc3RhbmRhcmQoXCJcdTMwRUJcdTMwRkNcdTMwRUJcdTMwRDZcdTMwQzNcdTMwQUZcdThBMThcdThGRjBcIiwgXCJydWxlYm9vay1hdXRob3Jpbmctc3RhbmRhcmRcIiksXG4gICAgICBzdGFuZGFyZChcIlx1MzBFQ1x1MzBCN1x1MzBENFx1OEExOFx1OEZGMFwiLCBcInJlY2lwZS1hdXRob3Jpbmctc3RhbmRhcmRcIiksXG4gICAgICBzdGFuZGFyZChcIlx1MzBCNVx1MzBGM1x1MzBEN1x1MzBFQlx1OEExOFx1OEZGMFwiLCBcInNhbXBsZS1hdXRob3Jpbmctc3RhbmRhcmRcIiksXG4gICAgICBzdGFuZGFyZChcIlx1MzBDNlx1MzBGM1x1MzBEN1x1MzBFQ1x1MzBGQ1x1MzBDOFx1OEExOFx1OEZGMFwiLCBcInRlbXBsYXRlLWF1dGhvcmluZy1zdGFuZGFyZFwiKSxcbiAgICAgIHN0YW5kYXJkKFwiXHUzMEFDXHUzMEE0XHUzMEM5XHU4QTE4XHU4RkYwXCIsIFwiZ3VpZGUtYXV0aG9yaW5nLXN0YW5kYXJkXCIpLFxuICAgICAgc3RhbmRhcmQoXCJcdTMwRUFcdTMwRDVcdTMwQTFcdTMwRUNcdTMwRjNcdTMwQjlcdThBMThcdThGRjBcIiwgXCJyZWZlcmVuY2UtYXV0aG9yaW5nLXN0YW5kYXJkXCIpLFxuICAgICAgc3RhbmRhcmQoXCJcdTZBMTlcdTZFOTZcdThBMThcdThGRjBcIiwgXCJzdGFuZGFyZC1hdXRob3Jpbmctc3RhbmRhcmRcIiksXG4gICAgICBzdGFuZGFyZChcIlx1NEVCQVx1MzBGQlx1N0Q0NFx1N0U1NFx1NUI5QVx1N0ZBOVwiLCBcInBlb3BsZS1hbmQtb3JnYW5pemF0aW9uLWRlZmluaXRpb24tc3RhbmRhcmRcIiksXG4gICAgICBzdGFuZGFyZChcIlx1MzBDNlx1MzBCOVx1MzBDOFx1NjU4N1x1NjZGOFx1MzBCOVx1MzBCM1x1MzBGQ1x1MzBEN1wiLCBcInRlc3QtZG9jdW1lbnQtc2NvcGUtc3RhbmRhcmRcIiksXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIHRleHQ6IFwiXHUzMEVCXHUzMEZDXHUzMEVCXCIsXG4gICAgY29sbGFwc2VkOiB0cnVlLFxuICAgIGl0ZW1zOiBbXG4gICAgICBncm91cChcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFwiLCBbXG4gICAgICAgIGdyb3VwKFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU1QjlBXHU3RkE5XCIsIHByb2plY3REZWZpbml0aW9uUnVsZWJvb2tzKSxcbiAgICAgICAgZ3JvdXAoXCJcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcdTMwREVcdTMwQ0RcdTMwQjhcdTMwRTFcdTMwRjNcdTMwQzhcIiwgcHJvamVjdE1hbmFnZW1lbnRSdWxlYm9va3MpLFxuICAgICAgICBncm91cChcIlx1MzBEN1x1MzBFRFx1MzBDMFx1MzBBRlx1MzBDOFx1NTkwOVx1NjZGNFwiLCBwcm9kdWN0Q2hhbmdlUnVsZWJvb2tzKSxcbiAgICAgIF0pLFxuICAgICAgZ3JvdXAoXCJcdTY5NkRcdTUyRDlcdTRFRDVcdTY5RDhcIiwgYnVzaW5lc3NTcGVjaWZpY2F0aW9uUnVsZWJvb2tzKSxcbiAgICAgIGdyb3VwKFwiXHU1OTE2XHU5MEU4SS9GXHU0RUQ1XHU2OUQ4XCIsIGV4dGVybmFsSWZSdWxlYm9va3MpLFxuICAgICAgZ3JvdXAoXCJcdTMwQTJcdTMwRkNcdTMwQURcdTMwQzZcdTMwQUZcdTMwQzFcdTMwRTNcIiwgYXJjaGl0ZWN0dXJlUnVsZWJvb2tzKSxcbiAgICAgIGdyb3VwKFwiXHUzMEI3XHUzMEI5XHUzMEM2XHUzMEUwXHU4QTJEXHU4QTA4XCIsIHN5c3RlbURlc2lnblJ1bGVib29rcyksXG4gICAgICBydWxlYm9vayhcIlx1Njk2RFx1NTJEOVx1NTNEN1x1NTE2NVx1Njc2MVx1NEVGNlwiLCBcImJhY1wiKSxcbiAgICAgIGdyb3VwKFwiXHU5NzVFXHU2QTVGXHU4MEZEXHU4OTgxXHU0RUY2XCIsIG5vbkZ1bmN0aW9uYWxSZXF1aXJlbWVudFJ1bGVib29rcyksXG4gICAgICBydWxlYm9vayhcIlx1MzBCN1x1MzBCOVx1MzBDNlx1MzBFMFx1NTNEN1x1NTE2NVx1Njc2MVx1NEVGNlwiLCBcInNhY1wiKSxcbiAgICAgIGdyb3VwKFwiXHUzMEM2XHUzMEI5XHUzMEM4XCIsIHRlc3RpbmdSdWxlYm9va3MpLFxuICAgICAgZ3JvdXAoXCJcdTc5RkJcdTg4NENcIiwgbWlncmF0aW9uUnVsZWJvb2tzKSxcbiAgICAgIGdyb3VwKFwiXHU5MDRCXHU3NTI4XCIsIG9wZXJhdGlvbnNSdWxlYm9va3MpLFxuICAgIF0sXG4gIH0sXG5dO1xuXG5leHBvcnQgY29uc3QgUFJPSkVDVFNfU0VHTUVOVF9URVhUOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBwcm9qZWN0czogXCJcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcIixcbiAgXCIwMTAtZGVsaXZlcmFibGVzLWNhdGFsb2dcIjogXCJcdTYyMTBcdTY3OUNcdTcyNjlcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjBcIixcbiAgXCIwMjAtcHJvamVjdC1kZWZpbml0aW9uXCI6IFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU1QjlBXHU3RkE5XCIsXG4gIFwiMDMwLXByb2plY3QtbWFuYWdlbWVudFwiOiBcIlx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1MzBERVx1MzBDRFx1MzBCOFx1MzBFMVx1MzBGM1x1MzBDOFwiLFxuICBcIjA0MC1wcm9kdWN0LWNoYW5nZVwiOiBcIlx1MzBEN1x1MzBFRFx1MzBDMFx1MzBBRlx1MzBDOFx1NTkwOVx1NjZGNFwiLFxuICBjb250cm9sczogXCJcdTdCQTFcdTc0MDZcdTUzRjBcdTVFMzNcdTMwRkJcdTdCQTFcdTc0MDZcdTMwRDNcdTMwRTVcdTMwRkNcIixcbiAgXCJwcm9qZWN0LXJlZ2lzdGVyXCI6IFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU3NjdCXHU5MzMyXHU3QzNGXCIsXG4gIHJlcG9ydGluZzogXCJcdTMwRUNcdTMwRERcdTMwRkNcdTMwQzhcIixcbiAgXCJwcm9ncmVzcy1yZXBvcnRzXCI6IFwiXHU5MDMyXHU2MzU3XHU1ODMxXHU1NDRBXCIsXG4gIFwibWVldGluZy1taW51dGVzXCI6IFwiXHU4QjcwXHU0RThCXHU5MzMyXCIsXG4gIGV4ZWN1dGlvbjogXCJcdTVCOUZcdTg4NENcdTdCQTFcdTc0MDZcIixcbiAgZXhlYzogXCJcdTVCOUZcdTg4NENcdTMwRUZcdTMwRkNcdTMwQUZcdTMwQjlcdTMwREFcdTMwRkNcdTMwQjlcIixcbiAgZXZlbnRzOiBcIlx1MzBBNFx1MzBEOVx1MzBGM1x1MzBDOFx1MzBFRFx1MzBCMFwiLFxuICBwbGFuczogXCJcdTVCOUZcdTg4NENcdTMwRDdcdTMwRTlcdTMwRjNcIixcbiAgcmVzdWx0czogXCJcdTVCOUZcdTg4NENcdTdENTBcdTY3OUNcIixcbiAgZ2VuZXJhdGVkOiBcIlx1NzUxRlx1NjIxMFx1NzI2OVwiLFxuICByZXZpZXdzOiBcIlx1MzBFQ1x1MzBEM1x1MzBFNVx1MzBGQ1wiLFxuICBzY2hlZHVsZTogXCJcdTMwQjlcdTMwQjFcdTMwQjhcdTMwRTVcdTMwRkNcdTMwRUJcIixcbiAgcm91dGluZXM6IFwiXHUzMEVCXHUzMEZDXHUzMEMxXHUzMEYzXCIsXG4gIFwiMDEwLWFzLWlzXCI6IFwiXHU3M0ZFXHU3MkI2XHU1QjlBXHU3RkE5XCIsXG4gIFwiMDEwLWJ1c2luZXNzLXNwZWNpZmljYXRpb25zXCI6IFwiXHU2OTZEXHU1MkQ5XHU0RUQ1XHU2OUQ4XCIsXG4gIFwiMDIwLWltcGFjdC1hbmFseXNpc1wiOiBcIlx1NUY3MVx1OTdGRlx1OEFCRlx1NjdGQlwiLFxuICBcIjAzMC10cmFjZWFiaWxpdHlcIjogXCJcdTMwQzhcdTMwRUNcdTMwRkNcdTMwQjVcdTMwRDNcdTMwRUFcdTMwQzZcdTMwQTNcIixcbiAgXCIwNDAtbWlncmF0aW9uXCI6IFwiXHU3OUZCXHU4ODRDXCIsXG4gIC8vIFx1OTc1RVx1NjNBOFx1NTk2OFx1NTMxNlx1MzA1N1x1MzA1Rlx1NjIxMFx1Njc5Q1x1NzI2OVx1MzBENVx1MzBBMVx1MzBBNFx1MzBFQlx1MzA2RVx1N0Y2RVx1MzA0RFx1NTgzNFx1NjI0MFx1RkYwOGlkLWFuZC1maWxlLW5hbWluZy1zdGFuZGFyZC5tZCA5LjFcdUZGMDlcdTMwMDJcbiAgdHJhc2g6IFwiXHU1RUMzXHU2QjYyXHU2RTA4XHUzMDdGXCIsXG59O1xuXG5leHBvcnQgY29uc3QgUFJPSkVDVFNfRklMRV9URVhUOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBpbmRleDogXCJcdTRFMDBcdTg5QTdcIixcbiAgXCJ0YXNrLWNhdGFsb2dcIjogXCJcdTMwQkZcdTMwQjlcdTMwQUZcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjBcIixcbn07XG5cbi8vIGRvY3MvamEvcHJvZHVjdCBcdTkxNERcdTRFMEJcdTMwNkVcdTMwQzdcdTMwQTNcdTMwRUNcdTMwQUZcdTMwQzhcdTMwRUFcdTU0MEQgXHUyMTkyIFx1MzBCNVx1MzBBNFx1MzBDOVx1MzBEMFx1MzBGQ1x1ODg2OFx1NzkzQVx1NTQwRFx1RkYwOFx1NjVFNVx1NjcyQ1x1OEE5RVx1NTMxNlx1RkYwOVx1MzAwMlxuZXhwb3J0IGNvbnN0IFBST0RVQ1RfU0VHTUVOVF9URVhUOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBwcm9kdWN0OiBcIlx1MzBEN1x1MzBFRFx1MzBDMFx1MzBBRlx1MzBDOFwiLFxuICBcIjAxMC1idXNpbmVzcy1zcGVjc1wiOiBcIlx1Njk2RFx1NTJEOVx1NEVENVx1NjlEOFwiLFxuICBcIjAxMC1kYXRhLWZsb3dcIjogXCJcdTY5ODJcdTVGRjVcdTMwQzdcdTMwRkNcdTMwQkZcdTMwRDVcdTMwRURcdTMwRkNcIixcbiAgXCIwMzAtYXJjaGl0ZWN0dXJlXCI6IFwiXHUzMEEyXHUzMEZDXHUzMEFEXHUzMEM2XHUzMEFGXHUzMEMxXHUzMEUzXCIsXG4gIFwiMDIwLWluZnJhc3RydWN0dXJlXCI6IFwiXHUzMEE0XHUzMEYzXHUzMEQ1XHUzMEU5XHUzMEZCXHU2MjgwXHU4ODUzXHU5MDc4XHU1QjlBXCIsXG4gIFwiMDQwLXN5c3RlbS1kZXNpZ25cIjogXCJcdTMwQjdcdTMwQjlcdTMwQzZcdTMwRTBcdThBMkRcdThBMDhcIixcbiAgLy8gXHU5NzVFXHU2M0E4XHU1OTY4XHU1MzE2XHUzMDU3XHUzMDVGXHU2MjEwXHU2NzlDXHU3MjY5XHUzMEQ1XHUzMEExXHUzMEE0XHUzMEVCXHUzMDZFXHU3RjZFXHUzMDREXHU1ODM0XHU2MjQwXHVGRjA4aWQtYW5kLWZpbGUtbmFtaW5nLXN0YW5kYXJkLm1kIDkuMVx1RkYwOVx1MzAwMlxuICB0cmFzaDogXCJcdTVFQzNcdTZCNjJcdTZFMDhcdTMwN0ZcIixcbn07XG5cbi8vIGRvY3MvamEvcHJvZHVjdCBcdTkxNERcdTRFMEJcdTMwNkVcdTY1RTJcdTc3RTVcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdTMwNkVcdTMwRTFcdTMwQ0JcdTMwRTVcdTMwRkNcdTg4NjhcdTc5M0FcdUZGMDhQUk9KRUNUU19GSUxFX01FTlUgXHUzMDY4XHU1NDBDXHUzMDU4XHU0RUQ1XHU3RDQ0XHUzMDdGXHVGRjA5XHUzMDAyXG4vLyB0ZXh0OiBcdTUxNjhcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdTUxNzFcdTkwMUFcdTMwNkVcdTMwMENcdTY5ODJcdTVGRjVcdTMwQzdcdTMwRkNcdTMwQkZcdTMwRDVcdTMwRURcdTMwRkNcdTU2RjNcdUZGMDguLi5cdUZGMDk6IFNwZWNEb2pvXHUzMDBEXHUzMDY4XHUzMDQ0XHUzMDQ2IEgxIFx1MzA2Rlx1NTE5N1x1OTU3N1x1MzA2QVx1MzA1Rlx1MzA4MVx1MzAwMVxuLy8gXHU1NkZBXHU1QjlBXHUzMDZFXHU3N0VEXHUzMDQ0XHU4ODY4XHU3OTNBXHU1NDBEXHVGRjA4SDEgXHUzMDg4XHUzMDhBXHU1MTJBXHU1MTQ4XHVGRjA5XHUzMDZCXHUzMDU5XHUzMDhCXHUzMDAyXG4vLyBvcmRlcjogY2RmZC1vdmVydmlldyBcdTMwOTJcdTUxNDhcdTk4MkRcdTMwMDFcdTdEOUFcdTMwNTFcdTMwNjZcdTdDRkJcdTdENzFcdTUyMjVcdTMwNkVcdThBNzNcdTdEMzBcdUZGMDhyZWdpc3RlciBcdTdDRkJcdTMwRkJzY2hlZHVsZSBcdTdDRkJcdTMwRkJyb3V0aW5lIFx1N0NGQlx1RkYwOVx1MzA5Mlx1NEUyNlx1MzA3OVx1MzA4Qlx1RkYwOFBKUi1TSlFDXHVGRjA5XHUzMDAyXG4vLyBcdTVFQzNcdTZCNjJcdTZFMDhcdTMwN0ZcdUZGMDh0cmFzaFx1RkYwOVx1MzA2RVx1NjVFN1x1NjU4N1x1NjZGOFx1MzA2Rlx1MzAwMVx1NjVFN1x1NEY1M1x1N0NGQlx1MzA1NFx1MzA2OFx1MzA2Qlx1MzA3RVx1MzA2OFx1MzA4MVx1MzA2Nlx1NUY4Q1x1MzA4RFx1MzA3OFx1NEUyNlx1MzA3OVx1MzA4Qlx1MzAwMlxuZXhwb3J0IGNvbnN0IFBST0RVQ1RfRklMRV9NRU5VOiBSZWNvcmQ8c3RyaW5nLCB7IHRleHQ6IHN0cmluZzsgb3JkZXI/OiBudW1iZXIgfT4gPSB7XG4gIFwiY2RmZC1vdmVydmlld1wiOiB7IHRleHQ6IFwiXHU1MTY4XHU0RjUzXHU2OTgyXHU4OTgxXCIsIG9yZGVyOiAwIH0sXG4gIFwiY2RmZC11Yy1yZWdpc3RlclwiOiB7IHRleHQ6IFwicmVnaXN0ZXIgXHU3Q0ZCXCIsIG9yZGVyOiAxIH0sXG4gIFwiY2RmZC11Yy1zY2hlZHVsZVwiOiB7IHRleHQ6IFwic2NoZWR1bGUgXHU3Q0ZCXCIsIG9yZGVyOiAyIH0sXG4gIFwiY2RmZC11Yy1yb3V0aW5lXCI6IHsgdGV4dDogXCJyb3V0aW5lIFx1N0NGQlwiLCBvcmRlcjogMyB9LFxuICAvLyBcdTVFQzNcdTZCNjJcdTZFMDhcdTMwN0ZcdUZGMDhQSlItU0pRQ1x1RkYwOVx1MzAwMlx1MzBEN1x1MzBFRFx1MzBCQlx1MzBCOVx1MzBCMFx1MzBFQlx1MzBGQ1x1MzBEN1x1NTIyNSBDREZEIFx1MzA2OFx1MzAwMWNkZmQtdWMtc2NoZWR1bGUgXHUzMDZCXHU1RjE1XHUzMDREXHU3RDk5XHUzMDQ0XHUzMDYwXHU2NUU3XHUzMEU2XHUzMEZDXHUzMEI5XHUzMEIxXHUzMEZDXHUzMEI5XHU1MjI1IENERkRcdTMwMDJcbiAgXCJjZGZkLW9uYm9hcmRpbmdcIjogeyB0ZXh0OiBcIlx1RkYwOFx1NjVFN1x1RkYwOU9uYm9hcmRpbmdcdUZGMDhQLTAxXHVGRjA5XCIsIG9yZGVyOiAyMDAgfSxcbiAgXCJjZGZkLXBsYW5cIjogeyB0ZXh0OiBcIlx1RkYwOFx1NjVFN1x1RkYwOVBsYW5cdUZGMDhQLTAyXHUzMDFDUC0wNlx1RkYwOVwiLCBvcmRlcjogMjEwIH0sXG4gIFwiY2RmZC1kb1wiOiB7IHRleHQ6IFwiXHVGRjA4XHU2NUU3XHVGRjA5RG9cdUZGMDhQLTA3XHVGRjA5XCIsIG9yZGVyOiAyMjAgfSxcbiAgXCJjZGZkLWNoZWNrXCI6IHsgdGV4dDogXCJcdUZGMDhcdTY1RTdcdUZGMDlDaGVja1x1RkYwOFAtMDhcdTMwMUNQLTEwXHVGRjA5XCIsIG9yZGVyOiAyMzAgfSxcbiAgXCJjZGZkLWFjdGlvblwiOiB7IHRleHQ6IFwiXHVGRjA4XHU2NUU3XHVGRjA5QWN0aW9uXHVGRjA4UC0xMVx1MzAxQ1AtMTNcdUZGMDlcIiwgb3JkZXI6IDI0MCB9LFxuICBcImNkZmQtb3JjaGVzdHJhdG9yXCI6IHsgdGV4dDogXCJcdUZGMDhcdTY1RTdcdUZGMDlPcmNoZXN0cmF0b3JcdUZGMDhQLTE0XHVGRjA5XCIsIG9yZGVyOiAyNTAgfSxcbiAgXCJjZGZkLXVjLWRlbGl2ZXJhYmxlXCI6IHsgdGV4dDogXCJcdUZGMDhcdTY1RTdcdUZGMDlcdTYyMTBcdTY3OUNcdTcyNjlcdTMwNkVcdTRGNUNcdTYyMTBcdTMwNEJcdTMwODlcdTVCOENcdTRFODZcdTMwN0VcdTMwNjdcIiwgb3JkZXI6IDI2MCB9LFxuICBcImNkZmQtaW5pdFwiOiB7IHRleHQ6IFwiXHU1MjFEXHU2NzFGXHUzMEJCXHUzMEMzXHUzMEM4XHUzMEEyXHUzMEMzXHUzMEQ3XHVGRjA4UC0wMVx1RkYwOVwiLCBvcmRlcjogMTAgfSxcbiAgXCJjZGZkLXJlZ2lzdGVyLWxpZmVjeWNsZVwiOiB7IHRleHQ6IFwiXHU3NjdCXHU5MzMyXHU3QzNGXHUzMEU5XHUzMEE0XHUzMEQ1XHUzMEI1XHUzMEE0XHUzMEFGXHUzMEVCXHVGRjA4UC0wMlx1RkYwOVwiLCBvcmRlcjogMjAgfSxcbiAgXCJjZGZkLWNhdGFsb2ctcGxhbm5pbmdcIjogeyB0ZXh0OiBcIlx1OEEwOFx1NzUzQlx1NUM1NVx1OTU4Qlx1RkYwOFAtMDNcdUZGMDlcIiwgb3JkZXI6IDMwIH0sXG4gIFwiY2RmZC10YXNrLWV4ZWN1dGlvblwiOiB7IHRleHQ6IFwiXHUzMEJGXHUzMEI5XHUzMEFGXHU1QjlGXHU4ODRDXHVGRjA4UC0wNFx1RkYwOVwiLCBvcmRlcjogNDAgfSxcbiAgXCJjZGZkLXJvdXRpbmVcIjogeyB0ZXh0OiBcIlx1NUI5QVx1NjcxRlx1NTFFNlx1NzQwNlx1RkYwOFAtMDVcdUZGMDlcIiwgb3JkZXI6IDUwIH0sXG4gIFwiY2RmZC1tdWx0aS1wcm9qZWN0XCI6IHsgdGV4dDogXCJcdTRFMjZcdTg4NENcdTUxRTZcdTc0MDZcdUZGMDhQLTA2XHVGRjA5XCIsIG9yZGVyOiA2MCB9LFxuICBcImNkZmQtYWdlbnQtY29uZmlnLW9wZXJhdGlvblwiOiB7IHRleHQ6IFwiXHU2OUNCXHU2MjEwXHU1OTA5XHU2NkY0XHVGRjA4UC0wN1x1RkYwOVwiLCBvcmRlcjogNzAgfSxcbiAgXCJjZGZkLWRlcml2ZWQtY29udGVudFwiOiB7IHRleHQ6IFwiXHU2RDNFXHU3NTFGXHU3NTFGXHU2MjEwXHVGRjA4UC0wOFx1RkYwOVwiLCBvcmRlcjogODAgfSxcbiAgXCJjZGZkLXJlcG9ydGluZ1wiOiB7IHRleHQ6IFwiXHU1ODMxXHU1NDRBXHVGRjA4UC0wOVx1RkYwOVwiLCBvcmRlcjogOTAgfSxcbiAgXCJjZGZkLWRlcHJlY2F0aW9uXCI6IHsgdGV4dDogXCJcdTk3NUVcdTYzQThcdTU5NjhcdTUzMTZcdTMwRkJcdTRGRERcdTdCQTFcdUZGMDhQLTEwXHVGRjA5XCIsIG9yZGVyOiAxMDAgfSxcbiAgLy8gXHU1RUMzXHU2QjYyXHU2RTA4XHUzMDdGXHVGRjA4aWQtYW5kLWZpbGUtbmFtaW5nLXN0YW5kYXJkLm1kIDkuMiBcdTdENENcdThERUZCXHVGRjA5XHUzMDAyY2RmZC1yZWdpc3Rlci1saWZlY3ljbGUgXHUzMDZFXHU1RjhDXHU3RDk5XHUzMDZCXG4gIC8vIFx1NzlGQlx1ODg0Q1x1NkUwOFx1MzA3Rlx1MzA2MFx1MzA0Q1x1MzAwMVNjaGVkdWxlIFx1MzA2RVx1OTA0RVx1NTNCQlx1MzBCRlx1MzBCOVx1MzBBRklEXHU1M0MyXHU3MTY3XHU2NTc0XHU1NDA4XHU2MDI3XHUzMDZFXHUzMDVGXHUzMDgxXHUzMEQ1XHUzMEExXHUzMEE0XHUzMEVCXHUzMDZGXHU3REFEXHU2MzAxXHUzMDU5XHUzMDhCXHUzMDAyXG4gIFwiY2RmZC1yZWdpc3Rlci1vcGVyYXRpb25cIjogeyB0ZXh0OiBcIlx1NzY3Qlx1OTMzMlx1N0MzRlx1OTA0Qlx1NzUyOFx1RkYwOFx1NUVDM1x1NkI2Mlx1MzBGQlx1NjVFN1x1NzI0OFx1RkYwOVwiLCBvcmRlcjogOTk5IH0sXG59O1xuXG4vLyBcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcdTkxNERcdTRFMEJcdTMwNkVcdTY1RTJcdTc3RTVcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdTMwNkVcdTMwRTFcdTMwQ0JcdTMwRTVcdTMwRkNcdTg4NjhcdTc5M0FcdUZGMDhcdTZBMTlcdTZFOTZcdTYyMTBcdTY3OUNcdTcyNjlcdTMwNjhcdTc1MUZcdTYyMTBcdTMwRDNcdTMwRTVcdTMwRkNcdUZGMDlcdTMwMDJcbi8vIHRleHQ6IEgxIFx1MzA2RVx1MzAwQ1x1MzBCRlx1MzBBNFx1MzBDOFx1MzBFQjogPFx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1NTQwRD5cdTMwMERcdTVGNjJcdTVGMEZcdTMwODRcdTgyRjFcdThBOUUgSDEgXHUzMDg4XHUzMDhBXHU3N0VEXHUzMDQ0XHU1NkZBXHU1QjlBXHU4ODY4XHU3OTNBXHU1NDBEXHVGRjA4SDEgXHUzMDg4XHUzMDhBXHU1MTJBXHU1MTQ4XHVGRjA5XHUzMDAyXG4vLyBvcmRlcjogXHU1NDBDXHU0RTAwXHUzMEM3XHUzMEEzXHUzMEVDXHUzMEFGXHUzMEM4XHUzMEVBXHU1MTg1XHUzMDY3XHUzMDZFXHU4ODY4XHU3OTNBXHU5ODA2XHUzMDAyXHUzMEQ1XHUzMEExXHUzMEE0XHUzMEVCXHU1NDBEXHU5ODA2XHUzMDY3XHUzMDZGXHUzMDZBXHUzMDRGXHU0RjVDXHU2MjEwXHU5ODA2XHUzMEZCXHU2OTFDXHU4QTBFXHU5ODA2XG4vLyBcdUZGMDh0cmFjay1kZXNpZ24tZ3VpZGVcdUZGMDlcdTMwODRcdTUzQzJcdTcxNjdcdTk4M0JcdTVFQTZcdTMwNkJcdTU0MDhcdTMwOEZcdTMwNUJcdTMwOEJcdTMwMDJcdTY3MkFcdTc2N0JcdTkzMzJcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdTMwNkZcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdTU0MERcdTk4MDZcdTMwNjdcdTVGOENcdTdEOUFcdTMwNkJcdTRFMjZcdTMwNzZcdTMwMDJcbi8vIG9yZGVyIFx1MzA5Mlx1NzcwMVx1NzU2NVx1MzA1N1x1MzA1Rlx1MzBENVx1MzBBMVx1MzBBNFx1MzBFQlx1MzA2Rlx1NjVFMlx1NUI5QVx1MzA2RVx1NEUyNlx1MzA3M1x1RkYwOFJFQURNRSBcdTMwNkZcdTUxNDhcdTk4MkRcdUZGMDlcdTMwNkJcdTVGOTNcdTMwNDZcdTMwMDJcbmV4cG9ydCBjb25zdCBQUk9KRUNUU19GSUxFX01FTlU6IFJlY29yZDxzdHJpbmcsIHsgdGV4dDogc3RyaW5nOyBvcmRlcj86IG51bWJlciB9PiA9IHtcbiAgUkVBRE1FOiB7IHRleHQ6IFwiXHU2OTgyXHU4OTgxXCIgfSxcbiAgLy8gMDEwLWRlbGl2ZXJhYmxlcy1jYXRhbG9nXG4gIFwiZGN0LWluZGV4XCI6IHsgdGV4dDogXCJcdTYyMTBcdTY3OUNcdTcyNjlcdTMwQUJcdTMwQkZcdTMwRURcdTMwQjBcdTMwNkVcdTdEMjJcdTVGMTVcIiwgb3JkZXI6IDEwIH0sXG4gIFwiZGN0LXByb2plY3QtZGVmaW5pdGlvblwiOiB7IHRleHQ6IFwiXHU2MjEwXHU2NzlDXHU3MjY5XHUzMEFCXHUzMEJGXHUzMEVEXHUzMEIwXHVGRjA4XHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU1QjlBXHU3RkE5XHVGRjA5XCIsIG9yZGVyOiAyMCB9LFxuICBcImRjdC1wcm9qZWN0LW1hbmFnZW1lbnRcIjogeyB0ZXh0OiBcIlx1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFx1RkYwOFx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1MzBERVx1MzBDRFx1MzBCOFx1MzBFMVx1MzBGM1x1MzBDOFx1RkYwOVwiLCBvcmRlcjogMzAgfSxcbiAgXCJkY3QtcGxhbm5pbmdcIjogeyB0ZXh0OiBcIlx1NjIxMFx1Njc5Q1x1NzI2OVx1MzBBQlx1MzBCRlx1MzBFRFx1MzBCMFx1RkYwOFx1OEEwOFx1NzUzQlx1RkYwOVwiLCBvcmRlcjogNDAgfSxcbiAgLy8gMDIwLXByb2plY3QtZGVmaW5pdGlvblxuICBcInByai1vdmVydmlld1wiOiB7IHRleHQ6IFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU2OTgyXHU4OTgxXCIsIG9yZGVyOiAxMCB9LFxuICBcInByai1zdGFrZWhvbGRlci1yZWdpc3RlclwiOiB7IHRleHQ6IFwiXHUzMEI5XHUzMEM2XHUzMEZDXHUzMEFGXHUzMERCXHUzMEVCXHUzMEMwXHUzMEZDXHU3NjdCXHU5MzMyXHU3QzNGXCIsIG9yZGVyOiAyMCB9LFxuICBcInByai1jaGFydGVyXCI6IHsgdGV4dDogXCJcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcdTYxQjJcdTdBRTBcIiwgb3JkZXI6IDMwIH0sXG4gIFwicHJqLXNjb3BlXCI6IHsgdGV4dDogXCJcdTMwRDdcdTMwRURcdTMwQjhcdTMwQTdcdTMwQUZcdTMwQzhcdTMwQjlcdTMwQjNcdTMwRkNcdTMwRDdcIiwgb3JkZXI6IDQwIH0sXG4gIFwicHJqLXN1Y2Nlc3MtY3JpdGVyaWEtYW5kLWFjY2VwdGFuY2UtY3JpdGVyaWFcIjogeyB0ZXh0OiBcIlx1NjIxMFx1NTI5Rlx1NTdGQVx1NkU5Nlx1MzA2OFx1NTNEN1x1NTE2NVx1Njc2MVx1NEVGNlwiLCBvcmRlcjogNTAgfSxcbiAgXCJwcmotaXNzdWVzLWFuZC1hcHByb2FjaFwiOiB7IHRleHQ6IFwiXHU4QUIyXHU5ODRDXHUzMDY4XHU4OUUzXHU2QzdBXHUzMEEyXHUzMEQ3XHUzMEVEXHUzMEZDXHUzMEMxXCIsIG9yZGVyOiA2MCB9LFxuICBcInByai1hc3N1bXB0aW9ucy1jb25zdHJhaW50cy1kZXBlbmRlbmNpZXNcIjogeyB0ZXh0OiBcIlx1NTI0RFx1NjNEMFx1MzBGQlx1NTIzNlx1N0QwNFx1MzBGQlx1NEY5RFx1NUI1OFx1OTVBMlx1NEZDMlwiLCBvcmRlcjogNzAgfSxcbiAgXCJwcmotY29tcGFyaXNvbi1vZi1hbHRlcm5hdGl2ZXNcIjogeyB0ZXh0OiBcIlx1NEVFM1x1NjZGRlx1Njg0OFx1MzA2RVx1NkJENFx1OEYwM1wiLCBvcmRlcjogODAgfSxcbiAgLy8gMDMwLXByb2plY3QtbWFuYWdlbWVudFx1RkYwOFx1N0JBMVx1NzQwNlx1OEEwOFx1NzUzQiBcdTIxOTIgXHU3RDQ0XHU3RTU0XHU0RjUzXHU1MjM2XHUzMDZFXHU5ODA2XHUzMDAyXHU1NDBDXHU0RTAwXHUzMEM3XHUzMEEzXHUzMEVDXHUzMEFGXHUzMEM4XHUzMEVBXHUzMDZBXHUzMDZFXHUzMDY3XHU5MDFBXHUzMDU3XHU3NTZBXHU1M0Y3XHVGRjA5XG4gIFwicG0tcGxhblwiOiB7IHRleHQ6IFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU3QkExXHU3NDA2XHU4QTA4XHU3NTNCXCIsIG9yZGVyOiAxMCB9LFxuICBcInBtLWNvbW11bmljYXRpb24tcGxhblwiOiB7IHRleHQ6IFwiXHUzMEIzXHUzMERGXHUzMEU1XHUzMENCXHUzMEIxXHUzMEZDXHUzMEI3XHUzMEU3XHUzMEYzXHU4QTA4XHU3NTNCXCIsIG9yZGVyOiAyMCB9LFxuICBcInBtLXF1YWxpdHktbWFuYWdlbWVudC1wbGFuXCI6IHsgdGV4dDogXCJcdTU0QzFcdThDRUFcdTdCQTFcdTc0MDZcdThBMDhcdTc1M0JcIiwgb3JkZXI6IDMwIH0sXG4gIFwicG0tcmV2aWV3LXZpZXdwb2ludHNcIjogeyB0ZXh0OiBcIlx1MzBFQ1x1MzBEM1x1MzBFNVx1MzBGQ1x1ODlCM1x1NzBCOVwiLCBvcmRlcjogNDAgfSxcbiAgXCJwbS1vcmdhbml6YXRpb25cIjogeyB0ZXh0OiBcIlx1N0Q0NFx1N0U1NFx1MzA2OFx1MzBFRFx1MzBGQ1x1MzBFQlx1MzA2RVx1NUI5QVx1N0ZBOVwiLCBvcmRlcjogNTAgfSxcbiAgXCJwbS1yb2xlc1wiOiB7IHRleHQ6IFwiXHUzMEVEXHUzMEZDXHUzMEVCXHU1QjlBXHU3RkE5XCIsIG9yZGVyOiA2MCB9LFxuICBcInBtLW1lbWJlcnNcIjogeyB0ZXh0OiBcIlx1MzBFMVx1MzBGM1x1MzBEMFx1MzBGQ1x1NUI5QVx1N0ZBOVwiLCBvcmRlcjogNzAgfSxcbiAgXCJwbS1yYWNpXCI6IHsgdGV4dDogXCJcdTdENDRcdTdFNTRcdTRGNTNcdTUyMzZcdTMwNjhSQUNJXCIsIG9yZGVyOiA4MCB9LFxuICAvLyBjb250cm9sc1xuICBcInBqci1pbmRleFwiOiB7IHRleHQ6IFwiXHUzMEQ3XHUzMEVEXHUzMEI4XHUzMEE3XHUzMEFGXHUzMEM4XHU3NjdCXHU5MzMyXHU1M0YwXHU1RTMzXCIsIG9yZGVyOiAxMCB9LFxuICBcInBqci12aWV3cy1ieS1zdGF0dXNcIjogeyB0ZXh0OiBcIlx1NTNGMFx1NUUzM1x1MzBEM1x1MzBFNVx1MzBGQ1x1RkYwOFx1NzJCNlx1NjE0Qlx1NTIyNVx1RkYwOVwiLCBvcmRlcjogMTEgfSxcbiAgXCJwanItdmlld3MtYnktcHJpb3JpdHlcIjogeyB0ZXh0OiBcIlx1NTNGMFx1NUUzM1x1MzBEM1x1MzBFNVx1MzBGQ1x1RkYwOFx1NTEyQVx1NTE0OFx1NUVBNlx1NTIyNVx1RkYwOVwiLCBvcmRlcjogMTIgfSxcbiAgXCJwanItdmlld3MtYnktb3duZXJcIjogeyB0ZXh0OiBcIlx1NTNGMFx1NUUzM1x1MzBEM1x1MzBFNVx1MzBGQ1x1RkYwOFx1NjJDNVx1NUY1M1x1ODAwNVx1NTIyNVx1RkYwOVwiLCBvcmRlcjogMTMgfSxcbiAgXCJwbS1yaXNrLXJlZ2lzdGVyXCI6IHsgdGV4dDogXCJcdTMwRUFcdTMwQjlcdTMwQUZcdTc2N0JcdTkzMzJcdTdDM0ZcIiwgb3JkZXI6IDEwIH0sXG4gIFwicG0taXNzdWUtbG9nXCI6IHsgdGV4dDogXCJcdThBQjJcdTk4NENcdTMwRURcdTMwQjBcIiwgb3JkZXI6IDIwIH0sXG4gIFwicG0tY2hhbmdlLXJlcXVlc3QtbG9nXCI6IHsgdGV4dDogXCJcdTU5MDlcdTY2RjRcdTg5ODFcdTZDNDJcdTMwRURcdTMwQjBcIiwgb3JkZXI6IDMwIH0sXG4gIFwicG0tZGVjaXNpb24tbG9nXCI6IHsgdGV4dDogXCJcdTYxMEZcdTYwMURcdTZDN0FcdTVCOUFcdTMwRURcdTMwQjBcIiwgb3JkZXI6IDQwIH0sXG4gIC8vIGV4ZWN1dGlvbiAvIGdlbmVyYXRlZFx1RkYwOFx1OTAzMlx1NjM1N1x1MzBEM1x1MzBFNVx1MzBGQ1x1RkYwOVxuICByZWFkeTogeyB0ZXh0OiBcIlx1Nzc0MFx1NjI0Qlx1NTNFRlx1ODBGRFx1MzBCRlx1MzBCOVx1MzBBRlwiLCBvcmRlcjogMTAgfSxcbiAgdGltZWxpbmU6IHsgdGV4dDogXCJcdTMwQkZcdTMwQTRcdTMwRTBcdTMwRTlcdTMwQTRcdTMwRjNcIiwgb3JkZXI6IDIwIH0sXG4gIFwiY3JpdGljYWwtcGF0aFwiOiB7IHRleHQ6IFwiXHUzMEFGXHUzMEVBXHUzMEM2XHUzMEEzXHUzMEFCXHUzMEVCXHUzMEQxXHUzMEI5XCIsIG9yZGVyOiAzMCB9LFxuICBjcG06IHsgdGV4dDogXCJcdTMwQUZcdTMwRUFcdTMwQzZcdTMwQTNcdTMwQUJcdTMwRUJcdTMwRDFcdTMwQjlcdTUyMDZcdTY3OTBcIiwgb3JkZXI6IDQwIH0sXG4gIFwic2NoZWR1bGUtZGlmZlwiOiB7IHRleHQ6IFwiXHUzMEI5XHUzMEIxXHUzMEI4XHUzMEU1XHUzMEZDXHUzMEVCXHU1REVFXHU1MjA2XCIsIG9yZGVyOiA1MCB9LFxuICBkYXNoYm9hcmQ6IHsgdGV4dDogXCJcdTMwQzBcdTMwQzNcdTMwQjdcdTMwRTVcdTMwRENcdTMwRkNcdTMwQzlcIiwgb3JkZXI6IDYwIH0sXG4gIC8vIFx1NUI5Rlx1ODg0Q1x1MzBEN1x1MzBFOVx1MzBGM1x1MzBGQlx1NUI5Rlx1ODg0Q1x1N0Q1MFx1Njc5Q1x1MzA2Rlx1MzBCNVx1MzBBNFx1MzBDOVx1MzBEMFx1MzBGQ1x1MzA2Qlx1OEYwOVx1MzA1Qlx1MzA1QVx1MzAwMVx1MzA1M1x1MzA2RVx1NEUwMFx1ODlBN1x1MzA0Qlx1MzA4OVx1OEZCRlx1MzA4Qlx1MzAwMlxuICBcImV4ZWMtcmVjb3Jkc1wiOiB7IHRleHQ6IFwiXHU1QjlGXHU4ODRDXHU4QTE4XHU5MzMyXHU0RTAwXHU4OUE3XCIsIG9yZGVyOiA3MCB9LFxufTtcblxuLy8gXHUzMEIwXHUzMEVCXHUzMEZDXHUzMEQ3XHVGRjA4XHUzMEVBXHUzMEYzXHUzMEFGXHUzMDZBXHUzMDU3XHVGRjA5XHUzMDZFXHU4ODY4XHU3OTNBXHU5ODA2XHUzMDAyXHUzMEUxXHUzMENCXHUzMEU1XHUzMEZDXHU4ODY4XHU3OTNBXHU1NDBEXHVGRjA4XHU1OTA5XHU2M0RCXHU1RjhDXHVGRjA5XHUzMDkyXHUzMEFEXHUzMEZDXHUzMDZCXHUzMDU5XHUzMDhCXHUzMDAyXG4vLyBcdTY1RTJcdTVCOUFcdTMwNjdcdTMwNkZcdTU0MENcdTRFMDBcdTk2OEVcdTVDNjRcdTMwNkVcdTUxNDhcdTk4MkRcdTMwNkJcdTRFMjZcdTMwNzZcdTMwNUZcdTMwODFcdTMwMDFcdTVGOENcdTMwOERcdTMwNzhcdTUyRDVcdTMwNEJcdTMwNTdcdTMwNUZcdTMwNDRcdTMwQjBcdTMwRUJcdTMwRkNcdTMwRDdcdTMwNkVcdTMwN0ZcdTc2N0JcdTkzMzJcdTMwNTlcdTMwOEJcdTMwMDJcbi8vIFx1MzBEN1x1MzBFRFx1MzBCOFx1MzBBN1x1MzBBRlx1MzBDOFx1NzZGNFx1NEUwQlx1MzA2RVx1NkEyQVx1NjVBRFx1MzBDN1x1MzBBM1x1MzBFQ1x1MzBBRlx1MzBDOFx1MzBFQVx1RkYwOFx1NTNGMFx1NUUzM1x1MzBGQlx1MzBCOVx1MzBCMVx1MzBCOFx1MzBFNVx1MzBGQ1x1MzBFQlx1MzBGQlx1NUI5Rlx1ODg0Q1x1NzJCNlx1NjE0Qlx1RkYwOVx1MzA2Rlx1MzAwMVxuLy8gXHU3NTZBXHU1M0Y3XHU0RUQ4XHUzMDREXHUzMDZFXHU2MjEwXHU2NzlDXHU3MjY5XHUzMEM0XHUzMEVBXHUzMEZDXHVGRjA4XHU2MjEwXHU2NzlDXHU3MjY5XHUzMEFCXHUzMEJGXHUzMEVEXHUzMEIwXHUzMDFDXHUzMEQ3XHUzMEVEXHUzMEMwXHUzMEFGXHUzMEM4XHU1OTA5XHU2NkY0XHVGRjA5XHUzMDZFXHU1RjhDXHUzMDhEXHUzMDZCXHU5MDRCXHU3NTI4XHU5ODA2XHUzMDY3XHU0RTI2XHUzMDc5XHUzMDhCXHUzMDAyXG4vLyBcdTVCOUZcdTg4NENcdTMwRDdcdTMwRTlcdTMwRjNcdTMwRkJcdTVCOUZcdTg4NENcdTdENTBcdTY3OUNcdTMwNkZcdTU5MjdcdTkxQ0ZcdTMwNkVcdTk4MDVcdTc2RUVcdTMwOTJcdTU0MkJcdTMwODBcdTMwNUZcdTMwODFcdTMwMDFcdTkwMzJcdTYzNTdcdTMwRDNcdTMwRTVcdTMwRkNcdTMwNkVcdTVGOENcdTMwOERcdTMwNkJcdTdGNkVcdTMwNEZcdTMwMDJcbmV4cG9ydCBjb25zdCBQUk9KRUNUU19HUk9VUF9PUkRFUjogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHtcbiAgLy8gXHU5NzVFXHU2M0E4XHU1OTY4XHU1MzE2XHUzMDU3XHUzMDVGXHU2NTg3XHU2NkY4XHVGRjA4dHJhc2hcdUZGMDlcdTMwNkZcdTczRkVcdTg4NENcdTMwNkVcdTY1ODdcdTY2RjhcdTMwNkVcdTVGOENcdTMwOERcdTMwNkJcdTdGNkVcdTMwNEZcdTMwMDJcbiAgXHU1RUMzXHU2QjYyXHU2RTA4XHUzMDdGOiA5MDAsXG4gIFwiXHU3QkExXHU3NDA2XHU1M0YwXHU1RTMzXHUzMEZCXHU3QkExXHU3NDA2XHUzMEQzXHUzMEU1XHUzMEZDXCI6IDEwLFxuICBcdTMwQjlcdTMwQjFcdTMwQjhcdTMwRTVcdTMwRkNcdTMwRUI6IDIwLFxuICBcdTMwRUJcdTMwRkNcdTMwQzFcdTMwRjM6IDMwLFxuICBcdTVCOUZcdTg4NENcdTdCQTFcdTc0MDY6IDQwLFxuICBcdTMwRUNcdTMwRERcdTMwRkNcdTMwQzg6IDUwLFxuICBcdTVCOUZcdTg4NENcdTMwRDdcdTMwRTlcdTMwRjM6IDkwLFxuICBcdTVCOUZcdTg4NENcdTdENTBcdTY3OUM6IDk1LFxufTtcblxuLy8gXHUzMEIwXHUzMEVCXHUzMEZDXHUzMEQ3XHU1MzE2XHUzMDVCXHUzMDVBXHUzMDAxXHU1QjUwXHUzMDkyXHU4OUFBXHUzMDY4XHU1NDBDXHU0RTAwXHU5NjhFXHU1QzY0XHUzMDc4XHU1QzU1XHU5NThCXHUzMDU5XHUzMDhCXHUzMEIwXHUzMEVCXHUzMEZDXHUzMEQ3XHVGRjA4XHUzMEUxXHUzMENCXHUzMEU1XHUzMEZDXHU4ODY4XHU3OTNBXHU1NDBEXHVGRjA5XHUzMDAyXG4vLyBcdTMwMENcdTc1MUZcdTYyMTBcdTcyNjlcdTMwMERcdUZGMDhnZW5lcmF0ZWQgXHUzMEQ1XHUzMEE5XHUzMEVCXHUzMEMwXHVGRjA5XHUzMDZGXHU0RTAwXHU4OUE3XHU2MDI3XHUzMDZFXHUzMDVGXHUzMDgxXHUzMDAxXHUzMDBDXHU1QjlGXHU4ODRDXHUzMEVGXHUzMEZDXHUzMEFGXHUzMEI5XHUzMERBXHUzMEZDXHUzMEI5XHUzMDBEXHVGRjA4ZXhlYyBcdTMwRDVcdTMwQTlcdTMwRUJcdTMwQzBcdUZGMDlcdTMwNkZcbi8vIFZpdGVQcmVzcyBcdTMwQjVcdTMwQTRcdTMwQzlcdTMwRDBcdTMwRkNcdTMwNkVcdTYzQ0ZcdTc1M0JcdTZERjFcdTMwNTVcdTRFMEFcdTk2NTBcdTMwOTJcdThEODVcdTMwNDhcdTMwNjZcdTVCOUZcdTg4NENcdTMwRDdcdTMwRTlcdTMwRjNcdTMwRkJcdTVCOUZcdTg4NENcdTdENTBcdTY3OUNcdTMwNENcdTg4NjhcdTc5M0FcdTMwNTVcdTMwOENcdTMwNkFcdTMwNEZcdTMwNkFcdTMwOEJcdTMwNkVcdTMwOTJcdTk2MzJcdTMwNTBcdTMwNUZcdTMwODFcdTMwMDJcbmV4cG9ydCBjb25zdCBGTEFUVEVORURfR1JPVVBfVEVYVFMgPSBuZXcgU2V0KFtcIlx1NzUxRlx1NjIxMFx1NzI2OVwiLCBcIlx1NUI5Rlx1ODg0Q1x1MzBFRlx1MzBGQ1x1MzBBRlx1MzBCOVx1MzBEQVx1MzBGQ1x1MzBCOVwiXSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi93b3Jrc3BhY2VzL3NwZWNkb2pvLXdvcmtzcGFjZS9zcGVjZG9qby9wYWNrYWdlcy9kb2NzLXNpdGUvc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya3NwYWNlcy9zcGVjZG9qby13b3Jrc3BhY2Uvc3BlY2Rvam8vcGFja2FnZXMvZG9jcy1zaXRlL3NyYy9nZW4tbWVybWFpZC1zdmcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS9zcmMvZ2VuLW1lcm1haWQtc3ZnLnRzXCI7aW1wb3J0ICogYXMgZnMgZnJvbSBcIm5vZGU6ZnNcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgZXhlY0ZpbGVTeW5jIH0gZnJvbSBcIm5vZGU6Y2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gXCJub2RlOmNyeXB0b1wiO1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gXCJub2RlOm1vZHVsZVwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJub2RlOnVybFwiO1xuXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgV09SS1NQQUNFX1JPT1QgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5lbnYuU1BFQ0RPSk9fRE9DU19ST09UID8/IHByb2Nlc3MuY3dkKCkpO1xuY29uc3QgUEFDS0FHRV9ST09UID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpLCBcIi4uXCIpO1xuY29uc3QgREVGQVVMVF9ST09UID0gcGF0aC5qb2luKFdPUktTUEFDRV9ST09ULCBcImRvY3NcIik7XG5jb25zdCBERUZBVUxUX09VVF9ESVIgPSBwYXRoLmpvaW4oV09SS1NQQUNFX1JPT1QsIFwiLnZpdGVwcmVzc1wiLCBcIm1lcm1haWRcIik7XG5jb25zdCBQVVBQRVRFRVJfQ09ORklHID0gcGF0aC5qb2luKFBBQ0tBR0VfUk9PVCwgXCJwdXBwZXRlZXItY29uZmlnLmpzb25cIik7XG5jb25zdCBNRVJNQUlEX0NPTkZJRyA9IHBhdGguam9pbihQQUNLQUdFX1JPT1QsIFwibWVybWFpZC1jb25maWcuanNvblwiKTtcbmNvbnN0IE1FUk1BSURfQ0xJID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShyZXF1aXJlLnJlc29sdmUoXCJAbWVybWFpZC1qcy9tZXJtYWlkLWNsaVwiKSksIFwiY2xpLmpzXCIpO1xuY29uc3QgTUVSTUFJRF9DTElfUEtHX1BBVEggPSBwYXRoLmpvaW4oXG4gIHBhdGguZGlybmFtZShyZXF1aXJlLnJlc29sdmUoXCJAbWVybWFpZC1qcy9tZXJtYWlkLWNsaVwiKSksXG4gIFwiLi5cIixcbiAgXCJwYWNrYWdlLmpzb25cIixcbik7XG5jb25zdCBNRVJNQUlEX0NMSV9WRVJTSU9OID0gU3RyaW5nKFxuICAoSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoTUVSTUFJRF9DTElfUEtHX1BBVEgsIFwidXRmOFwiKSkgYXMgeyB2ZXJzaW9uPzogdW5rbm93biB9KS52ZXJzaW9uLFxuKTtcbmNvbnN0IE1FUk1BSURfQ09ORklHX0NPTlRFTlQgPSBmcy5yZWFkRmlsZVN5bmMoTUVSTUFJRF9DT05GSUcsIFwidXRmOFwiKTtcbmNvbnN0IE1FUk1BSURfQ09ORklHX0hBU0ggPSBjcnlwdG8uY3JlYXRlSGFzaChcIm1kNVwiKS51cGRhdGUoTUVSTUFJRF9DT05GSUdfQ09OVEVOVCkuZGlnZXN0KFwiaGV4XCIpO1xuXG4vLyBcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdTUzNThcdTRGNERcdTMwNkVcdTVERUVcdTUyMDZcdTUyMjRcdTVCOUFcdTMwQURcdTMwRTNcdTMwQzNcdTMwQjdcdTMwRTVcdTMwMDJvdXREaXIgXHU5MTREXHU0RTBCXHUzMDZCXHU3RjZFXHUzMDREXHUzMDAxXHU3NTFGXHU2MjEwXHU2RTA4XHUzMDdGIFNWRyBcdTMwNjhcdTRFMDBcdTdERDJcdTMwNkIgZ2l0aWdub3JlIFx1MzA1NVx1MzA4Q1x1MzA4Qlx1MzAwMlxuY29uc3QgTUFOSUZFU1RfRklMRSA9IFwiLm1hbmlmZXN0Lmpzb25cIjtcbmNvbnN0IE1BTklGRVNUX1ZFUlNJT04gPSAxO1xuY29uc3QgU1ZHX05BTUVfUEFUVEVSTiA9IC9eWzAtOWEtZl17OH1cXC5zdmckLztcblxuaW50ZXJmYWNlIE1hbmlmZXN0RW50cnkge1xuICBtdGltZU1zOiBudW1iZXI7XG4gIHNpemU6IG51bWJlcjtcbiAgaGFzaGVzOiBzdHJpbmdbXTtcbiAgLy8gXHU0RTAwXHU5MEU4XHUzMDZFXHU1NkYzXHUzMDRDXHU1OTMxXHU2NTU3XHUzMDU3XHUzMDVGXHUzMEQ1XHUzMEExXHUzMEE0XHUzMEVCXHUzMDZGXHUzMDAxXHU2MjEwXHU1MjlGXHUzMDU3XHUzMDVGXHU1NkYzXHUzMDYwXHUzMDUxXHUzMDkyXHU0RkREXHU2MzAxXHUzMDU3XHUzMDAxXHU2QjIxXHU1NkRFXHUzMDgyXHU1MThEXHU4QTY2XHU4ODRDXHUzMDU5XHUzMDhCXHUzMDAyXG4gIGhhc0Vycm9ycz86IGJvb2xlYW47XG4gIC8vIFx1NjNDRlx1NzUzQlx1MzA2Qlx1NEY3Rlx1MzA2M1x1MzA1RiBtZXJtYWlkLWNsaSBcdTMwNkVcdTcyNDhcdTMwNjggbWVybWFpZC1jb25maWcuanNvbiBcdTMwNkVcdTMwQ0ZcdTMwQzNcdTMwQjdcdTMwRTVcdTMwMDJcbiAgLy8gXHU0RUNBXHUzMDZFXHU1MDI0XHUzMDY4XHU3NTcwXHUzMDZBXHUzMDhCXHUzMEE4XHUzMEYzXHUzMEM4XHUzMEVBXHUzMDZGXHUzMDAxTWFya2Rvd24gXHUzMDRDXHU1OTA5XHUzMDhGXHUzMDYzXHUzMDY2XHUzMDQ0XHUzMDZBXHUzMDRGXHUzMDY2XHUzMDgyXHUzMEI5XHUzMEFEXHUzMEMzXHUzMEQ3XHUzMDZCXHU0RjdGXHUzMDhGXHUzMDZBXHUzMDQ0XHUzMDAyXG4gIG1lcm1haWRDbGlWZXJzaW9uPzogc3RyaW5nO1xuICBtZXJtYWlkQ29uZmlnSGFzaD86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIE1hbmlmZXN0IHtcbiAgdmVyc2lvbjogbnVtYmVyO1xuICBmaWxlczogUmVjb3JkPHN0cmluZywgTWFuaWZlc3RFbnRyeT47XG59XG5cbi8qKlxuICogbWVybWFpZC1jbGkgXHUzMDZFXHU3MjQ4XHUzMEZCbWVybWFpZC1jb25maWcuanNvblx1MzBGQk1lcm1haWRcdTMwQjNcdTMwRkNcdTMwQzlcdTMwNEJcdTMwODlcdTMwQ0ZcdTMwQzNcdTMwQjdcdTMwRTVcdTMwOTJcdTRGNUNcdTMwNjNcdTMwNjZcdTMwMDFTVkdcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdTU0MERcdTMwNkJcdTRGN0ZcdTMwNDZcdTMwMDJcbiAqIFZpdGVQcmVzcyBcdTMwNkUgTWFya2Rvd24gXHU2M0NGXHU3NTNCXHUzMDgyXHU1NDBDXHUzMDU4XHU5NUEyXHU2NTcwXHUzMDY3IFNWRyBcdTU0MERcdTMwOTJcdTZDNDJcdTMwODFcdTMwOEJcdTMwNUZcdTMwODFcdTMwMDFcdTc1MUZcdTYyMTBcdTUwNzRcdTMwNjhcdTUzQzJcdTcxNjdcdTUwNzRcdTMwNENcdTMwNUFcdTMwOENcdTMwNkFcdTMwNDRcdTMwMDJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcm1haWRTdmdJZChjb2RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gY3J5cHRvXG4gICAgLmNyZWF0ZUhhc2goXCJtZDVcIilcbiAgICAudXBkYXRlKGAke01FUk1BSURfQ0xJX1ZFUlNJT059XFxuJHtNRVJNQUlEX0NPTkZJR19DT05URU5UfVxcbiR7Y29kZX1gKVxuICAgIC5kaWdlc3QoXCJoZXhcIilcbiAgICAuc2xpY2UoMCwgOCk7XG59XG5cbmV4cG9ydCB0eXBlIE1lcm1haWRFcnJvck1vZGUgPSBcIndhcm5cIiB8IFwidGhyb3dcIjtcblxuZnVuY3Rpb24gY3JlYXRlTWFuaWZlc3RFbnRyeShzdGF0OiBmcy5TdGF0cywgaGFzaGVzOiBzdHJpbmdbXSwgaGFzRXJyb3JzID0gZmFsc2UpOiBNYW5pZmVzdEVudHJ5IHtcbiAgcmV0dXJuIHtcbiAgICBtdGltZU1zOiBzdGF0Lm10aW1lTXMsXG4gICAgc2l6ZTogc3RhdC5zaXplLFxuICAgIGhhc2hlcyxcbiAgICAuLi4oaGFzRXJyb3JzID8geyBoYXNFcnJvcnM6IHRydWUgfSA6IHt9KSxcbiAgICBtZXJtYWlkQ2xpVmVyc2lvbjogTUVSTUFJRF9DTElfVkVSU0lPTixcbiAgICBtZXJtYWlkQ29uZmlnSGFzaDogTUVSTUFJRF9DT05GSUdfSEFTSCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNSZW5kZXJlZFdpdGhDdXJyZW50U2V0dGluZ3MoZW50cnk6IE1hbmlmZXN0RW50cnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBlbnRyeS5tZXJtYWlkQ2xpVmVyc2lvbiA9PT0gTUVSTUFJRF9DTElfVkVSU0lPTiAmJlxuICAgIGVudHJ5Lm1lcm1haWRDb25maWdIYXNoID09PSBNRVJNQUlEX0NPTkZJR19IQVNIXG4gICk7XG59XG5cbmZ1bmN0aW9uIHN2Z1BhdGhGb3Iob3V0RGlyOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcGF0aC5qb2luKG91dERpciwgYCR7aWR9LnN2Z2ApO1xufVxuXG5mdW5jdGlvbiBtYW5pZmVzdFBhdGgob3V0RGlyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcGF0aC5qb2luKG91dERpciwgTUFOSUZFU1RfRklMRSk7XG59XG5cbmZ1bmN0aW9uIGxvYWRNYW5pZmVzdChvdXREaXI6IHN0cmluZyk6IE1hbmlmZXN0IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByYXcgPSBmcy5yZWFkRmlsZVN5bmMobWFuaWZlc3RQYXRoKG91dERpciksIFwidXRmOFwiKTtcbiAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdykgYXMgUGFydGlhbDxNYW5pZmVzdD47XG4gICAgaWYgKHBhcnNlZC52ZXJzaW9uID09PSBNQU5JRkVTVF9WRVJTSU9OICYmIHBhcnNlZC5maWxlcyAmJiB0eXBlb2YgcGFyc2VkLmZpbGVzID09PSBcIm9iamVjdFwiKSB7XG4gICAgICByZXR1cm4geyB2ZXJzaW9uOiBNQU5JRkVTVF9WRVJTSU9OLCBmaWxlczogcGFyc2VkLmZpbGVzIH07XG4gICAgfVxuICB9IGNhdGNoIHtcbiAgICAvLyBcdTY3MkFcdTc1MUZcdTYyMTBcdTMwRkJcdTc4MzRcdTY0MERcdTY2NDJcdTMwNkZcdTMwRDVcdTMwRUJcdTMwQjlcdTMwQURcdTMwRTNcdTMwRjNcdTMwNkJcdTMwRDVcdTMwQTlcdTMwRkNcdTMwRUJcdTMwRDBcdTMwQzNcdTMwQUZcdTMwNTlcdTMwOEJcbiAgfVxuICByZXR1cm4geyB2ZXJzaW9uOiBNQU5JRkVTVF9WRVJTSU9OLCBmaWxlczoge30gfTtcbn1cblxuZnVuY3Rpb24gc2F2ZU1hbmlmZXN0KG91dERpcjogc3RyaW5nLCBtYW5pZmVzdDogTWFuaWZlc3QpOiB2b2lkIHtcbiAgZnMubWtkaXJTeW5jKG91dERpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gIC8vIFx1MzBENVx1MzBBMVx1MzBBNFx1MzBFQlx1OTgwNlx1MzA5Mlx1NTZGQVx1NUI5QVx1MzA1N1x1MzA2Nlx1NURFRVx1NTIwNlx1MzA5Mlx1NUI4OVx1NUI5QVx1MzA1NVx1MzA1Qlx1MzA4QlxuICBjb25zdCBmaWxlcyA9IE9iamVjdC5rZXlzKG1hbmlmZXN0LmZpbGVzKVxuICAgIC5zb3J0KClcbiAgICAucmVkdWNlPFJlY29yZDxzdHJpbmcsIE1hbmlmZXN0RW50cnk+PigoYWNjLCBrZXkpID0+IHtcbiAgICAgIGFjY1trZXldID0gbWFuaWZlc3QuZmlsZXNba2V5XTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICBmcy53cml0ZUZpbGVTeW5jKFxuICAgIG1hbmlmZXN0UGF0aChvdXREaXIpLFxuICAgIEpTT04uc3RyaW5naWZ5KHsgdmVyc2lvbjogTUFOSUZFU1RfVkVSU0lPTiwgZmlsZXMgfSwgbnVsbCwgMiksXG4gICAgXCJ1dGY4XCIsXG4gICk7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RNZXJtYWlkQmxvY2tzKG1hcmtkb3duOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIC8vIFx1MjcwNSBcdTg4NENcdTk4MkRcdTMwNkUgYGBgbWVybWFpZCAuLi4gYGBgIFx1MzA2MFx1MzA1MVx1MzA5Mlx1NjJGRVx1MzA0NlxuICBjb25zdCBtZXJtYWlkQmxvY2tzID0gWy4uLm1hcmtkb3duLm1hdGNoQWxsKC9eYGBgbWVybWFpZFteXFxuXSpcXG4oW1xcc1xcU10qPyleYGBgL2dtKV07XG4gIHJldHVybiBtZXJtYWlkQmxvY2tzLm1hcCgobSkgPT4gbVsxXT8udHJpbSgpKS5maWx0ZXIoKHYpOiB2IGlzIHN0cmluZyA9PiAhIXYpO1xufVxuXG5mdW5jdGlvbiByZWxhdGl2ZVBhdGhXaXRoaW5Sb290KGZpbGU6IHN0cmluZywgcm9vdERpcjogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgcmVsID0gcGF0aC5yZWxhdGl2ZShwYXRoLnJlc29sdmUocm9vdERpciksIHBhdGgucmVzb2x2ZShmaWxlKSk7XG4gIGlmIChyZWwgPT09IFwiXCIgfHwgcmVsID09PSBcIi4uXCIgfHwgcmVsLnN0YXJ0c1dpdGgoYC4uJHtwYXRoLnNlcH1gKSB8fCBwYXRoLmlzQWJzb2x1dGUocmVsKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHJlbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZEdlbmVyYXRlTWVybWFpZEZvckZpbGUoZmlsZTogc3RyaW5nLCByb290RGlyID0gREVGQVVMVF9ST09UKTogYm9vbGVhbiB7XG4gIGlmICghZmlsZS5lbmRzV2l0aChcIi5tZFwiKSkgcmV0dXJuIGZhbHNlO1xuICBjb25zdCByZWwgPSByZWxhdGl2ZVBhdGhXaXRoaW5Sb290KGZpbGUsIHJvb3REaXIpO1xuICByZXR1cm4gcmVsICE9PSB1bmRlZmluZWQgJiYgIXJlbC5zcGxpdChwYXRoLnNlcCkuaW5jbHVkZXMoXCJnZW5lcmF0ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGlzRmlsZU5vdEZvdW5kRXJyb3IoZXJyb3I6IHVua25vd24pOiBlcnJvciBpcyBOb2RlSlMuRXJybm9FeGNlcHRpb24ge1xuICByZXR1cm4gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAoZXJyb3IgYXMgTm9kZUpTLkVycm5vRXhjZXB0aW9uKS5jb2RlID09PSBcIkVOT0VOVFwiO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0TWFya2Rvd25GaWxlcyhkaXI6IHN0cmluZywgYWNjOiBzdHJpbmdbXSA9IFtdKTogc3RyaW5nW10ge1xuICBjb25zdCBlbnRyaWVzID0gZnMucmVhZGRpclN5bmMoZGlyLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgZnVsbCA9IHBhdGguam9pbihkaXIsIGVudHJ5Lm5hbWUpO1xuXG4gICAgLy8gLnZpdGVwcmVzcyBcdTMwODQgcHVibGljXHUzMDAxXHU2RDNFXHU3NTFGXHU3NTFGXHU2MjEwXHU3MjY5XHUzMDZBXHUzMDY5XHUzMDZGXHU3MTIxXHU4OTk2XG4gICAgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgZW50cnkubmFtZSA9PT0gXCIudml0ZXByZXNzXCIgfHxcbiAgICAgICAgZW50cnkubmFtZSA9PT0gXCJwdWJsaWNcIiB8fFxuICAgICAgICBlbnRyeS5uYW1lID09PSBcIm5vZGVfbW9kdWxlc1wiIHx8XG4gICAgICAgIGVudHJ5Lm5hbWUgPT09IFwiZ2VuZXJhdGVkXCJcbiAgICAgICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbGxlY3RNYXJrZG93bkZpbGVzKGZ1bGwsIGFjYyk7XG4gICAgfSBlbHNlIGlmIChlbnRyeS5pc0ZpbGUoKSAmJiBlbnRyeS5uYW1lLmVuZHNXaXRoKFwiLm1kXCIpKSB7XG4gICAgICBhY2MucHVzaChmdWxsKTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTUyMTdcdTYzMTlcdTk4MDZcdTMwNkJcdTRGOURcdTVCNThcdTMwNUJcdTMwNUFcdTUxOERcdTczRkVcdTYwMjdcdTMwOTJcdTc4QkFcdTRGRERcdTMwNTlcdTMwOEJcbiAgcmV0dXJuIGFjYy5zb3J0KCk7XG59XG5cbi8qKlxuICogU1ZHIFx1MzA2RSB2aWV3Qm94IFx1MzA5Mlx1OEFBRFx1MzA3Rlx1NTNENlx1MzA4QVx1MzAwMVx1MzA1RFx1MzA2RVx1NTAyNFx1MzA2NyB3aWR0aCAvIGhlaWdodCBcdTVDNUVcdTYwMjdcdTMwOTJcdTRFMEFcdTY2RjhcdTMwNERcdTMwNTlcdTMwOEJcdTMwMDJcbiAqIFx1MzA1OVx1MzA2N1x1MzA2QiB3aWR0aD1cIjEwMCVcIiBcdTMwNkFcdTMwNjlcdTMwNENcdTRFRDhcdTMwNDRcdTMwNjZcdTMwNDRcdTMwNjZcdTMwODJcdTUyNEFcdTk2NjRcdTMwNTdcdTMwNjZcdTMwNEJcdTMwODlcdTRFRDhcdTMwNTFcdTc2RjRcdTMwNTdcdTMwN0VcdTMwNTlcdTMwMDJcbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplU3ZnU2l6ZShzdmdQYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgbGV0IHN2ZyA9IGZzLnJlYWRGaWxlU3luYyhzdmdQYXRoLCBcInV0ZjhcIik7XG5cbiAgLy8gdmlld0JveD1cIm1pblggbWluWSBXIEhcIiBcdTMwOTJcdTYzQTJcdTMwNTlcbiAgY29uc3QgdmJNYXRjaCA9IHN2Zy5tYXRjaCgvdmlld0JveD1cIihbXlwiXSspXCIvKTtcbiAgaWYgKCF2Yk1hdGNoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcGFydHMgPSB2Yk1hdGNoWzFdLnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xuICBpZiAocGFydHMubGVuZ3RoICE9PSA0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgWywgLCB3LCBoXSA9IHBhcnRzOyAvLyBbbWluWCwgbWluWSwgd2lkdGgsIGhlaWdodF0gXHUzMDkyXHU2MEYzXHU1QjlBXG5cbiAgLy8gXHU5NThCXHU1OUNCXHUzMEJGXHUzMEIwIDxzdmcgLi4uPiBcdTMwOTJcdTMwQURcdTMwRTNcdTMwRDdcdTMwQzFcdTMwRTNcbiAgY29uc3QgdGFnTWF0Y2ggPSBzdmcubWF0Y2goLzxzdmdbXj5dKj4vKTtcbiAgaWYgKCF0YWdNYXRjaCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IG9yaWdpbmFsVGFnID0gdGFnTWF0Y2hbMF07XG4gIC8vIFwiPHN2Z1wiIFx1MzA2OCBcIj5cIiBcdTMwOTJcdTk2NjRcdTMwNDRcdTMwNUZcdTVDNUVcdTYwMjdcdTkwRThcdTUyMDZcdTMwOTJcdTUzRDZcdTMwOEFcdTUxRkFcdTMwNTlcbiAgY29uc3QgYXR0cnMgPSBvcmlnaW5hbFRhZy5zbGljZShcIjxzdmdcIi5sZW5ndGgsIC0xKTsgLy8gXHU1MTQ4XHU5ODJEIFwiPHN2Z1wiIFx1MzA2OFx1NjcyQlx1NUMzRSBcIj5cIiBcdTMwOTJcdTk2NjRcdTUzQkJcdTMwNTdcdTMwNUZcdTkwRThcdTUyMDZcblxuICAvLyBcdTVDNUVcdTYwMjdcdTY1ODdcdTVCNTdcdTUyMTdcdTMwNEJcdTMwODlcdTY1RTJcdTVCNThcdTMwNkUgd2lkdGggLyBoZWlnaHQgXHUzMDkyXHU1MjRBXHU5NjY0XG4gIGNvbnN0IGNsZWFuZWRBdHRycyA9IGF0dHJzLnJlcGxhY2UoL1xcc3dpZHRoPVwiW15cIl0qXCIvLCBcIlwiKS5yZXBsYWNlKC9cXHNoZWlnaHQ9XCJbXlwiXSpcIi8sIFwiXCIpO1xuXG4gIC8vIFx1NjVCMFx1MzA1N1x1MzA0NCBzdmcgXHUzMEJGXHUzMEIwXHUzMDkyXHU3RDQ0XHUzMDdGXHU3QUNCXHUzMDY2XG4gIC8vIGNsZWFuZWRBdHRycyBcdTMwNkZcdTUxNDhcdTk4MkRcdTMwNkJcdTMwQjlcdTMwREFcdTMwRkNcdTMwQjlcdTMwOTJcdTU0MkJcdTMwOTNcdTMwNjdcdTMwNDRcdTMwOEJcdTMwNkVcdTMwNjdcdTMwMDFcdTMwNURcdTMwNkVcdTMwN0VcdTMwN0VcdTkwMjNcdTdENTBcdTMwNTdcdTMwNjZPS1xuICBjb25zdCBuZXdUYWcgPSBgPHN2ZyB3aWR0aD1cIiR7d31cIiBoZWlnaHQ9XCIke2h9XCIke2NsZWFuZWRBdHRyc30+YDtcblxuICAvLyBcdTMwQkZcdTMwQjBcdTUxNjhcdTRGNTNcdTMwOTJcdTdGNkVcdTMwNERcdTYzREJcdTMwNDhcbiAgc3ZnID0gc3ZnLnJlcGxhY2Uob3JpZ2luYWxUYWcsIG5ld1RhZyk7XG5cbiAgZnMud3JpdGVGaWxlU3luYyhzdmdQYXRoLCBzdmcsIFwidXRmOFwiKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyU3ZnKG91dERpcjogc3RyaW5nLCBjb2RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBpZCA9IG1lcm1haWRTdmdJZChjb2RlKTtcbiAgY29uc3Qgc3ZnUGF0aCA9IHN2Z1BhdGhGb3Iob3V0RGlyLCBpZCk7XG5cbiAgLy8gXHU2NUUyXHUzMDZCXHU1NDBDXHUzMDU4XHUzMEIzXHUzMEZDXHUzMEM5XHUzMDZFU1ZHXHUzMDRDXHUzMDQyXHUzMDhDXHUzMDcwXHU1MThEXHU3NTFGXHU2MjEwXHUzMDU3XHUzMDZBXHUzMDQ0XHVGRjA4XHUzMEQ2XHUzMEVEXHUzMEMzXHUzMEFGXHU1MzU4XHU0RjREXHUzMEFEXHUzMEUzXHUzMEMzXHUzMEI3XHUzMEU1XHVGRjA5XG4gIGlmIChmcy5leGlzdHNTeW5jKHN2Z1BhdGgpKSB7XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgY29uc3QgdG1wTW1kID0gcGF0aC5qb2luKG91dERpciwgYC50bXAtJHtpZH0ubW1kYCk7XG4gIGZzLndyaXRlRmlsZVN5bmModG1wTW1kLCBjb2RlLCBcInV0ZjhcIik7XG5cbiAgY29uc29sZS5sb2coYFx1RDgzQ1x1REYwMCBHZW5lcmF0aW5nIG1lcm1haWQgU1ZHOiAke3BhdGgucmVsYXRpdmUocHJvY2Vzcy5jd2QoKSwgc3ZnUGF0aCl9YCk7XG5cbiAgdHJ5IHtcbiAgICAvLyBtZXJtYWlkLWNsaSBcdTMwOTJcdTRGN0ZcdTMwNjNcdTMwNjYgLm1tZCBcdTIxOTIgLnN2Z1xuICAgIGV4ZWNGaWxlU3luYyhcbiAgICAgIHByb2Nlc3MuZXhlY1BhdGgsXG4gICAgICBbTUVSTUFJRF9DTEksIFwiLXBcIiwgUFVQUEVURUVSX0NPTkZJRywgXCItY1wiLCBNRVJNQUlEX0NPTkZJRywgXCItaVwiLCB0bXBNbWQsIFwiLW9cIiwgc3ZnUGF0aF0sXG4gICAgICB7IHN0ZGlvOiBbXCJpZ25vcmVcIiwgXCJwaXBlXCIsIFwicGlwZVwiXSB9LFxuICAgICk7XG5cbiAgICAvLyBcdTI3MDUgXHUzMDUzXHUzMDUzXHUzMDY3IHdpZHRoL2hlaWdodCBcdTMwOTIgdmlld0JveCBcdTMwNEJcdTMwODlcdTRFMEFcdTY2RjhcdTMwNERcbiAgICBub3JtYWxpemVTdmdTaXplKHN2Z1BhdGgpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIG1lcm1haWQtY2xpIFx1MzA0Q1x1OTAxNFx1NEUyRFx1MzA3RVx1MzA2N1x1NjZGOFx1MzA0NFx1MzA1RiBTVkcgXHUzMDkyXHU2MjEwXHU1MjlGXHUzMEFEXHUzMEUzXHUzMEMzXHUzMEI3XHUzMEU1XHUzMDY4XHUzMDU3XHUzMDY2XHU1MThEXHU1MjI5XHU3NTI4XHUzMDU3XHUzMDZBXHUzMDQ0XHUzMDAyXG4gICAgZnMucm1TeW5jKHN2Z1BhdGgsIHsgZm9yY2U6IHRydWUgfSk7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH0gZmluYWxseSB7XG4gICAgZnMucm1TeW5jKHRtcE1tZCwgeyBmb3JjZTogdHJ1ZSB9KTtcbiAgfVxuXG4gIHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gcmVuZGVyRXJyb3JTdW1tYXJ5KGVycm9yOiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3Qgc3RkZXJyID0gKGVycm9yIGFzIHsgc3RkZXJyPzogdW5rbm93biB9IHwgbnVsbCk/LnN0ZGVycjtcbiAgY29uc3QgZGV0YWlsID1cbiAgICB0eXBlb2Ygc3RkZXJyID09PSBcInN0cmluZ1wiIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdGRlcnIpID8gc3RkZXJyLnRvU3RyaW5nKCkudHJpbSgpIDogXCJcIjtcbiAgcmV0dXJuIChkZXRhaWwgfHwgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSkpXG4gICAgLnNwbGl0KC9cXG5cXHMrYXQgLylbMF1cbiAgICAudHJpbSgpO1xufVxuXG5mdW5jdGlvbiBmaW5pc2hHZW5lcmF0aW9uKGVycm9yczogRXJyb3JbXSwgZXJyb3JNb2RlOiBNZXJtYWlkRXJyb3JNb2RlKTogdm9pZCB7XG4gIGlmIChlcnJvcnMubGVuZ3RoID4gMCAmJiBlcnJvck1vZGUgPT09IFwidGhyb3dcIikge1xuICAgIHRocm93IG5ldyBBZ2dyZWdhdGVFcnJvcihcbiAgICAgIGVycm9ycyxcbiAgICAgIGBbbWVybWFpZF0gJHtlcnJvcnMubGVuZ3RofSBkaWFncmFtKHMpIGZhaWxlZDpcXG4ke2Vycm9ycy5tYXAoKGVycm9yKSA9PiBlcnJvci5tZXNzYWdlKS5qb2luKFwiXFxuXCIpfWAsXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIDEgXHUzMEQ1XHUzMEExXHUzMEE0XHUzMEVCXHUzMDkyXHU1MUU2XHU3NDA2XHUzMDU3XHUzMDY2XHUzMDAxXHUzMDVEXHUzMDZFXHUzMEQ1XHUzMEExXHUzMEE0XHUzMEVCXHUzMDRDXHU1M0MyXHU3MTY3XHUzMDU5XHUzMDhCIFNWRyBcdTMwQ0ZcdTMwQzNcdTMwQjdcdTMwRTVcdTRFMDBcdTg5QTdcdTMwOTJcdThGRDRcdTMwNTlcdTMwMDJcbiAqIG1hbmlmZXN0IFx1MzA0Q1x1NkUyMVx1MzA1NVx1MzA4Q1x1MzAwMW10aW1lL3NpemUgXHUzMDY4XHU2M0NGXHU3NTNCXHU2NjQyXHUzMDZFIG1lcm1haWQtY2xpIFx1MzA2RVx1NzI0OFx1MzBGQlx1OEEyRFx1NUI5QVx1MzBDRlx1MzBDM1x1MzBCN1x1MzBFNVx1MzA0Q1x1NEUwMFx1ODFGNFx1MzA1N1x1MzAwMVxuICogXHU1QkZFXHU1RkRDIFNWRyBcdTMwNENcdTYzQzNcdTMwNjNcdTMwNjZcdTMwNDRcdTMwOEJcdTU4MzRcdTU0MDhcdTMwNkYgcmVhZCBcdTMwNUJcdTMwNUFcdTMwQjlcdTMwQURcdTMwQzNcdTMwRDdcdTMwNTlcdTMwOEJcdTMwMDJcbiAqL1xuZnVuY3Rpb24gcHJvY2Vzc01hcmtkb3duKFxuICBtZFBhdGg6IHN0cmluZyxcbiAgcm9vdERpcjogc3RyaW5nLFxuICBvdXREaXI6IHN0cmluZyxcbiAgZXJyb3JzOiBFcnJvcltdLFxuICBwcmV2TWFuaWZlc3Q/OiBNYW5pZmVzdCxcbik6IHsgaGFzaGVzOiBzdHJpbmdbXTsgaGFzRXJyb3JzOiBib29sZWFuIH0ge1xuICBjb25zdCBzdGF0ID0gZnMuc3RhdFN5bmMobWRQYXRoKTtcblxuICBpZiAocHJldk1hbmlmZXN0KSB7XG4gICAgY29uc3QgcmVsS2V5ID0gcGF0aC5yZWxhdGl2ZShyb290RGlyLCBtZFBhdGgpO1xuICAgIGNvbnN0IHByZXYgPSBwcmV2TWFuaWZlc3QuZmlsZXNbcmVsS2V5XTtcbiAgICBpZiAoXG4gICAgICBwcmV2ICYmXG4gICAgICAhcHJldi5oYXNFcnJvcnMgJiZcbiAgICAgIHByZXYubXRpbWVNcyA9PT0gc3RhdC5tdGltZU1zICYmXG4gICAgICBwcmV2LnNpemUgPT09IHN0YXQuc2l6ZSAmJlxuICAgICAgaXNSZW5kZXJlZFdpdGhDdXJyZW50U2V0dGluZ3MocHJldikgJiZcbiAgICAgIHByZXYuaGFzaGVzLmV2ZXJ5KChpZCkgPT4gZnMuZXhpc3RzU3luYyhzdmdQYXRoRm9yKG91dERpciwgaWQpKSlcbiAgICApIHtcbiAgICAgIC8vIFx1NTkwOVx1NjZGNFx1MzA2QVx1MzA1NyAmIFx1NzUxRlx1NjIxMFx1NkUwOFx1MzA3RiBcdTIxOTIgXHU0RjU1XHUzMDgyXHUzMDU3XHUzMDZBXHUzMDQ0XG4gICAgICByZXR1cm4geyBoYXNoZXM6IHByZXYuaGFzaGVzLCBoYXNFcnJvcnM6IGZhbHNlIH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgdGV4dCA9IGZzLnJlYWRGaWxlU3luYyhtZFBhdGgsIFwidXRmOFwiKTtcbiAgY29uc3QgbWVybWFpZEJsb2NrcyA9IGV4dHJhY3RNZXJtYWlkQmxvY2tzKHRleHQpO1xuICBpZiAobWVybWFpZEJsb2Nrcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4geyBoYXNoZXM6IFtdLCBoYXNFcnJvcnM6IGZhbHNlIH07XG4gIH1cblxuICBjb25zb2xlLmxvZyhgXHVEODNDXHVERjAwIEdlbmVyYXRpbmcgbWVybWFpZCBTVkcgZnJvbTogJHtwYXRoLnJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIG1kUGF0aCl9YCk7XG5cbiAgZnMubWtkaXJTeW5jKG91dERpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG5cbiAgY29uc3QgaGFzaGVzOiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgaGFzRXJyb3JzID0gZmFsc2U7XG4gIGZvciAoY29uc3QgW2luZGV4LCBjb2RlXSBvZiBtZXJtYWlkQmxvY2tzLmVudHJpZXMoKSkge1xuICAgIHRyeSB7XG4gICAgICBoYXNoZXMucHVzaChyZW5kZXJTdmcob3V0RGlyLCBjb2RlKSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgICBjb25zdCBmYWlsdXJlID0gbmV3IEVycm9yKFxuICAgICAgICBgJHtwYXRoLnJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIG1kUGF0aCl9IChkaWFncmFtICR7aW5kZXggKyAxfSwgJHttZXJtYWlkU3ZnSWQoY29kZSl9KTogJHtyZW5kZXJFcnJvclN1bW1hcnkoZXJyb3IpfWAsXG4gICAgICAgIHsgY2F1c2U6IGVycm9yIH0sXG4gICAgICApO1xuICAgICAgZXJyb3JzLnB1c2goZmFpbHVyZSk7XG4gICAgICBjb25zb2xlLndhcm4oYFttZXJtYWlkXSBza2lwcGluZyBmYWlsZWQgZGlhZ3JhbTogJHtmYWlsdXJlLm1lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7IGhhc2hlcywgaGFzRXJyb3JzIH07XG59XG5cbi8qKlxuICogbWFuaWZlc3QgXHUzMDZCXHU3NjdCXHU5MzMyXHUzMDU1XHUzMDhDXHUzMDVGXHUzMDY5XHUzMDZFXHUzMEQ1XHUzMEExXHUzMEE0XHUzMEVCXHUzMDRCXHUzMDg5XHUzMDgyXHU1M0MyXHU3MTY3XHUzMDU1XHUzMDhDXHUzMDZBXHUzMDRGXHUzMDZBXHUzMDYzXHUzMDVGIFNWRyBcdTMwOTJcdTUyNEFcdTk2NjRcdTMwNTlcdTMwOEJcdTMwMDJcbiAqIFx1NTI0QVx1OTY2NFx1NUJGRVx1OEM2MVx1MzA2Rlx1MzBDRlx1MzBDM1x1MzBCN1x1MzBFNVx1NTQwRFx1MzA2RSBTVkdcdUZGMDhgPGhhc2g+LnN2Z2BcdUZGMDlcdTMwNkVcdTMwN0ZcdTMwNkJcdTk2NTBcdTVCOUFcdTMwNTlcdTMwOEJcdTMwMDJcbiAqL1xuZnVuY3Rpb24gcHJ1bmVPcnBoYW5TdmdzKG91dERpcjogc3RyaW5nLCBtYW5pZmVzdDogTWFuaWZlc3QpOiB2b2lkIHtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKG91dERpcikpIHJldHVybjtcblxuICBjb25zdCByZWZlcmVuY2VkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGZvciAoY29uc3QgZW50cnkgb2YgT2JqZWN0LnZhbHVlcyhtYW5pZmVzdC5maWxlcykpIHtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIGVudHJ5Lmhhc2hlcykgcmVmZXJlbmNlZC5hZGQoYCR7aWR9LnN2Z2ApO1xuICB9XG5cbiAgZm9yIChjb25zdCBuYW1lIG9mIGZzLnJlYWRkaXJTeW5jKG91dERpcikpIHtcbiAgICBpZiAoIVNWR19OQU1FX1BBVFRFUk4udGVzdChuYW1lKSkgY29udGludWU7XG4gICAgaWYgKHJlZmVyZW5jZWQuaGFzKG5hbWUpKSBjb250aW51ZTtcbiAgICBmcy5ybVN5bmMocGF0aC5qb2luKG91dERpciwgbmFtZSksIHsgZm9yY2U6IHRydWUgfSk7XG4gICAgY29uc29sZS5sb2coYFx1RDgzRVx1RERGOSBSZW1vdmluZyBvcnBoYW4gbWVybWFpZCBTVkc6ICR7bmFtZX1gKTtcbiAgfVxufVxuXG4vLyBhZGRpdGlvbmFsUm9vdERpcnMgXHUzMDZGIGRvY3MvIFx1NEVFNVx1NTkxNlx1MzA2Qlx1N0Y2RVx1MzA0Qlx1MzA4Q1x1MzA1Rlx1MzBEQVx1MzBGQ1x1MzBCOFx1RkYwOGRvY3Mtc2l0ZSBcdTMwNENcdTMwQjlcdTMwQzZcdTMwRkNcdTMwQjhcdTMwRjNcdTMwQjBcdTMwNTdcdTMwNUYgcGFja2FnZSBcdTMwNkVcbi8vIGthdGEgXHUzMDZBXHUzMDY5XHVGRjA5XHUzMDkyXHU1NDBDXHUzMDU4IG1hbmlmZXN0IFx1MzA2N1x1NjI3MVx1MzA0Nlx1MzA1Rlx1MzA4MVx1MzA2RVx1MzA4Mlx1MzA2RVx1MzAwMm1hbmlmZXN0IFx1MzA2RVx1MzBBRFx1MzBGQ1x1MzA2RiByb290RGlyIFx1NzZGOFx1NUJGRVx1MzA2RVx1MzA3RVx1MzA3RVx1MzA2OFx1MzA1N1x1MzAwMVxuLy8gXHU4RkZEXHU1MkEwXHUzMEVCXHUzMEZDXHUzMEM4XHUzMDZFXHUzMEQ1XHUzMEExXHUzMEE0XHUzMEVCXHUzMDgyXHU4RDcwXHU2N0ZCXHUzMDZCXHU1NDJCXHUzMDgxXHUzMDhCXHUzMDUzXHUzMDY4XHUzMDY3XHUzMDAxb3JwaGFuIFx1NTIyNFx1NUI5QVx1MzA2N1x1NEU5Mlx1MzA0NFx1MzA2RSBTVkcgXHUzMDkyXHU2RDg4XHUzMDU3XHU1NDA4XHUzMDhGXHUzMDZBXHUzMDQ0XHUzMDg4XHUzMDQ2XHUzMDZCXHUzMDU5XHUzMDhCXHUzMDAyXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVNZXJtYWlkU3ZncyhvcHRpb25zPzoge1xuICByb290RGlyPzogc3RyaW5nO1xuICBvdXREaXI/OiBzdHJpbmc7XG4gIGFkZGl0aW9uYWxSb290RGlycz86IHN0cmluZ1tdO1xuICBlcnJvck1vZGU/OiBNZXJtYWlkRXJyb3JNb2RlO1xufSk6IHZvaWQge1xuICBjb25zdCByb290RGlyID0gb3B0aW9ucz8ucm9vdERpciA/PyBERUZBVUxUX1JPT1Q7XG4gIGNvbnN0IG91dERpciA9IG9wdGlvbnM/Lm91dERpciA/PyBERUZBVUxUX09VVF9ESVI7XG4gIGNvbnN0IG1hcmtkb3duRmlsZXMgPSBbcm9vdERpciwgLi4uKG9wdGlvbnM/LmFkZGl0aW9uYWxSb290RGlycyA/PyBbXSldXG4gICAgLmZpbHRlcigoZGlyKSA9PiBmcy5leGlzdHNTeW5jKGRpcikpXG4gICAgLmZsYXRNYXAoKGRpcikgPT4gY29sbGVjdE1hcmtkb3duRmlsZXMoZGlyKSk7XG5cbiAgY29uc29sZS5sb2coXCJcdUQ4M0RcdUREMEQgU2Nhbm5pbmcgZG9jcyBmb3IgbWVybWFpZCBjb2RlIGJsb2Nrcy4uLlwiKTtcblxuICBjb25zdCBwcmV2TWFuaWZlc3QgPSBsb2FkTWFuaWZlc3Qob3V0RGlyKTtcbiAgY29uc3QgbmV4dE1hbmlmZXN0OiBNYW5pZmVzdCA9IHsgdmVyc2lvbjogTUFOSUZFU1RfVkVSU0lPTiwgZmlsZXM6IHt9IH07XG4gIGNvbnN0IGVycm9yczogRXJyb3JbXSA9IFtdO1xuXG4gIGZvciAoY29uc3QgbWRQYXRoIG9mIG1hcmtkb3duRmlsZXMpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RhdCA9IGZzLnN0YXRTeW5jKG1kUGF0aCk7XG4gICAgICBjb25zdCB7IGhhc2hlcywgaGFzRXJyb3JzIH0gPSBwcm9jZXNzTWFya2Rvd24obWRQYXRoLCByb290RGlyLCBvdXREaXIsIGVycm9ycywgcHJldk1hbmlmZXN0KTtcbiAgICAgIGlmIChoYXNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBtZXJtYWlkIFx1MzA5Mlx1NTQyQlx1MzA4MFx1MzBENVx1MzBBMVx1MzBBNFx1MzBFQlx1MzA2RVx1MzA3Rlx1OEExOFx1OTMzMlx1MzA1OVx1MzA4Qlx1RkYwOG10aW1lL3NpemUgXHUzMDY3XHU2QjIxXHU1NkRFXHUzMDZFXHU1REVFXHU1MjA2XHU1MjI0XHU1QjlBXHUzMDZCXHU0RjdGXHUzMDQ2XHVGRjA5XG4gICAgICAgIG5leHRNYW5pZmVzdC5maWxlc1twYXRoLnJlbGF0aXZlKHJvb3REaXIsIG1kUGF0aCldID0gY3JlYXRlTWFuaWZlc3RFbnRyeShcbiAgICAgICAgICBzdGF0LFxuICAgICAgICAgIGhhc2hlcyxcbiAgICAgICAgICBoYXNFcnJvcnMsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmICghaXNGaWxlTm90Rm91bmRFcnJvcihlcnJvcikpIHRocm93IGVycm9yO1xuICAgICAgY29uc29sZS53YXJuKGBbbWVybWFpZF0gc2tpcHBpbmcgbWlzc2luZyBNYXJrZG93bjogJHtwYXRoLnJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIG1kUGF0aCl9YCk7XG4gICAgfVxuICB9XG5cbiAgcHJ1bmVPcnBoYW5TdmdzKG91dERpciwgbmV4dE1hbmlmZXN0KTtcbiAgc2F2ZU1hbmlmZXN0KG91dERpciwgbmV4dE1hbmlmZXN0KTtcblxuICBmaW5pc2hHZW5lcmF0aW9uKGVycm9ycywgb3B0aW9ucz8uZXJyb3JNb2RlID8/IFwidGhyb3dcIik7XG4gIGNvbnNvbGUubG9nKFwiXHUyNzA1IE1lcm1haWQgU1ZHIGdlbmVyYXRpb24gZG9uZS5cIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU1lcm1haWRTdmdzRm9yRmlsZShcbiAgbWRQYXRoOiBzdHJpbmcsXG4gIG9wdGlvbnM/OiB7IHJvb3REaXI/OiBzdHJpbmc7IG91dERpcj86IHN0cmluZzsgZXJyb3JNb2RlPzogTWVybWFpZEVycm9yTW9kZSB9LFxuKTogdm9pZCB7XG4gIGNvbnN0IHJvb3REaXIgPSBvcHRpb25zPy5yb290RGlyID8/IERFRkFVTFRfUk9PVDtcbiAgY29uc3Qgb3V0RGlyID0gb3B0aW9ucz8ub3V0RGlyID8/IERFRkFVTFRfT1VUX0RJUjtcblxuICBpZiAoIW1kUGF0aC5lbmRzV2l0aChcIi5tZFwiKSkgcmV0dXJuO1xuXG4gIGNvbnN0IHJlbEtleSA9IHJlbGF0aXZlUGF0aFdpdGhpblJvb3QobWRQYXRoLCByb290RGlyKTtcbiAgaWYgKHJlbEtleSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgLy8gXHU1MzU4XHU0RTAwXHUzMEQ1XHUzMEExXHUzMEE0XHUzMEVCXHU2NkY0XHU2NUIwXHVGRjA4ZGV2IFx1MzA2RVx1MzBEQlx1MzBDM1x1MzBDOFx1MzBFQVx1MzBFRFx1MzBGQ1x1MzBDOVx1N0I0OVx1RkYwOVx1MzA2N1x1MzA2Rlx1NUJGRVx1OEM2MVx1MzBENVx1MzBBMVx1MzBBNFx1MzBFQlx1MzA5Mlx1NUUzOFx1MzA2Qlx1NTFFNlx1NzQwNlx1MzA1N1x1MzAwMVxuICAvLyBtYW5pZmVzdCBcdTMwNkVcdThBNzJcdTVGNTNcdTMwQThcdTMwRjNcdTMwQzhcdTMwRUFcdTMwNjBcdTMwNTFcdTMwOTJcdTY2RjRcdTY1QjBcdTMwNTlcdTMwOEJcdTMwMDJcbiAgY29uc3QgbWFuaWZlc3QgPSBsb2FkTWFuaWZlc3Qob3V0RGlyKTtcbiAgY29uc3QgZXJyb3JzOiBFcnJvcltdID0gW107XG5cbiAgY29uc3QgcmVtb3ZlTWFuaWZlc3RFbnRyeSA9ICgpOiB2b2lkID0+IHtcbiAgICBkZWxldGUgbWFuaWZlc3QuZmlsZXNbcmVsS2V5XTtcbiAgICBwcnVuZU9ycGhhblN2Z3Mob3V0RGlyLCBtYW5pZmVzdCk7XG4gICAgc2F2ZU1hbmlmZXN0KG91dERpciwgbWFuaWZlc3QpO1xuICB9O1xuXG4gIGlmICghc2hvdWxkR2VuZXJhdGVNZXJtYWlkRm9yRmlsZShtZFBhdGgsIHJvb3REaXIpIHx8ICFmcy5leGlzdHNTeW5jKG1kUGF0aCkpIHtcbiAgICBjb25zb2xlLndhcm4oYFttZXJtYWlkXSBza2lwcGluZyBtaXNzaW5nIG9yIGdlbmVyYXRlZCBNYXJrZG93bjogJHtyZWxLZXl9YCk7XG4gICAgcmVtb3ZlTWFuaWZlc3RFbnRyeSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgeyBoYXNoZXMsIGhhc0Vycm9ycyB9ID0gcHJvY2Vzc01hcmtkb3duKG1kUGF0aCwgcm9vdERpciwgb3V0RGlyLCBlcnJvcnMpO1xuICAgIGlmIChoYXNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc3RhdCA9IGZzLnN0YXRTeW5jKG1kUGF0aCk7XG4gICAgICBtYW5pZmVzdC5maWxlc1tyZWxLZXldID0gY3JlYXRlTWFuaWZlc3RFbnRyeShzdGF0LCBoYXNoZXMsIGhhc0Vycm9ycyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBtYW5pZmVzdC5maWxlc1tyZWxLZXldO1xuICAgIH1cbiAgICBwcnVuZU9ycGhhblN2Z3Mob3V0RGlyLCBtYW5pZmVzdCk7XG4gICAgc2F2ZU1hbmlmZXN0KG91dERpciwgbWFuaWZlc3QpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmICghaXNGaWxlTm90Rm91bmRFcnJvcihlcnJvcikpIHRocm93IGVycm9yO1xuICAgIGNvbnNvbGUud2FybihgW21lcm1haWRdIHNraXBwaW5nIG1pc3NpbmcgTWFya2Rvd246ICR7cmVsS2V5fWApO1xuICAgIHJlbW92ZU1hbmlmZXN0RW50cnkoKTtcbiAgfVxuICBmaW5pc2hHZW5lcmF0aW9uKGVycm9ycywgb3B0aW9ucz8uZXJyb3JNb2RlID8/IFwidGhyb3dcIik7XG59XG5cbmZ1bmN0aW9uIGlzRGlyZWN0UnVuKCk6IGJvb2xlYW4ge1xuICBjb25zdCBzZWxmUGF0aCA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcbiAgY29uc3QgaW52b2tlZCA9IHByb2Nlc3MuYXJndlsxXSA/IHBhdGgucmVzb2x2ZShwcm9jZXNzLmFyZ3ZbMV0pIDogXCJcIjtcbiAgcmV0dXJuIGludm9rZWQgPT09IHBhdGgucmVzb2x2ZShzZWxmUGF0aCk7XG59XG5cbmlmIChpc0RpcmVjdFJ1bigpKSB7XG4gIGdlbmVyYXRlTWVybWFpZFN2Z3MoKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS9zcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi93b3Jrc3BhY2VzL3NwZWNkb2pvLXdvcmtzcGFjZS9zcGVjZG9qby9wYWNrYWdlcy9kb2NzLXNpdGUvc3JjL2dlbi1kMi1zdmcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS9zcmMvZ2VuLWQyLXN2Zy50c1wiO2ltcG9ydCB7IGV4aXN0c1N5bmMsIG1rZGlyU3luYywgcmVhZGRpclN5bmMsIHJlYWRGaWxlU3luYywgcm1TeW5jLCB3cml0ZUZpbGVTeW5jIH0gZnJvbSBcIm5vZGU6ZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcbmltcG9ydCB7IGFzc2VydEQyVmVyc2lvbiwgZDJTdmdJZCwgZXh0cmFjdEQyQmxvY2tzLCByZW5kZXJEMiB9IGZyb20gXCIuL2QyLm1qc1wiO1xuZXhwb3J0IHsgZDJTdmdJZCB9IGZyb20gXCIuL2QyLm1qc1wiO1xuXG5mdW5jdGlvbiBjb2xsZWN0TWFya2Rvd24oZGlyOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGlmICghZXhpc3RzU3luYyhkaXIpKSByZXR1cm4gW107XG4gIHJldHVybiByZWFkZGlyU3luYyhkaXIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KVxuICAgIC5mbGF0TWFwKChlbnRyeSkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBlbnRyeS5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpIHx8XG4gICAgICAgIFtcImdlbmVyYXRlZFwiLCBcIm5vZGVfbW9kdWxlc1wiLCBcInB1YmxpY1wiLCBcInNlY3JldHNcIl0uaW5jbHVkZXMoZW50cnkubmFtZSlcbiAgICAgIClcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgY29uc3QgZmlsZSA9IHBhdGguam9pbihkaXIsIGVudHJ5Lm5hbWUpO1xuICAgICAgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KCkpIHJldHVybiBjb2xsZWN0TWFya2Rvd24oZmlsZSk7XG4gICAgICByZXR1cm4gZW50cnkuaXNGaWxlKCkgJiYgZmlsZS5lbmRzV2l0aChcIi5tZFwiKSA/IFtmaWxlXSA6IFtdO1xuICAgIH0pXG4gICAgLnNvcnQoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlRDJTdmdzKG9wdGlvbnM6IHsgcm9vdERpcj86IHN0cmluZzsgb3V0RGlyPzogc3RyaW5nIH0gPSB7fSk6IHZvaWQge1xuICBjb25zdCB3b3Jrc3BhY2UgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5lbnYuU1BFQ0RPSk9fRE9DU19ST09UID8/IHByb2Nlc3MuY3dkKCkpO1xuICBjb25zdCByb290RGlyID0gb3B0aW9ucy5yb290RGlyID8/IHBhdGguam9pbih3b3Jrc3BhY2UsIFwiZG9jc1wiKTtcbiAgY29uc3Qgb3V0RGlyID0gb3B0aW9ucy5vdXREaXIgPz8gcGF0aC5qb2luKHdvcmtzcGFjZSwgXCIudml0ZXByZXNzXCIsIFwiZDJcIik7XG4gIGNvbnN0IGJsb2NrcyA9IGNvbGxlY3RNYXJrZG93bihyb290RGlyKS5mbGF0TWFwKChmaWxlKSA9PlxuICAgIGV4dHJhY3REMkJsb2NrcyhyZWFkRmlsZVN5bmMoZmlsZSwgXCJ1dGY4XCIpLCBmaWxlKSxcbiAgKTtcbiAgLy8gRXZlbiBhIGNvbXBsZXRlbHkgY2FjaGVkIGJ1aWxkIG11c3QgZGV0ZWN0IGEgbWlzc2luZyBvciBpbmNvbXBhdGlibGUgQ0xJLlxuICBpZiAoYmxvY2tzLmxlbmd0aCA+IDApIGFzc2VydEQyVmVyc2lvbigpO1xuICBjb25zdCByZWZlcmVuY2VkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IGVycm9yczogRXJyb3JbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGJsb2NrIG9mIGJsb2Nrcykge1xuICAgIGNvbnN0IG5hbWUgPSBgJHtkMlN2Z0lkKGJsb2NrLmNvZGUpfS5zdmdgO1xuICAgIHJlZmVyZW5jZWQuYWRkKG5hbWUpO1xuICAgIGNvbnN0IG91dHB1dCA9IHBhdGguam9pbihvdXREaXIsIG5hbWUpO1xuICAgIGlmIChleGlzdHNTeW5jKG91dHB1dCkpIGNvbnRpbnVlO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdmcgPSByZW5kZXJEMihibG9jay5jb2RlKTtcbiAgICAgIG1rZGlyU3luYyhvdXREaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgd3JpdGVGaWxlU3luYyhvdXRwdXQsIHN2ZywgXCJ1dGY4XCIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBybVN5bmMob3V0cHV0LCB7IGZvcmNlOiB0cnVlIH0pO1xuICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgICBgJHtibG9jay5maWxlfToke2Jsb2NrLmxpbmV9IFtkMl0gJHtlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcil9YCxcbiAgICAgICAgICB7IGNhdXNlOiBlcnJvciB9LFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgaWYgKGV4aXN0c1N5bmMob3V0RGlyKSkge1xuICAgIGZvciAoY29uc3QgbmFtZSBvZiByZWFkZGlyU3luYyhvdXREaXIpKSB7XG4gICAgICBpZiAoL15bMC05YS1mXXs4fVxcLnN2ZyQvdS50ZXN0KG5hbWUpICYmICFyZWZlcmVuY2VkLmhhcyhuYW1lKSlcbiAgICAgICAgcm1TeW5jKHBhdGguam9pbihvdXREaXIsIG5hbWUpKTtcbiAgICB9XG4gIH1cbiAgaWYgKGVycm9ycy5sZW5ndGggPiAwKVxuICAgIHRocm93IG5ldyBBZ2dyZWdhdGVFcnJvcihlcnJvcnMsIGVycm9ycy5tYXAoKGVycm9yKSA9PiBlcnJvci5tZXNzYWdlKS5qb2luKFwiXFxuXCIpKTtcbn1cblxuaWYgKHByb2Nlc3MuYXJndlsxXSAmJiBwYXRoLnJlc29sdmUocHJvY2Vzcy5hcmd2WzFdKSA9PT0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKVxuICBnZW5lcmF0ZUQyU3ZncygpO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy9zcGVjZG9qby13b3Jrc3BhY2Uvc3BlY2Rvam8vcGFja2FnZXMvZG9jcy1zaXRlL3NyY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS9zcmMvZDIubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2VzL3NwZWNkb2pvLXdvcmtzcGFjZS9zcGVjZG9qby9wYWNrYWdlcy9kb2NzLXNpdGUvc3JjL2QyLm1qc1wiO2ltcG9ydCB7IGV4ZWNGaWxlU3luYyB9IGZyb20gXCJub2RlOmNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCB7IGNyZWF0ZUhhc2ggfSBmcm9tIFwibm9kZTpjcnlwdG9cIjtcbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tIFwibm9kZTptb2R1bGVcIjtcblxuZXhwb3J0IGNvbnN0IEQyX1ZFUlNJT04gPSBcIjAuOS4wXCI7XG5leHBvcnQgY29uc3QgRDJfTEFZT1VUID0gXCJlbGtcIjtcbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XG4vLyBVc2UgdGhlIHNhbWUgTWFya2Rvd24gcGFyc2VyIGFzIFZpdGVQcmVzcywgaW5jbHVkaW5nIG5lc3RlZCBhbmQgbG9uZyBmZW5jZXMuXG5jb25zdCB2aXRlcHJlc3NSZXF1aXJlID0gY3JlYXRlUmVxdWlyZShyZXF1aXJlLnJlc29sdmUoXCJ2aXRlcHJlc3MvcGFja2FnZS5qc29uXCIpKTtcbmNvbnN0IE1hcmtkb3duSXQgPSB2aXRlcHJlc3NSZXF1aXJlKFwibWFya2Rvd24taXRcIik7XG5jb25zdCBwYXJzZXIgPSBuZXcgTWFya2Rvd25JdCh7IGh0bWw6IHRydWUgfSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0RDJCbG9ja3MobWFya2Rvd24sIGZpbGUgPSBcIlwiKSB7XG4gIC8vIEtlZXAgb3JpZ2luYWwgc291cmNlIGxpbmUgbnVtYmVycyB3aGlsZSBoaWRpbmcgWUFNTCBmcm9udG1hdHRlciBmcm9tIE1hcmtkb3duLlxuICBjb25zdCBzb3VyY2UgPSBtYXJrZG93bi5yZXBsYWNlKC9eLS0tXFxyP1xcbltcXHNcXFNdKj9cXHI/XFxuLS0tKD86XFxyP1xcbnwkKS91LCAodmFsdWUpID0+XG4gICAgdmFsdWUucmVwbGFjZSgvW15cXG5dL2d1LCBcIlwiKSxcbiAgKTtcbiAgcmV0dXJuIHBhcnNlclxuICAgIC5wYXJzZShzb3VyY2UsIHt9KVxuICAgIC5maWx0ZXIoKHRva2VuKSA9PiB0b2tlbi50eXBlID09PSBcImZlbmNlXCIgJiYgdG9rZW4uaW5mby50cmltKCkuc3BsaXQoL1xccy91KVswXSA9PT0gXCJkMlwiKVxuICAgIC5tYXAoKHRva2VuKSA9PiAoeyBmaWxlLCBsaW5lOiB0b2tlbi5tYXBbMF0gKyAxLCBjb2RlOiB0b2tlbi5jb250ZW50LnRyaW0oKSB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkMlN2Z0lkKGNvZGUpIHtcbiAgcmV0dXJuIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAudXBkYXRlKGAke0QyX1ZFUlNJT059XFxuJHtEMl9MQVlPVVR9XFxuJHtjb2RlLnRyaW0oKX1gKVxuICAgIC5kaWdlc3QoXCJoZXhcIilcbiAgICAuc2xpY2UoMCwgOCk7XG59XG5cbmZ1bmN0aW9uIHJ1bkQyKGFyZ3MsIGlucHV0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGV4ZWNGaWxlU3luYyhcImQyXCIsIGFyZ3MsIHtcbiAgICAgIGlucHV0LFxuICAgICAgZW5jb2Rpbmc6IFwidXRmOFwiLFxuICAgICAgc3RkaW86IFtcInBpcGVcIiwgXCJwaXBlXCIsIFwicGlwZVwiXSxcbiAgICAgIHRpbWVvdXQ6IDEyMF8wMDAsXG4gICAgICBtYXhCdWZmZXI6IDMyICogMTAyNCAqIDEwMjQsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGVycm9yLmNvZGUgPT09IFwiRU5PRU5UXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRDIgQ0xJIG5vdCBmb3VuZDogaW5zdGFsbCBkMiB2JHtEMl9WRVJTSU9OfSBhbmQgYWRkIGl0IHRvIFBBVEguYCwge1xuICAgICAgICBjYXVzZTogZXJyb3IsXG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLnN0ZGVycj8udG9TdHJpbmcoKS50cmltKCkgfHwgZXJyb3IubWVzc2FnZSwgeyBjYXVzZTogZXJyb3IgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEQyVmVyc2lvbigpIHtcbiAgY29uc3QgYWN0dWFsID0gcnVuRDIoW1widmVyc2lvblwiXSkudHJpbSgpLnJlcGxhY2UoL152L3UsIFwiXCIpO1xuICBpZiAoYWN0dWFsICE9PSBEMl9WRVJTSU9OKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEQyIENMSSB2ZXJzaW9uIG1pc21hdGNoOiBleHBlY3RlZCAke0QyX1ZFUlNJT059LCBnb3QgJHthY3R1YWx9LiBJbnN0YWxsIGQyIHYke0QyX1ZFUlNJT059LmAsXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRDIoY29kZSkge1xuICAvLyBTVkcgdmlhIHN0ZG91dCBhdm9pZHMgdGVtcG9yYXJ5IHNvdXJjZS9vdXRwdXQgZmlsZXMsIGluY2x1ZGluZyBwYXJ0aWFsIGNhY2hlcy5cbiAgY29uc3Qgc3ZnID0gcnVuRDIoXG4gICAgW1wiLS1sYXlvdXRcIiwgRDJfTEFZT1VULCBcIi0tdGhlbWVcIiwgXCIwXCIsIFwiLS1zY2FsZVwiLCBcIjFcIiwgXCItLXRhcmdldFwiLCBcIlwiLCBcIi1cIiwgXCItXCJdLFxuICAgIGNvZGUsXG4gICk7XG4gIGlmICghLzxzdmdcXGIvdS50ZXN0KHN2ZykpIHRocm93IG5ldyBFcnJvcihcIkQyIENMSSBkaWQgbm90IHByb2R1Y2UgU1ZHIG91dHB1dC5cIik7XG4gIHJldHVybiBzdmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUQyKGNvZGUpIHtcbiAgcnVuRDIoW1widmFsaWRhdGVcIiwgXCItXCJdLCBjb2RlKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya3NwYWNlcy9zcGVjZG9qby13b3Jrc3BhY2Uvc3BlY2Rvam8vcGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3MvZDItYXV0by1nZW5lcmF0ZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya3NwYWNlcy9zcGVjZG9qby13b3Jrc3BhY2Uvc3BlY2Rvam8vcGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3MvZDItYXV0by1nZW5lcmF0ZS50c1wiO2ltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IGdlbmVyYXRlRDJTdmdzIH0gZnJvbSBcIi4uL3NyYy9nZW4tZDItc3ZnLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBkMlN2Z0F1dG9HZW5lcmF0ZShvcHRpb25zOiB7XG4gIHJvb3REaXI6IHN0cmluZztcbiAgb3V0RGlyOiBzdHJpbmc7XG4gIGNvbnRlbnRSb290OiBzdHJpbmc7XG4gIHN5bmNGaWxlOiAoZmlsZTogc3RyaW5nKSA9PiB2b2lkO1xufSk6IFBsdWdpbiB7XG4gIGxldCBzc3IgPSBmYWxzZTtcbiAgY29uc3QgZ2VuZXJhdGUgPSAoKSA9PiBnZW5lcmF0ZUQyU3ZncyhvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcImQyLXN2Zy1hdXRvLWdlbmVyYXRlXCIsXG4gICAgY29uZmlnUmVzb2x2ZWQoY29uZmlnKSB7XG4gICAgICBzc3IgPSBCb29sZWFuKGNvbmZpZy5idWlsZC5zc3IpO1xuICAgIH0sXG4gICAgYnVpbGRTdGFydCgpIHtcbiAgICAgIGlmICghc3NyKSBnZW5lcmF0ZSgpO1xuICAgIH0sXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgc2VydmVyLndhdGNoZXIuYWRkKG9wdGlvbnMuY29udGVudFJvb3QpO1xuICAgICAgZm9yIChjb25zdCBldmVudCBvZiBbXCJhZGRcIiwgXCJjaGFuZ2VcIiwgXCJ1bmxpbmtcIl0gYXMgY29uc3QpIHtcbiAgICAgICAgc2VydmVyLndhdGNoZXIub24oZXZlbnQsIChmaWxlKSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVsYXRpdmUgPSBwYXRoLnJlbGF0aXZlKG9wdGlvbnMuY29udGVudFJvb3QsIGZpbGUpO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFyZWxhdGl2ZSB8fFxuICAgICAgICAgICAgcmVsYXRpdmUuc3RhcnRzV2l0aChcIi4uXCIpIHx8XG4gICAgICAgICAgICBwYXRoLmlzQWJzb2x1dGUocmVsYXRpdmUpIHx8XG4gICAgICAgICAgICAhZmlsZS5lbmRzV2l0aChcIi5tZFwiKVxuICAgICAgICAgIClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBvcHRpb25zLnN5bmNGaWxlKGZpbGUpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBnZW5lcmF0ZSgpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBzZXJ2ZXIuY29uZmlnLmxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgICAgYFtkMl0gJHtlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcil9YCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlcnZlci53cy5zZW5kKHsgdHlwZTogXCJmdWxsLXJlbG9hZFwiIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy9zcGVjZG9qby13b3Jrc3BhY2Uvc3BlY2Rvam8vcGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi93b3Jrc3BhY2VzL3NwZWNkb2pvLXdvcmtzcGFjZS9zcGVjZG9qby9wYWNrYWdlcy9kb2NzLXNpdGUvLnZpdGVwcmVzcy9rYXRhLXN0YWdpbmcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS8udml0ZXByZXNzL2thdGEtc3RhZ2luZy50c1wiO2ltcG9ydCB7XG4gIGNvcHlGaWxlU3luYyxcbiAgZXhpc3RzU3luYyxcbiAgbWtkaXJTeW5jLFxuICByZWFkRmlsZVN5bmMsXG4gIHJlYWRkaXJTeW5jLFxuICByZWFscGF0aFN5bmMsXG4gIHJtU3luYyxcbiAgd3JpdGVGaWxlU3luYyxcbn0gZnJvbSBcIm5vZGU6ZnNcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuXG4vLyBwYWNrYWdlIFx1NTNDMlx1NzE2N1x1NEUyRFx1RkYwOGVqZWN0IFx1MzA1N1x1MzA2Nlx1MzA0NFx1MzA2QVx1MzA0NFx1RkYwOVx1MzA2RSBrYXRhIFx1MzA2Rlx1NTIyOVx1NzUyOFx1MzBFQVx1MzBERFx1MzBCOFx1MzBDOFx1MzBFQVx1MzA2RSBkb2NzLyBcdTkxNERcdTRFMEJcdTMwNkJcdTVCNThcdTU3MjhcdTMwNTdcdTMwNkFcdTMwNDRcdTMwMDJcbi8vIFZpdGVQcmVzcyBcdTMwNkUgc3JjRGlyIFx1MzA2RiAxIFx1MzA2NFx1MzA1N1x1MzA0Qlx1NjMwN1x1NUI5QVx1MzA2N1x1MzA0RFx1MzA2QVx1MzA0NFx1MzA1Rlx1MzA4MVx1MzAwMVx1MzBEM1x1MzBFQlx1MzBDOVx1NTI0RFx1MzA2Qlx1NTIyOVx1NzUyOFx1NTA3NCBkb2NzIFx1MzA2OCBwYWNrYWdlIFx1NTA3NFx1NjU4N1x1NjZGOFx1MzA5MlxuLy8gXHUzMEI5XHUzMEM2XHUzMEZDXHUzMEI4XHUzMEYzXHUzMEIwXHUzMDc4XHU5MUNEXHUzMDZEXHUzMDAxXHUzMDUzXHUzMDUzXHUzMDkyIHNyY0RpciBcdTMwNkJcdTMwNTlcdTMwOEJcdTMwMDJcbi8vIHdvcmtzcGFjZSBcdTMwOTIgc3JjRGlyIFx1MzA2Qlx1MzA1N1x1MzA1Rlx1MzA3RVx1MzA3RVx1MzA2N1x1MzA2RiBgLnZpdGVwcmVzcy8qKmAgXHUzMDZFXHU4RDcwXHU2N0ZCXHU5NjY0XHU1OTE2XHUzMDY3XHUzMERBXHUzMEZDXHUzMEI4XHUzMDRDXHU2QjIwXHUzMDUxXHUzMDhCXHUzMDAyXG4vLyBzcmNEaXIgXHU4MUVBXHU0RjUzXHUzMDkyXHU1MjA3XHUzMDhBXHU2NkZGXHUzMDQ4XHUzMDhDXHUzMDcwXHUzMEM5XHUzMEMzXHUzMEM4XHUzMEM3XHUzMEEzXHUzMEVDXHUzMEFGXHUzMEM4XHUzMEVBXHUzMDZFXHU4RDcwXHU2N0ZCXHUzMDg0IHN5bWxpbmsgXHUzMDZCXHU5ODNDXHUzMDhCXHU1RkM1XHU4OTgxXHUzMDRDXHUzMDZBXHUzMDQ0XHUzMDAyXG5leHBvcnQgY29uc3QgS0FUQV9TVEFHSU5HX0RJUl9OQU1FID0gXCIudml0ZXByZXNzL2thdGEtc3RhZ2luZ1wiO1xuXG4vLyBcdTg5MDdcdTg4RkRcdTVCRkVcdThDNjFcdTMwNkYgcGFja2FnZSBcdTMwNENcdTU0MENcdTY4QjFcdTMwNTlcdTMwOEIgZG9jcy9qYS9zcGVjZG9qbyBcdTUxNjhcdTRGNTNcdTMwNjhcdTMwNTlcdTMwOEJcdTMwMDJlamVjdCBcdTMwNjdcdTMwNERcdTMwOEIga2F0YVx1RkYwOHJ1bGVib29rIC9cbi8vIHN0YW5kYXJkIC8gcmVjaXBlIC8gc2FtcGxlIC8gdGVtcGxhdGVcdUZGMDlcdTMwNjBcdTMwNTFcdTMwOTJcdTg5MDdcdTg4RkRcdTMwNTlcdTMwOEJcdTMwNjhcdTMwMDFzdGFuZGFyZCBcdTMwNkFcdTMwNjlcdTMwNENcdTc2RjhcdTVCRkUgTWFya2Rvd25cbi8vIFx1MzBFQVx1MzBGM1x1MzBBRlx1MzA2N1x1NTNDMlx1NzE2N1x1MzA1OVx1MzA4QiBndWlkZXMgLyByZWZlcmVuY2VzIFx1MzA0Q1x1NkIyMFx1MzA1MVx1MzAwMVZpdGVQcmVzcyBcdTMwNkUgZGVhZCBsaW5rIFx1NjkxQ1x1NjdGQlx1MzA2N1x1MzBEM1x1MzBFQlx1MzBDOVx1MzA0Q1x1NTkzMVx1NjU1N1x1MzA1OVx1MzA4Qlx1MzAwMlxuLy8gXHUzMEI1XHUzMEE0XHUzMEM5XHUzMEQwXHUzMEZDXHUzMDZFIHNwZWNkb2pvIFx1N0JDMFx1MzA4MiBndWlkZXMgXHUzMDZBXHUzMDY5XHUzMDkyXHU1MjREXHU2M0QwXHUzMDZCXHU3RDQ0XHUzMDdFXHUzMDhDXHUzMDY2XHUzMDQ0XHUzMDhCXHUzMDAyXG5jb25zdCBLQVRBX1JFTEFUSVZFX0RJUlMgPSBbXCJkb2NzL2phL3NwZWNkb2pvXCJdIGFzIGNvbnN0O1xuXG5jb25zdCBQQUNLQUdFX05BTUUgPSBcInNwZWNkb2pvXCI7XG5cbi8vIHBhY2thZ2UgXHU1NDBDXHU2OEIxXHU2NTg3XHU2NkY4XHUzMDZCXHUzMDZGIFNwZWNEb2pvIFx1OTU4Qlx1NzY3QVx1MzBFQVx1MzBERFx1MzBCOFx1MzBDOFx1MzBFQVx1ODFFQVx1OEVBQlx1MzA2RVx1OEEyRFx1OEEwOFx1NjZGOFx1RkYwOGRvY3MvamEvcHJvZHVjdC8uLi5cdUZGMDlcdTMwNzhcdTMwNkVcdTc2RjhcdTVCRkVcdTMwRUFcdTMwRjNcdTMwQUZcdTMwNENcbi8vIFx1MzA0Mlx1MzA4QVx1MzAwMVx1NTIyOVx1NzUyOFx1MzBFQVx1MzBERFx1MzBCOFx1MzBDOFx1MzBFQVx1MzA2N1x1MzA2Rlx1NUZDNVx1MzA1QSBkZWFkIGxpbmsgXHUzMDZCXHUzMDZBXHUzMDhCXHUzMDAyVml0ZVByZXNzIFx1MzA2RSBpZ25vcmVEZWFkTGlua3MgXHUzMDZGIFVSTCBcdTMwNTdcdTMwNEJcbi8vIFx1NTNEN1x1MzA1MVx1NTNENlx1MzA4OVx1MzA1QVx1NTNDMlx1NzE2N1x1NTE0M1x1MzBEQVx1MzBGQ1x1MzBCOFx1MzA2N1x1N0Q1RVx1MzA4Q1x1MzA2QVx1MzA0NFx1MzA1Rlx1MzA4MVx1MzAwMVx1MzBCOVx1MzBDNlx1MzBGQ1x1MzBCOFx1MzBGM1x1MzBCMFx1MzA5Mlx1ODg0Q1x1MzA2M1x1MzA1Rlx1NTgzNFx1NTQwOFx1MzA2Qlx1OTY1MFx1MzA4QVx1MzA1M1x1MzA2RVx1NUY2Mlx1MzA2RSBVUkwgXHUzMDYwXHUzMDUxXHUzMDkyXHU3MTIxXHU4OTk2XHUzMDU5XHUzMDhCXHUzMDAyXG5leHBvcnQgY29uc3QgU1RBR0VEX1BBQ0tBR0VfREVBRF9MSU5LX1BBVFRFUk5TOiByZWFkb25seSBSZWdFeHBbXSA9IFsvXihcXC5cXC8pPyhcXC5cXC5cXC8pK3Byb2R1Y3RcXC8vXTtcblxuZXhwb3J0IHR5cGUgS2F0YVN0YWdpbmdSZXN1bHQgPSB7XG4gIC8vIFZpdGVQcmVzcyBcdTMwNkUgc3JjRGlyIFx1MzA2OFx1MzA1N1x1MzA2Nlx1NEY3Rlx1MzA0Nlx1MzAwMXdvcmtzcGFjZSBcdTMwNkUgLnZpdGVwcmVzcyBcdTkxNERcdTRFMEJcdTMwNkVcdTk1QjJcdTg5QTdcdTc1MjhcdTMwQzRcdTMwRUFcdTMwRkNcdTMwMDJcbiAgc3RhZ2luZ1Jvb3Q6IHN0cmluZztcbiAgLy8ga2F0YSBcdTMwNkVcdTUzQzJcdTcxNjdcdTUxNDMgcGFja2FnZSBcdTMwRUJcdTMwRkNcdTMwQzhcdTMwMDJcdTg5RTNcdTZDN0FcdTMwNjdcdTMwNERcdTMwNkFcdTMwNDRcdTMwMDFcdTMwN0VcdTMwNUZcdTMwNkYgd29ya3NwYWNlIFx1ODFFQVx1OEVBQlx1MzA2RVx1NTgzNFx1NTQwOFx1MzA2RiB1bmRlZmluZWRcdTMwMDJcbiAgcGFja2FnZVJvb3Q6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgc3RhZ2VkOiBudW1iZXI7XG4gIGVqZWN0ZWQ6IG51bWJlcjtcbiAgLy8gZGV2IFx1MzA2N1x1NTIyOVx1NzUyOFx1NTA3NCBkb2NzIFx1MzA2RVx1NTkwOVx1NjZGNFx1MzBGQlx1OEZGRFx1NTJBMFx1MzBGQlx1NTI0QVx1OTY2NFx1MzA5Mlx1NTNDRFx1NjYyMFx1MzA1OVx1MzA4Qlx1MzAwMlx1NTI0QVx1OTY2NFx1NjY0Mlx1MzA2Rlx1NTQwQ1x1NjhCMVx1NjU4N1x1NjZGOFx1MzA3OFx1NjIzQlx1MzA1OVx1MzAwMlxuICBzeW5jRmlsZTogKGZpbGU6IHN0cmluZykgPT4gdm9pZDtcbn07XG5cbmZ1bmN0aW9uIHJlYWRQYWNrYWdlTmFtZShwYWNrYWdlSnNvblBhdGg6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyc2VkOiB1bmtub3duID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGFja2FnZUpzb25QYXRoLCBcInV0ZjhcIikpO1xuICAgIGlmICh0eXBlb2YgcGFyc2VkID09PSBcIm9iamVjdFwiICYmIHBhcnNlZCAhPT0gbnVsbCAmJiBcIm5hbWVcIiBpbiBwYXJzZWQpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSAocGFyc2VkIGFzIHsgbmFtZTogdW5rbm93biB9KS5uYW1lO1xuICAgICAgcmV0dXJuIHR5cGVvZiBuYW1lID09PSBcInN0cmluZ1wiID8gbmFtZSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gY2F0Y2gge1xuICAgIC8vIHBhY2thZ2UuanNvbiBcdTMwNENcdTcxMjFcdTMwNDRcdTMwRkJcdTU4Q0FcdTMwOENcdTMwNjZcdTMwNDRcdTMwOEJcdTU4MzRcdTU0MDhcdTMwNkZcdThBNzJcdTVGNTNcdTMwNkFcdTMwNTdcdTMwNjhcdTMwNTdcdTMwNjZcdTYyNzFcdTMwNDZcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBzYW1lRGlyZWN0b3J5KGZpcnN0OiBzdHJpbmcsIHNlY29uZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiByZWFsUGF0aE9yUmVzb2x2ZWQoZmlyc3QpID09PSByZWFsUGF0aE9yUmVzb2x2ZWQoc2Vjb25kKTtcbn1cblxuLy8ga2F0YSBcdTMwNkVcdTUzQzJcdTcxNjdcdTUxNDMgcGFja2FnZSBcdTMwRUJcdTMwRkNcdTMwQzhcdTMwOTJcdTg5RTNcdTZDN0FcdTMwNTlcdTMwOEJcdTMwMDJcdTk4MDZcdTVFOEZcdTMwNkYgc3BlY2Rvam8gQ0xJIFx1MzA2RSByZXNvbHZlciBcdTMwNjhcdTYzQzNcdTMwNDhcdTMwOEJcdTMwMDJcbi8vIDEuIFNQRUNET0pPX1BBQ0tBR0VfUk9PVFx1RkYwOENMSSBcdTMwNjhcdTU0MENcdTMwNThcdTY2MEVcdTc5M0FcdTVERUVcdTMwNTdcdTY2RkZcdTMwNDhcdUZGMDlcbi8vIDIuIHdvcmtzcGFjZSBcdTMwNEJcdTMwODlcdTg5QUFcdTY1QjlcdTU0MTFcdTMwNzhcdThGQkZcdTMwNjNcdTMwNUYgbm9kZV9tb2R1bGVzL3NwZWNkb2pvXG4vLyB3b3Jrc3BhY2UgXHU4MUVBXHU4RUFCXHUzMDRDIHNwZWNkb2pvIHBhY2thZ2UgXHUzMDZFXHU1ODM0XHU1NDA4XHVGRjA4U3BlY0Rvam8gXHU5NThCXHU3NjdBXHUzMEVBXHUzMEREXHUzMEI4XHUzMEM4XHUzMEVBXHVGRjA5XHUzMDZGXHU4OTA3XHU4OEZEXHU0RTBEXHU4OTgxXHUzMDZFXHUzMDVGXHUzMDgxIHVuZGVmaW5lZFx1MzAwMlxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVLYXRhUGFja2FnZVJvb3Qod29ya3NwYWNlUm9vdDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgY29uc3Qgb3ZlcnJpZGUgPSBwcm9jZXNzLmVudi5TUEVDRE9KT19QQUNLQUdFX1JPT1Q7XG4gIGNvbnN0IGNhbmRpZGF0ZSA9XG4gICAgb3ZlcnJpZGUgJiYgb3ZlcnJpZGUudHJpbSgpICE9PSBcIlwiXG4gICAgICA/IHBhdGgucmVzb2x2ZShvdmVycmlkZSlcbiAgICAgIDogZmluZEluc3RhbGxlZFBhY2thZ2Uod29ya3NwYWNlUm9vdCk7XG4gIGlmICghY2FuZGlkYXRlIHx8IHNhbWVEaXJlY3RvcnkoY2FuZGlkYXRlLCB3b3Jrc3BhY2VSb290KSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgcmV0dXJuIGNhbmRpZGF0ZTtcbn1cblxuZnVuY3Rpb24gZmluZEluc3RhbGxlZFBhY2thZ2Uod29ya3NwYWNlUm9vdDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHJlYWRQYWNrYWdlTmFtZShwYXRoLmpvaW4od29ya3NwYWNlUm9vdCwgXCJwYWNrYWdlLmpzb25cIikpID09PSBQQUNLQUdFX05BTUUpIHtcbiAgICByZXR1cm4gd29ya3NwYWNlUm9vdDtcbiAgfVxuICBsZXQgY3VycmVudCA9IHBhdGgucmVzb2x2ZSh3b3Jrc3BhY2VSb290KTtcbiAgZm9yICg7Oykge1xuICAgIGNvbnN0IGNhbmRpZGF0ZSA9IHBhdGguam9pbihjdXJyZW50LCBcIm5vZGVfbW9kdWxlc1wiLCBQQUNLQUdFX05BTUUpO1xuICAgIGlmIChyZWFkUGFja2FnZU5hbWUocGF0aC5qb2luKGNhbmRpZGF0ZSwgXCJwYWNrYWdlLmpzb25cIikpID09PSBQQUNLQUdFX05BTUUpIHJldHVybiBjYW5kaWRhdGU7XG4gICAgY29uc3QgcGFyZW50ID0gcGF0aC5kaXJuYW1lKGN1cnJlbnQpO1xuICAgIGlmIChwYXJlbnQgPT09IGN1cnJlbnQpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY3VycmVudCA9IHBhcmVudDtcbiAgfVxufVxuXG4vLyBrYXRhIFx1MzBCM1x1MzBERVx1MzBGM1x1MzBDOVx1MzA2OFx1NTQwQ1x1MzA1OFx1MzA0RiBnZW5lcmF0ZWQvIFx1MzA2Rlx1ODkwN1x1ODhGRFx1MzA1N1x1MzA2QVx1MzA0NFx1MzAwMlx1OTgwNlx1NUU4Rlx1MzA5Mlx1NTZGQVx1NUI5QVx1MzA1N1x1MzA2Nlx1N0Q1MFx1Njc5Q1x1MzA5Mlx1NTE4RFx1NzNGRVx1NTNFRlx1ODBGRFx1MzA2Qlx1MzA1OVx1MzA4Qlx1MzAwMlxuZnVuY3Rpb24gcmVsYXRpdmVGaWxlc0JlbG93KHJvb3Q6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgaWYgKCFleGlzdHNTeW5jKHJvb3QpKSByZXR1cm4gW107XG4gIGNvbnN0IGZpbGVzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB2aXNpdCA9IChjdXJyZW50OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCByZWxhdGl2ZURpcmVjdG9yeSA9IHBhdGgucmVsYXRpdmUocm9vdCwgY3VycmVudCkuc3BsaXQocGF0aC5zZXApLmpvaW4oXCIvXCIpO1xuICAgIGNvbnN0IGNvcmVLYXRhRGlyZWN0b3J5ID0gbmV3IFNldChbXG4gICAgICBcInJ1bGVib29rc1wiLFxuICAgICAgXCJzdGFuZGFyZHNcIixcbiAgICAgIFwicmVjaXBlc1wiLFxuICAgICAgXCJzYW1wbGVzXCIsXG4gICAgICBcInRlbXBsYXRlc1wiLFxuICAgIF0pLmhhcyhyZWxhdGl2ZURpcmVjdG9yeSk7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiByZWFkZGlyU3luYyhjdXJyZW50LCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSkpIHtcbiAgICAgIGlmIChlbnRyeS5uYW1lID09PSBcImdlbmVyYXRlZFwiKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGFic29sdXRlUGF0aCA9IHBhdGguam9pbihjdXJyZW50LCBlbnRyeS5uYW1lKTtcbiAgICAgIGlmIChlbnRyeS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIC8vIGNvcmUgcGFja2FnZSBcdTMwNkVcdTdBMkVcdTk4NUVcdTMwQzdcdTMwQTNcdTMwRUNcdTMwQUZcdTMwQzhcdTMwRUFcdTc2RjRcdTRFMEJcdTMwNjBcdTMwNTFcdTMwOTJcdTU0MENcdTY4QjEga2F0YSBcdTMwNjhcdTMwNTdcdTMwNjZcdTYyNzFcdTMwNDZcdTMwMDJcbiAgICAgICAgLy8gYXV0aG9yaXR5IFx1MzBCNVx1MzBENlx1MzBDN1x1MzBBM1x1MzBFQ1x1MzBBRlx1MzBDOFx1MzBFQVx1MzA2Rlx1NTIyOVx1NzUyOFx1ODAwNVx1MzBGQnZhcmlhbnQgXHU2MjQwXHU2NzA5XHUzMDZFXHUzMDVGXHUzMDgxXHUzMEI5XHUzMEM2XHUzMEZDXHUzMEI4XHUzMEYzXHUzMEIwXHUzMDU3XHUzMDZBXHUzMDQ0XHUzMDAyXG4gICAgICAgIGlmICghY29yZUthdGFEaXJlY3RvcnkpIHZpc2l0KGFic29sdXRlUGF0aCk7XG4gICAgICB9IGVsc2UgaWYgKGVudHJ5LmlzRmlsZSgpKSBmaWxlcy5wdXNoKHBhdGgucmVsYXRpdmUocm9vdCwgYWJzb2x1dGVQYXRoKSk7XG4gICAgfVxuICB9O1xuICB2aXNpdChyb290KTtcbiAgcmV0dXJuIGZpbGVzLnNvcnQoKTtcbn1cblxuZnVuY3Rpb24gY29weURvY3Moc291cmNlOiBzdHJpbmcsIGRlc3RpbmF0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKCFleGlzdHNTeW5jKHNvdXJjZSkpIHJldHVybjtcbiAgbWtkaXJTeW5jKGRlc3RpbmF0aW9uLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiByZWFkZGlyU3luYyhzb3VyY2UsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KSkge1xuICAgIGNvbnN0IGZyb20gPSBwYXRoLmpvaW4oc291cmNlLCBlbnRyeS5uYW1lKTtcbiAgICBjb25zdCB0byA9IHBhdGguam9pbihkZXN0aW5hdGlvbiwgZW50cnkubmFtZSk7XG4gICAgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KCkpIGNvcHlEb2NzKGZyb20sIHRvKTtcbiAgICBlbHNlIGlmIChlbnRyeS5pc0ZpbGUoKSkgY29weUZpbGVTeW5jKGZyb20sIHRvKTtcbiAgfVxufVxuXG4vLyBwYWNrYWdlIFx1NTA3NFx1MzA2RSBrYXRhIFx1MzA5Mlx1MzBCOVx1MzBDNlx1MzBGQ1x1MzBCOFx1MzBGM1x1MzBCMFx1MzA3OFx1ODkwN1x1ODhGRFx1MzA1OVx1MzA4Qlx1MzAwMlx1NTI0RFx1NTZERVx1MzA2RVx1MzBCOVx1MzBDNlx1MzBGQ1x1MzBCOFx1MzBGM1x1MzBCMFx1MzA2Rlx1NkJDRVx1NTZERVx1NEY1Q1x1MzA4QVx1NzZGNFx1MzA1N1x1MzAwMVxuLy8gcGFja2FnZSBcdTMwNkVcdTY2RjRcdTY1QjBcdTMwODQgZWplY3QgXHUzMDY3XHU2RDg4XHUzMDQ4XHUzMDVGIGthdGEgXHUzMDRDXHU1M0U0XHUzMDQ0XHUzMDdFXHUzMDdFXHU2QjhCXHUzMDg5XHUzMDZBXHUzMDQ0XHUzMDg4XHUzMDQ2XHUzMDZCXHUzMDU5XHUzMDhCXHUzMDAyXG4vLyBlamVjdCBcdTZFMDhcdTMwN0ZcdUZGMDhcdTUyMjlcdTc1MjhcdTMwRUFcdTMwRERcdTMwQjhcdTMwQzhcdTMwRUFcdTUwNzRcdTMwNkJcdTU0MENcdTMwNThcdTc2RjhcdTVCRkVcdTMwRDFcdTMwQjlcdTMwNENcdTMwNDJcdTMwOEJcdUZGMDlcdTMwRDVcdTMwQTFcdTMwQTRcdTMwRUJcdTMwNkZcdTg5MDdcdTg4RkRcdTMwNUJcdTMwNUFcdTMwMDFcdTUyMjlcdTc1MjhcdTMwRUFcdTMwRERcdTMwQjhcdTMwQzhcdTMwRUFcdTUwNzRcdTMwOTJcdTYzQTFcdTc1MjhcdTMwNTlcdTMwOEJcdTMwMDJcbmV4cG9ydCBmdW5jdGlvbiBzdGFnZUJ1bmRsZWRLYXRhKHdvcmtzcGFjZVJvb3Q6IHN0cmluZyk6IEthdGFTdGFnaW5nUmVzdWx0IHtcbiAgY29uc3Qgc3RhZ2luZ1Jvb3QgPSBwYXRoLmpvaW4od29ya3NwYWNlUm9vdCwgS0FUQV9TVEFHSU5HX0RJUl9OQU1FKTtcbiAgcm1TeW5jKHN0YWdpbmdSb290LCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgZm9yY2U6IHRydWUgfSk7XG4gIG1rZGlyU3luYyhwYXRoLmpvaW4oc3RhZ2luZ1Jvb3QsIFwiZG9jc1wiKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gIGNvbnN0IHdvcmtzcGFjZURvY3MgPSBwYXRoLmpvaW4od29ya3NwYWNlUm9vdCwgXCJkb2NzXCIpO1xuICBjb3B5RG9jcyh3b3Jrc3BhY2VEb2NzLCBwYXRoLmpvaW4oc3RhZ2luZ1Jvb3QsIFwiZG9jc1wiKSk7XG5cbiAgY29uc3QgcGFja2FnZVJvb3QgPSByZXNvbHZlS2F0YVBhY2thZ2VSb290KHdvcmtzcGFjZVJvb3QpO1xuICBjb25zdCBidW5kbGVkRmlsZXMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXG4gIGxldCBzdGFnZWQgPSAwO1xuICBsZXQgZWplY3RlZCA9IDA7XG4gIGZvciAoY29uc3QgcmVsYXRpdmVEaXIgb2YgS0FUQV9SRUxBVElWRV9ESVJTKSB7XG4gICAgaWYgKCFwYWNrYWdlUm9vdCkgYnJlYWs7XG4gICAgY29uc3QgYnVuZGxlZERpciA9IHBhdGguam9pbihwYWNrYWdlUm9vdCwgcmVsYXRpdmVEaXIpO1xuICAgIGNvbnN0IHJlcG9zaXRvcnlEaXIgPSBwYXRoLmpvaW4od29ya3NwYWNlUm9vdCwgcmVsYXRpdmVEaXIpO1xuICAgIGZvciAoY29uc3QgZmlsZSBvZiByZWxhdGl2ZUZpbGVzQmVsb3coYnVuZGxlZERpcikpIHtcbiAgICAgIGJ1bmRsZWRGaWxlcy5zZXQocGF0aC5qb2luKHJlbGF0aXZlRGlyLCBmaWxlKSwgcGF0aC5qb2luKGJ1bmRsZWREaXIsIGZpbGUpKTtcbiAgICAgIGlmIChleGlzdHNTeW5jKHBhdGguam9pbihyZXBvc2l0b3J5RGlyLCBmaWxlKSkpIHtcbiAgICAgICAgZWplY3RlZCArPSAxO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gcGF0aC5qb2luKHN0YWdpbmdSb290LCByZWxhdGl2ZURpciwgZmlsZSk7XG4gICAgICBta2RpclN5bmMocGF0aC5kaXJuYW1lKGRlc3RpbmF0aW9uKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICBjb3B5RmlsZVN5bmMocGF0aC5qb2luKGJ1bmRsZWREaXIsIGZpbGUpLCBkZXN0aW5hdGlvbik7XG4gICAgICBzdGFnZWQgKz0gMTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTUyMjlcdTc1MjhcdTMwRUFcdTMwRERcdTMwQjhcdTMwQzhcdTMwRUFcdTMwNkUgLmdpdGlnbm9yZSBcdTMwOTJcdTY2RjhcdTMwNERcdTYzREJcdTMwNDhcdTMwNUFcdTMwNkIgR2l0IFx1N0JBMVx1NzQwNlx1NUJGRVx1OEM2MVx1MzA0Qlx1MzA4OVx1NTkxNlx1MzA1OVx1MzAwMlxuICB3cml0ZUZpbGVTeW5jKFxuICAgIHBhdGguam9pbihzdGFnaW5nUm9vdCwgXCIuZ2l0aWdub3JlXCIpLFxuICAgIFwiIyBAc3BlY2Rvam8vZG9jcy1zaXRlIFx1MzA0Q1x1NzUxRlx1NjIxMFx1MzA1OVx1MzA4Qlx1MzBCOVx1MzBDNlx1MzBGQ1x1MzBCOFx1MzBGM1x1MzBCMFx1MzAwMkdpdCBcdTdCQTFcdTc0MDZcdTMwNTdcdTMwNkFcdTMwNDRcdTMwMDJcXG4qXFxuXCIsXG4gICAgXCJ1dGY4XCIsXG4gICk7XG4gIGNvbnN0IHN5bmNGaWxlID0gKGZpbGU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUod29ya3NwYWNlUm9vdCwgZmlsZSk7XG4gICAgY29uc3Qgd2l0aGluRG9jcyA9IHBhdGgucmVsYXRpdmUod29ya3NwYWNlRG9jcywgZmlsZSk7XG4gICAgaWYgKHdpdGhpbkRvY3MgPT09IFwiXCIgfHwgd2l0aGluRG9jcy5zdGFydHNXaXRoKFwiLi5cIikgfHwgcGF0aC5pc0Fic29sdXRlKHdpdGhpbkRvY3MpKSByZXR1cm47XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSBwYXRoLmpvaW4oc3RhZ2luZ1Jvb3QsIHJlbGF0aXZlUGF0aCk7XG4gICAgY29uc3Qgc291cmNlID0gZXhpc3RzU3luYyhmaWxlKSA/IGZpbGUgOiBidW5kbGVkRmlsZXMuZ2V0KHJlbGF0aXZlUGF0aCk7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgbWtkaXJTeW5jKHBhdGguZGlybmFtZShkZXN0aW5hdGlvbiksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgY29weUZpbGVTeW5jKHNvdXJjZSwgZGVzdGluYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICBybVN5bmMoZGVzdGluYXRpb24sIHsgZm9yY2U6IHRydWUgfSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4geyBzdGFnaW5nUm9vdCwgcGFja2FnZVJvb3QsIHN0YWdlZCwgZWplY3RlZCwgc3luY0ZpbGUgfTtcbn1cblxuLy8gZG9jLWluZGV4IFx1MzA2RSBwYWNrYWdlIFx1NTA3NCBrYXRhIFx1MzBBOFx1MzBGM1x1MzBDOFx1MzBFQVx1RkYwOFx1NEY4QjogXCJub2RlX21vZHVsZXMvc3BlY2Rvam8vZG9jcy9qYS9zcGVjZG9qby8uLi5cIlx1RkYwOVx1MzA5MlxuLy8gXHUzMEI1XHUzMEE0XHUzMEM4XHU0RTBBXHUzMDZFXHUzMEQxXHUzMEI5XHVGRjA4XCJkb2NzL2phL3NwZWNkb2pvLy4uLlwiXHVGRjA5XHUzMDc4XHU0RUQ4XHUzMDUxXHU2NkZGXHUzMDQ4XHUzMDhCXHUzMDAyXHUzMEI5XHUzMEM2XHUzMEZDXHUzMEI4XHUzMEYzXHUzMEIwXHUzMDZGIHJld3JpdGVzIFx1MzA2N1xuLy8gZG9jcy9qYS8uLi4gXHUzMDY4XHU1NDBDXHUzMDU4XHU1MTZDXHU5NThCIFVSTCBcdTMwNzhcdTUxOTlcdTUwQ0ZcdTMwNTVcdTMwOENcdTMwOEJcdTMwNUZcdTMwODFcdTMwMDF3aWtpbGluayBcdTMwNkZcdTMwNTNcdTMwNkVcdTMwRDFcdTMwQjlcdTMwNjdcdTg5RTNcdTZDN0FcdTMwNjdcdTMwNERcdTMwOEJcdTMwMDJcbi8vIFx1ODg0Q1x1NzU2QVx1NTNGN1x1MzBCNVx1MzBENVx1MzBBM1x1MzBDM1x1MzBBRlx1MzBCOVx1RkYwOFwiOjQyXCJcdUZGMDlcdTMwNkZcdTRGRERcdTYzMDFcdTMwNTlcdTMwOEJcdTMwMDJwYWNrYWdlIFx1NTkxNlx1MzA2RVx1MzBBOFx1MzBGM1x1MzBDOFx1MzBFQVx1MzA2Rlx1MzA1RFx1MzA2RVx1MzA3RVx1MzA3RVx1OEZENFx1MzA1OVx1MzAwMlxuZXhwb3J0IGZ1bmN0aW9uIHRvU2l0ZURvY0luZGV4RW50cnkoXG4gIGVudHJ5OiBzdHJpbmcsXG4gIHdvcmtzcGFjZVJvb3Q6IHN0cmluZyxcbiAgcGFja2FnZVJvb3Q6IHN0cmluZyB8IHVuZGVmaW5lZCxcbik6IHN0cmluZyB7XG4gIGlmICghcGFja2FnZVJvb3QpIHJldHVybiBlbnRyeTtcbiAgY29uc3QgY29sb25JbmRleCA9IGVudHJ5Lmxhc3RJbmRleE9mKFwiOlwiKTtcbiAgY29uc3QgaGFzTGluZSA9IGNvbG9uSW5kZXggPiAwICYmIC9eXFxkKyQvLnRlc3QoZW50cnkuc2xpY2UoY29sb25JbmRleCArIDEpKTtcbiAgY29uc3QgZmlsZVBhdGggPSBoYXNMaW5lID8gZW50cnkuc2xpY2UoMCwgY29sb25JbmRleCkgOiBlbnRyeTtcbiAgY29uc3Qgc3VmZml4ID0gaGFzTGluZSA/IGVudHJ5LnNsaWNlKGNvbG9uSW5kZXgpIDogXCJcIjtcblxuICAvLyBub2RlX21vZHVsZXMvc3BlY2Rvam8gXHUzMDRDIHN5bWxpbmtcdUZGMDhucG0gbGlua1x1MzBGQnBucG0gXHUzMDZBXHUzMDY5XHVGRjA5XHUzMDZFXHU1ODM0XHU1NDA4XHUzMDAxaW5kZXggYnVpbGQgXHUzMDRDXHU4QTE4XHU5MzMyXHUzMDU3XHUzMDVGXG4gIC8vIFx1MzBEMVx1MzBCOVx1MzA2OCBwYWNrYWdlIFx1MzBFQlx1MzBGQ1x1MzBDOFx1MzA2RVx1ODg2OFx1OEExOFx1MzA0Q1x1NEUwMFx1ODFGNFx1MzA1N1x1MzA2QVx1MzA0NFx1MzA1Rlx1MzA4MVx1MzAwMVx1NUI5Rlx1NEY1M1x1MzBEMVx1MzBCOVx1MzA2N1x1NkJENFx1OEYwM1x1MzA1OVx1MzA4Qlx1MzAwMlxuICBjb25zdCBwYWNrYWdlRG9jc1Jvb3QgPSByZWFsUGF0aE9yUmVzb2x2ZWQocGF0aC5qb2luKHBhY2thZ2VSb290LCBcImRvY3NcIikpO1xuICBjb25zdCBhYnNvbHV0ZVBhdGggPSByZWFsUGF0aE9yUmVzb2x2ZWQocGF0aC5yZXNvbHZlKHdvcmtzcGFjZVJvb3QsIGZpbGVQYXRoKSk7XG4gIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUocGFja2FnZURvY3NSb290LCBhYnNvbHV0ZVBhdGgpO1xuICBpZiAocmVsYXRpdmVQYXRoID09PSBcIlwiIHx8IHJlbGF0aXZlUGF0aC5zdGFydHNXaXRoKFwiLi5cIikgfHwgcGF0aC5pc0Fic29sdXRlKHJlbGF0aXZlUGF0aCkpIHtcbiAgICByZXR1cm4gZW50cnk7XG4gIH1cbiAgcmV0dXJuIGBkb2NzLyR7cmVsYXRpdmVQYXRoLnNwbGl0KHBhdGguc2VwKS5qb2luKFwiL1wiKX0ke3N1ZmZpeH1gO1xufVxuXG5mdW5jdGlvbiByZWFsUGF0aE9yUmVzb2x2ZWQodGFyZ2V0OiBzdHJpbmcpOiBzdHJpbmcge1xuICB0cnkge1xuICAgIHJldHVybiByZWFscGF0aFN5bmModGFyZ2V0KTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHBhdGgucmVzb2x2ZSh0YXJnZXQpO1xuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi93b3Jrc3BhY2VzL3NwZWNkb2pvLXdvcmtzcGFjZS9zcGVjZG9qby9wYWNrYWdlcy9kb2NzLXNpdGUvLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS8udml0ZXByZXNzL2xvY2FsZS1zaWRlYmFyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2VzL3NwZWNkb2pvLXdvcmtzcGFjZS9zcGVjZG9qby9wYWNrYWdlcy9kb2NzLXNpdGUvLnZpdGVwcmVzcy9sb2NhbGUtc2lkZWJhci50c1wiO2ltcG9ydCB7IGV4aXN0c1N5bmMsIHN0YXRTeW5jIH0gZnJvbSBcIm5vZGU6ZnNcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuXG4vLyB2aXRlcHJlc3Mtc2lkZWJhciBcdTMwNkUgZ2VuZXJhdGVTaWRlYmFyIFx1MzA2RiBkb2N1bWVudFJvb3RQYXRoIC8gc2NhblN0YXJ0UGF0aCBcdTMwOTIgcHJvY2Vzcy5jd2QoKSBcdTMwNEJcdTMwODlcdTg5RTNcdTZDN0FcdTMwNTdcdTMwMDFcbi8vIFx1OEQ3MFx1NjdGQlx1NTE0OFx1MzA0Q1x1NUI1OFx1NTcyOFx1MzA1N1x1MzA2QVx1MzA0NFx1MzA2OCBcIlRoZSBwYXRoIHRvIHNjYW4gZG9lcyBub3QgZXhpc3RcIiBcdTMwOTJcdTYyOTVcdTMwNTJcdTMwNjZcdThBMkRcdTVCOUFcdTMwNkVcdThBQURcdTMwN0ZcdThGQkNcdTMwN0ZcdTMwNTRcdTMwNjhcdTU5MzFcdTY1NTdcdTMwNTVcdTMwNUJcdTMwOEJcdTMwMDJcbi8vIGBjb25maWcgaW5pdGAgXHUzMDZGIGRvY3MvamEgXHUzMDYwXHUzMDUxXHUzMDkyXHU0RjVDXHUzMDhCXHUzMDVGXHUzMDgxXHUzMDAxbG9jYWxlIFx1MzA2RVx1MzBENVx1MzBBOVx1MzBFQlx1MzBDMFx1MzBGQ1x1MzA0Q1x1NzEyMVx1MzA0NCB3b3Jrc3BhY2UgXHUzMDY3XHUzMDZGXHU4RDcwXHU2N0ZCXHUzMDkyXHU4ODRDXHUzMDhGXHUzMDVBXG4vLyBcdTdBN0FcdTMwNkVcdTMwQjVcdTMwQTRcdTMwQzlcdTMwRDBcdTMwRkNcdTMwNjhcdTMwNTdcdTMwNjZcdTYyNzFcdTMwNDZcdTMwMDJcbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRTY2FuTG9jYWxlU2lkZWJhcihcbiAgd29ya3NwYWNlUm9vdDogc3RyaW5nLFxuICBkb2N1bWVudFJvb3RQYXRoOiBzdHJpbmcsXG4gIGxvY2FsZTogc3RyaW5nLFxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHNjYW5QYXRoID0gcGF0aC5qb2luKHdvcmtzcGFjZVJvb3QsIGRvY3VtZW50Um9vdFBhdGgsIGxvY2FsZSk7XG4gIGlmICghZXhpc3RzU3luYyhzY2FuUGF0aCkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHN0YXRTeW5jKHNjYW5QYXRoKS5pc0RpcmVjdG9yeSgpO1xufVxuXG4vLyBsb2NhbGUgXHUzMDZFXHUzMEQ1XHUzMEE5XHUzMEVCXHUzMEMwXHUzMEZDXHUzMDRDXHUzMDQyXHUzMDhCXHUzMDY4XHUzMDREXHUzMDYwXHUzMDUxIHNjYW4gXHUzMDkyXHU1NDdDXHUzMDczXHUzMDAxXHU3MTIxXHUzMDQ0XHUzMDY4XHUzMDREXHUzMDZGXHU3QTdBXHU5MTREXHU1MjE3XHUzMDkyXHU4RkQ0XHUzMDU5XHUzMDAyXG5leHBvcnQgZnVuY3Rpb24gc2NhbkxvY2FsZVNpZGViYXI8VD4oXG4gIHdvcmtzcGFjZVJvb3Q6IHN0cmluZyxcbiAgZG9jdW1lbnRSb290UGF0aDogc3RyaW5nLFxuICBsb2NhbGU6IHN0cmluZyxcbiAgc2NhbjogKCkgPT4gVFtdLFxuKTogVFtdIHtcbiAgaWYgKCFzaG91bGRTY2FuTG9jYWxlU2lkZWJhcih3b3Jrc3BhY2VSb290LCBkb2N1bWVudFJvb3RQYXRoLCBsb2NhbGUpKSByZXR1cm4gW107XG4gIHJldHVybiBzY2FuKCk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi93b3Jrc3BhY2VzL3NwZWNkb2pvLXdvcmtzcGFjZS9zcGVjZG9qby9wYWNrYWdlcy9kb2NzLXNpdGUvLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS8udml0ZXByZXNzL21lcm1haWQtYXNzZXRzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2VzL3NwZWNkb2pvLXdvcmtzcGFjZS9zcGVjZG9qby9wYWNrYWdlcy9kb2NzLXNpdGUvLnZpdGVwcmVzcy9tZXJtYWlkLWFzc2V0cy50c1wiO2ltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRkaXJTeW5jLCByZWFkRmlsZVN5bmMgfSBmcm9tIFwibm9kZTpmc1wiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gXCJ2aXRlXCI7XG5cbi8vIHB1YmxpY0RpciBcdTMwNkZcdTUyMjlcdTc1MjhcdTgwMDVcdTMwNkUgcHVibGljLyBcdTMwNkVcdTMwN0VcdTMwN0VcdTMwNkJcdTMwNTdcdTMwMDFcdTc1MUZcdTYyMTAgU1ZHIFx1MzA2MFx1MzA1MVx1MzA5Mlx1NTIyNVx1MzA2RVx1NTgzNFx1NjI0MFx1MzA0Qlx1MzA4OVx1OTE0RFx1NEZFMVx1MzA1OVx1MzA4Qlx1MzAwMlxuLy8gbWFuaWZlc3QgXHUzMDg0XHU0RTAwXHU2NjQyXHUzMEQ1XHUzMEExXHUzMEE0XHUzMEVCXHUzMDZGXHU1MTZDXHU5NThCXHUzMDVCXHUzMDVBXHUzMDAxYnVpbGQgXHUzMDY4IGRldiBcdTMwNjdcdTU0MENcdTMwNTggVVJMIFx1MzA5Mlx1NEY3Rlx1MzA0Nlx1MzAwMlxuZXhwb3J0IGZ1bmN0aW9uIG1lcm1haWRBc3NldHMoXG4gIG91dERpcjogc3RyaW5nLFxuICBiYXNlOiBzdHJpbmcsXG4gIGtpbmQ6IFwibWVybWFpZFwiIHwgXCJkMlwiID0gXCJtZXJtYWlkXCIsXG4pOiBQbHVnaW4ge1xuICBsZXQgaXNTc3JCdWlsZCA9IGZhbHNlO1xuICByZXR1cm4ge1xuICAgIG5hbWU6IGBzcGVjZG9qby0ke2tpbmR9LWFzc2V0c2AsXG4gICAgY29uZmlnUmVzb2x2ZWQoY29uZmlnKSB7XG4gICAgICBpc1NzckJ1aWxkID0gQm9vbGVhbihjb25maWcuYnVpbGQuc3NyKTtcbiAgICB9LFxuICAgIGdlbmVyYXRlQnVuZGxlKCkge1xuICAgICAgaWYgKGlzU3NyQnVpbGQgfHwgIWV4aXN0c1N5bmMob3V0RGlyKSkgcmV0dXJuO1xuICAgICAgZm9yIChjb25zdCBuYW1lIG9mIHJlYWRkaXJTeW5jKG91dERpcikpIHtcbiAgICAgICAgaWYgKCEvXlswLTlhLWZdezh9XFwuc3ZnJC8udGVzdChuYW1lKSkgY29udGludWU7XG4gICAgICAgIHRoaXMuZW1pdEZpbGUoe1xuICAgICAgICAgIHR5cGU6IFwiYXNzZXRcIixcbiAgICAgICAgICBmaWxlTmFtZTogYCR7a2luZH0vJHtuYW1lfWAsXG4gICAgICAgICAgc291cmNlOiByZWFkRmlsZVN5bmMocGF0aC5qb2luKG91dERpciwgbmFtZSkpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHJlcS51cmw/LnNwbGl0KC9bPyNdLylbMF07XG4gICAgICAgIGNvbnN0IHNpdGVQYXRoID0gdXJsPy5zdGFydHNXaXRoKGJhc2UpID8gYC8ke3VybC5zbGljZShiYXNlLmxlbmd0aCl9YCA6IHVybDtcbiAgICAgICAgY29uc3QgbmFtZSA9IHNpdGVQYXRoPy5tYXRjaChuZXcgUmVnRXhwKGBeLyR7a2luZH0vKFswLTlhLWZdezh9XFxcXC5zdmcpJGApKT8uWzFdO1xuICAgICAgICBpZiAoIW5hbWUgfHwgIWV4aXN0c1N5bmMocGF0aC5qb2luKG91dERpciwgbmFtZSkpKSByZXR1cm4gbmV4dCgpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiaW1hZ2Uvc3ZnK3htbFwiKTtcbiAgICAgICAgcmVzLmVuZChyZWFkRmlsZVN5bmMocGF0aC5qb2luKG91dERpciwgbmFtZSkpKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi93b3Jrc3BhY2VzL3NwZWNkb2pvLXdvcmtzcGFjZS9zcGVjZG9qby9wYWNrYWdlcy9kb2NzLXNpdGUvLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS8udml0ZXByZXNzL21lcm1haWQtYXV0by1nZW5lcmF0ZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya3NwYWNlcy9zcGVjZG9qby13b3Jrc3BhY2Uvc3BlY2Rvam8vcGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3MvbWVybWFpZC1hdXRvLWdlbmVyYXRlLnRzXCI7aW1wb3J0ICogYXMgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQge1xuICBnZW5lcmF0ZU1lcm1haWRTdmdzLFxuICBnZW5lcmF0ZU1lcm1haWRTdmdzRm9yRmlsZSxcbiAgc2hvdWxkR2VuZXJhdGVNZXJtYWlkRm9yRmlsZSxcbn0gZnJvbSBcIi4uL3NyYy9nZW4tbWVybWFpZC1zdmcuanNcIjtcbmltcG9ydCB0eXBlIHsgTWVybWFpZEVycm9yTW9kZSB9IGZyb20gXCIuLi9zcmMvZ2VuLW1lcm1haWQtc3ZnLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJtYWlkU3ZnQXV0b0dlbmVyYXRlKG9wdGlvbnM6IHtcbiAgcm9vdERpcjogc3RyaW5nO1xuICBvdXREaXI6IHN0cmluZztcbiAgY29udGVudFJvb3Q6IHN0cmluZztcbiAgc3luY0ZpbGU6IChmaWxlOiBzdHJpbmcpID0+IHZvaWQ7XG59KTogUGx1Z2luIHtcbiAgbGV0IHRpbWVyOiBOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZDtcbiAgbGV0IHJ1bm5pbmcgPSBmYWxzZTtcbiAgbGV0IHBlbmRpbmcgPSBmYWxzZTtcbiAgY29uc3QgcGVuZGluZ0ZpbGVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGxldCBpc1NzckJ1aWxkID0gZmFsc2U7XG4gIGxldCBlcnJvck1vZGU6IE1lcm1haWRFcnJvck1vZGUgPSBcInRocm93XCI7XG5cbiAgY29uc3QgcnVuID0gKHJlYXNvbjogc3RyaW5nKSA9PiB7XG4gICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgIHBlbmRpbmcgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBpZiAocGVuZGluZ0ZpbGVzLnNpemUgPiAwKSB7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gWy4uLnBlbmRpbmdGaWxlc107XG4gICAgICAgIHBlbmRpbmdGaWxlcy5jbGVhcigpO1xuICAgICAgICBjb25zb2xlLmxvZyhgW21lcm1haWRdIGdlbmVyYXRpbmcgc3ZncyBmb3IgJHtmaWxlcy5sZW5ndGh9IGZpbGUocykgKCR7cmVhc29ufSlgKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGdlbmVyYXRlTWVybWFpZFN2Z3NGb3JGaWxlKGZpbGUsIHtcbiAgICAgICAgICAgICAgcm9vdERpcjogb3B0aW9ucy5yb290RGlyLFxuICAgICAgICAgICAgICBvdXREaXI6IG9wdGlvbnMub3V0RGlyLFxuICAgICAgICAgICAgICBlcnJvck1vZGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW21lcm1haWRdIGZhaWxlZCB0byBnZW5lcmF0ZSBTVkdzIGZvciAke2ZpbGV9YCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coYFttZXJtYWlkXSBnZW5lcmF0aW5nIHN2Z3MgKCR7cmVhc29ufSlgKTtcbiAgICAgICAgZ2VuZXJhdGVNZXJtYWlkU3Zncyh7XG4gICAgICAgICAgcm9vdERpcjogb3B0aW9ucy5yb290RGlyLFxuICAgICAgICAgIG91dERpcjogb3B0aW9ucy5vdXREaXIsXG4gICAgICAgICAgZXJyb3JNb2RlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgaWYgKHBlbmRpbmcpIHtcbiAgICAgICAgcGVuZGluZyA9IGZhbHNlO1xuICAgICAgICBydW4oXCJwZW5kaW5nXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBzY2hlZHVsZSA9IChyZWFzb246IHN0cmluZywgZGVsYXlNcyA9IDI1MCkgPT4ge1xuICAgIGlmICh0aW1lcikgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gcnVuKHJlYXNvbiksIGRlbGF5TXMpO1xuICB9O1xuXG4gIGNvbnN0IHNjaGVkdWxlRmlsZSA9IChmaWxlOiBzdHJpbmcsIHJlYXNvbjogc3RyaW5nLCBkZWxheU1zID0gMjUwKSA9PiB7XG4gICAgcGVuZGluZ0ZpbGVzLmFkZChmaWxlKTtcbiAgICBzY2hlZHVsZShyZWFzb24sIGRlbGF5TXMpO1xuICB9O1xuXG4gIGNvbnN0IHNob3VsZEhhbmRsZSA9IChmaWxlOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gc2hvdWxkR2VuZXJhdGVNZXJtYWlkRm9yRmlsZShmaWxlLCBvcHRpb25zLnJvb3REaXIpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJtZXJtYWlkLXN2Zy1hdXRvLWdlbmVyYXRlXCIsXG5cbiAgICBjb25maWdSZXNvbHZlZChjb25maWcpIHtcbiAgICAgIGVycm9yTW9kZSA9IGNvbmZpZy5jb21tYW5kID09PSBcInNlcnZlXCIgPyBcIndhcm5cIiA6IFwidGhyb3dcIjtcbiAgICAgIC8vIFZpdGVQcmVzcyBidWlsZCBcdTMwNkYgY2xpZW50IGJ1aWxkIFx1MzA2OCBTU1IgYnVpbGQgXHUzMDkyXHU5MDIzXHU3RDlBXHU1QjlGXHU4ODRDXHUzMDU5XHUzMDhCXHUzMDVGXHUzMDgxXHUzMDAxXG4gICAgICAvLyBidWlsZFN0YXJ0IFx1MzA0QzJcdTU2REVcdTU0N0NcdTMwNzBcdTMwOENcdTMwOEJcdTMwMDJTVkdcdTc1MUZcdTYyMTBcdTMwNkYxXHU1NkRFXHUzMDY3XHU1MzQxXHU1MjA2XHUzMDZBXHUzMDZFXHUzMDY3IFNTUiBcdTUwNzRcdTMwNkZcdTMwQjlcdTMwQURcdTMwQzNcdTMwRDdcdTMwNTlcdTMwOEJcdTMwMDJcbiAgICAgIGlzU3NyQnVpbGQgPSBCb29sZWFuKGNvbmZpZy5idWlsZD8uc3NyKTtcbiAgICB9LFxuXG4gICAgYnVpbGRTdGFydCgpIHtcbiAgICAgIGlmIChpc1NzckJ1aWxkKSByZXR1cm47XG4gICAgICBydW4oXCJidWlsZFN0YXJ0XCIpO1xuICAgIH0sXG5cbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBzY2hlZHVsZShcInN0YXJ0dXBcIiwgMCk7XG5cbiAgICAgIC8vIFx1NTE0M1x1MzA2RSBkb2NzIFx1MzA2RVx1NTkwOVx1NjZGNFx1MzA5Mlx1OTVCMlx1ODlBN1x1NzUyOFx1MzBDNFx1MzBFQVx1MzBGQ1x1MzA3OFx1NTNDRFx1NjYyMFx1MzA1N1x1MzAwMVx1NEVFNVx1NUY4Q1x1MzA2RiBWaXRlUHJlc3MgXHUzMDZFXHU5MDFBXHU1RTM4XHUzMDZFIEhNUiBcdTMwNkJcdTRFRkJcdTMwNUJcdTMwOEJcdTMwMDJcbiAgICAgIHNlcnZlci53YXRjaGVyLmFkZChvcHRpb25zLmNvbnRlbnRSb290KTtcbiAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgW1wiYWRkXCIsIFwiY2hhbmdlXCIsIFwidW5saW5rXCJdIGFzIGNvbnN0KSB7XG4gICAgICAgIHNlcnZlci53YXRjaGVyLm9uKGV2ZW50LCAoZmlsZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlbGF0aXZlID0gcGF0aC5yZWxhdGl2ZShvcHRpb25zLmNvbnRlbnRSb290LCBmaWxlKTtcbiAgICAgICAgICBpZiAocmVsYXRpdmUgJiYgIXJlbGF0aXZlLnN0YXJ0c1dpdGgoXCIuLlwiKSAmJiAhcGF0aC5pc0Fic29sdXRlKHJlbGF0aXZlKSkge1xuICAgICAgICAgICAgb3B0aW9ucy5zeW5jRmlsZShmaWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBzZXJ2ZXIud2F0Y2hlci5vbihcImFkZFwiLCAoZmlsZSkgPT4ge1xuICAgICAgICBpZiAoIXNob3VsZEhhbmRsZShmaWxlKSkgcmV0dXJuO1xuICAgICAgICBzY2hlZHVsZUZpbGUoZmlsZSwgXCJtZDphZGRcIik7XG4gICAgICB9KTtcblxuICAgICAgc2VydmVyLndhdGNoZXIub24oXCJ1bmxpbmtcIiwgKGZpbGUpID0+IHtcbiAgICAgICAgaWYgKCFzaG91bGRIYW5kbGUoZmlsZSkpIHJldHVybjtcbiAgICAgICAgc2NoZWR1bGVGaWxlKGZpbGUsIFwibWQ6dW5saW5rXCIpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGhhbmRsZUhvdFVwZGF0ZShjdHgpIHtcbiAgICAgIGlmICghc2hvdWxkSGFuZGxlKGN0eC5maWxlKSkgcmV0dXJuO1xuXG4gICAgICAvLyBNYXJrZG93biBcdTMwNkVcdTUxOERcdTYzQ0ZcdTc1M0JcdTMwODhcdTMwOEFcdTUxNDhcdTMwNkIgU1ZHIFx1MzA5Mlx1NzUyOFx1NjEwRlx1MzA1N1x1MzA1Rlx1MzA0NFx1MzA2RVx1MzA2N1x1NTQwQ1x1NjcxRlx1NzY4NFx1MzA2Qlx1NUI5Rlx1ODg0Q1xuICAgICAgcGVuZGluZ0ZpbGVzLmFkZChjdHguZmlsZSk7XG4gICAgICBydW4oXCJob3RVcGRhdGVcIik7XG4gICAgICBjdHguc2VydmVyLndzLnNlbmQoeyB0eXBlOiBcImZ1bGwtcmVsb2FkXCIgfSk7XG4gICAgICByZXR1cm4gW107XG4gICAgfSxcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya3NwYWNlcy9zcGVjZG9qby13b3Jrc3BhY2Uvc3BlY2Rvam8vcGFja2FnZXMvZG9jcy1zaXRlLy52aXRlcHJlc3MvZXhlYy1yZWNvcmQtbGlua3MudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dvcmtzcGFjZXMvc3BlY2Rvam8td29ya3NwYWNlL3NwZWNkb2pvL3BhY2thZ2VzL2RvY3Mtc2l0ZS8udml0ZXByZXNzL2V4ZWMtcmVjb3JkLWxpbmtzLnRzXCI7aW1wb3J0IHsgcG9zaXggYXMgcGF0aCB9IGZyb20gXCJub2RlOnBhdGhcIjtcblxuZXhwb3J0IHR5cGUgR2l0SHViU291cmNlID0ge1xuICByZXBvc2l0b3J5VXJsOiBzdHJpbmc7XG4gIGJyYW5jaDogc3RyaW5nO1xufTtcblxudHlwZSBXaWtpbGlua1RhcmdldCA9IHtcbiAgZGlzcGxheVRleHQ6IHN0cmluZztcbiAgaHJlZjogc3RyaW5nO1xufTtcblxuY29uc3QgRVhFQ19SRUNPUkRfUEFUSCA9IC8oXnxcXC8pZXhlY3V0aW9uXFwvZXhlY1xcLyg/OnBsYW5zfHJlc3VsdHMpXFwvW14vXStcXC5tZCQvO1xuXG5mdW5jdGlvbiBzdHJpcEVudHJ5TGluZVN1ZmZpeChlbnRyeTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgY29sb25JbmRleCA9IGVudHJ5Lmxhc3RJbmRleE9mKFwiOlwiKTtcbiAgY29uc3QgaGFzTGluZSA9IGNvbG9uSW5kZXggPiAwICYmIC9eXFxkKyQvLnRlc3QoZW50cnkuc2xpY2UoY29sb25JbmRleCArIDEpKTtcbiAgcmV0dXJuIGhhc0xpbmUgPyBlbnRyeS5zbGljZSgwLCBjb2xvbkluZGV4KSA6IGVudHJ5O1xufVxuXG5mdW5jdGlvbiBpc0V4ZWNQbGFuT3JSZXN1bHRQYXRoKHJlcG9zaXRvcnlQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIEVYRUNfUkVDT1JEX1BBVEgudGVzdChyZXBvc2l0b3J5UGF0aCk7XG59XG5cbmZ1bmN0aW9uIGdpdGh1YkJsb2JVcmwocmVwb3NpdG9yeVBhdGg6IHN0cmluZywgc291cmNlOiBHaXRIdWJTb3VyY2UpOiBzdHJpbmcge1xuICBjb25zdCByZXBvc2l0b3J5VXJsID0gc291cmNlLnJlcG9zaXRvcnlVcmwucmVwbGFjZSgvXFwvKyQvLCBcIlwiKTtcbiAgcmV0dXJuIGAke3JlcG9zaXRvcnlVcmx9L2Jsb2IvJHtzb3VyY2UuYnJhbmNofS8ke3JlcG9zaXRvcnlQYXRofWA7XG59XG5cbmZ1bmN0aW9uIHRvUmVwb3NpdG9yeVBhdGgoY3VycmVudFJlbFBhdGg6IHN0cmluZywgaHJlZlBhdGg6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRDdXJyZW50UGF0aCA9IGN1cnJlbnRSZWxQYXRoLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xuICBjb25zdCBub3JtYWxpemVkSHJlZlBhdGggPSBocmVmUGF0aC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgY29uc3Qgc2l0ZVBhdGggPSBub3JtYWxpemVkSHJlZlBhdGguc3RhcnRzV2l0aChcIi9cIilcbiAgICA/IHBhdGgubm9ybWFsaXplKG5vcm1hbGl6ZWRIcmVmUGF0aC5zbGljZSgxKSlcbiAgICA6IHBhdGgubm9ybWFsaXplKHBhdGguam9pbihwYXRoLmRpcm5hbWUobm9ybWFsaXplZEN1cnJlbnRQYXRoKSwgbm9ybWFsaXplZEhyZWZQYXRoKSk7XG5cbiAgaWYgKHNpdGVQYXRoID09PSBcIi4uXCIgfHwgc2l0ZVBhdGguc3RhcnRzV2l0aChcIi4uL1wiKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgcmV0dXJuIHNpdGVQYXRoLnN0YXJ0c1dpdGgoXCJkb2NzL1wiKSA/IHNpdGVQYXRoIDogYGRvY3MvJHtzaXRlUGF0aH1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmV3cml0ZUV4ZWNSZWNvcmRNYXJrZG93bkhyZWYoXG4gIGhyZWY6IHN0cmluZyxcbiAgY3VycmVudFJlbFBhdGg6IHN0cmluZyxcbiAgc291cmNlOiBHaXRIdWJTb3VyY2UsXG4pOiBzdHJpbmcge1xuICBpZiAoXG4gICAgaHJlZiA9PT0gXCJcIiB8fFxuICAgIGhyZWYuc3RhcnRzV2l0aChcIiNcIikgfHxcbiAgICBocmVmLnN0YXJ0c1dpdGgoXCIvL1wiKSB8fFxuICAgIC9eW2Etel1bYS16Ky4tXSo6L2kudGVzdChocmVmKVxuICApIHtcbiAgICByZXR1cm4gaHJlZjtcbiAgfVxuXG4gIGNvbnN0IG1hdGNoID0gaHJlZi5tYXRjaCgvXihbXj8jXSopKFs/I10uKik/JC8pO1xuICBpZiAoIW1hdGNoIHx8IG1hdGNoWzFdID09PSBcIlwiKSByZXR1cm4gaHJlZjtcblxuICBjb25zdCByZXBvc2l0b3J5UGF0aCA9IHRvUmVwb3NpdG9yeVBhdGgoY3VycmVudFJlbFBhdGgsIG1hdGNoWzFdKTtcbiAgaWYgKCFyZXBvc2l0b3J5UGF0aCB8fCAhaXNFeGVjUGxhbk9yUmVzdWx0UGF0aChyZXBvc2l0b3J5UGF0aCkpIHJldHVybiBocmVmO1xuXG4gIHJldHVybiBgJHtnaXRodWJCbG9iVXJsKHJlcG9zaXRvcnlQYXRoLCBzb3VyY2UpfSR7bWF0Y2hbMl0gPz8gXCJcIn1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUV4ZWNSZWNvcmRXaWtpbGluayhcbiAgaW5uZXI6IHN0cmluZyxcbiAgZG9jSW5kZXg6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+LFxuICBzb3VyY2U6IEdpdEh1YlNvdXJjZSxcbik6IFdpa2lsaW5rVGFyZ2V0IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgcGlwZUluZGV4ID0gaW5uZXIuaW5kZXhPZihcInxcIik7XG4gIGNvbnN0IGlkID0gcGlwZUluZGV4ID09PSAtMSA/IGlubmVyIDogaW5uZXIuc2xpY2UoMCwgcGlwZUluZGV4KTtcbiAgY29uc3QgZGlzcGxheVRleHQgPSBwaXBlSW5kZXggPT09IC0xID8gaWQgOiBpbm5lci5zbGljZShwaXBlSW5kZXggKyAxKTtcbiAgaWYgKCEvXlthLXpdW2EtejAtOTpfLV0rJC8udGVzdChpZCkpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgY29uc3QgZW50cnkgPSBkb2NJbmRleFtpZF07XG4gIGlmICghZW50cnkpIHJldHVybiB1bmRlZmluZWQ7XG4gIGNvbnN0IHJlcG9zaXRvcnlQYXRoID0gc3RyaXBFbnRyeUxpbmVTdWZmaXgoZW50cnkpLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTtcbiAgaWYgKCFpc0V4ZWNQbGFuT3JSZXN1bHRQYXRoKHJlcG9zaXRvcnlQYXRoKSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICByZXR1cm4ge1xuICAgIGRpc3BsYXlUZXh0LFxuICAgIGhyZWY6IGdpdGh1YkJsb2JVcmwocmVwb3NpdG9yeVBhdGgsIHNvdXJjZSksXG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlYLFNBQVMsb0JBQW9CO0FBQ3RaLFNBQVMsdUJBQXVCOzs7QUNTaEMsSUFBTSxlQUFlLENBQUMsS0FBYSxPQUFlLGdCQUFnQixHQUFHLElBQUksRUFBRTtBQUMzRSxJQUFNLFFBQVEsQ0FBQyxNQUFjLFFBQTZCO0FBQUEsRUFDeEQ7QUFBQSxFQUNBLE1BQU0sYUFBYSxVQUFVLEVBQUU7QUFDakM7QUFDQSxJQUFNLFlBQVksQ0FBQyxNQUFjLFFBQTZCO0FBQUEsRUFDNUQ7QUFBQSxFQUNBLE1BQU0sYUFBYSxjQUFjLEVBQUU7QUFDckM7QUFDQSxJQUFNLFdBQVcsQ0FBQyxNQUFjLFFBQTZCO0FBQUEsRUFDM0Q7QUFBQSxFQUNBLE1BQU0sYUFBYSxhQUFhLEVBQUU7QUFDcEM7QUFDQSxJQUFNLGFBQWEsQ0FBQyxNQUFjLFFBQTZCO0FBQUEsRUFDN0Q7QUFBQSxFQUNBLE1BQU0sYUFBYSxjQUFjLEVBQUU7QUFDckM7QUFDQSxJQUFNLFdBQVcsQ0FBQyxNQUFjLElBQVksV0FBd0M7QUFBQSxFQUNsRjtBQUFBLEVBQ0EsTUFBTSxhQUFhLGFBQWEsR0FBRyxFQUFFLFdBQVc7QUFBQSxFQUNoRCxHQUFJLFFBQVEsRUFBRSxXQUFXLE1BQU0sTUFBTSxJQUFJLENBQUM7QUFDNUM7QUFDQSxJQUFNLFNBQVMsQ0FBQyxNQUFjLElBQVksV0FBd0M7QUFBQSxFQUNoRjtBQUFBLEVBQ0EsTUFBTSxhQUFhLFdBQVcsR0FBRyxFQUFFLFNBQVM7QUFBQSxFQUM1QyxHQUFJLFFBQVEsRUFBRSxXQUFXLE1BQU0sTUFBTSxJQUFJLENBQUM7QUFDNUM7QUFDQSxJQUFNLFNBQVMsQ0FBQyxNQUFjLElBQVksV0FBd0M7QUFBQSxFQUNoRjtBQUFBLEVBQ0EsTUFBTSxhQUFhLFdBQVcsR0FBRyxFQUFFLFNBQVM7QUFBQSxFQUM1QyxHQUFJLFFBQVEsRUFBRSxXQUFXLE1BQU0sTUFBTSxJQUFJLENBQUM7QUFDNUM7QUFDQSxJQUFNLGFBQWEsQ0FBQyxNQUFjLElBQVksV0FBd0M7QUFBQSxFQUNwRjtBQUFBLEVBQ0EsTUFBTSxhQUFhLFdBQVcsYUFBYSxFQUFFLFNBQVM7QUFBQSxFQUN0RCxHQUFJLFFBQVEsRUFBRSxXQUFXLE1BQU0sTUFBTSxJQUFJLENBQUM7QUFDNUM7QUFDQSxJQUFNLFdBQVcsQ0FBQyxNQUFjLElBQVksV0FBd0M7QUFBQSxFQUNsRjtBQUFBLEVBQ0EsTUFBTSxhQUFhLGFBQWEsR0FBRyxFQUFFLFdBQVc7QUFBQSxFQUNoRCxHQUFJLFFBQVEsRUFBRSxXQUFXLE1BQU0sTUFBTSxJQUFJLENBQUM7QUFDNUM7QUFDQSxJQUFNLGVBQWUsQ0FBQyxN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O0FBQ2hCLGtCQUFNLEtBQUssY0FBYyxLQUFLLEVBQUU7QUFBQSxVQUNsQyxPQUFPO0FBQ0wsa0JBQU0sUUFBUSxNQUFNLEtBQUssUUFBUSxJQUFJLENBQUM7QUFDdEMsa0JBQU0sVUFBVSxLQUFLLEtBQUs7QUFBQSxVQUM1QjtBQUFBLFFBQ0Y7QUFFQSxjQUFNLE1BQU0sYUFBYTtBQUN6QixlQUFPO0FBQUEsTUFDVCxDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFBQSxFQUVBLE1BQU07QUFBQSxJQUNKLFdBQWdCLFdBQUtILGlCQUFnQixRQUFRO0FBQUEsSUFDN0MsU0FBUztBQUFBLE1BQ1AsdUJBQXVCO0FBQUEsUUFDckIsU0FBUztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsYUFBYTtBQUFBLFFBQ2IsVUFBVSxDQUFDLFNBQVMsWUFBWSxTQUFTLElBQUk7QUFBQSxNQUMvQyxDQUFDO0FBQUEsTUFDRCxjQUFjLGlCQUFpQixJQUFJO0FBQUEsTUFDbkMsa0JBQWtCO0FBQUEsUUFDaEIsU0FBUztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsYUFBYTtBQUFBLFFBQ2IsVUFBVSxDQUFDLFNBQVMsWUFBWSxTQUFTLElBQUk7QUFBQSxNQUMvQyxDQUFDO0FBQUEsTUFDRCxjQUFjLFlBQVksTUFBTSxJQUFJO0FBQUEsSUFDdEM7QUFBQSxJQUNBLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS0wsdUJBQXVCO0FBQUEsSUFDekI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicmVxdWlyZSIsICJleGlzdHNTeW5jIiwgIm1rZGlyU3luYyIsICJyZWFkZGlyU3luYyIsICJyZWFkRmlsZVN5bmMiLCAicm1TeW5jIiwgIndyaXRlRmlsZVN5bmMiLCAicGF0aCIsICJmaWxlVVJMVG9QYXRoIiwgImV4ZWNGaWxlU3luYyIsICJjcmVhdGVIYXNoIiwgImNyZWF0ZVJlcXVpcmUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCIsICJyZXF1aXJlIiwgImNyZWF0ZVJlcXVpcmUiLCAiY3JlYXRlSGFzaCIsICJleGVjRmlsZVN5bmMiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCIsICJleGlzdHNTeW5jIiwgInJlYWRkaXJTeW5jIiwgInBhdGgiLCAicmVhZEZpbGVTeW5jIiwgIm1rZGlyU3luYyIsICJ3cml0ZUZpbGVTeW5jIiwgInJtU3luYyIsICJmaWxlVVJMVG9QYXRoIiwgInBhdGgiLCAicmVsYXRpdmUiLCAicGF0aCIsICJleGlzdHNTeW5jIiwgIm1rZGlyU3luYyIsICJyZWFkRmlsZVN5bmMiLCAicmVhZGRpclN5bmMiLCAicm1TeW5jIiwgIndyaXRlRmlsZVN5bmMiLCAicGF0aCIsICJyZWFkRmlsZVN5bmMiLCAiZXhpc3RzU3luYyIsICJyZWFkZGlyU3luYyIsICJta2RpclN5bmMiLCAicm1TeW5jIiwgIndyaXRlRmlsZVN5bmMiLCAiZXhpc3RzU3luYyIsICJzdGF0U3luYyIsICJwYXRoIiwgImV4aXN0c1N5bmMiLCAic3RhdFN5bmMiLCAiZXhpc3RzU3luYyIsICJyZWFkZGlyU3luYyIsICJyZWFkRmlsZVN5bmMiLCAicGF0aCIsICJiYXNlIiwgImV4aXN0c1N5bmMiLCAicmVhZGRpclN5bmMiLCAicmVhZEZpbGVTeW5jIiwgInBhdGgiLCAicmVsYXRpdmUiLCAicGF0aCIsICJwYXRoIiwgImRvY0luZGV4IiwgInBhdGgiLCAiZXhpc3RzU3luYyIsICJyZWFkRmlsZVN5bmMiLCAicmVhZGRpclN5bmMiLCAiV09SS1NQQUNFX1JPT1QiLCAiZXhpc3RzU3luYyIsICJyZWFkRmlsZVN5bmMiLCAic3RyaXBFbnRyeUxpbmVTdWZmaXgiLCAicmVhZGRpclN5bmMiLCAicGF0aCIsICJiYXNlIiwgInJlbGF0aXZlIl0KfQo=
