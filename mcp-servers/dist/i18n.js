/**
 * Multi-language support framework for Humanity4AI MCP handlers.
 * Provides locale-aware reply templates for all 11 skills.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
export const SUPPORTED_LOCALES = [
    "en", "zh", "es", "fr", "de", "ja", "ko", "ar", "pt"
];
export function normalizeLocale(locale) {
    const lower = locale.toLowerCase();
    if (lower.startsWith("zh"))
        return "zh";
    if (lower.startsWith("es"))
        return "es";
    if (lower.startsWith("fr"))
        return "fr";
    if (lower.startsWith("de"))
        return "de";
    if (lower.startsWith("ja"))
        return "ja";
    if (lower.startsWith("ko"))
        return "ko";
    if (lower.startsWith("ar"))
        return "ar";
    if (lower.startsWith("pt"))
        return "pt";
    return "en";
}
// ─── Supportive Reply i18n ────────────────────────────────────────────────────
const supportiveReplies = {
    en: "I hear you, and I am glad you reached out. You shared: \"{message}\". It makes sense that things feel heavy right now. You do not have to have it all figured out — let us focus on one small step at a time.",
    zh: "我听到了，我很高兴你能说出来。你说：\"{message}\"。感到沉重是很正常的。你不需要一下子把所有事情都弄清楚——我们先专注于一小步。",
    es: "Te escucho y me alegra que hayas contactado. Compartiste: \"{message}\". Tiene sentido que las cosas se sientan pesadas ahora. No tienes que tenerlo todo resuelto — enfoquémonos en un pequeño paso a la vez.",
    fr: "Je t'entends, et je suis content que tu aies tendu la main. Tu as partagé : \"{message}\". Il est normal que les choses semblent lourdes en ce moment. Tu n'as pas à tout comprendre — concentrons-nous sur un petit pas à la fois.",
    de: "Ich höre dich und bin froh, dass du dich gemeldet hast. Du hast gesagt: \"{message}\". Es ergibt Sinn, dass sich die Dinge gerade schwer anfühlen. Du musst nicht alles auf einmal lösen — lass uns einen kleinen Schritt nach dem anderen machen.",
    ja: "あなたの声を聞いています。連絡してくれて嬉しいです。「{message}」とおっしゃいましたね。今、物事が重く感じるのは自然なことです。すべてを一度に解決する必要はありません——小さな一歩ずつ進みましょう。",
    ko: "들어드렸습니다. 연락 주셔서 감사합니다. \"{message}\"라고 말씀하셨네요. 지금 일이 무겁게 느껴지는 것은 당연합니다. 모든 것을 한 번에 해결할 필요는 없습니다 — 작은 한 걸음씩 나아가요.",
    ar: "أسمعك، وأنا سعيد لأنك تواصلت معنا. لقد شاركت: \"{message}\". من المنطقي أن تشعر الأمور بثقلها الآن. ليس عليك أن تفهم كل شيء — دعنا نركز على خطوة صغيرة في كل مرة.",
    pt: "Eu ouço você e fico feliz que tenha entrado em contato. Você compartilhou: \"{message}\". Faz sentido que as coisas pareçam pesadas agora. Você não precisa ter tudo resolvido — vamos focar em um pequeno passo de cada vez.",
};
export function getSupportiveReply(message, locale) {
    const template = supportiveReplies[locale] || supportiveReplies.en;
    return template.replace("{message}", message);
}
// ─── Crisis Resources i18n ────────────────────────────────────────────────────
const crisisResources = {
    en: { primary: "US: 988 Suicide & Crisis Lifeline", secondary: "UK: Samaritans 116 123" },
    zh: { primary: "中国: 希望24热线 400-161-9995", secondary: "香港: 撒玛利亚会 2896 0000" },
    es: { primary: "España: Teléfono de la Esperanza 717 003 717", secondary: "México: SAPTEL 55 5259 8121" },
    fr: { primary: "France: SOS Amitié 09 72 39 40 50", secondary: "Suisse: La Main Tendue 143" },
    de: { primary: "Deutschland: Telefonseelsorge 0800 111 0 111", secondary: "Österreich: Telefonseelsorge 142" },
    ja: { primary: "日本: いのちの電話 0120-783-556", secondary: "東京: よりそいホットライン 0120-279-338" },
    ko: { primary: "한국: 자살예방핫라인 1393", secondary: "생명의 전화 1588-9191" },
    ar: { primary: "مصر: الخط الساخن للصحة النفسية 0800-888-0700", secondary: "السعودية: استشاراتك 920033360" },
    pt: { primary: "Brasil: CVV 188", secondary: "Portugal: SOS Voz Amiga 213 544 545" },
};
export function getLocalizedCrisisResources(locale) {
    return crisisResources[locale] || crisisResources.en;
}
// ─── WCAG AA Assessment i18n ──────────────────────────────────────────────────
const wcagCategories = {
    en: {
        colorContrast: "Colour Contrast",
        keyboardNav: "Keyboard Navigation",
        semanticHtml: "Semantic HTML",
        ariaLabels: "ARIA Labels",
        formLabels: "Form Labels",
        headingStructure: "Heading Structure",
        focusOrder: "Focus Order",
        score: "Accessibility Score",
        heuristic: "heuristic",
    },
    zh: { colorContrast: "颜色对比", keyboardNav: "键盘导航", semanticHtml: "语义HTML", ariaLabels: "ARIA标签", formLabels: "表单标签", headingStructure: "标题结构", focusOrder: "焦点顺序", score: "无障碍得分", heuristic: "启发式" },
    es: { colorContrast: "Contraste de Color", keyboardNav: "Navegación por Teclado", semanticHtml: "HTML Semántico", ariaLabels: "Etiquetas ARIA", formLabels: "Etiquetas de Formulario", headingStructure: "Estructura de Encabezados", focusOrder: "Orden de Foco", score: "Puntuación de Accesibilidad", heuristic: "heurístico" },
    fr: { colorContrast: "Contraste des Couleurs", keyboardNav: "Navigation au Clavier", semanticHtml: "HTML Sémantique", ariaLabels: "Étiquettes ARIA", formLabels: "Étiquettes de Formulaire", headingStructure: "Structure des Titres", focusOrder: "Ordre de Focus", score: "Score d'Accessibilité", heuristic: "heuristique" },
    de: { colorContrast: "Farbkontrast", keyboardNav: "Tastaturnavigation", semanticHtml: "Semantisches HTML", ariaLabels: "ARIA-Labels", formLabels: "Formularbeschriftungen", headingStructure: "Überschriftenstruktur", focusOrder: "Fokusreihenfolge", score: "Barrierefreiheitsbewertung", heuristic: "heuristisch" },
    ja: { colorContrast: "色のコントラスト", keyboardNav: "キーボードナビゲーション", semanticHtml: "セマンティックHTML", ariaLabels: "ARIAラベル", formLabels: "フォームラベル", headingStructure: "見出し構造", focusOrder: "フォーカス順序", score: "アクセシビリティスコア", heuristic: "ヒューリスティック" },
    ko: { colorContrast: "색상 대비", keyboardNav: "키보드 탐색", semanticHtml: "시맨틱 HTML", ariaLabels: "ARIA 레이블", formLabels: "폼 레이블", headingStructure: "제목 구조", focusOrder: "포커스 순서", score: "접근성 점수", heuristic: "휴리스틱" },
    ar: { colorContrast: "تباين الألوان", keyboardNav: "التنقل بلوحة المفاتيح", semanticHtml: "HTML الدلالي", ariaLabels: "تسميات ARIA", formLabels: "تسميات النموذج", headingStructure: "هيكل العناوين", focusOrder: "ترتيب التركيز", score: "درجة إمكانية الوصول", heuristic: "إرشادي" },
    pt: { colorContrast: "Contraste de Cores", keyboardNav: "Navegação por Teclado", semanticHtml: "HTML Semântico", ariaLabels: "Rótulos ARIA", formLabels: "Rótulos de Formulário", headingStructure: "Estrutura de Cabeçalhos", focusOrder: "Ordem de Foco", score: "Pontuação de Acessibilidade", heuristic: "heurístico" },
};
export function getLocalizedCategory(category, locale) {
    const cat = wcagCategories[locale] || wcagCategories.en;
    return cat[category] || category;
}
//# sourceMappingURL=i18n.js.map