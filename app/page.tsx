"use client"

import { useState, type CSSProperties, type ReactNode } from "react"

const STEPS = [
  {
    title: "开始之前：你不需要会什么",
    content: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>聊天模型在「看」哪些词？</div>
          <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}>
            这份讲解给<b>完全没学过 AI</b> 的人。看完你能用自己的话说明：当模型读到「北京的天气怎么样」里的「怎么样」时，它为什么会去盯着「天气」，而不是随便一个词。
          </div>
        </Card>

        <div style={{ background: "#F4F8FD", border: "0.5px solid #C9DDF3", borderLeft: "3px solid #378ADD", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0C447C", marginBottom: 8 }}>先记住一件事</div>
          <div style={{ fontSize: 13, color: "#334", lineHeight: 1.8 }}>
            语言模型做的事很单一：<b>猜下一个词</b>。为了猜得准，它得先搞清楚——前面哪些词和当前这个词有关。后面每一步，都是在拆开「它到底怎么决定看谁」。
          </div>
        </div>

        <Card>
          <Label>你不需要会这些</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#444", lineHeight: 1.7 }}>
            {[
              { ok: "会小学加减乘除就够", no: "不用编程、不用微积分、不用读英文论文" },
              { ok: "主路径点「下一步」就能走完", no: "遇到折叠的「补充」，跳过也完全没关系" },
              { ok: "数字都可以用手算核对", no: "这里把几千维简化成 4 个数，只为了能看清" },
            ].map(({ ok, no }) => (
              <div key={ok}>
                <div style={{ fontWeight: 600, color: "#085041" }}>{ok}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{no}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Label>路上会碰到的四个词（现在知道个大概就行）</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { k: "模型", v: "一个靠海量文本练出来的猜词机器，不是会思考的人" },
              { k: "token", v: "切出来的一小块文字。这里按整词切，方便看；真实模型往往切得更碎" },
              { k: "向量", v: "一串数字，用来表示一个词。可以把它想成这个词的身份证号码" },
              { k: "注意力", v: "决定「当前这个词该看前面哪些词、看多少」的那套打分办法" },
            ].map(({ k, v }) => (
              <div key={k} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "#0C447C", width: 48, flexShrink: 0 }}>{k}</div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    ),
  },
  {
    title: "第 1 步：用户输入句子",
    content: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card>
          <Label>用户输入</Label>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: 6, textAlign: "center", margin: "12px 0", color: "#1a1a1a" }}>
            北京 的 天气 怎么样
          </div>
        </Card>
        <Card>
          <Label>模型先把句子切成一块块 token</Label>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "12px 0", flexWrap: "wrap" }}>
            {["北京", "的", "天气", "怎么样"].map((w) => (
              <div key={w} style={{ textAlign: "center" }}>
                <div style={tokenStyle()}>{w}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>token</div>
              </div>
            ))}
          </div>
          <Muted>
            这里按整词切，只是为了好看。真实模型常常切得更碎，但不影响后面要讲的「看谁」。
          </Muted>
        </Card>
        <Card>
          <Label>它接下来要做的，是猜再往后的词</Label>
          <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}>
            模型从左到右一个词一个词往外写。写到「怎么样」时，它并不是在「理解人生」，而是在问：<b>前面哪些词，能帮我猜对下一个词？</b>
          </div>
          <Muted>后面整份讲解，都只盯着「怎么样」这一个词，看它怎么决定把注意力分给谁。</Muted>
        </Card>
      </div>
    ),
  },
  {
    title: "第 2 步：每个词变成数字向量",
    content: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Card>
          <Label>每个词变成一串数字，叫 Embedding（词向量）</Label>
          <div style={{ fontSize: 11, color: "#aaa", textAlign: "center", margin: "10px 0 4px", fontFamily: "monospace" }}>
            [ {DIMS.join("　")} ]
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "4px 0 12px", justifyContent: "center" }}>
            {WORDS.map((w, i) => (
              <div key={w} style={{ textAlign: "center", minWidth: 120 }}>
                <div style={tokenStyle()}>{w}</div>
                <div style={{ fontSize: 11, color: "#378ADD", fontFamily: "monospace", marginTop: 6 }}>
                  [{VEC[i].map((v) => v.toFixed(1)).join(", ")}]
                </div>
              </div>
            ))}
          </div>
          <Muted>
            这些数字是词的“身份证”。维度名字（地点感、气象感…）是我们为了好讲临时起的；真实模型是几千维，每一维代表什么人类读不懂。词的先后顺序模型另外有办法记住，这份讲解先跳过，不影响看懂后面的打分。
          </Muted>
        </Card>

        <Bridge title="接下来要解决的问题：这 4 个向量目前互不相干">
          <div style={{ marginBottom: 10 }}>
            模型现在只知道每个词单独是什么意思，还不知道<b>它们之间的关系</b>。只想先往下走的话，记住一句就行：<b>先给前面每个词打分，再按分数把含义揉进来</b>。招聘比方用来解释「为什么正好是三种向量」——可以慢慢看，也可以先跳到第 3 步。
          </div>
          <div style={{ marginBottom: 10 }}>
            要让“怎么样”明白自己是在问天气，只需要做两件事：
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { n: "①", t: "打分", d: "给前面每个词打一个“和我有多相关”的分数" },
              { n: "②", t: "混合", d: "按分数高低，把这些词的含义按比例揉进自己身上" },
            ].map(({ n, t, d }) => (
              <div key={n} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <div style={{ color: "#378ADD", fontWeight: 600 }}>{n}</div>
                <div>
                  <b>{t}</b>
                  <span style={{ color: "#777" }}>　{d}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10 }}>
            麻烦的是，这两件事需要的信息<b>不是同一种</b>。用招聘来类比，一眼就明白为什么正好是三种：
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {[
              {
                n: "①",
                t: "打分：招聘方看简历",
                bg: "#E6F1FB",
                border: "#185FA5",
                text: "#0C447C",
                rows: [
                  { k: "招聘方要写清楚", v: "“我要找一个会 Python 的后端”", tag: "我在找什么", role: "Q" },
                  { k: "应聘者要写清楚", v: "“我是后端，会 Python”", tag: "我是什么", role: "K" },
                ],
                note: "两边角色完全不对称：一个在提需求，一个在亮标签。用同一份信息表达不了，所以必须拆成两个向量。",
              },
              {
                n: "②",
                t: "混合：录用后他带来什么",
                bg: "#FAEEDA",
                border: "#BA7517",
                text: "#633806",
                rows: [{ k: "真正交付的", v: "十年架构经验、踩过的坑、代码风格……", tag: "我能提供什么内容", role: "V" }],
                note: "简历上那句“会 Python”只是用来被搜到的标签，不等于他实际能干的活。招人看的是标签，用人用的是本事——两者必须分开。",
              },
            ].map(({ n, t, bg, border, text, rows, note }) => (
              <div key={n} style={{ background: bg, border: `0.5px solid ${border}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 8 }}>
                  {n} {t}
                </div>
                {rows.map(({ k, v, tag, role }) => (
                  <div key={role} style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: text, opacity: 0.7, width: 82, flexShrink: 0 }}>{k}</div>
                    <div style={{ fontSize: 12, color: text, flex: 1, minWidth: 150 }}>{v}</div>
                    <div style={{ fontSize: 11, color: text, opacity: 0.8, background: "rgba(255,255,255,0.7)", borderRadius: 5, padding: "2px 7px" }}>
                      {tag} → <b style={{ fontFamily: "monospace" }}>{role}</b>
                    </div>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: text, opacity: 0.75, lineHeight: 1.7, marginTop: 6 }}>{note}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 10 }}>
            换回句子：<b>“怎么样”</b>是招聘方（我在找一个能被问状态的东西），<b>“天气”</b>是应聘者（我是气象类概念），录用之后“天气”交付的是它<b>完整的语义内容</b>。
            这三种用途各配一个专用向量，就是下一步的 <b>Q / K / V</b>。
          </div>

          <div style={{ marginTop: 10 }} />
          <Detail title="补充（可以后看）：为什么不能省成两个、甚至一个">
            <WhyThree />
          </Detail>
        </Bridge>
      </div>
    ),
  },
  {
    title: "第 3 步：每个词变出三个向量 Q / K / V",
    content: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Card>
          <Label>把上一步的三种用途，各配一个专用向量</Label>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {[
              { role: "Q — Query（查询）", use: "用来 ① 打分", eq: "词向量 × Wq", meaning: "我在找什么", example: "“怎么样”的Q：我在找气象/状态类词", bg: "#E1F5EE", border: "#1D9E75", text: "#085041" },
              { role: "K — Key（键）", use: "用来 ① 打分", eq: "词向量 × Wk", meaning: "我能被什么找到", example: "“天气”的K：我是气象类概念", bg: "#EEEDFE", border: "#534AB7", text: "#3C3489" },
              { role: "V — Value（值）", use: "用来 ② 混合", eq: "词向量 × Wv", meaning: "找到我能得到什么", example: "“天气”的V：天气的完整语义", bg: "#FAEEDA", border: "#BA7517", text: "#633806" },
            ].map(({ role, use, eq, meaning, example, bg, border, text }) => (
              <div key={role} style={{ flex: 1, minWidth: 150, background: bg, border: `0.5px solid ${border}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontWeight: 600, color: text, fontSize: 13, marginBottom: 2 }}>{role}</div>
                <div style={{ fontSize: 11, color: text, opacity: 0.7, marginBottom: 6 }}>{use}</div>
                <div style={{ fontSize: 11, color: text, opacity: 0.8, fontFamily: "monospace" }}>{eq}</div>
                <div style={{ fontSize: 12, color: text, marginTop: 6 }}>含义：{meaning}</div>
                <div style={{ fontSize: 11, color: text, opacity: 0.75, marginTop: 4 }}>{example}</div>
              </div>
            ))}
          </div>
          <Muted style={{ marginTop: 10 }}>
            一句话记住：<b>Q 和 K 负责决定“看谁”，V 负责提供“看到的内容”</b>。后面第 4、5 步用 Q 和 K，第 6 步用 V。
          </Muted>
        </Card>

        <Detail title="补充（可以后看）：“乘以一个矩阵”到底在做什么">
          <MatrixExplain />
        </Detail>

        <Detail title="补充（可以后看）：Wq / Wk / Wv 这三个矩阵是怎么来的">
          <Training />
        </Detail>
      </div>
    ),
  },
  {
    title: "第 4 步：Q 和每个 K 做点积打分",
    content: () => {
      const scores = WORDS.map((w, i) => ({
        w,
        k: fmtVec(K_AFTER[i]),
        score: ATTN_SCORES[i],
        pct: (ATTN_SCORES[i] / ATTN_MAX) * 100,
        hi: i === 2,
      }))
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card>
            <Label>这就是上一步说的 ① 打分：“怎么样”的 Q 去和每个词的 K 做点积</Label>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#666", margin: "8px 0" }}>
              “怎么样”的 Q = {fmtVec(Q_HOW)}
            </div>
            {scores.map(({ w, k, score, pct, hi }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 52, textAlign: "right", fontWeight: hi ? 600 : 400, color: hi ? "#085041" : "#333", fontSize: 13 }}>{w}</div>
                <div style={{ fontSize: 10, color: "#aaa", fontFamily: "monospace", width: 120, flexShrink: 0 }}>{k}</div>
                <div style={{ flex: 1, height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: hi ? "#1D9E75" : "#85B7EB", borderRadius: 4, transition: "width 0.4s" }} />
                </div>
                <div style={{ width: 36, fontWeight: hi ? 600 : 400, color: hi ? "#085041" : "#666", fontSize: 13 }}>{score.toFixed(2)}</div>
              </div>
            ))}
            <Muted>
              “天气”得分最高（{ATTN_SCORES[2].toFixed(2)}），因为它的 K 和“怎么样”的 Q 最合拍——这是训练推出来的，不是人写的规则。下面四个分数都可以用同一套乘法加总核对。
            </Muted>
          </Card>

          <Detail title="补充：“点积”是什么？就是比“合不合拍”">
            <div style={{ marginBottom: 8 }}>
              点积 = <b>对应位置相乘，然后全部加起来</b>。先抛开 AI，假设你和两个朋友对三样东西的喜好各打一个分（-5 到 5）：
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 12 }}>
              {[
                { name: "", cells: ["火锅", "跑步", "恐怖片"], head: true },
                { name: "你", cells: ["5", "3", "-4"] },
                { name: "朋友A", cells: ["4", "2", "-5"] },
                { name: "朋友B", cells: ["-3", "-1", "5"] },
              ].map(({ name, cells, head }) => (
                <div key={name || "head"} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 48, color: head ? "#aaa" : "#333", fontWeight: head ? 400 : 600 }}>{name}</div>
                  {cells.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 56,
                        textAlign: "center",
                        padding: "3px 0",
                        borderRadius: 5,
                        background: head ? "transparent" : "#f2f2f0",
                        color: head ? "#aaa" : "#333",
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontFamily: "monospace", fontSize: 12, lineHeight: 1.9 }}>
              <div style={{ color: "#085041" }}>
                你 · 朋友A = 5×4 + 3×2 + (-4)×(-5) = <span style={{ fontWeight: 600, fontSize: 14 }}>46</span>　很像
              </div>
              <div style={{ color: "#993C1D" }}>
                你 · 朋友B = 5×(-3) + 3×(-1) + (-4)×5 = <span style={{ fontWeight: 600, fontSize: 14 }}>-38</span>　相反
              </div>
            </div>
            <div style={{ marginTop: 10, color: "#888" }}>
              同号相乘得正（加分），异号相乘得负（扣分）—— 所以点积天然就是个“相似度打分器”。
              Q 和 K 做点积，就是在问：这个词<b>想找的东西</b>，和那个词<b>能提供的东西</b>，对不对得上。
            </div>
          </Detail>

          <Detail title="补充：这四个分数是怎么乘出来的">
            <div style={{ marginBottom: 8 }}>
              每一项都是：Q 和那个词的 K，<b>对应位置相乘，再全部加起来</b>。Q = {fmtVec(Q_HOW)}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.9, color: "#444" }}>
              {WORDS.map((w, i) => {
                const k = K_AFTER[i]
                const terms = Q_HOW.map((q, d) => `${q.toFixed(1)}×${k[d].toFixed(1)}`)
                return (
                  <div key={w} style={{ color: i === 2 ? "#085041" : "#555", fontWeight: i === 2 ? 600 : 400 }}>
                    {w}：{terms.join(" + ")} = {ATTN_SCORES[i].toFixed(2)}
                  </div>
                )
              })}
            </div>
          </Detail>
        </div>
      )
    },
  },
  {
    title: "第 5 步：Softmax 把分数变成权重",
    content: () => {
      const items = WORDS.map((w, i) => ({
        w,
        raw: ATTN_SCORES[i].toFixed(2),
        weight: ATTN_WEIGHTS[i].toFixed(2),
        pct: ATTN_WEIGHTS[i] * 100,
        hi: i === 2,
      }))
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card>
            <Label>Softmax：把原始分数压缩成加起来等于 1 的权重</Label>
            <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>原始分数</div>
                {items.map(({ w, raw, hi }) => (
                  <div key={w} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", borderRadius: 6, marginBottom: 4, background: hi ? "#E1F5EE" : "#f7f7f5", color: hi ? "#085041" : "#333", fontSize: 13 }}>
                    <span>{w}</span><span style={{ fontFamily: "monospace" }}>{raw}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", fontSize: 20, color: "#aaa" }}>→</div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>注意力权重（合计 = 1）</div>
                {items.map(({ w, weight, pct, hi }) => (
                  <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 44, fontSize: 13, color: hi ? "#085041" : "#333", fontWeight: hi ? 600 : 400 }}>{w}</div>
                    <div style={{ flex: 1, height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: hi ? "#1D9E75" : "#85B7EB", borderRadius: 4 }} />
                    </div>
                    <div style={{ width: 36, fontSize: 13, color: hi ? "#085041" : "#666", fontFamily: "monospace" }}>{weight}</div>
                  </div>
                ))}
              </div>
            </div>
            <Muted style={{ marginTop: 10 }}>
              天气约占 {(ATTN_WEIGHTS[2] * 100).toFixed(0)}%，自己约 {(ATTN_WEIGHTS[3] * 100).toFixed(0)}%，北京约 {(ATTN_WEIGHTS[0] * 100).toFixed(0)}%，「的」约 {(ATTN_WEIGHTS[1] * 100).toFixed(0)}%。天气仍然最高，但不是只看一个词——这才是把上面那四个分数做 Softmax 的真实结果。
            </Muted>
          </Card>
          <Detail title="补充：为什么非要转成“加起来等于 1”">
            因为下一步要按这些数字<b>分配比例</b>。原始分数（{ATTN_SCORES[0].toFixed(2)}、{ATTN_SCORES[2].toFixed(2)}…）没有上限，直接拿去混合，结果会越加越大、数值失控。
            压成合计为 1 之后，它就变成了标准的“百分比”：天气约占 {(ATTN_WEIGHTS[2] * 100).toFixed(0)}%、自己约占 {(ATTN_WEIGHTS[3] * 100).toFixed(0)}%…… 混出来的向量始终保持在合理范围内。
          </Detail>
        </div>
      )
    },
  },
  {
    title: "第 6 步：按权重加权 Value，得到理解结果",
    content: () => {
      const order = [2, 3, 0, 1]
      const notes = ["有一定贡献", "最少", "贡献最多", "自己也看一点"]
      const items = order.map((i) => ({
        w: WORDS[i],
        p: ATTN_WEIGHTS[i].toFixed(2),
        note: notes[i],
        hi: i === 2,
        dim: i === 1,
        share: ATTN_WEIGHTS[i] * 100,
      }))
      const barColors = ["#1D9E75", "#85B7EB", "#B7D3F0", "#e8e8e8"]
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card>
            <Label>这就是 ② 混合：按权重对每个词的 V 向量加权求和</Label>
            <div style={{ margin: "10px 0" }}>
              {items.map(({ w, p, note, hi, dim }) => (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, opacity: dim ? 0.4 : 1 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 13, color: hi ? "#085041" : "#555", fontWeight: hi ? 600 : 400, width: 36 }}>{p}</div>
                  <div style={{ fontSize: 13, color: "#555" }}>×</div>
                  <div style={{ padding: "4px 12px", borderRadius: 6, background: hi ? "#FAEEDA" : "#f7f7f5", border: `0.5px solid ${hi ? "#BA7517" : "#e0e0e0"}`, fontSize: 13, color: hi ? "#633806" : "#333" }}>“{w}”的 V</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{note}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 4 }}>
              {items.map((item, i) => (
                <div key={item.w} style={{ width: `${item.share}%`, background: barColors[i] }} />
              ))}
            </div>
            <Muted>
              新向量里大约一半来自“天气”，其余掺了自己、北京和一点“的”——一杯以天气为主的混合饮料。
            </Muted>
          </Card>

          <div style={{ background: "#E1F5EE", border: "0.5px solid #1D9E75", borderRadius: 10, padding: "12px 16px", borderLeft: "3px solid #1D9E75" }}>
            <div style={{ fontWeight: 600, color: "#085041", fontSize: 14 }}>输出：主要包含“天气”的语义，也带一点“北京”和它自己</div>
            <div style={{ fontSize: 12, color: "#0F6E56", marginTop: 4 }}>模型就这样知道“怎么样”在问天气的状态，而不是北京的位置。</div>
          </div>

          <Detail title="补充：“加权求和”是什么？就是按重要性算平均">
            <div style={{ marginBottom: 8 }}>普通平均是大家权重一样，加权求和是<b>谁重要谁占的比例大</b>。最熟悉的例子是算总成绩：</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#444", lineHeight: 1.9 }}>
              <div style={{ color: "#888" }}>期末占 60%，作业占 30%，考勤占 10%</div>
              <div>总分 = 90×0.6 + 80×0.3 + 60×0.1</div>
              <div style={{ color: "#0C447C", fontWeight: 600 }}>
                　　 = 54 + 24 + 6 = <span style={{ fontSize: 14 }}>84 分</span>
              </div>
            </div>
            <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", margin: "10px 0 6px" }}>
              <div style={{ width: "60%", background: "#185FA5" }} />
              <div style={{ width: "30%", background: "#85B7EB" }} />
              <div style={{ width: "10%", background: "#d8e6f5" }} />
            </div>
            <div style={{ color: "#888" }}>
              权重加起来 = 1，所以结果不会跑飞。上面对 V 做的事完全一样，只不过被加权的不是分数，而是一串一串的向量。
            </div>
          </Detail>

          <Detail title="补充（可以后看）：这套流程不止算一次 —— 多头 与 多层">
            <MultiHeadLayer />
          </Detail>
        </div>
      )
    },
  },
  {
    title: "完整流程回顾",
    content: () => {
      const steps = [
        { n: 1, label: "分词", desc: "句子切成 token：北京 / 的 / 天气 / 怎么样", bg: "#E6F1FB", border: "#185FA5", text: "#0C447C" },
        { n: 2, label: "Embedding", desc: "每个词变成数字向量（词的“身份证”）", bg: "#EAF3DE", border: "#3B6D11", text: "#27500A" },
        { n: 3, label: "生成 Q K V", desc: "词向量 × Wq/Wk/Wv → 三种用途的向量", bg: "#EEEDFE", border: "#534AB7", text: "#3C3489" },
        { n: 4, label: "点积打分", desc: "“怎么样”的Q × 每个词的K → 相关度分数", bg: "#E1F5EE", border: "#1D9E75", text: "#085041" },
        { n: 5, label: "Softmax", desc: "原始分数 → 加起来等于 1 的注意力权重", bg: "#FAEEDA", border: "#BA7517", text: "#633806" },
        { n: 6, label: "加权求 V", desc: "按权重对所有词的V加权求和 → 理解了上下文的输出", bg: "#FAECE7", border: "#993C1D", text: "#712B13" },
      ]
      return (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {steps.map(({ n, label, desc, bg, border, text }) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: bg, border: `0.5px solid ${border}` }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: border, color: "#fff", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
                <div style={{ fontWeight: 600, color: text, minWidth: 80, fontSize: 13 }}>{label}</div>
                <div style={{ fontSize: 12, color: text, opacity: 0.85 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "#f7f7f5", border: "0.5px solid #e0e0e0", fontSize: 12, color: "#666", lineHeight: 1.7 }}>
            零基础记住这两句就够了：<b>点积负责“算多少分”，加权求和负责“按分数分蛋糕”</b>。主线到此结束。
          </div>
          <Detail title="补充（可以后看）：真实模型会把这套流程做很多遍">
            以上第 3~6 步是<b>一个头</b>做的事。真实模型里会横着分成很多头、竖着叠很多层（例如 32 层 × 32 头），一层叠一层地把理解加深。想看「她」是怎么一层层锁定「小红」的，回到第 6 步打开「多头与多层」。
          </Detail>
          <Detail title="进阶（可完全跳过）：KV Cache 和显存">
            <div>
              工程上会把第 3 步里每个词的 <b>K 和 V 向量</b>缓存起来。只要前面的词没变，它们的 K/V 就不用重算 —— 这就是 KV Cache，也是 prompt 前缀最好保持稳定的原因。
            </div>
            <div style={{ marginTop: 8 }}>
              输入 10 个词、32 层 32 头，一次会冒出上万组 q/k/v，全缓存很吃显存。所以现在常用 <b>GQA</b>：Q 仍是 32 头，K/V 只留 8 组，每 4 个 Q 头共享一组，显存大约省 4 倍。不懂这些，不影响你已经看懂注意力。
            </div>
          </Detail>
        </div>
      )
    },
  },
]

