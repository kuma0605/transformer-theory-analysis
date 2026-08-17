"use client"

import { useState, type CSSProperties, type ReactNode } from "react"

const STEPS = [
  {
    title: "开始之前：需要什么基础",
    content: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>聊天模型在“看”哪些词？</div>
          <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}>
            这份讲解写给<b>没有 AI 基础</b>的读者。读完之后，你可以用自己的话说明一件事：模型读到“北京的天气怎么样”里的“怎么样”时，为什么会去看“天气”，而不是句子里的其他词。
          </div>
        </Card>

        <div style={{ background: "#F4F8FD", border: "0.5px solid #C9DDF3", borderLeft: "3px solid #378ADD", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0C447C", marginBottom: 8 }}>先记住一件事</div>
          <div style={{ fontSize: 13, color: "#334", lineHeight: 1.8 }}>
            语言模型只做一件事：<b>预测下一个词</b>。要预测得准，它必须先判断前面哪些词与当前的词相关。后面各步拆解的，就是这个判断过程。
          </div>
        </div>

        <Card>
          <Label>阅读门槛</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#444", lineHeight: 1.7 }}>
            {[
              { ok: "只需要会加减乘除", no: "不需要编程基础，不需要微积分，不需要读英文论文" },
              { ok: "一路点“下一步”即可读完", no: "折叠起来的延伸内容可以跳过，不影响主线" },
              { ok: "文中的数字都可以自己验算", no: "真实模型有几千个数，这里简化成 4 个，便于展示" },
            ].map(({ ok, no }) => (
              <div key={ok}>
                <div style={{ fontWeight: 600, color: "#085041" }}>{ok}</div>
                <div style={{ fontSize: 12, color: "#5a5a5a" }}>{no}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Label>会用到的四个术语（先有个大概印象即可）</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { k: "模型", v: "在海量文本上训练出来的预测程序，并不具备人类的思考能力" },
              { k: "token", v: "文本切分后的最小单位。本文按整词切分，便于展示；真实模型通常切得更细" },
              { k: "词向量", v: "表示一个词的一串数字，每个数字是它在某个侧面上的强弱" },
              { k: "注意力", v: "一套打分机制，决定当前的词该关注前面的词和它自己，各关注多少" },
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
    title: "第 1 步：输入一句话",
    content: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card>
          <Label>输入</Label>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: 6, textAlign: "center", margin: "12px 0", color: "#1a1a1a" }}>
            北京 的 天气 怎么样
          </div>
        </Card>
        <Card>
          <Label>模型先把句子切分成 token</Label>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "12px 0", flexWrap: "wrap" }}>
            {["北京", "的", "天气", "怎么样"].map((w) => (
              <div key={w} style={{ textAlign: "center" }}>
                <div style={tokenStyle()}>{w}</div>
                <div style={{ fontSize: 11, color: "#5a5a5a", marginTop: 4 }}>token</div>
              </div>
            ))}
          </div>
          <Muted>
            此处按整词切分，只为讲解方便。真实模型通常切得更细，但不影响后面要讲的关注机制。
          </Muted>
        </Card>
        <Card>
          <Label>接下来，模型要预测后面的词</Label>
          <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}>
            模型从左到右逐词读这句话。读到最后的“怎么样”时，它并不是在理解这句话的含义，而是在判断：<b>前面哪些词有助于预测下一个词？</b>
          </div>
          <Muted>后续各步只跟踪“怎么样”这一个词，看它如何分配注意力。</Muted>
        </Card>
      </div>
    ),
  },
  {
    title: "第 2 步：每个词转换成词向量",
    content: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Card>
          <Label>每个词转换成一串数字，称为词向量（Embedding）</Label>
          <div style={{ fontSize: 11, color: "#6e6e6e", textAlign: "center", margin: "10px 0 4px", fontFamily: "monospace" }}>
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
            一串数字合起来就叫这个词的<b>向量</b>。每个数字对应上方的一个侧面，表示这个词在该侧面上的强弱：“天气”的气象感是 1.0，地点感只有 0.3。一个数字装不下一个词的多个侧面，所以要用一串。侧面的名称（地点感、气象感等）是为讲解方便临时命名的；真实模型有几千个数字，每一个具体代表什么，人无法直接读出。词的先后顺序由另一套机制记录，本文不展开，不影响理解后面的打分过程。
          </Muted>
        </Card>

        <Bridge title="待解决的问题：这 4 个词向量目前互不相关">
          <div style={{ marginBottom: 10 }}>
            模型目前只知道每个词各自的含义，还不清楚<b>词与词之间的关系</b>。整个过程可以概括成两步：先给前面的词和它自己各打一个分数，再按分数把这些词的含义并入自身。下面用招聘做类比，说明为什么需要三种向量；不想细看的话，可以直接跳到第 3 步。
          </div>
          <div style={{ marginBottom: 10 }}>
            要让“怎么样”确定自己问的是天气，需要完成两件事：
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { n: "①", t: "打分", d: "给前面的词和它自己各打一个相关度分数" },
              { n: "②", t: "混合", d: "按分数高低，把这些词的含义按比例并入自身" },
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
            问题在于，这两件事需要的信息<b>并不相同</b>。用招聘来类比，就能看出为什么需要三种向量：
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
                  { k: "招聘方需要说明", v: "“我要找一个会 Python 的后端”", tag: "我在找什么", role: "Q" },
                  { k: "应聘者需要说明", v: "“我是后端，会 Python”", tag: "我是什么", role: "K" },
                ],
                note: "两者的角色并不对称：一方提出需求，一方展示自身条件。同一份信息无法同时承担这两种表达，因此必须拆成两个向量。",
              },
              {
                n: "②",
                t: "混合：录用之后他能提供什么",
                bg: "#FAEEDA",
                border: "#BA7517",
                text: "#633806",
                rows: [{ k: "实际提供的", v: "多年架构经验、项目中积累的判断、代码风格等", tag: "我能提供什么内容", role: "V" }],
                note: "简历上的“会 Python”只是便于被检索的标签，并不等于他实际能承担的工作。筛选看的是标签，用人看的是能力，两者必须分开表示。",
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
            回到这个句子：<b>“怎么样”</b>相当于招聘方，需要找一个可以描述状态的对象；<b>“天气”</b>相当于应聘者，属于气象类词汇。被选中之后，“天气”提供的是它<b>完整的含义</b>。
            上面两张卡片里出现了三份不同的信息：<b>我在找什么</b>、<b>我是什么</b>、<b>我能提供什么内容</b>。它们各自对应一个专用向量，也就是下一步的 <b>Q、K、V</b>。
          </div>

          <div style={{ marginTop: 10 }} />
          <Detail title="延伸：为什么不能只用两个甚至一个向量">
            <WhyThree />
          </Detail>
        </Bridge>
      </div>
    ),
  },
  {
    title: "第 3 步：每个词生成 Q、K、V 三个向量",
    content: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Card>
          <Label>上一步的三份信息——我在找什么、我是什么、我能提供什么内容——各对应一个专用向量</Label>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {[
              { role: "Q — Query（查询）", use: "用来 ① 打分", eq: "词向量 × Wq", meaning: "我在找什么", example: "“怎么样”的 Q：正在寻找气象或状态类的词", bg: "#E1F5EE", border: "#1D9E75", text: "#085041" },
              { role: "K — Key（键）", use: "用来 ① 打分", eq: "词向量 × Wk", meaning: "我是什么", example: "“天气”的 K：属于气象类的词", bg: "#EEEDFE", border: "#534AB7", text: "#3C3489" },
              { role: "V — Value（值）", use: "用来 ② 混合", eq: "词向量 × Wv", meaning: "我能提供什么内容", example: "“天气”的 V：天气一词的完整含义", bg: "#FAEEDA", border: "#BA7517", text: "#633806" },
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
            概括一句：<b>Q 和 K 决定关注谁，V 提供关注到的内容</b>。第 4、5 步用 Q 和 K，第 6 步用 V。
          </Muted>
        </Card>

        <Detail title="延伸：乘以一个矩阵到底在做什么">
          <MatrixExplain />
        </Detail>

        <Detail title="延伸：Wq、Wk、Wv 这三个矩阵从何而来">
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
        pct: Math.max(0, (ATTN_SCORES[i] / ATTN_MAX) * 100),
        hi: i === 2,
      }))
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card>
            <Label>这就是上一步的第 ① 步打分：用“怎么样”的 Q 与每个词的 K 做点积</Label>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#666", margin: "8px 0" }}>
              “怎么样”的 Q = {fmtVec(Q_HOW)}
            </div>
            {scores.map(({ w, k, score, pct, hi }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 52, textAlign: "right", fontWeight: hi ? 600 : 400, color: hi ? "#085041" : "#333", fontSize: 13 }}>{w}</div>
                <div style={{ fontSize: 10, color: "#6e6e6e", fontFamily: "monospace", width: 120, flexShrink: 0 }}>{k}</div>
                <div style={{ flex: 1, height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: hi ? "#1D9E75" : "#85B7EB", borderRadius: 4, transition: "width 0.4s" }} />
                </div>
                <div style={{ width: 36, fontWeight: hi ? 600 : 400, color: hi ? "#085041" : "#666", fontSize: 13 }}>{score.toFixed(2)}</div>
              </div>
            ))}
            <Muted>
              “天气”的相关度分数最高（{ATTN_SCORES[2].toFixed(2)}），因为它的 K 与“怎么样”的 Q 方向最接近。“的”是虚词，分数为负（{ATTN_SCORES[1].toFixed(2)}），说明两者不仅无关，方向还相反。这一结果由训练得到，并非人为设定的规则。以上四个分数都可以用同一种乘法逐项验算。
            </Muted>
          </Card>

          <Detail title="延伸：点积是什么，为什么能衡量相关度">
            <div style={{ marginBottom: 8 }}>
              点积就是把两组数字<b>对应相乘，再全部相加</b>。先不谈 AI：假设你和两位朋友分别为三样事物打分（-5 到 5 分）：
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
                你 · 朋友A = 5×4 + 3×2 + (-4)×(-5) = <span style={{ fontWeight: 600, fontSize: 14 }}>46</span>　偏好接近
              </div>
              <div style={{ color: "#993C1D" }}>
                你 · 朋友B = 5×(-3) + 3×(-1) + (-4)×5 = <span style={{ fontWeight: 600, fontSize: 14 }}>-38</span>　偏好相反
              </div>
            </div>
            <div style={{ marginTop: 10, color: "#5a5a5a" }}>
              同号相乘为正（加分），异号相乘为负（扣分），因此点积天然可以衡量两组数字是否接近。
              Q 与 K 做点积，问的就是：这个词<b>想找的内容</b>，与那个词<b>能提供的内容</b>是否匹配。
            </div>
          </Detail>

          <Detail title="延伸：这四个分数的完整算式">
            <div style={{ marginBottom: 8 }}>
              每个分数都由 Q 与该词的 K <b>对应相乘再求和</b>得到。Q = {fmtVec(Q_HOW)}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.9, color: "#444" }}>
              {WORDS.map((w, i) => {
                const k = K_AFTER[i]
                const terms = Q_HOW.map((q, d) => `${q.toFixed(2)}×${k[d].toFixed(2)}`)
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
            <Label>Softmax：把相关度分数换算成合计为 1 的权重</Label>
            <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#6e6e6e", marginBottom: 6 }}>相关度分数</div>
                {items.map(({ w, raw, hi }) => (
                  <div key={w} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", borderRadius: 6, marginBottom: 4, background: hi ? "#E1F5EE" : "#f7f7f5", color: hi ? "#085041" : "#333", fontSize: 13 }}>
                    <span>{w}</span><span style={{ fontFamily: "monospace" }}>{raw}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", fontSize: 20, color: "#6e6e6e" }}>→</div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#6e6e6e", marginBottom: 6 }}>注意力权重（合计 = 1）</div>
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
              四个权重分别是：天气约 {(ATTN_WEIGHTS[2] * 100).toFixed(0)}%，“怎么样”自身约 {(ATTN_WEIGHTS[3] * 100).toFixed(0)}%，北京约 {(ATTN_WEIGHTS[0] * 100).toFixed(0)}%，“的”约 {(ATTN_WEIGHTS[1] * 100).toFixed(0)}%。
              天气仍然最高，但模型并非只看这一个词。以上数值由上一步的四个分数经 Softmax 换算得到。
            </Muted>
          </Card>
          <Detail title="延伸：为什么要换算成合计为 1">
            因为下一步要按这些数值<b>分配比例</b>。相关度分数（{ATTN_SCORES[0].toFixed(2)}、{ATTN_SCORES[2].toFixed(2)} 等）没有上限，直接用于混合会使结果不断变大、数值失控。
            换算成合计为 1 之后，它们相当于百分比：天气约 {(ATTN_WEIGHTS[2] * 100).toFixed(0)}%，“怎么样”自身约 {(ATTN_WEIGHTS[3] * 100).toFixed(0)}%。这样混合出来的向量始终处于合理范围内。
          </Detail>
          <Detail title="延伸：完整公式里还要先除以 √d">
            <div style={{ marginBottom: 8 }}>
              正文为了便于手算，省略了一步除法。完整的注意力公式是{" "}
              <code style={{ fontFamily: "monospace", background: "#f2f2f0", borderRadius: 4, padding: "1px 5px" }}>Softmax(Q · K ÷ √d)</code>
              ：点积得到相关度分数后，<b>先除以 √d，再送进 Softmax</b>。这里的 d 是 Q、K 的维度，本文简化为 {D_K}，真实模型中常见 128。
            </div>
            <div style={{ marginBottom: 8 }}>
              这步除法用来<b>控制分数的波动范围</b>。维度越高，点积累加的项就越多，分数越容易拉开到几十的量级。而分数一旦悬殊，Softmax 会把几乎全部权重压给最大的那个词，其余趋近于 0，注意力就退化成只看一个词，训练时也很难再调整。除以 √d 恰好抵消维度带来的放大。
            </div>
            <div style={{ marginBottom: 8 }}>
              本文的四个分数本来就在合理范围内，因此这步除法只是让差距变小，<b>排序完全不变</b>：
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "monospace", fontSize: 11 }}>
              {[
                { k: "省略除法（正文）", ws: ATTN_WEIGHTS },
                { k: `除以 √${D_K} ≈ ${D_K_ROOT.toFixed(2)}`, ws: SCALED_WEIGHTS },
              ].map(({ k, ws }) => (
                <div key={k} style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "baseline" }}>
                  <span style={{ width: 108, flexShrink: 0, color: "#6e6e6e", fontFamily: "system-ui, sans-serif" }}>{k}</span>
                  {WORDS.map((word, i) => (
                    <span
                      key={word}
                      style={{
                        width: 74,
                        flexShrink: 0,
                        textAlign: "center",
                        padding: "2px 0",
                        borderRadius: 5,
                        background: i === 2 ? "#E1F5EE" : "#f7f7f5",
                        color: i === 2 ? "#085041" : "#999",
                        fontWeight: i === 2 ? 600 : 400,
                      }}
                    >
                      {word} {(ws[i] * 100).toFixed(0)}%
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </Detail>
        </div>
      )
    },
  },
  {
    title: "第 6 步：按权重合并 V，得到最终表示",
    content: () => {
      const order = [2, 3, 0, 1]
      const notes = ["也有一定贡献", "贡献最少", "贡献最多", "自身也占一部分"]
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
            <Label>这就是第 ② 步混合：按权重对各词的 V 向量加权求和</Label>
            <div style={{ margin: "10px 0" }}>
              {items.map(({ w, p, note, hi, dim }) => (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, opacity: dim ? 0.4 : 1 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 13, color: hi ? "#085041" : "#555", fontWeight: hi ? 600 : 400, width: 36 }}>{p}</div>
                  <div style={{ fontSize: 13, color: "#555" }}>×</div>
                  <div style={{ padding: "4px 12px", borderRadius: 6, background: hi ? "#FAEEDA" : "#f7f7f5", border: `0.5px solid ${hi ? "#BA7517" : "#e0e0e0"}`, fontSize: 13, color: hi ? "#633806" : "#333" }}>“{w}”的 V</div>
                  <div style={{ fontSize: 11, color: "#6e6e6e" }}>{note}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 4 }}>
              {items.map((item, i) => (
                <div key={item.w} style={{ width: `${item.share}%`, background: barColors[i] }} />
              ))}
            </div>
            <Muted>
              新向量中约有一半来自“天气”，其余来自“怎么样”自身、“北京”和少量的“的”，是一份以“天气”为主的混合表示。
            </Muted>
          </Card>

          <div style={{ background: "#E1F5EE", border: "0.5px solid #1D9E75", borderRadius: 10, padding: "12px 16px", borderLeft: "3px solid #1D9E75" }}>
            <div style={{ fontWeight: 600, color: "#085041", fontSize: 14 }}>输出：以“天气”的含义为主，同时包含“北京”和自身的信息</div>
            <div style={{ fontSize: 12, color: "#0F6E56", marginTop: 4 }}>模型由此判断出，“怎么样”问的是天气的状态，而不是北京的位置。</div>
          </div>

          <Detail title="延伸：加权求和就是按重要性计算平均">
            <div style={{ marginBottom: 8 }}>普通平均给每一项相同的权重，加权求和则让<b>重要的项占更大比例</b>。最常见的例子是计算总成绩：</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#444", lineHeight: 1.9 }}>
              <div style={{ color: "#5a5a5a" }}>期末占 60%，作业占 30%，考勤占 10%</div>
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
            <div style={{ color: "#5a5a5a" }}>
              权重合计为 1，因此结果不会失控。上面对 V 的处理完全相同，只是被加权的对象不是分数，而是一串串向量。
            </div>
          </Detail>

          <Detail title="延伸：多头与多层，这套流程会重复很多次">
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
        { n: 2, label: "Embedding", desc: "每个词转换成词向量", bg: "#EAF3DE", border: "#3B6D11", text: "#27500A" },
        { n: 3, label: "生成 Q K V", desc: "词向量 × Wq/Wk/Wv → 三份信息各自的向量", bg: "#EEEDFE", border: "#534AB7", text: "#3C3489" },
        { n: 4, label: "点积打分", desc: "“怎么样”的 Q × 每个词的 K → 相关度分数", bg: "#E1F5EE", border: "#1D9E75", text: "#085041" },
        { n: 5, label: "Softmax", desc: "相关度分数 → 合计为 1 的注意力权重", bg: "#FAEEDA", border: "#BA7517", text: "#633806" },
        { n: 6, label: "加权求 V", desc: "按权重对各词的 V 加权求和 → 融合上下文的表示", bg: "#FAECE7", border: "#993C1D", text: "#712B13" },
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
            主线到此结束，记住两句话即可：<b>点积负责计算分数，加权求和负责按分数分配比例</b>。
          </div>
          <Detail title="延伸：真实模型会重复执行这套流程">
            以上第 3 至 6 步，是<b>一个注意力头</b>完成的工作。真实模型会并列多个头、串联多层（例如 32 层 × 32 头），逐层加深对句子的理解。若想看“她”如何逐层锁定“小红”，可回到第 6 步展开“多头与多层”。
          </Detail>
          <Detail title="进阶：KV Cache 与显存（可跳过）">
            <div>
              工程上会把第 3 步中每个词的 <b>K、V 向量</b>缓存下来。只要前面的词没有变化，这些 K/V 就无需重新计算，这就是 KV Cache，也是 prompt 前缀应保持稳定的原因。
            </div>
            <div style={{ marginTop: 8 }}>
              输入 10 个词、32 层 32 头时，一次前向会产生上万组 q/k/v，全部缓存会占用大量显存。因此目前常用 <b>GQA</b>：Q 仍保留 32 个头，K/V 只保留 8 组，每 4 个 Q 头共享一组，显存占用约降为四分之一。这部分属于工程优化，不影响对注意力本身的理解。
            </div>
          </Detail>
        </div>
      )
    },
  },
]

const WORDS = ["北京", "的", "天气", "怎么样"]
const DIMS = ["地点感", "气象感", "疑问感", "虚词性"]
// 第 2 步的 4 个词向量（真实模型为 4096 维，这里简化为 4 维，便于验算）
const VEC = [
  [1.0, 0.2, 0.1, 0.1], // 北京
  [0.1, 0.1, 0.1, 1.0], // 的
  [0.3, 1.0, 0.1, 0.1], // 天气
  [0.1, 0.4, 1.0, 0.2], // 怎么样
]
const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0)
const SYM = VEC.map((a) => VEC.map((b) => dot(a, b)))

// 一个矩阵 = 一叠“提问卡”，每一行就是一道题。
// Wq 与 Wk 的同一行必须问同一个话题（Q 问“我在找 X 吗”，K 答“我是 X 吗”），
// 否则点积的第 r 项就成了拿两件不相干的事情相乘。
const MATS = {
  Wq: {
    label: "Wq（问“我在找什么”）",
    color: "#1D9E75",
    bg: "#E1F5EE",
    text: "#085041",
    out: "Q",
    rows: [
      { q: "我在找地点吗？", w: [0.9, 0.0, 0.0, 0.0] },
      { q: "我在找气象或状态吗？", w: [0.0, 0.1, 0.9, 0.0] },
      { q: "我在找实词吗？", w: [0.0, 0.0, 0.5, 0.0] },
    ],
  },
  Wk: {
    label: "Wk（问“我是什么”）",
    color: "#534AB7",
    bg: "#EEEDFE",
    text: "#3C3489",
    out: "K",
    rows: [
      { q: "我是地点吗？", w: [0.9, 0.0, 0.0, 0.0] },
      { q: "我是气象或状态吗？", w: [0.0, 1.0, 0.0, 0.0] },
      { q: "我是实词吗？", w: [0.5, 0.5, 0.3, -1.0] },
    ],
  },
}

// 第 3–6 步共用：Q/K 一律由词向量乘矩阵得出，保证折叠区的演算与主线数值同源
const project = (v: number[], mk: "Wq" | "Wk") => MATS[mk].rows.map((r) => dot(v, r.w))
const ask = (wi: number, mk: "Wq" | "Wk", r: number) => dot(VEC[wi], MATS[mk].rows[r].w)
const Q_HOW = project(VEC[3], "Wq")
const K_AFTER = VEC.map((v) => project(v, "Wk"))
const fmtVec = (v: number[]) => `[${v.map((x) => x.toFixed(2)).join(",")}]`
const softmax = (xs: number[]) => {
  const ex = xs.map((x) => Math.exp(x))
  const s = ex.reduce((a, b) => a + b, 0)
  return ex.map((e) => e / s)
}
const ATTN_SCORES = K_AFTER.map((k) => dot(Q_HOW, k))
const ATTN_WEIGHTS = softmax(ATTN_SCORES)
const ATTN_MAX = Math.max(...ATTN_SCORES)

// 第 5 步折叠区：完整公式会先除以 √d 再做 Softmax，这里据此算出对照用的权重
const D_K = Q_HOW.length
const D_K_ROOT = Math.sqrt(D_K)
const SCALED_WEIGHTS = softmax(ATTN_SCORES.map((s) => s / D_K_ROOT))

// —— 多头 / 多层演示 ——
const SENT = ["小明", "把", "书", "给了", "小红", "，", "她", "很", "开心"]
const ME = 6 // 追踪“她”这个词

const LAYERS = [
  {
    n: 1,
    tag: "浅层",
    heads: [
      { h: "头 3", job: "关注前一个词", a: [0.02, 0.02, 0.03, 0.04, 0.09, 0.68, 0.08, 0.02, 0.02] },
      { h: "头 11", job: "寻找指人的词", a: [0.28, 0.02, 0.04, 0.03, 0.31, 0.02, 0.24, 0.03, 0.03] },
      { h: "头 26", job: "关注标点与断句", a: [0.03, 0.04, 0.03, 0.04, 0.05, 0.62, 0.09, 0.05, 0.05] },
    ],
    know: "我是个人称代词，前面有两个人名候选：小明、小红。",
    level: 1,
  },
  {
    n: 5,
    tag: "中浅层",
    heads: [
      { h: "头 3", job: "关注前一个词", a: [0.02, 0.02, 0.03, 0.05, 0.12, 0.62, 0.08, 0.03, 0.03] },
      { h: "头 11", job: "寻找指人的词", a: [0.18, 0.02, 0.03, 0.04, 0.58, 0.02, 0.09, 0.02, 0.02] },
      { h: "头 26", job: "分辨施动方与接受方", a: [0.09, 0.03, 0.05, 0.31, 0.34, 0.03, 0.11, 0.02, 0.02] },
    ],
    know: "“给了”涉及给予双方，我更可能是接受的一方，小红的可能性上升。",
    level: 2,
  },
  {
    n: 20,
    tag: "中深层",
    heads: [
      { h: "头 3", job: "转为关注修饰关系", a: [0.03, 0.02, 0.06, 0.08, 0.14, 0.04, 0.09, 0.42, 0.12] },
      { h: "头 11", job: "指代消解", a: [0.05, 0.01, 0.02, 0.03, 0.83, 0.01, 0.03, 0.01, 0.01] },
      { h: "头 26", job: "判断谁做了什么", a: [0.24, 0.02, 0.14, 0.36, 0.14, 0.02, 0.04, 0.02, 0.02] },
    ],
    know: "我指的是小红，这一判断已基本确定。",
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
        前面第 3 至 6 步，是<b>一个注意力头</b>完成的工作。真实模型会在两个方向上重复这一流程：
        <div style={{ marginTop: 6 }}>
          <b>并列的“头”</b>：同一句话由 32 个头同时处理，各自关注不同角度。
        </div>
        <div style={{ marginTop: 2 }}>
          <b>串联的“层”</b>：每处理一遍，就把新的理解<b>写回每个词</b>，再用更新后的词重新处理一遍，共 32 遍。
        </div>
      </div>

      {/* 例句 */}
      <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 11, color: "#5a5a5a", marginBottom: 8 }}>以下句为例，只跟踪“她”这一个词，观察它在各层获得了哪些信息</div>
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
        <div style={{ fontSize: 11, color: "#5a5a5a", marginBottom: 6 }}>点击查看不同深度的层</div>
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
          在第 {L.n} 层，“她”由 32 个头同时处理。以下选取其中 3 个，观察它们各自关注的词：
        </div>
        {L.heads.map(({ h, job, a }) => {
          const top = a.indexOf(Math.max(...a))
          return (
            <div key={h} style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap", marginBottom: 8 }}>
                <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "#3C3489" }}>{h}</div>
                <div style={{ fontSize: 11, color: "#5a5a5a" }}>{job}</div>
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
          32 个头的结果合并后叠加回“她”的向量，作为第 {L.n + 1} 层的输入
        </div>
        <div style={{ fontSize: 13, color: "#3C3489", lineHeight: 1.8 }}>
          这一层结束后，“她”携带的信息是：<b>{L.know}</b>
        </div>
        <div style={{ display: "flex", gap: 3, marginTop: 10 }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ flex: 1, height: 5, borderRadius: 3, background: s <= L.level ? "#534AB7" : "rgba(83,74,183,0.15)", transition: "background 180ms" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#3C3489", opacity: 0.6, marginTop: 5 }}>理解深度</div>
      </div>

      <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px", lineHeight: 1.9 }}>
        <div style={{ fontWeight: 600, color: "#333", marginBottom: 6 }}>三个容易混淆的地方</div>
        <div style={{ color: "#555" }}>
          <b>1. 为什么需要这么多层？</b>一次加权求和只能建立<b>一层</b>关联。从“她是代词”推进到“她收到书，所以开心”，中间要经过多层关联，而每层只能推进一步。
        </div>
        <div style={{ color: "#555", marginTop: 6 }}>
          <b>2. 下一层的“她”为什么不同了？</b>因为每层的输出都会<b>叠加</b>到该词原有的向量上。第 20 层接收到的“她”，已经是带有“我是小红”这一信息的新向量：字面没变，向量已经不是最初那串数字。
        </div>
        <div style={{ color: "#555", marginTop: 6 }}>
          <b>3. 由谁决定使用哪个头的 Wq/Wk/Wv？</b>没有谁来决定。数据流到第几层的第几个头，就使用该头的权重，其间没有任何路由或判断，如同流水线上的固定工位。
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
            <div style={{ fontSize: 11, color: "#6e6e6e", marginTop: 2 }}>{x.l}</div>
          </div>
        ))}
      </div>
      <div style={{ color: "#5a5a5a", textAlign: "center", fontSize: 11, marginTop: -4 }}>
        以 Llama-2 7B 为例：打分 → Softmax → 加权求和，整个过程共执行 1024 次。
      </div>
    </div>
  )
}

