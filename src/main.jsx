import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  Check,
  Clock3,
  Compass,
  GraduationCap,
  HelpCircle,
  HeartHandshake,
  Mic2,
  Pause,
  Play,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import "./styles.css";

const inquiries = [
  "告诉我：你是谁？",
  "告诉我：此刻在你心里真实发生了什么？",
  "告诉我：什么让你感到有生命力？",
  "告诉我：你如何经验到另一个人？",
  "告诉我：你正在回避什么？",
  "告诉我：什么是爱？",
  "告诉我：你如何感受自己的身体？",
  "告诉我：生命此刻在你身上如何展开？",
  "告诉我：你最深的渴望是什么？",
  "告诉我：你愿意放下什么？",
];

const rounds = [
  { speaker: "A", listener: "B", prompt: "B 向 A 给出探问，A 探索并表达。" },
  { speaker: "B", listener: "A", prompt: "A 向 B 给出同一个探问，B 探索并表达。" },
  { speaker: "A", listener: "B", prompt: "重复第一轮，允许更深、更慢、更诚实。" },
  { speaker: "B", listener: "A", prompt: "重复第二轮，完成一个完整循环。" },
];

const historyItems = [
  [
    "源头",
    "二人禅的现代形式来自密集自我探问与二人沟通练习的结合：把禅修式的内在追问，放进面对面表达与倾听的结构里。",
  ],
  [
    "结构化",
    "早期密集闭关强调固定探问、轮换表达与倾听、严格时间容器和持续整合。形式的重点不是讨论观点，而是一次次回到当下真实经验。",
  ],
  [
    "发展",
    "后来的日常练习把密集闭关中的核心技术拆解为更容易学习和带领的形式：短轮次、清晰边界、温和探问和安全支持。",
  ],
  [
    "当代应用",
    "今天的二人禅常用于关系觉察、团体练习、静心课程和自我探索。它保留“探问、表达、接收”的核心，同时更重视创伤知情、同意和练习后的落地。",
  ],
];

const learningPath = [
  {
    title: "1. 建立共同语言",
    body: "先理解四个基础元素：探问、表达、倾听、整合。学习者要知道练习不是辩论、心理咨询或互相建议，而是让直接经验被清楚地说出和接收。",
  },
  {
    title: "2. 熟悉标准流程",
    body: "从 3 到 5 分钟一轮开始，使用同一个探问完成 A/B 交替。练习重点是守住角色、时间和边界，而不是追求特殊体验。",
  },
  {
    title: "3. 扩充探问层次",
    body: "探问可以从当下感受、身体觉察、关系经验，逐步进入身份、爱、生命、死亡、真实等更深主题。新手先用温和探问，稳定后再加深。",
  },
  {
    title: "4. 加入记录与复盘",
    body: "每次练习后记录三件事：我直接经验到了什么、我如何表达或回避、我需要怎样整合。复盘只整理自己的经验，不评价搭档。",
  },
];

const practiceFormats = [
  ["日常双人练习", "每周 1 到 2 次，每次 30 到 60 分钟。适合建立熟悉度、信任和稳定的表达能力。"],
  ["小组练习", "由带领者说明规则、分组、计时和收尾。适合学习不同搭档带来的镜照，但需要更清楚的保密约定。"],
  ["线上练习", "提前测试设备，保持摄像头稳定，约定断线后的处理方式。线上更需要慢速、简短和明确的结束流程。"],
  ["密集练习", "持续时间更长、探问更集中，可能触及强烈经验。应由成熟带领者设计流程，并设置充分休息和整合。"],
];

const integrationPrompts = [
  "刚才最真实、最有能量的一句话是什么？",
  "我的身体现在有什么变化？",
  "我在哪一刻开始解释、表演或保护自己？",
  "我从倾听者那里接收到什么，而不是想象到什么？",
  "练习后 24 小时内，我需要怎样照顾自己？",
  "这次经验如何带回日常关系，而不是停留在练习场里？",
];