const WORDS = ["北京", "的", "天气", "怎么样"]
const DIMS = ["地点感", "气象感", "疑问感", "虚词性"]
// 第 2 步里那 4 个词向量（真实是 4096 维，这里简化成 4 维好手算）
const VEC = [
  [1.0, 0.2, 0.1, 0.1], // 北京
  [0.1, 0.1, 0.1, 1.0], // 的
  [0.3, 1.0, 0.1, 0.1], // 天气
  [0.1, 0.4, 1.0, 0.2], // 怎么样
]
const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0)
const SYM = VEC.map((a) => VEC.map((b) => dot(a, b)))

// 第 4–6 步共用：Q/K 与注意力分数都从这里算，避免示意数字和手算对不上
const Q_HOW = [0.1, 0.9, 0.1, 0.7]
const K_AFTER = [
  [0.8, 0.2, 0.7, 0.1],
  [0.5, 0.1, 0.2, 0.1],
  [0.0, 1.0, 0.0, 0.8],
  [0.2, 0.5, 0.3, 0.4],
]
const fmtVec = (v: number[]) => `[${v.map((x) => x.toFixed(1)).join(",")}]`
const softmax = (xs: number[]) => {
  const ex = xs.map((x) => Math.exp(x))
  const s = ex.reduce((a, b) => a + b, 0)
  return ex.map((e) => e / s)
}
const ATTN_SCORES = K_AFTER.map((k) => dot(Q_HOW, k))
const ATTN_WEIGHTS = softmax(ATTN_SCORES)
const ATTN_MAX = Math.max(...ATTN_SCORES)

