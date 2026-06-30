import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  Check,
  Clock3,
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
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top">
          <span>二人禅</span>
          <small>Dyad Meditation</small>
        </a>
        <nav aria-label="主导航">
          <a href="#learn">学习</a>
          <a href="#practice">练习</a>
          <a href="#inquiries">探问</a>
          <a href="#safety">边界</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <img src="/hero-dyad.png" alt="两人面对面进行二人禅练习的插画" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow">学习 · 练习 · 整合</p>
            <h1>二人禅 Dyad Meditation</h1>
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
            <p>Sources</p>
            <h2>本站整理依据</h2>
          </div>
          <div className="resource-list">
            <article>
              <BookOpen />
              <div>
                <h3>The Power of Dyad Meditation</h3>
                <p>整理其关于现代二人禅、线上练习、安全空间、整合时间和探问题库的框架。</p>
              </div>
            </article>
            <article>
              <BookOpen />
              <div>
                <h3>The Enlightenment Intensive</h3>
                <p>整理其关于二人沟通格式、自我探问、表达真实经验和密集闭关结构的历史脉络。</p>
              </div>
            </article>
          </div>
          <p className="note">
            内容为中文学习整理与实践指南，不是原书逐字翻译。深入学习、带领工作坊或参加密集闭关时，应阅读原书并接受合格带领者训练。
          </p>
        </section>
      </main>

      <footer>
        <span>二人禅 Dyad Meditation</span>
        <span>愿表达真实，愿倾听清明。</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