const facilitatorGuides = [
  {
    title: "先成为稳定的练习者",
    body: "带领者需要长期亲身练习，熟悉表达者的迟疑、沉默、情绪涌动和身体反应。没有足够自我经验时，容易把带领变成讲解、分析或控制。",
  },
  {
    title: "学习两套能力",
    body: "一套是方法能力：探问设计、轮次安排、时间管理、整合流程。另一套是容器能力：同意、保密、边界、风险识别、团体氛围和暂停机制。",
  },
  {
    title: "只维护结构，不接管内容",
    body: "带领者不解释练习者的经验，不追问创伤细节，不把自己的答案塞给别人。职责是让探问清楚、规则清楚、结束清楚，并在必要时降速或停止。",
  },
  {
    title: "从小范围开始",
    body: "新带领者适合先带熟悉的人、短时段、温和探问。逐步练习开场说明、示范、计时、分组、复盘和处理突发情绪，再考虑公开工作坊或密集练习。",
  },
];

const qaItems = [
  [
    "二人禅和普通聊天有什么不同？",
    "聊天通常会回应、建议、比较和延伸话题；二人禅使用固定探问、固定角色和固定时间。倾听者主要提供在场，不把对方的内容拿来讨论。",
  ],
  [
    "练习中沉默可以吗？",
    "可以。沉默常常是探问进入身体和经验的过程。表达者可以停顿，也可以说“我现在不知道”“我感到空白”。这些都属于真实发生的内容。",
  ],
  [
    "是否必须看着对方眼睛？",
    "不必须。可以自然眼神接触，也可以看向地面或闭眼。关键是保持清醒和连接，而不是制造压力。",
  ],
  [
    "强烈情绪出现时怎么办？",
    "先减速，回到呼吸、身体触点和当下环境。若情绪过强、出现解离或安全风险，应立即停止练习，转向稳定支持或专业帮助。",
  ],
  [
    "带领者可以给建议吗？",
    "练习进行中不建议。结束后的分享也应避免诊断和评判。若需要教学，最好只说明方法、边界和下一步资源。",
  ],
  [
    "这能替代心理治疗吗？",
    "不能。二人禅是觉察与沟通练习，不是医疗、心理治疗或危机干预。正在经历严重心理困扰的人，应先获得专业支持。",
  ],
];

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