// —— 多头 / 多层演示 ——
const SENT = ["小明", "把", "书", "给了", "小红", "，", "她", "很", "开心"]
const ME = 6 // 追踪“她”这个词

const LAYERS = [
  {
    n: 1,
    tag: "浅层",
    heads: [
      { h: "头 3", job: "盯住前一个词", a: [0.02, 0.02, 0.03, 0.04, 0.09, 0.68, 0.08, 0.02, 0.02] },
      { h: "头 11", job: "找长得像人的词", a: [0.28, 0.02, 0.04, 0.03, 0.31, 0.02, 0.24, 0.03, 0.03] },
      { h: "头 26", job: "看标点、断句", a: [0.03, 0.04, 0.03, 0.04, 0.05, 0.62, 0.09, 0.05, 0.05] },
    ],
    know: "我是个人称代词，前面有两个人名候选：小明、小红。",
    level: 1,
  },
  {
    n: 5,
    tag: "中浅层",
    heads: [
      { h: "头 3", job: "盯住前一个词", a: [0.02, 0.02, 0.03, 0.05, 0.12, 0.62, 0.08, 0.03, 0.03] },
      { h: "头 11", job: "找长得像人的词", a: [0.18, 0.02, 0.03, 0.04, 0.58, 0.02, 0.09, 0.02, 0.02] },
      { h: "头 26", job: "看谁在句子里当主语", a: [0.09, 0.03, 0.05, 0.31, 0.34, 0.03, 0.11, 0.02, 0.02] },
    ],
    know: "“给了”是个双向动词，我更可能是接受方那一位 —— 小红的可能性变大了。",
    level: 2,
  },
  {
    n: 20,
    tag: "中深层",
    heads: [
      { h: "头 3", job: "已改为找修饰关系", a: [0.03, 0.02, 0.06, 0.08, 0.14, 0.04, 0.09, 0.42, 0.12] },
      { h: "头 11", job: "指代消解", a: [0.05, 0.01, 0.02, 0.03, 0.83, 0.01, 0.03, 0.01, 0.01] },
      { h: "头 26", job: "谁做了什么", a: [0.24, 0.02, 0.14, 0.36, 0.14, 0.02, 0.04, 0.02, 0.02] },
    ],
    know: "我 = 小红。这件事已经基本锁死了。",
    level: 3,
  },
  {
    n: 32,
    tag: "深层",
    heads: [
      { h: "头 3", job: "汇总整句语义", a: [0.08, 0.02, 0.22, 0.24, 0.19, 0.01, 0.04, 0.06, 0.14] },
      { h: "头 11", job: "指代消解（保持）", a: [0.04, 0.01, 0.03, 0.04, 0.78, 0.01, 0.04, 0.02, 0.03] },
      { h: "头 26", job: "因果关系", a: [0.06, 0.02, 0.26, 0.28, 0.12, 0.01, 0.03, 0.05, 0.17] },
    ],
    know: "我是小红，我收到了书，所以我很开心。",
    level: 4,
  },
]

