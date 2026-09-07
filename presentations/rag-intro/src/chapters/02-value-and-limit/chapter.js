export function renderValueAndLimit(step) {
  const scenes = [
    `
    <section class="scene vl vl-update">
      <div class="scene-kicker">KNOWLEDGE UPDATE</div>
      <div class="update-grid">
        <div class="update-path is-good">
          <span class="mono-label">RAG PATH</span>
          <div class="db-stack"><i></i><i></i><i></i></div>
          <strong>更新知识库</strong>
          <div class="update-arrow">→</div>
          <b>立即使用新资料</b>
        </div>
        <div class="update-divider"></div>
        <div class="update-path is-heavy">
          <span class="mono-label">MODEL RETRAIN</span>
          <div class="model-cube"><i></i><i></i><i></i></div>
          <strong>重新训练模型</strong>
          <div class="strike-line"></div>
          <b>不是每次更新都要做</b>
        </div>
      </div>
      <div class="update-caption hero-num">UPDATE ≠ RETRAIN</div>
    </section>`,
    `
    <section class="scene vl vl-trace">
      <div class="scene-kicker">TRACEABLE ANSWER</div>
      <div class="trace-answer card">
        <span class="mono-label">ANSWER</span>
        <h2>答案不只要“像真的”</h2>
        <p>还要能回到它引用的资料</p>
      </div>
      <svg class="trace-lines" viewBox="0 0 760 520" aria-hidden="true">
        <path class="draw-line" d="M20 80 H300 V130 H735" />
        <path class="draw-line delay-1" d="M20 250 H360 V250 H735" />
        <path class="draw-line delay-2" d="M20 420 H420 V370 H735" />
      </svg>
      <div class="trace-docs">
        <article class="trace-doc"><span>DOC_01</span><b>制度正文</b><small>相关段落</small></article>
        <article class="trace-doc"><span>DOC_02</span><b>报销说明</b><small>命中片段</small></article>
        <article class="trace-doc"><span>DOC_03</span><b>流程附件</b><small>补充依据</small></article>
      </div>
      <div class="trace-caption">DOCUMENT → SEGMENT → ANSWER</div>
    </section>`,
    `
    <section class="scene vl vl-risk">
      <div class="scene-kicker">PIPELINE RISK</div>
      <div class="risk-track">
        <div class="risk-node"><span>01</span><strong>切片</strong><small>CHUNK</small></div>
        <div class="risk-edge is-on"></div>
        <div class="risk-node is-break"><span>02</span><strong>召回</strong><small>RECALL</small><b>MISS</b></div>
        <div class="risk-edge is-off"></div>
        <div class="risk-node is-dim"><span>03</span><strong>上下文</strong><small>CONTEXT</small></div>
        <div class="risk-edge is-off"></div>
        <div class="risk-node is-dim"><span>04</span><strong>生成</strong><small>ANSWER</small></div>
      </div>
      <svg class="risk-wave" viewBox="0 0 1300 180" aria-hidden="true">
        <path class="risk-wave-line" d="M20 90 C120 20 220 160 320 90 S520 20 620 90 S820 160 920 90 S1120 20 1280 90" />
      </svg>
      <div class="risk-caption"><strong>前面找错了</strong><span>后面的模型再强也很难救</span></div>
    </section>`,
    `
    <section class="scene vl vl-chunk">
      <div class="scene-kicker">CHUNK + RETRIEVAL</div>
      <div class="chunk-source card">
        <span class="mono-label">SOURCE DOC</span>
        <div class="source-lines"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <svg class="chunk-cut" viewBox="0 0 420 500" aria-hidden="true">
        <path class="draw-line" d="M210 20 V470" />
        <path class="cut-mark" d="M165 90 H255 M165 205 H255 M165 320 H255" />
      </svg>
      <div class="chunk-pieces">
        <div class="chunk-piece"><span>A</span><b>定义</b></div>
        <div class="chunk-piece is-hit"><span>B</span><b>报销材料</b></div>
        <div class="chunk-piece"><span>C</span><b>审批边界</b></div>
      </div>
      <div class="chunk-query">资料怎么切，决定系统更容易找到什么</div>
    </section>`,
    `
    <section class="scene vl vl-recall">
      <div class="scene-kicker">RECALL CHECK</div>
      <div class="recall-query hero-num">正确资料<br>进来了吗？</div>
      <div class="recall-context card">
        <span class="mono-label">CONTEXT WINDOW</span>
        <div class="recall-slot is-wrong">采购流程</div>
        <div class="recall-slot is-right">报销说明</div>
        <div class="recall-slot is-wrong">差旅预订</div>
      </div>
      <svg class="recall-focus" viewBox="0 0 520 520" aria-hidden="true">
        <circle class="focus-ring" cx="260" cy="260" r="170" />
        <circle class="focus-ring delay-1" cx="260" cy="260" r="110" />
        <path class="draw-line" d="M260 20 V110 M260 410 V500 M20 260 H110 M410 260 H500" />
      </svg>
      <div class="recall-caption">RETRIEVAL QUALITY BEFORE GENERATION QUALITY</div>
    </section>`,
    `
    <section class="scene vl vl-final">
      <div class="scene-kicker">CONTROL / CITATION</div>
      <div class="final-core">
        <span class="mono-label">RAG CONTROL LOOP</span>
        <h1>找得到<br><span>引得出</span></h1>
        <div class="rule"></div>
        <p>答案用了什么资料，能不能追溯？</p>
      </div>
      <div class="final-flow">
        <div><small>01</small><strong>切片 / 检索</strong></div>
        <svg viewBox="0 0 150 40"><path class="draw-line" d="M5 20 H135"/><path class="draw-line" d="M120 8 L135 20 L120 32"/></svg>
        <div><small>02</small><strong>正确召回</strong></div>
        <svg viewBox="0 0 150 40"><path class="draw-line delay-1" d="M5 20 H135"/><path class="draw-line delay-1" d="M120 8 L135 20 L120 32"/></svg>
        <div><small>03</small><strong>来源引用</strong></div>
      </div>
      <div class="final-stamp">TRACEABLE / CONTROLLABLE</div>
    </section>`
  ];
  return scenes[Math.max(0, Math.min(step, scenes.length - 1))];
}