function PracticeTimer() {
  const [minutes, setMinutes] = useState(5);
  const [roundIndex, setRoundIndex] = useState(0);
  const [remaining, setRemaining] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const totalSeconds = minutes * 60;

  useEffect(() => {
    if (!running) return undefined;
    const interval = window.setInterval(() => {
      setRemaining((value) => {
        if (value > 1) return value - 1;
        setRoundIndex((index) => (index + 1) % rounds.length);
        return totalSeconds;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, totalSeconds]);

  const progress = useMemo(() => {
    return Math.max(0, Math.min(100, ((totalSeconds - remaining) / totalSeconds) * 100));
  }, [remaining, totalSeconds]);

  function reset(nextMinutes = minutes) {
    setRunning(false);
    setRoundIndex(0);
    setRemaining(nextMinutes * 60);
  }

  function updateMinutes(value) {
    const next = Number(value);
    setMinutes(next);
    reset(next);
  }

  const activeRound = rounds[roundIndex];

  return (
    <section className="practice" id="practice">
      <div className="section-heading">
        <p>Practice Tool</p>
        <h2>四轮二人禅计时器</h2>
      </div>
      <div className="practice-grid">
        <div className="timer-panel">
          <div className="timer-topline">
            <span>第 {roundIndex + 1} 轮 / 4</span>
            <span>
              {activeRound.speaker} 说 · {activeRound.listener} 听
            </span>
          </div>
          <div className="timer-face" aria-live="polite">
            {formatTime(remaining)}
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="round-prompt">{activeRound.prompt}</p>
          <div className="timer-controls">
            <button type="button" onClick={() => setRunning((value) => !value)}>
              {running ? <Pause size={18} /> : <Play size={18} />}
              {running ? "暂停" : "开始"}
            </button>
            <button type="button" className="secondary" onClick={() => reset()}>
              <RefreshCcw size={18} />
              重置
            </button>
          </div>
          <label className="duration-control">
            每轮时长
            <select value={minutes} onChange={(event) => updateMinutes(event.target.value)}>
              <option value="3">3 分钟</option>
              <option value="5">5 分钟</option>
              <option value="8">8 分钟</option>
              <option value="10">10 分钟</option>
            </select>
          </label>
        </div>

        <div className="flow-panel">
          {rounds.map((round, index) => (
            <div className={index === roundIndex ? "flow-step active" : "flow-step"} key={round.prompt}>
              <span>{index + 1}</span>
              <div>
                <strong>
                  {round.speaker} 表达，{round.listener} 倾听
                </strong>
                <p>{round.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top">
          <img src={`${baseUrl}logo-dyad.svg`} alt="" />
          <span>
            二人禅
            <small>Dyad Meditation</small>
          </span>
        </a>
        <nav aria-label="主导航">
          <a href="#learn">学习</a>
          <a href="#history">起源</a>
          <a href="#path">路径</a>
          <a href="#practice">练习</a>
          <a href="#facilitator">带领者</a>
          <a href="#inquiries">探问</a>
          <a href="#qa">Q&A</a>
          <a href="#safety">边界</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <img src={`${baseUrl}hero-dyad.png`} alt="两人面对面进行二人禅练习的插画" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow">学习 · 练习 · 整合</p>
            <h1>
              <span>二人禅</span>
              <small>Dyad Meditation</small>
            </h1>
            <p>
              一种把静心、诚实表达和深度倾听结合在一起的双人探问练习。它不追求正确答案，而是支持两个人在安全、清晰的结构中直接经验当下。
            </p>
            <div className="hero-actions">
              <a href="#practice">开始练习</a>
              <a href="#learn" className="ghost">
                了解方法
              </a>
            </div>
          </div>
        </section>

        <section className="history" id="history">
          <div className="section-heading">
            <p>History</p>
            <h2>从密集自我探问，到当代二人练习</h2>
          </div>
          <div className="history-layout">
            <div className="history-intro">
              <Compass />
              <h3>历史脉络</h3>
              <p>
                这部分融合了密集探问传统与当代二人练习的教学框架：既保留自我探问、轮换表达和专注倾听，也加入更适合日常练习的安全、边界和整合设计。
              </p>
            </div>
            <div className="history-timeline">
              {historyItems.map(([title, body], index) => (
                <article key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="learning-path" id="path">
          <div className="section-heading">
            <p>Learning Path</p>
            <h2>系统学习二人禅，可以按四步推进</h2>
          </div>
          <div className="path-grid">
            {learningPath.map((item) => (
              <article key={item.title}>
                <BookOpen />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="formats-panel">
            <div>
              <p className="eyebrow">Practice Formats</p>
              <h3>常见练习形式</h3>
            </div>
            <div className="formats-grid">
              {practiceFormats.map(([title, body]) => (
                <article key={title}>
                  <Check size={18} />
                  <div>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="intro" id="learn">
          <div className="section-heading">
            <p>What It Is</p>
            <h2>二人禅不是聊天，而是带结构的共同临在</h2>
          </div>
          <div className="intro-grid">
            <article>
              <UsersRound />
              <h3>两个人</h3>
              <p>练习者面对面坐下，可以在线或线下。一个人接收探问并表达，另一个人只给出探问、保持在场和倾听。</p>
            </article>
            <article>
              <Mic2 />
              <h3>一个探问</h3>
              <p>探问不是考试题。它像一扇门，邀请你觉察身体、情绪、念头和更深处的直接经验。</p>
            </article>
            <article>
              <Clock3 />
              <h3>固定轮次</h3>
              <p>常见格式是每轮 5 分钟，A/B 交替四轮。结构提供公平、专注和稳定的容器。</p>
            </article>
            <article>
              <HeartHandshake />
              <h3>诚实与接纳</h3>
              <p>表达者不需要表演或解释得漂亮；倾听者不分析、不建议、不打断，让对方被完整接收。</p>
            </article>
          </div>
        </section>

        <section className="method">
          <div className="method-copy">
            <p className="eyebrow">Core Method</p>
            <h2>一次完整练习</h2>
            <p>
              选择一个探问，设定每轮时长。倾听者清楚说出探问，表达者停留片刻，然后说出此刻真实浮现的内容。时间到后交换角色。
            </p>
          </div>
          <div className="method-steps">
            {[
              ["准备", "约定保密、边界、时长和结束方式。手机静音，坐姿稳定，眼神自然。"],
              ["接收", "倾听者说：请告诉我……。表达者先让探问进入身体和经验。"],
              ["表达", "表达者说真实发生的内容，可以停顿、沉默、重新开始。"],
              ["倾听", "倾听者不回应内容，只在需要时重复探问，并保持开放在场。"],
              ["整合", "四轮结束后至少留 5 到 20 分钟安静、书写、散步或分享收尾。"],
            ].map(([title, body], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <PracticeTimer />

        <section className="facilitator" id="facilitator">
          <div className="facilitator-copy">
            <p className="eyebrow">Facilitator</p>
            <h2>带领者：学习方法，也学习如何守住容器</h2>
            <p>
              带领二人禅不是把别人推向深度，而是让每个人在清楚、安全、可退出的结构里探索。带领者的成熟度，体现在能否稳定地维护边界、节奏和整合，而不是制造强烈体验。
            </p>
          </div>
          <div className="facilitator-grid">
            {facilitatorGuides.map((item) => (
              <article key={item.title}>
                <GraduationCap />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="facilitator-notes">
            <h3>带领时的注意事项</h3>
            <ul>
              <li>开场说明练习目的、流程、保密原则、可暂停和可退出。</li>
              <li>避免使用过度侵入的探问；新手先从身体、当下感受和关系觉察开始。</li>
              <li>为每轮留出清晰开始和结束，不让分享无限延长。</li>
              <li>观察过度激活、麻木、失联、惊恐和自伤风险；必要时停止练习。</li>
              <li>结束后安排安静整合，不急于总结、评价或解释他人的经验。</li>
            </ul>
          </div>
        </section>

        <section className="inquiries" id="inquiries">
          <div className="section-heading">
            <p>Inquiry Library</p>
            <h2>今日可以使用的探问</h2>
          </div>
          <div className="inquiry-grid">
            {inquiries.map((item) => (
              <button type="button" key={item}>
                <Sparkles size={16} />
                {item}
              </button>
            ))}
          </div>
          <div className="integration-panel">
            <div>
              <p className="eyebrow">Integration</p>
              <h3>练习后可以记录的问题</h3>
            </div>
            <div className="integration-grid">
              {integrationPrompts.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="qa" id="qa">
          <div className="section-heading">
            <p>Q&A</p>
            <h2>常见问题</h2>
          </div>
          <div className="qa-list">
            {qaItems.map(([question, answer]) => (
              <article key={question}>
                <HelpCircle />
                <div>
                  <h3>{question}</h3>
                  <p>{answer}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="safety" id="safety">
          <div>
            <p className="eyebrow">Safety</p>
            <h2>安全边界比深度更重要</h2>
            <p>
              二人禅可能触及强烈情绪、创伤记忆或存在性议题。它可以支持自我探索，但不替代心理治疗、医疗照护或危机干预。
            </p>
          </div>
          <ul>
            <li>
              <ShieldCheck />
              <span>开始前确认保密、同意、可暂停和可退出。</span>
            </li>
            <li>
              <ShieldCheck />
              <span>倾听者不诊断、不教导、不追问个人隐私。</span>
            </li>
            <li>
              <ShieldCheck />
              <span>若出现失控、解离、自伤风险或严重惊恐，立即停止并寻求专业支持。</span>
            </li>
            <li>
              <ShieldCheck />
              <span>新手先从温和探问开始，避免把练习变成突破压力。</span>
            </li>
          </ul>
        </section>

        <section className="resources">
          <div className="section-heading">
            <p>Study Notes</p>
            <h2>学习和实践时，请保留这几个重点</h2>
          </div>
          <div className="resource-list">
            <article>
              <BookOpen />
              <div>
                <h3>方法要清楚</h3>
                <p>每次练习都要明确探问、角色、轮次、时长和结束方式。结构越清楚，练习者越容易放松进入经验。</p>
              </div>
            </article>
            <article>
              <BookOpen />
              <div>
                <h3>整合要足够</h3>
                <p>深度不只发生在表达时，也发生在练习后的安静、书写、散步和日常关系里。不要用下一轮体验覆盖上一轮经验。</p>
              </div>
            </article>
          </div>
          <p className="note">
            内容为中文学习整理与实践指南，不是原文翻译，也不替代心理治疗、医疗照护或合格带领者训练。深入带领工作坊或参加密集练习时，应接受系统训练和督导。
          </p>
        </section>
      </main>

      <footer>
        <span className="footer-brand">
          <img src={`${baseUrl}logo-dyad.svg`} alt="" />
          二人禅 Dyad Meditation
        </span>
        <span>愿表达真实，愿倾听清明。</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