function MultiHeadLayer() {
  const [li, setLi] = useState(0)
  const L = LAYERS[li]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ lineHeight: 1.9 }}>
        前面第 3~6 步，是<b>一个头</b>做的事。真实模型里这套流程会被重复很多很多次 —— 分成两个方向：
        <div style={{ marginTop: 6 }}>
          <b>横着的「头」</b>：同一句话，32 个人同时读，各读各的角度。
        </div>
        <div style={{ marginTop: 2 }}>
          <b>竖着的「层」</b>：读完一遍，把新理解<b>写回每个词里</b>，然后拿着新的词再读一遍，共 32 遍。
        </div>
      </div>

      {/* 例句 */}
      <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>拿这句话举例，我们只盯着「她」这一个词，看它每一层都懂了些什么</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, fontSize: 14 }}>
          {SENT.map((w, i) => (
            <span
              key={i}
              style={{
                padding: "3px 7px",
                borderRadius: 6,
                background: i === ME ? "#534AB7" : "transparent",
                color: i === ME ? "#fff" : "#555",
                fontWeight: i === ME ? 600 : 400,
              }}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* 层选择 */}
      <div>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>拖动看不同深度的层</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {LAYERS.map((x, i) => (
            <button
              key={x.n}
              onClick={() => setLi(i)}
              style={{
                flex: 1,
                minWidth: 74,
                padding: "8px 6px",
                borderRadius: 8,
                fontSize: 12,
                cursor: "pointer",
                border: "0.5px solid " + (li === i ? "#534AB7" : "#ddd"),
                background: li === i ? "#534AB7" : "#fff",
                color: li === i ? "#fff" : "#666",
              }}
            >
              <div style={{ fontWeight: 600 }}>第 {x.n} 层</div>
              <div style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>{x.tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 三个头 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 12, color: "#666" }}>
          第 {L.n} 层里，「她」被 32 个头同时处理。随便挑 3 个看看它们各自在关注谁：
        </div>
        {L.heads.map(({ h, job, a }) => {
          const top = a.indexOf(Math.max(...a))
          return (
            <div key={h} style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap", marginBottom: 8 }}>
                <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "#3C3489" }}>{h}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{job}</div>
                <div style={{ marginLeft: "auto", fontSize: 11, color: "#085041" }}>
                  最关注 <b>{SENT[top]}</b>
                </div>
              </div>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 42 }}>
                {SENT.map((w, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div
                      style={{
                        width: "100%",
                        height: `${a[i] * 34}px`,
                        minHeight: 2,
                        background: i === top ? "#1D9E75" : "#d5d5d5",
                        borderRadius: 3,
                        transition: "height 180ms",
                      }}
                    />
                    <div style={{ fontSize: 9, color: i === top ? "#085041" : "#bbb", whiteSpace: "nowrap" }}>{w}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 合并 → 这一层的理解 */}
      <div style={{ background: "#EEEDFE", border: "0.5px solid #534AB7", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 11, color: "#3C3489", opacity: 0.75, marginBottom: 6 }}>
          32 个头的结果拼在一起 → 覆盖掉旧的「她」，成为第 {L.n + 1} 层的输入
        </div>
        <div style={{ fontSize: 13, color: "#3C3489", lineHeight: 1.8 }}>
          此刻「她」心里想的是：<b>{L.know}</b>
        </div>
        <div style={{ display: "flex", gap: 3, marginTop: 10 }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ flex: 1, height: 5, borderRadius: 3, background: s <= L.level ? "#534AB7" : "rgba(83,74,183,0.15)", transition: "background 180ms" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#3C3489", opacity: 0.6, marginTop: 5 }}>理解深度</div>
      </div>

      <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px", lineHeight: 1.9 }}>
        <div style={{ fontWeight: 600, color: "#333", marginBottom: 6 }}>三个容易卡住的点</div>
        <div style={{ color: "#555" }}>
          <b>1. 为什么要那么多层？</b>一次加权求和只能建立<b>一跳</b>关系。要从“她是个代词”走到“她收到书所以开心”，中间隔着好几跳，一层只能走一跳。
        </div>
        <div style={{ color: "#555", marginTop: 6 }}>
          <b>2. 下一层的「她」为什么变了？</b>因为每一层的输出会<b>覆盖</b>掉词原来的向量。第 20 层拿到的「她」，已经是携带着“我是小红”这条信息的新向量了 —— 词还是那个字，向量早就不是原来那串数了。
        </div>
        <div style={{ color: "#555", marginTop: 6 }}>
          <b>3. 谁决定用哪个头的 Wq/Wk/Wv？</b>没人决定。走到第几层第几个头，就用那一层那个头的，没有任何路由或判断 —— 像流水线上固定的工位，零件走到哪台机床就被加工一次。
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "monospace", flexWrap: "wrap" }}>
        {[
          { n: "32", l: "层" },
          { n: "×", l: "" },
          { n: "32", l: "头" },
          { n: "=", l: "" },
          { n: "1024", l: "组 Q/K/V", hi: true },
        ].map((x, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: x.hi ? 24 : 20, fontWeight: 600, color: x.hi ? "#085041" : "#555" }}>{x.n}</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{x.l}</div>
          </div>
        ))}
      </div>
      <div style={{ color: "#888", textAlign: "center", fontSize: 11, marginTop: -4 }}>
        以 Llama-2 7B 为例。打分 → softmax → 加权求和，一共跑 1024 次，没有一次是偷懒的。
      </div>
    </div>
  )
}

// —— 训练演示：模型靠“做完形填空 + 对答案”自己把权重调出来 ——
const GUESS = ["上海", "了", "晴朗", "呢"] // 注意力落在哪个词上，就会猜出什么
const FIXED = [0.30, 0.20, 0.25] // 北京 / 的 / 怎么样 的分数（这里固定不动）

function attnOf(w: number) {
  const raw = [FIXED[0], FIXED[1], w * 1.6, FIXED[2]]
  const ex = raw.map((x) => Math.exp(x * 3))
  const s = ex.reduce((a, b) => a + b, 0)
  return ex.map((x) => x / s)
}

function Training() {
  const [w, setW] = useState(0.05) // Wk 里“关注气象感”那一格的数字
  const [round, setRound] = useState(0)
  const [log, setLog] = useState<{ r: number; guess: string; p: number; delta: number }[]>([])

  const attn = attnOf(w)
  const pRight = attn[2] // 猜对“晴朗”的把握
  const guess = GUESS[attn.indexOf(Math.max(...attn))]
  const correct = guess === "晴朗"

  function step(n: number) {
    let cw = w
    let cr = round
    const entries: { r: number; guess: string; p: number; delta: number }[] = []
    for (let i = 0; i < n; i++) {
      const a = attnOf(cw)
      const g = GUESS[a.indexOf(Math.max(...a))]
      const err = 1 - a[2] // 差多少才算全对
      const delta = err * 0.55 // 梯度：错得越多，改得越狠
      entries.push({ r: cr + 1, guess: g, p: a[2], delta })
      cw = Math.min(2, cw + delta)
      cr += 1
    }
    setW(cw)
    setRound(cr)
    setLog((prev) => [...entries.slice(-3).reverse(), ...prev].slice(0, 6))
  }

  function reset() {
    setW(0.05)
    setRound(0)
    setLog([])
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ lineHeight: 1.9 }}>
        这三个矩阵<b>不是人写的，也不是算出来的</b>。它们出厂时是一堆<b>随机数</b>，是模型自己在海量文本上做<b>完形填空</b>，一次次对答案、一次次微调，才慢慢变成有用的数字。
        <div style={{ marginTop: 6 }}>下面这个演示只保留一格权重，你可以亲手把它“训”出来：</div>
      </div>

      {/* 练习题 */}
      <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>模型每天做的唯一一道题（答案就在原文里，不用人来标）</div>
        <div style={{ fontSize: 14, color: "#333", lineHeight: 1.9 }}>
          北京的天气怎么样？今天很
          <span style={{ display: "inline-block", minWidth: 52, textAlign: "center", margin: "0 4px", padding: "2px 8px", borderRadius: 6, background: "#fff", border: "1px dashed #bbb", color: "#bbb" }}>
            ？
          </span>
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>
          正确答案：<b style={{ color: "#085041" }}>晴朗</b> —— 要答对，就必须注意到“天气”这个词。
        </div>
      </div>

      {/* 当前这一格权重 */}
      <div style={{ background: "#EEEDFE", border: "0.5px solid #534AB7", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6 }}>
          <div style={{ fontSize: 12, color: "#3C3489" }}>
            <b>Wk</b> 里“关注气象感”那一格的数字
          </div>
          <div style={{ fontSize: 11, color: "#3C3489", opacity: 0.7 }}>已训练 {round} 轮</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 600, color: "#3C3489", width: 62 }}>{w.toFixed(2)}</div>
          <div style={{ flex: 1, height: 8, background: "rgba(0,0,0,0.07)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${(w / 2) * 100}%`, height: "100%", background: "#534AB7", borderRadius: 4, transition: "width 200ms" }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#3C3489", opacity: 0.7, marginTop: 6, lineHeight: 1.7 }}>
          {round === 0 ? "出厂状态：一个没有任何含义的随机小数。" : "没有人告诉过它这一格该填多少 —— 这个数字是被“答错”一次次推上来的。"}
        </div>
      </div>

      {/* 注意力 + 猜测 */}
      <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>用这个权重算出来的注意力分布</div>
        {WORDS.map((word, i) => (
          <div key={word} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <div style={{ width: 46, fontSize: 12, color: i === 2 ? "#085041" : "#888", fontWeight: i === 2 ? 600 : 400 }}>{word}</div>
            <div style={{ flex: 1, height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${attn[i] * 100}%`, height: "100%", background: i === 2 ? "#1D9E75" : "#c8c8c8", borderRadius: 4, transition: "width 200ms" }} />
            </div>
            <div style={{ width: 38, fontSize: 11, fontFamily: "monospace", color: "#999", textAlign: "right" }}>{(attn[i] * 100).toFixed(0)}%</div>
          </div>
        ))}

        <div
          style={{
            marginTop: 10,
            padding: "10px 12px",
            borderRadius: 8,
            background: correct ? "#E1F5EE" : "#FAECE7",
            border: `0.5px solid ${correct ? "#1D9E75" : "#C4553A"}`,
          }}
        >
          <div style={{ fontSize: 12, color: correct ? "#085041" : "#712B13", lineHeight: 1.8 }}>
            模型这次填的是 <b style={{ fontSize: 14 }}>{guess}</b>
            {correct ? "　✓ 对上了" : "　✗ 答案是「晴朗」"}
          </div>
          <div style={{ fontSize: 11, color: correct ? "#085041" : "#712B13", opacity: 0.8, marginTop: 4 }}>
            对“晴朗”的把握只有 {(pRight * 100).toFixed(0)}%，离 100% 还差 {(100 - pRight * 100).toFixed(0)} —— <b>这个差距就是“梯度”</b>，它决定这一格要往上推多少。
          </div>
        </div>
      </div>

      {/* 按钮 */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { t: "训练 1 轮", n: 1 },
          { t: "训练 10 轮", n: 10 },
          { t: "训练 100 轮", n: 100 },
        ].map(({ t, n }) => (
          <button
            key={t}
            onClick={() => step(n)}
            style={{
              padding: "7px 14px",
              borderRadius: 7,
              fontSize: 12,
              cursor: "pointer",
              border: "0.5px solid #534AB7",
              background: "#fff",
              color: "#534AB7",
              fontWeight: 500,
            }}
          >
            {t}
          </button>
        ))}
        <button
          onClick={reset}
          disabled={round === 0}
          style={{
            padding: "7px 14px",
            borderRadius: 7,
            fontSize: 12,
            marginLeft: "auto",
            cursor: round === 0 ? "not-allowed" : "pointer",
            border: "0.5px solid " + (round === 0 ? "#eee" : "#c8c8c8"),
            background: "#fff",
            color: round === 0 ? "#ccc" : "#555",
            fontWeight: 500,
          }}
        >
          重置成随机
        </button>
      </div>

      {/* 日志 */}
      {log.length > 0 && (
        <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>最近几轮（新的在上）</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "monospace", fontSize: 11 }}>
            {log.map((e, i) => (
              <div key={`${e.r}-${i}`} style={{ display: "flex", gap: 8, color: e.guess === "晴朗" ? "#085041" : "#993C1D", flexWrap: "wrap" }}>
                <span style={{ width: 52, color: "#bbb" }}>第{e.r}轮</span>
                <span style={{ width: 62 }}>填「{e.guess}」</span>
                <span style={{ width: 66, opacity: 0.8 }}>把握{(e.p * 100).toFixed(0)}%</span>
                <span style={{ color: "#534AB7" }}>权重 +{e.delta.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px", lineHeight: 1.9 }}>
        <div style={{ fontWeight: 600, color: "#333", marginBottom: 6 }}>刚才发生的，就是“反向传播”</div>
        <div style={{ color: "#555" }}>
          填错 → 算出差多少 → 顺着这个差距倒推回去，把每一格权重都往“下次能少错一点”的方向挪一小步。“倒推回去”这四个字，就是<b>反向</b>；一轮一轮地传下去，就是<b>传播</b>。
        </div>
        <div style={{ color: "#555", marginTop: 8 }}>
          真实训练里同时被挪的不是 1 格，而是 <b>70 亿格</b>；题目不是 1 道，而是几万亿道。跑上几个月，Wq/Wk/Wv 就从随机数变成了“疑问词自然会去找气象词”的样子。
        </div>
        <div style={{ color: "#888", fontSize: 11, marginTop: 8 }}>
          所以下一步里“天气”能拿到 1.46 的高分，纯粹是这些数字被推出来的结果 —— 模型内部并没有“疑问词该找名词”这条规则，也没有人写过这样一条规则。
        </div>
      </div>
    </div>
  )
}

// 一个矩阵 = 一叠“提问卡”，每一行就是一道题
const MATS = {
  Wq: {
    label: "Wq（问“我在找什么”）",
    color: "#1D9E75",
    bg: "#E1F5EE",
    text: "#085041",
    out: "Q",
    rows: [
      { q: "我在找地点吗？", w: [0.9, 0.0, 0.0, 0.0] },
      { q: "我在找气象 / 状态吗？", w: [0.0, 0.1, 0.9, 0.0] },
      { q: "我在找时间吗？", w: [0.0, 0.0, 0.3, 0.0] },
    ],
  },
  Wk: {
    label: "Wk（问“我是什么”）",
    color: "#534AB7",
    bg: "#EEEDFE",
    text: "#3C3489",
    out: "K",
    rows: [
      { q: "我是气象类概念吗？", w: [0.0, 1.0, 0.0, 0.0] },
      { q: "我是实词吗？", w: [0.5, 0.5, 0.3, -1.0] },
      { q: "我可以被提问吗？", w: [0.2, 0.8, 0.0, 0.0] },
    ],
  },
} as const

function MatrixExplain() {
  const [wi, setWi] = useState(2) // 词：默认“天气”
  const [mk, setMk] = useState<"Wq" | "Wk">("Wk")
  const m = MATS[mk]
  const v = VEC[wi]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ lineHeight: 1.9 }}>
        先别管“矩阵”这个词。一个矩阵其实就是<b>一叠提问卡</b>：
        <div style={{ marginTop: 6 }}>
          <b>一行 = 一道题。</b>这一行里的 4 个数字，是给词向量 4 个维度打的<b>关注度权重</b> —— 写 0 就是“这一维我完全不看”，写得大就是“我很在乎这一维”。
        </div>
        <div style={{ marginTop: 4 }}>把词向量按这份权重对应相乘再相加，得到<b>一个数</b>，就是这道题的答案分。</div>
        <div style={{ marginTop: 4 }}>矩阵有几行就问几道题，几个答案排起来，就是新的向量。</div>
      </div>

      {/* 选择器 */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>拿哪个词来算</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setWi(i)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: "pointer",
                  border: "0.5px solid " + (wi === i ? "#333" : "#ddd"),
                  background: wi === i ? "#333" : "#fff",
                  color: wi === i ? "#fff" : "#666",
                }}
              >
                {WORDS[i]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>乘哪个矩阵</div>
          <div style={{ display: "flex", gap: 4 }}>
            {(["Wq", "Wk"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setMk(k)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontFamily: "monospace",
                  cursor: "pointer",
                  border: "0.5px solid " + (mk === k ? MATS[k].color : "#ddd"),
                  background: mk === k ? MATS[k].color : "#fff",
                  color: mk === k ? "#fff" : "#666",
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 输入词向量 */}
      <div style={{ fontSize: 11, overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
          <div style={{ width: 74, flexShrink: 0 }} />
          {DIMS.map((d) => (
            <div key={d} style={{ width: 54, flexShrink: 0, textAlign: "center", color: "#aaa" }}>
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          <div style={{ width: 74, flexShrink: 0, textAlign: "right", paddingRight: 4, lineHeight: "24px", color: "#555", fontWeight: 600 }}>
            {WORDS[wi]}的向量
          </div>
          {v.map((n, d) => (
            <div
              key={d}
              style={{ width: 54, flexShrink: 0, textAlign: "center", padding: "4px 0", borderRadius: 5, background: "#f0f4f8", color: "#0C447C", fontFamily: "monospace", fontWeight: 600 }}
            >
              {n.toFixed(1)}
            </div>
          ))}
        </div>
      </div>

      {/* 逐行提问 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 12, color: "#666" }}>
          <b style={{ fontFamily: "monospace", color: m.text }}>{mk}</b> 的每一行，向 <b>{WORDS[wi]}</b> 问一道题：
        </div>
        {m.rows.map(({ q, w }, r) => {
          const terms = v.map((n, d) => n * w[d])
          const sum = terms.reduce((a, b) => a + b, 0)
          return (
            <div key={q} style={{ background: m.bg, border: `0.5px solid ${m.color}`, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "baseline" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: m.text }}>
                  第 {r + 1} 行：{q}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: m.text, opacity: 0.7 }}>
                  → {m.out}[{r}]
                </div>
              </div>

              {/* 权重行 */}
              <div style={{ display: "flex", gap: 3, marginTop: 8, overflowX: "auto" }}>
                <div style={{ width: 74, flexShrink: 0, fontSize: 11, color: m.text, opacity: 0.7, textAlign: "right", paddingRight: 4, lineHeight: "22px" }}>关注度权重</div>
                {w.map((n, d) => (
                  <div
                    key={d}
                    style={{
                      width: 54,
                      flexShrink: 0,
                      textAlign: "center",
                      padding: "3px 0",
                      borderRadius: 5,
                      fontFamily: "monospace",
                      fontSize: 11,
                      background: n === 0 ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.85)",
                      color: n === 0 ? "#bbb" : m.text,
                      fontWeight: n === 0 ? 400 : 600,
                    }}
                  >
                    {n.toFixed(1)}
                  </div>
                ))}
              </div>

              {/* 算式 */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center", marginTop: 8, fontFamily: "monospace", fontSize: 11, color: m.text }}>
                {v.map((n, d) => (
                  <span key={d} style={{ display: "inline-flex", gap: 3, alignItems: "center", opacity: w[d] === 0 ? 0.35 : 1 }}>
                    {d > 0 && <span style={{ opacity: 0.5 }}>+</span>}
                    <span style={{ background: "rgba(255,255,255,0.7)", borderRadius: 4, padding: "1px 5px" }}>
                      {n.toFixed(1)}×{w[d].toFixed(1)}
                    </span>
                  </span>
                ))}
                <span style={{ opacity: 0.5 }}>=</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{sum.toFixed(2)}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7 }}>
                <div style={{ flex: 1, height: 7, background: "rgba(0,0,0,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(0, Math.min(1, sum / 1.05)) * 100}%`, height: "100%", background: m.color, borderRadius: 4, transition: "width 120ms" }} />
                </div>
                <div style={{ fontSize: 11, color: m.text, opacity: 0.8, width: 62, flexShrink: 0 }}>{sum >= 0.7 ? "很符合" : sum >= 0.3 ? "有点像" : "基本不符"}</div>
              </div>

              {w.some((x) => x === 0) && (
                <div style={{ fontSize: 11, color: m.text, opacity: 0.6, marginTop: 6, lineHeight: 1.6 }}>
                  权重为 0 的那几项，不管词向量在那一维是多少，乘完都是 0 —— 等于这道题<b>完全不看</b>那些维度。
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 结论 */}
      <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 8 }}>换个矩阵，问的题就全变了 —— 这就是“提取不同侧面”</div>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.9 }}>
          <div>
            拿 <b>天气</b> 去问 <code style={{ fontFamily: "monospace", color: "#3C3489" }}>Wk</code>：“我是气象类概念吗” →{" "}
            <b style={{ color: "#3C3489", fontFamily: "monospace" }}>1.00</b>，非常符合。
          </div>
          <div>
            同一个 <b>天气</b> 去问 <code style={{ fontFamily: "monospace", color: "#085041" }}>Wq</code>：“我在找气象吗” →{" "}
            <b style={{ color: "#993C1D", fontFamily: "monospace" }}>0.19</b>，它并不在找什么。
          </div>
          <div style={{ marginTop: 4 }}>
            换成 <b>怎么样</b> 再问一次 <code style={{ fontFamily: "monospace", color: "#085041" }}>Wq</code>：“我在找气象吗” →{" "}
            <b style={{ color: "#085041", fontFamily: "monospace" }}>0.94</b>，它非常想找。
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.8, marginTop: 10 }}>
          词向量一个字都没变，只是<b>问的题不一样</b>，答出来的画像就完全不同。“怎么样”急着找气象（高 Q），“天气”正好是气象（高 K）—— 第 4 步它俩一点积，分数自然就高。
        </div>
        <div style={{ fontSize: 11, color: "#aaa", lineHeight: 1.7, marginTop: 8 }}>
          真实模型里这些题目没有名字，也没人写过它们 —— 权重全是训练时自己长出来的，这里只是为了看得懂才给每行起了名。
        </div>
      </div>
    </div>
  )
}

