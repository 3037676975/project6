export function renderWhyRag(step) {
  const scenes = [
    `
    <section class="scene wr wr-question">
      <div class="scene-kicker">INTERNAL KNOWLEDGE / QUESTION</div>
      <div class="wr-question-card">
        <span class="mono-label">QUERY_01</span>
        <h1>公司内部流程<br>到底怎么走？</h1>
        <div class="typing-line"><span></span></div>
      </div>
      <svg class="wr-question-link" viewBox="0 0 620 280" aria-hidden="true">
        <path class="draw-line" d="M20 140 H250 C330 140 320 70 400 70 H595" />
        <path class="broken-line" d="M250 245 H405 V150 H595" />
        <circle cx="595" cy="70" r="10" class="node-dot" />
      </svg>
      <div class="wr-model-block card">
        <span class="mono-label">LLM</span>
        <strong>回答很流畅</strong>
        <p>但它没有看到你的内部资料</p>
      </div>
      <div class="wr-data-block">
        <span class="mono-label">PRIVATE DOCS</span>
        <div class="doc-lines"><i></i><i></i><i></i><i></i></div>
        <b>NOT CONNECTED</b>
      </div>
    </section>`,
    `
    <section class="scene wr wr-definition">
      <div class="scene-kicker">RETRIEVAL-AUGMENTED GENERATION</div>
      <div class="wr-rag-title">
        <span class="hero-num">RAG</span>
        <div class="rule"></div>
        <p>检索增强生成</p>
      </div>
      <div class="wr-pipeline" aria-label="RAG核心关系">
        <div class="pipe-node is-active"><small>01</small><strong>检索资料</strong><span>RETRIEVE</span></div>
        <div class="pipe-arrow"><svg viewBox="0 0 180 40"><path class="draw-line" d="M4 20 H160"/><path class="draw-line" d="M145 7 L160 20 L145 33"/></svg></div>
        <div class="pipe-node"><small>02</small><strong>加入上下文</strong><span>CONTEXT</span></div>
        <div class="pipe-arrow"><svg viewBox="0 0 180 40"><path class="draw-line delay-1" d="M4 20 H160"/><path class="draw-line delay-1" d="M145 7 L160 20 L145 33"/></svg></div>
        <div class="pipe-node"><small>03</small><strong>生成回答</strong><span>GENERATE</span></div>
      </div>
      <div class="wr-formula mono-label">QUESTION + RETRIEVED CONTEXT → ANSWER</div>
    </section>`,
    `
    <section class="scene wr wr-search">
      <div class="scene-kicker">EXAMPLE / REIMBURSEMENT</div>
      <div class="search-query card">
        <span class="mono-label">QUERY</span>
        <h2>报销要什么材料？</h2>
      </div>
      <div class="search-field">
        <svg class="search-ray" viewBox="0 0 700 220" aria-hidden="true">
          <path class="draw-line" d="M15 110 H680" />
          <circle class="search-pulse" cx="500" cy="110" r="36" />
        </svg>
      </div>
      <div class="knowledge-stack">
        <article class="knowledge-doc"><span>DOC_A</span><b>差旅制度</b><i></i><i></i><i></i></article>
        <article class="knowledge-doc is-hit"><span>DOC_B</span><b>报销说明</b><i></i><i></i><i></i></article>
        <article class="knowledge-doc"><span>DOC_C</span><b>采购流程</b><i></i><i></i><i></i></article>
      </div>
      <div class="search-caption"><span>KNOWLEDGE BASE</span><strong>找到最相关的制度和说明</strong></div>
    </section>`,
    `
    <section class="scene wr wr-context">
      <div class="scene-kicker">CONTEXT ASSEMBLY</div>
      <div class="context-source">
        <span class="mono-label">RETRIEVED</span>
        <div class="segment-stack">
          <div class="segment is-selected">报销说明 · 相关片段 A</div>
          <div class="segment">差旅制度 · 片段 B</div>
          <div class="segment is-selected">报销说明 · 相关片段 C</div>
        </div>
      </div>
      <svg class="context-flow" viewBox="0 0 500 380" aria-hidden="true">
        <path class="draw-line" d="M20 90 H200 V190 H470" />
        <path class="draw-line delay-1" d="M20 290 H200 V190" />
      </svg>
      <div class="context-prompt card">
        <span class="mono-label">PROMPT CONTEXT</span>
        <div class="prompt-row"><b>Q</b><span>报销要什么材料？</span></div>
        <div class="prompt-row"><b>C</b><span>只放最相关的资料片段</span></div>
      </div>
      <div class="context-model">
        <div class="model-core">LLM</div>
        <div class="answer-line"><i></i><i></i><i></i></div>
        <strong>基于上下文组织答案</strong>
      </div>
    </section>`
  ];
  return scenes[Math.max(0, Math.min(step, scenes.length - 1))];
}