// —— 训练演示：模型通过预测下一个词并比对答案，自行调整权重 ——
const GUESS = ["上海", "了", "晴朗", "呢"] // 注意力落在哪个词上，就会预测出对应的词
const FIXED = [0.30, 0.20, 0.25] // 北京 / 的 / 怎么样 的分数（此处固定不变）

function attnOf(w: number) {
  const raw = [FIXED[0], FIXED[1], w * 1.6, FIXED[2]]
  const ex = raw.map((x) => Math.exp(x * 3))
  const s = ex.reduce((a, b) => a + b, 0)
  return ex.map((x) => x / s)
}

function Training() {
  const [w, setW] = useState(0.05) // Wk 中“关注气象感”那一项的数值
  const [round, setRound] = useState(0)
  const [log, setLog] = useState<{ r: number; guess: string; p: number; from: number; to: number; delta: number }[]>([])

  const attn = attnOf(w)
  const pRight = attn[2] // 预测出“晴朗”的把握
  const pctRight = Math.round(pRight * 100) // 取整后再算差额，保证两个数加起来正好 100
  const guess = GUESS[attn.indexOf(Math.max(...attn))]
  const correct = guess === "晴朗"

  function step(n: number) {
    let cw = w
    let cr = round
    const entries: { r: number; guess: string; p: number; from: number; to: number; delta: number }[] = []
    for (let i = 0; i < n; i++) {
      const a = attnOf(cw)
      const g = GUESS[a.indexOf(Math.max(...a))]
      const err = 1 - a[2] // 与完全正确之间的差距
      const next = Math.min(2, cw + err * 0.55) // 梯度：偏差越大，调整幅度越大
      entries.push({ r: cr + 1, guess: g, p: a[2], from: cw, to: next, delta: next - cw }) // 记录实际生效的调整量，保证 from + delta = to
      cw = next
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
        这三个矩阵<b>既不是人工编写的，也不是推导出来的</b>。它们初始时是一组<b>随机数</b>，模型在海量文本上反复<b>预测下一个词</b>，不断比对答案并微调，才逐渐变成有效的数值。
        <div style={{ marginTop: 6 }}>
          下面的演示从 Wk 中挑出<b>一个数字</b>，逐轮训练观察它的变化。矩阵里的每个数字都称为一个<b>权重</b>，它们就是训练要调整的对象。（后面第 5 步还会出现“注意力权重”，那是各词分到的百分比，与此处矩阵里的数字不是一回事。）
        </div>
      </div>

      {/* 练习题 */}
      <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 4 }}>模型反复练习的题型</div>
        <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>答案就在原文之中，无需人工标注</div>
        <div style={{ fontSize: 14, color: "#333", lineHeight: 1.9 }}>
          北京的天气怎么样？今天很
          <span style={{ display: "inline-block", minWidth: 52, textAlign: "center", margin: "0 4px", padding: "2px 8px", borderRadius: 6, background: "#fff", border: "1px dashed #bbb", color: "#767676" }}>
            ？
          </span>
        </div>
        <div style={{ fontSize: 11, color: "#5a5a5a", marginTop: 6 }}>
          正确答案：<b style={{ color: "#085041" }}>晴朗</b>。要答对，模型必须关注到“天气”这个词。
        </div>
      </div>

      {/* 当前这一格权重 */}
      <div style={{ background: "#EEEDFE", border: "0.5px solid #534AB7", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6 }}>
          <div style={{ fontSize: 12, color: "#3C3489" }}>
            正在训练的权重：<b>Wk</b> 中“关注气象感”那一项
          </div>
          <div style={{ fontSize: 11, color: "#3C3489", opacity: 0.7 }}>已训练 {round} 轮</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 600, color: "#3C3489", width: 74 }}>{w.toFixed(3)}</div>
          <div style={{ flex: 1, height: 8, background: "rgba(0,0,0,0.07)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${(w / 2) * 100}%`, height: "100%", background: "#534AB7", borderRadius: 4, transition: "width 200ms" }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#3C3489", opacity: 0.7, marginTop: 6, lineHeight: 1.7 }}>
          {round === 0
            ? "初始状态：0.050，一个不带任何含义的随机小数。真实模型同样从随机数起步，而不是从 0 起步——若权重全为 0，所有维度将完全对称，训练无从区分它们。"
            : "没有人指定这个数值应该是多少，它是在一次次比对答案的过程中被逐步推上来的。"}
        </div>
      </div>

      {/* 注意力分布与预测结果 */}
      <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 4 }}>“怎么样”的注意力分布</div>
        <div style={{ fontSize: 11, color: "#555", marginBottom: 10, lineHeight: 1.7 }}>
          这个权重决定每个词的 K（“我是什么”）。K 一变，“怎么样”与各词的匹配程度就跟着变，再换算成合计 100% 的比例，即为下图。匹配与换算的具体做法，第 4、5 步会讲，此处只需观察它随权重如何变化。
        </div>
        {WORDS.map((word, i) => (
          <div key={word} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <div style={{ width: 46, fontSize: 12, color: i === 2 ? "#085041" : "#888", fontWeight: i === 2 ? 600 : 400 }}>{word}</div>
            <div style={{ flex: 1, height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${attn[i] * 100}%`, height: "100%", background: i === 2 ? "#1D9E75" : "#c8c8c8", borderRadius: 4, transition: "width 200ms" }} />
            </div>
            <div style={{ width: 38, fontSize: 11, fontFamily: "monospace", color: "#666", textAlign: "right" }}>{(attn[i] * 100).toFixed(0)}%</div>
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
            {round === 0 ? "训练前" : `训练 ${round} 轮后`}，此刻考它一次，模型会填 <b style={{ fontSize: 14 }}>{guess}</b>
            {correct ? "　✓ 回答正确" : "　✗ 正确答案是“晴朗”"}
          </div>
          <div style={{ fontSize: 11, color: correct ? "#085041" : "#712B13", opacity: 0.8, marginTop: 4 }}>
            {correct ? (
              <>
                虽然已经答对，把握也只有 {pctRight}%，距离 100% 还差 {100 - pctRight} 个百分点。
                <b>只要还有差距，梯度就不为零</b>，训练不会就此停下，这个权重会继续上调。
              </>
            ) : (
              <>
                模型对“晴朗”的把握只有 {pctRight}%，距离 100% 还差 {100 - pctRight} 个百分点。
                <b>这个差距就是梯度</b>，它决定这个权重需要上调多少。
              </>
            )}
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
          重置为随机值
        </button>
      </div>

      {/* 日志 */}
      <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "10px 12px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 4 }}>训练记录（最新在上）</div>
        <div style={{ fontSize: 11, color: "#555", marginBottom: 8, lineHeight: 1.7 }}>
          考试成绩<b>完全由当前权重决定</b>：只要权重还是这个数，考一次和考一百次都是同样的结果。所以最上面一行的成绩，就是<b>下一轮将要使用的那份成绩</b>；点一次按钮，你会看到这两个数字原样出现在新增的那一行里，并非又考了一回。
          <div style={{ marginTop: 4 }}>
            考试本身不会让人进步：考完若不复习总结，再考多少次，成绩依旧。<b>“训练 1 轮”相当于考后的那次复习</b>——拿这份成绩算出与满分的差距，据此把权重推高一步。权重变了，下一次的成绩才会跟着变。
          </div>
          <div style={{ marginTop: 4 }}>
            下面每行记录一轮：模型当时填的词、它对“晴朗”有几成把握、以及这一轮把权重从多少调到了多少。把握越低，调整幅度越大；上一轮的终点即下一轮的起点，因此各行首尾相接。
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "monospace", fontSize: 11 }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              color: correct ? "#085041" : "#993C1D",
              background: "#EEEDFE",
              borderRadius: 5,
              padding: "3px 6px",
              margin: "-3px -6px 2px",
            }}
          >
            <span style={{ width: 52, color: "#8983C9" }}>当前水平</span>
            <span style={{ width: 62 }}>会填“{guess}”</span>
            <span style={{ width: 66, opacity: 0.8 }}>把握 {pctRight}%</span>
            <span style={{ color: "#8983C9" }}>权重仍是 {w.toFixed(3)}</span>
          </div>
          {log.map((e, i) => (
            <div key={`${e.r}-${i}`} style={{ display: "flex", gap: 8, color: e.guess === "晴朗" ? "#085041" : "#993C1D", flexWrap: "wrap" }}>
              <span style={{ width: 52, color: "#767676" }}>第{e.r}轮</span>
              <span style={{ width: 62 }}>填“{e.guess}”</span>
              <span style={{ width: 66, opacity: 0.8 }}>把握 {(e.p * 100).toFixed(0)}%</span>
              <span style={{ color: "#534AB7" }}>
                权重 {e.from.toFixed(3)} → {e.to.toFixed(3)}（上调 {e.delta.toFixed(3)}）
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px", lineHeight: 1.9 }}>
        <div style={{ fontWeight: 600, color: "#333", marginBottom: 6 }}>以上过程就是反向传播</div>
        <div style={{ color: "#555" }}>
          答错后先算出差距，再顺着这个差距逐层回推，把每个权重朝“下次误差更小”的方向调整一小步。逐层回推即为<b>反向</b>，一轮轮传递下去即为<b>传播</b>。
        </div>
        <div style={{ color: "#555", marginTop: 8 }}>
          真实训练中同时调整的不是 1 个权重，而是 <b>70 亿个</b>；练习题也不是 1 道，而是数万亿道。持续训练数月之后，Wq/Wk/Wv 就从随机数变成了“疑问词会主动关注气象词”的状态。
        </div>
        <div style={{ color: "#5a5a5a", fontSize: 11, marginTop: 8 }}>
          因此下一步中“天气”能得到 {ATTN_SCORES[2].toFixed(2)} 的高分，完全是这些数值训练后的结果。模型内部并不存在“疑问词应当关注名词”这样一条规则，也没有人写过这条规则。
        </div>
      </div>
    </div>
  )
}

function MatrixExplain() {
  const [wi, setWi] = useState(2) // 词：默认“天气”
  const [mk, setMk] = useState<"Wq" | "Wk">("Wk")
  const m = MATS[mk]
  const v = VEC[wi]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ lineHeight: 1.9 }}>
        暂且不管“矩阵”这个名称。一个矩阵可以看作<b>一叠提问卡</b>：
        <div style={{ marginTop: 6 }}>
          <b>一行即一道题。</b>该行的 4 个数字，是对词向量 4 个维度的<b>关注度权重</b>：为 0 表示完全不看这一维，数值越大表示越看重这一维。
        </div>
        <div style={{ marginTop: 4 }}>把词向量按这组权重对应相乘再相加，得到的<b>一个数值</b>，就是这道题的得分。</div>
        <div style={{ marginTop: 4 }}>矩阵有几行就问几道题，各题得分依次排列，就构成新的向量。</div>
      </div>

      {/* 选择器 */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 11, color: "#5a5a5a", marginBottom: 4 }}>选择要计算的词</div>
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
          <div style={{ fontSize: 11, color: "#5a5a5a", marginBottom: 4 }}>选择要相乘的矩阵</div>
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
            <div key={d} style={{ width: 54, flexShrink: 0, textAlign: "center", color: "#6e6e6e" }}>
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
          <b style={{ fontFamily: "monospace", color: m.text }}>{mk}</b> 的每一行，都向 <b>{WORDS[wi]}</b> 提出一道题：
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
                <div style={{ fontSize: 11, color: m.text, opacity: 0.8, width: 62, flexShrink: 0 }}>{sum >= 0.7 ? "高度符合" : sum >= 0.3 ? "部分符合" : "基本不符"}</div>
              </div>

              {w.some((x) => x === 0) && (
                <div style={{ fontSize: 11, color: m.text, opacity: 0.6, marginTop: 6, lineHeight: 1.6 }}>
                  权重为 0 的项，无论词向量在该维度上取值多少，相乘后都是 0，相当于这道题<b>完全不考虑</b>这些维度。
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 结论 */}
      <div style={{ background: "#f7f7f5", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 8 }}>换一个矩阵，问题就完全不同，这就是所谓提取不同侧面</div>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.9 }}>
          <div>
            拿 <b>天气</b> 去问 <code style={{ fontFamily: "monospace", color: "#3C3489" }}>Wk</code>：“我是气象或状态吗” →{" "}
            <b style={{ color: "#3C3489", fontFamily: "monospace" }}>{ask(2, "Wk", 1).toFixed(2)}</b>，高度符合。
          </div>
          <div>
            同一个 <b>天气</b> 去问 <code style={{ fontFamily: "monospace", color: "#085041" }}>Wq</code>：“我在找气象或状态吗” →{" "}
            <b style={{ color: "#993C1D", fontFamily: "monospace" }}>{ask(2, "Wq", 1).toFixed(2)}</b>，它并不在寻找什么。
          </div>
          <div style={{ marginTop: 4 }}>
            换成 <b>怎么样</b> 再问一次 <code style={{ fontFamily: "monospace", color: "#085041" }}>Wq</code>：“我在找气象或状态吗” →{" "}
            <b style={{ color: "#085041", fontFamily: "monospace" }}>{ask(3, "Wq", 1).toFixed(2)}</b>，它确实在寻找。
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.8, marginTop: 10 }}>
          词向量没有任何变化，只是<b>提问不同</b>，得到的结果就完全不同。“怎么样”在寻找气象类词（Q 值高），“天气”恰好属于气象类词（K 值高），因此第 4 步两者做点积时，分数自然很高。
        </div>
        <div style={{ fontSize: 11, color: "#555", lineHeight: 1.7, marginTop: 8 }}>
          真实模型中这些问题没有名称，也无人编写，权重全部由训练得到。此处为便于理解，才给每一行起了名字。
        </div>
      </div>
    </div>
  )
}

function WhyThree() {
  // 点击表格中任意一格，查看它的算式
  const [cell, setCell] = useState<[number, number]>([3, 2])
  const [ri, ci] = cell
  // 只用 2 个（K=V）：一个旋钮同时决定“是否容易被找到”和“传出的内容”
  const [knob, setKnob] = useState(50)
  // 用 3 个：两个互不影响的旋钮
  const [knobK, setKnobK] = useState(85)
  const [knobV, setKnobV] = useState(90)

  const t = knob / 100
  const hit = Math.round(t * 100) // 被“怎么样”命中的分数
  const pure = Math.round((1 - t) * 100) // 传出的内容中真正属于“天气”的成分

  let verdict = { text: "两边都不理想：分数不够高，内容也已被稀释。", color: "#993C1D" }
  if (t < 0.25) verdict = { text: "内容保持完整，但分数过低，“怎么样”无法注意到“天气”。", color: "#993C1D" }
  else if (t > 0.75) verdict = { text: "分数足够高，但传递出去的已经不是“天气”原本的含义。", color: "#993C1D" }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* ── 只用 1 个 ── */}
      <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#3C3489", marginBottom: 2 }}>只用 1 个：所有关系被迫变成双向对等</div>
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.8, marginBottom: 10 }}>
          如果不拆分，两个词的分数就是它们的<b>原始向量直接点积</b>。先列出第 2 步的 4 个词向量
          <span style={{ color: "#6e6e6e" }}>（真实模型为 4096 维，这里简化为 4 维，便于验算）</span>：
        </div>

        {/* 词向量表 */}
        <div style={{ fontSize: 11, overflowX: "auto", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
            <div style={{ width: 52, flexShrink: 0 }} />
            {DIMS.map((d) => (
              <div key={d} style={{ width: 56, flexShrink: 0, textAlign: "center", color: "#6e6e6e" }}>
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
          任取两个词，把 4 个数<b>对应相乘再相加</b>，就是它们的分数。两两计算后得到下表，<b style={{ color: "#3C3489" }}>点击任意一格可查看算式</b>：
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 11, overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 3 }}>
            <div style={{ width: 52, flexShrink: 0 }} />
            {WORDS.map((w) => (
              <div key={w} style={{ width: 56, flexShrink: 0, textAlign: "center", color: "#6e6e6e" }}>
                {w}
              </div>
            ))}
          </div>
          {WORDS.map((rw, i) => (
            <div key={rw} style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <div style={{ width: 52, flexShrink: 0, color: "#5a5a5a", textAlign: "right", paddingRight: 4 }}>{rw}</div>
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
            {WORDS[ri]} · {WORDS[ci]}　（对应相乘，再全部相加）
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
              ? "这是对角线：每一项都是自身相乘，结果全为正数，不会出现正负抵消，因此数值明显偏大。"
              : "把两个词对调后，每一项的两个因子只是次序交换，乘积完全相同，因此 " +
                `${WORDS[ci]} · ${WORDS[ri]} 也只能是 ${SYM[ri][ci].toFixed(2)}。`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#993C1D", width: 52, flexShrink: 0 }}>问题一</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
              <span style={{ background: "#F4E4E4", padding: "1px 5px", borderRadius: 4, color: "#993C1D" }}>对角线</span>在整张表里都是各行的最大值：
              自身相乘时每一项都为正数，不会相互抵消，结果是每个词最关注的都是自己。
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#993C1D", width: 52, flexShrink: 0 }}>问题二</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
              这张表沿对角线<b>完全对称</b>（点击一格，对称位置会同时高亮）。“怎么样”对“天气”的分数是{" "}
              <span style={{ background: "#EEEDFE", padding: "1px 5px", borderRadius: 4, color: "#3C3489", fontFamily: "monospace" }}>{SYM[2][3].toFixed(2)}</span>
              ，“天气”对“怎么样”也<b>只能</b>是同一个数。因为 a×b = b×a，逐项相等，这不是参数没调好，而是数学上无法改变。
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, padding: "10px 12px", background: "#f7f7f5", borderRadius: 8, fontSize: 12, color: "#555", lineHeight: 1.8 }}>
          但语言中的关系是<b>单向</b>的。在“小明把书给了小红，<b>她</b>很开心”中，“她”必须紧盯“小红”才能确定指代对象；而“小红”出现时，并不需要同等程度地回看“她”。
          <div style={{ marginTop: 8, color: "#085041" }}>
            拆成 Q、K 之后，每个词都有了两个向量：Q 是“我在找什么”，K 是“我是什么”。两个方向各用各的：
          </div>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { dir: "“她”看“小红”", eq: "她的 Q × 小红的 K" },
              { dir: "“小红”看“她”", eq: "小红的 Q × 她的 K" },
            ].map(({ dir, eq }) => (
              <div key={dir} style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
                <span style={{ width: 108, flexShrink: 0, color: "#085041" }}>{dir}</span>
                <span style={{ background: "#E1F5EE", borderRadius: 5, padding: "2px 8px", color: "#085041" }}>{eq}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 6, color: "#085041" }}>
            两次用的是<b>四个不同的向量</b>，算出来的两个分数自然可以不相等。回到招聘的类比：一个人写的招聘需求和他的自我介绍本来就是两份材料，所以 A 评价 B、B 评价 A 完全可以给出不同的分数。
          </div>
        </div>
      </div>

      {/* ── 只用 2 个 ── */}
      <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#3C3489", marginBottom: 2 }}>只用 2 个（K=V）：一个旋钮同时控制两个互相冲突的目标</div>
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.8, marginBottom: 12 }}>
          假设“怎么样”的 Q 在寻找可以描述状态的对象。要让“天气”更容易被它命中，只能把“天气”的向量<b>朝那个方向调整</b>。
          但在 K=V 的情况下，同一个旋钮也决定了“天气”被选中后<b>传出的内容</b>。拖动下方滑块观察：
        </div>

        <div style={{ fontSize: 11, color: "#5a5a5a", marginBottom: 4 }}>把“天气”的向量朝“更容易被命中”的方向调整</div>
        <input
          type="range"
          min={0}
          max={100}
          value={knob}
          onChange={(e) => setKnob(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#534AB7", marginBottom: 12 }}
          aria-label="把天气的向量朝更容易被命中的方向调整"
        />

        <Gauge label="被“怎么样”命中的分数" pct={hit} good color="#1D9E75" />
        <Gauge label="传出的内容中真正属于“天气”的成分" pct={pure} good color="#BA7517" />

        <div style={{ marginTop: 10, fontSize: 12, color: verdict.color, lineHeight: 1.7, fontWeight: 500 }}>{verdict.text}</div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#666", lineHeight: 1.8 }}>
          两条进度条由同一个旋钮控制，<b>一个升高，另一个必然下降</b>，无论滑到哪个位置都无法兼顾。这就是一个旋钮承担两项职责的后果。
        </div>
      </div>

      {/* ── 用 3 个 ── */}
      <div style={{ background: "#E1F5EE", border: "0.5px solid #1D9E75", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#085041", marginBottom: 2 }}>用 3 个：拆成两个互不影响的旋钮</div>
        <div style={{ fontSize: 12, color: "#085041", opacity: 0.85, lineHeight: 1.8, marginBottom: 12 }}>
          K 只负责如何被找到，V 只负责提供什么内容，两者独立调整，可以同时达到理想状态：
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
        <div style={{ fontSize: 11, color: "#085041", opacity: 0.7, marginBottom: 4 }}>旋钮 V：让“天气”传出的含义更完整</div>
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
        <Gauge label="传出的内容中真正属于“天气”的成分" pct={knobV} good color="#BA7517" />

        <div style={{ marginTop: 10, fontSize: 12, color: "#085041", lineHeight: 1.8 }}>
          再加上 Q 使关系具有方向，三个向量各司其职、互不牵连。这就是通常所说的<b>把权重与内容解耦</b>。
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
        <span style={{ fontSize: 11, color: "#767676" }}>{open ? "收起" : "展开"}</span>
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
  return <div style={{ fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 8 }}>{children}</div>
}

function Muted({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7, marginTop: 6, ...style }}>{children}</div>
}

function tokenStyle(): CSSProperties {
  return { padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, border: "0.5px solid #d0d0d0", background: "#fff", color: "#333", minWidth: 60, textAlign: "center" }
}

export default function Page() {
  const [cur, setCur] = useState(0)
  const step = STEPS[cur]

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 620, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ fontSize: 12, color: "#5a5a5a", marginBottom: 6 }}>注意力是怎么工作的 · 零基础版</div>
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