function WhyThree() {
  // 点开表格里任意一格，看它是怎么算出来的
  const [cell, setCell] = useState<[number, number]>([3, 2])
  const [ri, ci] = cell
  // 只用 2 个（K=V）：一根旋钮同时决定“容易被找到”和“传出去的内容”
  const [knob, setKnob] = useState(50)
  // 用 3 个：两根互不影响的旋钮
  const [knobK, setKnobK] = useState(85)
  const [knobV, setKnobV] = useState(90)

  const t = knob / 100
  const hit = Math.round(t * 100) // 被“怎么样”命中的分数
  const pure = Math.round((1 - t) * 100) // 传过去的内容里，真正属于“天气”的成分

  let verdict = { text: "两头都不满意：分数不够高，内容也已经被稀释了。", color: "#993C1D" }
  if (t < 0.25) verdict = { text: "内容很干净，但分数太低 ——“怎么样”根本注意不到“天气”。", color: "#993C1D" }
  else if (t > 0.75) verdict = { text: "分数够高了，但传过去的已经不是“天气”的意思了。", color: "#993C1D" }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* ── 只用 1 个 ── */}
      <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#3C3489", marginBottom: 2 }}>只用 1 个：所有关系被迫变成“双向对等”</div>
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.8, marginBottom: 10 }}>
          不拆的话，两个词的分数就是它们<b>原始向量直接点积</b>。先把第 2 步那 4 个词向量摊开
          <span style={{ color: "#aaa" }}>（真实是 4096 维，这里简化成 4 维，好手算）</span>：
        </div>

        {/* 词向量表 */}
        <div style={{ fontSize: 11, overflowX: "auto", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
            <div style={{ width: 52, flexShrink: 0 }} />
            {DIMS.map((d) => (
              <div key={d} style={{ width: 56, flexShrink: 0, textAlign: "center", color: "#aaa" }}>
                {d}
              </div>
            ))}
          </div>
          {WORDS.map((w, i) => (
            <div key={w} style={{ display: "flex", gap: 3, marginBottom: 3 }}>
              <div style={{ width: 52, flexShrink: 0, color: "#555", fontWeight: 600, textAlign: "right", paddingRight: 4, lineHeight: "24px" }}>{w}</div>
              {VEC[i].map((v, d) => (
                <div
                  key={d}
                  style={{
                    width: 56,
                    flexShrink: 0,
                    textAlign: "center",
                    padding: "4px 0",
                    borderRadius: 5,
                    fontFamily: "monospace",
                    background: i === ri || i === ci ? "#EEEDFE" : "#f7f7f5",
                    color: i === ri || i === ci ? "#3C3489" : "#999",
                    fontWeight: i === ri || i === ci ? 600 : 400,
                  }}
                >
                  {v.toFixed(1)}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.8, marginBottom: 8 }}>
          任取两个词，把 4 个数<b>对应相乘再相加</b>，就是它们的分数。两两算一遍，得到下面这张表 —— <b style={{ color: "#3C3489" }}>点任意一格看它怎么算出来的</b>：
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 11, overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 3 }}>
            <div style={{ width: 52, flexShrink: 0 }} />
            {WORDS.map((w) => (
              <div key={w} style={{ width: 56, flexShrink: 0, textAlign: "center", color: "#aaa" }}>
                {w}
              </div>
            ))}
          </div>
          {WORDS.map((rw, i) => (
            <div key={rw} style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <div style={{ width: 52, flexShrink: 0, color: "#888", textAlign: "right", paddingRight: 4 }}>{rw}</div>
              {WORDS.map((cw, j) => {
                const self = i === j
                const active = i === ri && j === ci
                const mirror = i === ci && j === ri && !active
                return (
                  <button
                    key={cw}
                    onClick={() => setCell([i, j])}
                    aria-label={`${rw} 和 ${cw} 的分数`}
                    style={{
                      width: 56,
                      flexShrink: 0,
                      textAlign: "center",
                      padding: "5px 0",
                      borderRadius: 5,
                      fontFamily: "monospace",
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: active || mirror || self ? 600 : 400,
                      background: active ? "#3C3489" : mirror ? "#EEEDFE" : self ? "#F4E4E4" : "#f7f7f5",
                      color: active ? "#fff" : mirror ? "#3C3489" : self ? "#993C1D" : "#999",
                      border: mirror ? "0.5px solid #534AB7" : "0.5px solid transparent",
                      transition: "background 100ms",
                    }}
                  >
                    {SYM[i][j].toFixed(2)}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* 算式 */}
        <div style={{ marginTop: 10, padding: "10px 12px", background: "#EEEDFE", border: "0.5px solid #534AB7", borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: "#3C3489", opacity: 0.75, marginBottom: 6 }}>
            {WORDS[ri]} · {WORDS[ci]}　（对应位置相乘，再全部加起来）
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontFamily: "monospace", fontSize: 12, color: "#3C3489" }}>
            {VEC[ri].map((v, d) => (
              <span key={d} style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                {d > 0 && <span style={{ opacity: 0.5 }}>+</span>}
                <span style={{ background: "rgba(255,255,255,0.8)", borderRadius: 4, padding: "2px 6px" }}>
                  {v.toFixed(1)}×{VEC[ci][d].toFixed(1)}
                </span>
                <span style={{ opacity: 0.55 }}>={(VEC[ri][d] * VEC[ci][d]).toFixed(2)}</span>
              </span>
            ))}
            <span style={{ opacity: 0.5 }}>=</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{SYM[ri][ci].toFixed(2)}</span>
          </div>
          <div style={{ fontSize: 11, color: "#3C3489", opacity: 0.7, marginTop: 6, lineHeight: 1.7 }}>
            {ri === ci
              ? "这是对角线：每一项都是自己乘自己，全是正数，所以必然是整行最大的。"
              : "把上面的两个词对调，每一项的两个因子只是左右交换，乘出来一模一样 —— 所以 " +
                `${WORDS[ci]} · ${WORDS[ri]} 也只能是 ${SYM[ri][ci].toFixed(2)}。`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#993C1D", width: 52, flexShrink: 0 }}>问题一</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
              <span style={{ background: "#F4E4E4", padding: "1px 5px", borderRadius: 4, color: "#993C1D" }}>对角线</span>永远是整行最大的 ——
              自己乘自己每一项都是正数，不会互相抵消。每个词最关注的都是它自己。
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#993C1D", width: 52, flexShrink: 0 }}>问题二</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
              这张表沿对角线<b>完全镜像</b>（点一格，它的镜像格会一起高亮）。“怎么样”看“天气”是{" "}
              <span style={{ background: "#EEEDFE", padding: "1px 5px", borderRadius: 4, color: "#3C3489", fontFamily: "monospace" }}>{SYM[2][3].toFixed(2)}</span>
              ，“天气”看“怎么样”也<b>只能</b>是这个数。因为 a×b = b×a，逐项都相等，这不是没调好，是数学上改不了。
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, padding: "10px 12px", background: "#f7f7f5", borderRadius: 8, fontSize: 12, color: "#555", lineHeight: 1.8 }}>
          可语言里的关系是<b>单向</b>的。“小明把书给了小红，<b>她</b>很开心”——“她”必须死死盯住“小红”才知道自己指谁；但“小红”出现的时候根本不需要同等地回看“她”。
          <div style={{ marginTop: 6, color: "#085041" }}>
            拆成 Q、K 之后，正向算的是 <code style={{ fontFamily: "monospace" }}>q_她 · k_小红</code>，反向算的是{" "}
            <code style={{ fontFamily: "monospace" }}>q_小红 · k_她</code> —— 用的是<b>两组不同的向量</b>，两个分数终于可以不相等了。
          </div>
        </div>
      </div>

      {/* ── 只用 2 个 ── */}
      <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#3C3489", marginBottom: 2 }}>只用 2 个（K=V）：一根旋钮，管着两件互相打架的事</div>
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.8, marginBottom: 12 }}>
          假设“怎么样”的 Q 在找“可以被问状态的东西”。想让“天气”更容易被它命中，唯一办法是把“天气”的向量<b>往那个方向拧</b>。
          但 K=V，这根旋钮同时也决定了“天气”被选中后<b>传出去的内容</b>。拖一下看看：
        </div>

        <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>把“天气”的向量往“容易被命中”的方向拧</div>
        <input
          type="range"
          min={0}
          max={100}
          value={knob}
          onChange={(e) => setKnob(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#534AB7", marginBottom: 12 }}
          aria-label="把天气的向量往容易被命中的方向拧"
        />

        <Gauge label="被“怎么样”命中的分数" pct={hit} good color="#1D9E75" />
        <Gauge label="传过去的内容里，真属于“天气”的成分" pct={pure} good color="#BA7517" />

        <div style={{ marginTop: 10, fontSize: 12, color: verdict.color, lineHeight: 1.7, fontWeight: 500 }}>{verdict.text}</div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#666", lineHeight: 1.8 }}>
          两条进度条被同一根旋钮绑住，<b>一个涨另一个必然跌</b>，滑到哪儿都没有两头都满意的位置。这就是“一个旋钮管两件事”的真实含义。
        </div>
      </div>

      {/* ── 用 3 个 ── */}
      <div style={{ background: "#E1F5EE", border: "0.5px solid #1D9E75", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#085041", marginBottom: 2 }}>用 3 个：拆成两根互不影响的旋钮</div>
        <div style={{ fontSize: 12, color: "#085041", opacity: 0.85, lineHeight: 1.8, marginBottom: 12 }}>
          K 只负责“怎样被找到”，V 只负责“交付什么内容”，各拧各的，可以同时拧到最好：
        </div>

        <div style={{ fontSize: 11, color: "#085041", opacity: 0.7, marginBottom: 4 }}>旋钮 K：让“天气”更容易被命中</div>
        <input
          type="range"
          min={0}
          max={100}
          value={knobK}
          onChange={(e) => setKnobK(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#1D9E75", marginBottom: 10 }}
          aria-label="旋钮 K"
        />
        <div style={{ fontSize: 11, color: "#085041", opacity: 0.7, marginBottom: 4 }}>旋钮 V：让“天气”传出去的语义更丰富</div>
        <input
          type="range"
          min={0}
          max={100}
          value={knobV}
          onChange={(e) => setKnobV(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#BA7517", marginBottom: 12 }}
          aria-label="旋钮 V"
        />

        <Gauge label="被“怎么样”命中的分数" pct={knobK} good color="#1D9E75" />
        <Gauge label="传过去的内容里，真属于“天气”的成分" pct={knobV} good color="#BA7517" />

        <div style={{ marginTop: 10, fontSize: 12, color: "#085041", lineHeight: 1.8 }}>
          再加上 Q 让关系有了方向，三个向量各管一件事，互不牵连 —— 这就是所谓的<b>“把权重和内容解耦”</b>。
        </div>
      </div>
    </div>
  )
}

function Gauge({ label, pct, color }: { label: string; pct: number; good?: boolean; color: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#666", marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ fontFamily: "monospace", fontWeight: 600, color: pct < 35 ? "#993C1D" : color }}>{pct}</span>
      </div>
      <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: pct < 35 ? "#C4553A" : color, borderRadius: 4, transition: "width 80ms linear" }} />
      </div>
    </div>
  )
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: "#fafafa", border: "0.5px solid #e8e8e8", borderRadius: 10, padding: "14px 16px" }}>
      {children}
    </div>
  )
}

function Bridge({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ background: "#F4F8FD", border: "0.5px solid #C9DDF3", borderLeft: "3px solid #378ADD", borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#0C447C", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: "#334", lineHeight: 1.8 }}>{children}</div>
    </div>
  )
}

function Detail({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: "0.5px solid #e0e0e0", borderRadius: 10, background: open ? "#fcfcfc" : "#fff", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "10px 14px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontSize: 12.5,
          color: "#555",
          fontFamily: "inherit",
        }}
      >
        <span
          style={{
            display: "inline-block",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.18s",
            color: "#378ADD",
            fontSize: 11,
          }}
          aria-hidden="true"
        >
          ▶
        </span>
        <span style={{ flex: 1 }}>{title}</span>
        <span style={{ fontSize: 11, color: "#bbb" }}>{open ? "收起" : "展开"}</span>
      </button>
      {open && (
        <div style={{ padding: "2px 16px 14px 30px", fontSize: 12.5, color: "#444", lineHeight: 1.8, borderTop: "0.5px solid #f0f0f0" }}>
          <div style={{ paddingTop: 12 }}>{children}</div>
        </div>
      )}
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{children}</div>
}

function Muted({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6, marginTop: 6, ...style }}>{children}</div>
}

function tokenStyle(): CSSProperties {
  return { padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, border: "0.5px solid #d0d0d0", background: "#fff", color: "#333", minWidth: 60, textAlign: "center" }
}

export default function Page() {
  const [cur, setCur] = useState(0)
  const step = STEPS[cur]

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 620, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>注意力是怎么工作的 · 零基础版</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>{step.title}</div>
        <div style={{ display: "flex", gap: 5 }}>
          {STEPS.map((_, i) => (
            <div key={i} onClick={() => setCur(i)} style={{ width: 10, height: 10, borderRadius: "50%", background: i === cur ? "#378ADD" : "#d0d0d0", cursor: "pointer", transition: "background 0.2s" }} />
          ))}
        </div>
      </div>

      <div style={{ minHeight: 320 }}>{step.content()}</div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        {cur > 0 && (
          <button onClick={() => setCur(cur - 1)} style={{ padding: "8px 18px", borderRadius: 8, border: "0.5px solid #d0d0d0", background: "#fff", color: "#555", fontSize: 13, cursor: "pointer" }}>
            上一步
          </button>
        )}
        <button
          onClick={() => setCur(cur === STEPS.length - 1 ? 0 : cur + 1)}
          style={{ padding: "8px 18px", borderRadius: 8, border: "0.5px solid #378ADD", background: "#378ADD", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 500 }}
        >
          {cur === 0 ? "开始 →" : cur === STEPS.length - 1 ? "从头再看 ↺" : "下一步 →"}
        </button>
      </div>
    </div>
  )
}
