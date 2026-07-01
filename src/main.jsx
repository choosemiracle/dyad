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
  LockKeyhole,
  Mic2,
  Pause,
  Play,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import "./styles.css";

const quickFacts = [
  ["适合谁", "想练习真诚表达、深度倾听、关系觉察和静心探问的人。"],
  ["需要多久", "第一次建议 20 到 30 分钟；熟悉后可延长到 45 到 60 分钟。"],
  ["需要几人", "两个人即可，也可以在带领者组织下进行小组练习。"],
  ["会得到什么", "更清楚地看见当下经验、表达习惯、关系模式和需要整合的内容。"],
];

const defaultPasswords = {
  professional: "2renchan",
  facilitator: "leadingnow",
  mechanism: "errenchanjili",
  admin: "weijia77",
};

const passwordLabels = {
  professional: "专业训练",
  facilitator: "带领者",
  mechanism: "机理",
  admin: "管理员",
};

function readStoredJson(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function getAccessPasswords() {
  return { ...defaultPasswords, ...readStoredJson("dyadAccessPasswords", {}) };
}

function getAccessPassword(key) {
  return getAccessPasswords()[key] || defaultPasswords[key];
}

function getBlogPosts() {
  return readStoredJson("dyadBlogPosts", []);
}

const audienceRoutes = [
  ["我是第一次来", "从 5 步练习和协议开始", "#first-practice"],
  ["我想直接练", "使用四轮计时器", "#practice"],
  ["我练过几次", "选择合适的探问", "#inquiries"],
  ["我要专业训练", "进入进阶练习质量指南", "#professional"],
  ["我要带小组", "查看带领者检查清单", "#facilitator"],
  ["我想懂机理", "深入理解背后的作用机制", "#mechanism"],
  ["我想看文章", "阅读后续更新的学习文章", "#blog"],
  ["我担心安全", "先看边界和不适合状态", "#safety"],
];

const firstPracticeSteps = [
  ["找搭档", "选择愿意遵守保密、不建议、不评判原则的人。第一次不建议和正处在强冲突中的人练习。"],
  ["选探问", "从温和入门探问开始，例如“告诉我：此刻你注意到了什么？”"],
  ["设时间", "每轮 3 到 5 分钟，A/B 交替四轮。时间短一点，更容易保持清醒和安全。"],
  ["按角色练", "倾听者只给出探问并保持在场，表达者说出当下的真实经验，可以停顿，也可以静默。"],
  ["结束整合", "完成后安静 3 分钟，再各自说一句收尾：我现在带走的是……"],
];

const agreementItems = [
  "我们同意保密，不把对方的内容转述给第三人。",
  "我们同意不提建议、不分析、不诊断、不追问隐私。",
  "任何一方都可以暂停、跳过或结束练习，不需要解释理由。",
  "如果出现明显失控、解离、惊恐或自伤风险，练习立即停止，优先寻求支持。",
];

const sampleDialogue = [
  ["倾听者", "请告诉我：此刻你注意到了什么？"],
  ["表达者", "我注意到胸口有点紧，也有一点不知道该说什么的尴尬。"],
  ["倾听者", "谢谢。请告诉我：此刻你注意到了什么？"],
  ["表达者", "刚才被接住之后，我放松了一点。我发现自己很想说得有价值。"],
];

const inquiryGroups = [
  {
    title: "温和入门",
    description: "第一次练习、线上练习、状态不稳定或刚认识搭档时优先使用。",
    items: [
      "告诉我：此刻你注意到了什么？",
      "告诉我：你如何感受自己的身体？",
      "告诉我：现在有什么感觉正在发生？",
      "告诉我：你此刻需要什么支持？",
    ],
  },
  {
    title: "关系觉察",
    description: "适合熟悉流程之后，用来观察被看见、被倾听和自我保护的方式。",
    items: [
      "告诉我：你如何感受到另一个人？",
      "告诉我：当你被倾听时发生了什么？",
      "告诉我：你如何保护自己不被看见？",
      "告诉我：你想让对方真正听见什么？",
    ],
  },
  {
    title: "自我探问",
    description: "适合已有稳定练习节奏后使用，帮助看见身份、回避和生命力。",
    items: [
      "告诉我：你是谁？",
      "告诉我：此刻在你心里真实发生了什么？",
      "告诉我：什么让你感到有生命力？",
      "告诉我：你正在回避什么？",
    ],
  },
  {
    title: "深度探问",
    description: "适合在带领成熟、整合时间充分、安全边界清楚时使用。",
    items: [
      "告诉我：什么是爱？",
      "告诉我：生命此刻在你身上如何展开？",
      "告诉我：你最深的渴望是什么？",
      "告诉我：你愿意放下什么？",
    ],
  },
];

const rounds = [
  { speaker: "A", listener: "B", prompt: "B 给出探问，A 表达：此刻你注意到了什么？" },
  { speaker: "B", listener: "A", prompt: "A 给出同一个探问，B 表达：此刻你注意到了什么？" },
  { speaker: "A", listener: "B", prompt: "B 再次给出探问，A 继续表达当下真实经验。" },
  { speaker: "B", listener: "A", prompt: "A 再次给出探问，B 完成这一轮循环。" },
];

const historyItems = [
  [
    "源头",
    "二人禅的现代形式来自密集自我探问与二人沟通练习的结合：把禅修式的内在追问，放进面对面表达与倾听的结构里。",
  ],
  [
    "结构化",
    "早期密集闭关强调固定探问、轮换表达与倾听、严格时间结构和持续整合。形式的重点不是讨论观点，而是一次次回到当下的真实经验。",
  ],
  [
    "发展",
    "后来的日常练习把密集闭关中的核心技术拆解为更容易学习和带领的形式：短轮次、清晰边界、温和探问与安全支持。",
  ],
  [
    "当代应用",
    "今天的二人禅常用于关系觉察、团体练习、静心课程和自我探索。它保留“探问、表达、接收”的核心，同时更重视创伤知情、同意和练习后的落地。",
  ],
];

const learningPath = [
  {
    title: "第 1 周：完成第一次练习",
    body: "只使用温和探问和短轮次。目标不是深入，而是学会角色、时间、保密、暂停和收尾。",
  },
  {
    title: "第 2-4 周：建立稳定节奏",
    body: "每周练习 1 到 2 次，记录自己的表达习惯、倾听反应和常见回避方式。",
  },
  {
    title: "稳定后：扩充探问层次",
    body: "从身体和当下感受，逐步进入关系、自我、爱、生命等主题。加深的前提是安全和整合足够。",
  },
  {
    title: "进阶：学习带领与小组",
    body: "如果要带小组，先练习开场说明、计时、分组、暂停机制、复盘和风险识别。",
  },
];

const practiceFormats = [
  ["日常双人练习", "每周 1 到 2 次，每次 30 到 60 分钟。适合建立熟悉度、信任和稳定的表达能力。"],
  ["小组练习", "由带领者说明规则、分组、计时和收尾。适合学习不同搭档带来的镜照，但需要更清楚的保密约定。"],
  ["线上练习", "提前测试设备，保持摄像头稳定，约定断线后的处理方式。线上更需要慢速、简短和明确的结束流程。"],
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
    body: "带领者需要长期亲身练习，熟悉表达者的迟疑、静默、情绪涌动和身体反应。没有足够自我经验时，容易把带领变成讲解、分析或控制。",
  },
  {
    title: "学习两套能力",
    body: "一套是方法能力：探问设计、轮次安排、时间管理、整合流程。另一套是空间护持能力：同意、保密、边界、风险识别、团体氛围和暂停机制。",
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

const facilitatorChecklist = [
  "开场说明：目的、流程、时长、角色、保密和退出权。",
  "示范一次：用 1 分钟演示倾听者如何给出探问、如何不回应内容。",
  "确认分组：避免明显权力不对等、强冲突或不愿参与的搭档组合。",
  "稳定计时：每轮清楚开始和结束，避免拖延或临场随意改规则。",
  "观察风险：注意过度激活、麻木、失联、惊恐、自责和自伤表达。",
  "安排收尾：留出安静、书写、喝水、散步或简短分享的整合时间。",
];

const suitabilityItems = [
  ["适合", "自我探索、关系练习、静心小组、表达训练、倾听训练、温和的团体觉察。"],
  ["谨慎", "正在经历强烈关系冲突、近期重大丧失、创伤记忆被频繁激活、身心状态不稳定。"],
  ["不适合", "急性危机、明显自伤风险、被迫参与、需要医疗或心理治疗介入的状态。"],
];

const professionalSections = [
  {
    title: "倾听者的具体训练",
    lead: "倾听者不是静默的旁观者，而是在护持一个清楚、稳定、非侵入的练习空间。二人禅的质量很大程度取决于倾听者能否不接管内容。",
    blocks: [
      {
        heading: "如何给出探问",
        items: [
          "语速放慢，句子完整，不用戏剧化语气推动对方进入情绪。",
          "每次只给出一个探问，不临场解释探问，也不补充自己的理解。",
          "给完探问后停下来，让表达者有时间让问题进入身体与经验。",
          "眼神自然、身体稳定，避免用点头、表情或声音暗示“我喜欢这个答案”。",
        ],
      },
      {
        heading: "什么时候重复探问",
        items: [
          "表达者明显离开探问、进入长篇故事或自我分析时，可以温和重复。",
          "表达者静默很久但仍在场时，不急着重复；先让静默工作。",
          "表达者说“我不知道”后，可以等待，也可以用同一个探问重新邀请。",
          "不要把重复探问变成催促；它是把注意力带回练习结构。",
        ],
      },
      {
        heading: "如何接住强烈经验",
        items: [
          "遇到眼泪，先保持呼吸和在场，不急着递解释或安慰。",
          "遇到混乱，帮助对方回到当下：可以提醒慢一点、感受脚底、看看房间。",
          "遇到愤怒，不反击、不辩解，也不鼓励宣泄；必要时暂停练习。",
          "若出现解离、自伤表达、失控惊恐或无法回到当下，立即停止并寻求现实支持。",
        ],
      },
      {
        heading: "处理自己的冲动",
        items: [
          "想建议时，觉察“我想让对方快点好起来”。",
          "想安慰时，觉察“我承受不了对方的痛苦”。",
          "想解释时，觉察“我正在把对方的经验放进我的地图”。",
          "把这些冲动留在自己这里，不把它们变成对方的任务。",
        ],
      },
    ],
  },
  {
    title: "表达者的具体训练",
    lead: "表达者的训练不是说得精彩，而是不断从故事、解释、表演回到当下正在发生的经验。",
    blocks: [
      {
        heading: "说当下，而不是讲完整故事",
        items: [
          "可以提到背景，但不要把整轮都用来解释来龙去脉。",
          "把注意力放在：这件事此刻如何在身体、情绪、念头中发生。",
          "当发现自己在讲故事时，直接说：“我注意到我在讲故事。”",
          "允许表达破碎、停顿、重复，只要它贴近此刻真实。",
        ],
      },
      {
        heading: "允许不知道和空白",
        items: [
          "“我不知道”可以是有效表达，不需要马上补一个答案。",
          "“我注意到空白”“我好像在编答案”都比编出一个漂亮答案更真实。",
          "空白时可以回到身体：呼吸、喉咙、胸口、腹部、手心、脚底。",
          "如果完全无法继续，可以提出暂停，而不是硬撑。",
        ],
      },
      {
        heading: "觉察经验层次",
        items: [
          "身体：紧、热、冷、麻、沉、轻、颤动、呼吸变化。",
          "情绪：害怕、羞耻、悲伤、愤怒、喜悦、柔软、麻木。",
          "图像与记忆：画面、片段、声音、某个场景被唤起。",
          "念头与冲动：想解释、想逃、想被认可、想控制、想靠近。",
        ],
      },
      {
        heading: "发现防卫时直接说出来",
        items: [
          "表演：我好像想说一个有深度的答案。",
          "讨好：我想说一个让你满意的东西。",
          "合理化：我注意到我在解释自己为什么这样。",
          "回避：我讲了很多，但没有碰到真正让我有感觉的地方。",
        ],
      },
    ],
  },
  {
    title: "倾听者过程建议",
    lead: "在 Dyad 冥想中，倾听者也可称为见证者。倾听者所护持的特殊空间，使表达者不必回到日常社交防御，而能更直接地接触真实经验。",
    blocks: [
      {
        heading: "给出精确指令，但不呼唤姓名",
        items: [
          "每个周期开始时，倾听者只需准确给出指导语，例如“告诉我：你是谁？”或“告诉我：爱在你内在如何存活？”",
          "同一轮练习中不要改变措辞，也不要解释题目；指令只说一次，让表达者自己向内接收。",
          "给出指令时不要呼唤对方姓名。姓名容易把表达者拉回日常身份、关系角色和社交防御。",
          "指令要清楚、稳定、简短；它不是鼓励语，也不是心理访谈的问题。",
        ],
      },
      {
        heading: "睁眼与柔和注视",
        items: [
          "即使表达者闭眼向内探寻，倾听者也保持睁眼，柔和地看着对方。",
          "这种视觉连接不是凝视或施压，而是一个无声的锚点：这里有人全心在场。",
          "如果表达者偶尔睁眼，他可以确认自己仍被稳定接住，而不是被评估或遗弃。",
          "目光柔和、身体安定，比做出反应更能支持表达者深入。",
        ],
      },
      {
        heading: "零肢体反馈与零面部暗示",
        items: [
          "倾听者不点头、不微笑鼓励、不皱眉、不叹气，也不通过表情传递赞同或反对。",
          "哪怕是安抚性的微笑，也可能让表达者开始迎合倾听者，而不是继续向内探寻。",
          "不要刻意绷成没有生命的表情；如果表达者因真实体验而自然大笑，倾听者可以被动地随之微笑或轻笑，但不要主动带头。",
          "重点不是“没有情感”，而是不给表达者任何需要回应你的信号。",
        ],
      },
      {
        heading: "杜绝干预、建议与同情式拯救",
        items: [
          "当表达者痛苦、哭泣或崩溃时，不给建议，不做心理分析，也不急着安慰。",
          "倾听者要传递一种更深的信任：对方有能力接触自己的经验，并从内在智慧中恢复。",
          "如果出现安全风险，应停止练习并寻求现实支持；这不是干预体验，而是保护安全。",
          "不要用“我懂你”“你会好起来”的话语接管对方的过程。",
        ],
      },
      {
        heading: "身体静止与隔绝外在动作",
        items: [
          "在 5 分钟内尽量保持身体静止，避免伸展、转头、走动或做手势。",
          "不喝水、不吃东西、不看手机、不回复信息、不抽烟，也不做其他细小活动。",
          "任何外在动作都会分散表达者的注意力，让他重新感到自己正在被社交观察。",
          "倾听者用稳定身体帮助练习空间稳定下来。",
        ],
      },
      {
        heading: "内在觉察与沟通闭合",
        items: [
          "倾听者自己的评判、不耐烦、走神、想安慰或想解释，都会出现；任务是觉察它们，并把注意力带回表达者。",
          "角色互换后，不回应、不评价伴侣刚才说过的内容；只对自己的内部体验负责。",
          "计时结束时，倾听者只说一句简单的“谢谢”或“我听到了”。",
          "这句话不是评价，而是给表达者一个明确讯号：信息已被接收，这一轮沟通可以闭合。",
        ],
      },
    ],
  },
  {
    title: "表达者过程建议",
    lead: "如果倾听者护持了稳定空间，表达者的任务就是把向内探寻得到的直接结果，尽可能原样交给这个空间。",
    blocks: [
      {
        heading: "接收指令后，先向内探寻",
        items: [
          "听到指令后，不要立刻用头脑组织语言，也不要马上开始解释。",
          "先接收这个指令，让它进入身体、感受、图像、记忆和当下经验。",
          "一个实用比例是：大约一半时间用于静默探寻，一半时间用于开口表达。",
          "表达之前允许自己停顿；真正的表达往往来自接触，而不是反应速度。",
        ],
      },
      {
        heading: "从体验中诉说，而不是谈论体验",
        items: [
          "谈论体验通常是分析、讲故事、解释原因或构造剧本。",
          "从体验中诉说，是从身体、情绪和当下鲜活状态里发声。",
          "不要只描述让你生气的人或事，而是描述“愤怒此刻在我身体里是什么感觉”。",
          "当你直接表达体验，而不是被故事带走时，内在智慧更容易浮现。",
        ],
      },
      {
        heading: "只沟通探寻的直接结果",
        items: [
          "表达者像诚实的汇报者，把因探问而浮现的念头、情绪、身体反应原样说出。",
          "不增加戏剧化解释，也不遗漏正在发生的关键经验。",
          "如果出现与探问无关的杂念，先判断它是否由探寻直接引发；若不是，可以放下。",
          "被大声沟通出来的，应尽量是向内探寻的直接结果。",
        ],
      },
      {
        heading: "只谈论自己，不回应伴侣",
        items: [
          "角色互换后，不评论伴侣上一轮说过的话，也不借自己的表达去安慰、反驳或回应伴侣。",
          "表达完全针对自己和自己的个人体验。",
          "不批评、不指责、不辱骂伴侣，也不试图改变伴侣。",
          "即使内容涉及关系，也要回到“这在我里面如何发生”。",
        ],
      },
      {
        heading: "闭眼或睁眼均可",
        items: [
          "表达者可以闭眼，以减少外部刺激并更容易向内探索。",
          "也可以睁眼看着伴侣，让表达发生在关系连接中。",
          "无论选择哪种方式，目的都是更完整地接触自己的内在经验。",
          "不要把眼神接触当成要求，也不要把闭眼当成逃避；看它是否服务于当下真实。",
        ],
      },
    ],
  },
  {
    title: "直接经验 vs 头脑解释",
    lead: "二人禅不是禁止思考，而是训练练习者辨认：我是在经验当下，还是在用解释离开当下。",
    blocks: [
      {
        heading: "直接经验",
        items: [
          "胸口紧，喉咙堵，眼睛湿，手在发热。",
          "我想躲开，我此刻害怕，我感到羞耻。",
          "我听到探问后，身体先往后缩了一下。",
          "我说到这里时，忽然有一股悲伤上来。",
        ],
      },
      {
        heading: "头脑解释",
        items: [
          "我从小就这样，所以我现在没办法。",
          "这是因为某个人曾经对我做了什么。",
          "我应该更开放，我不应该这么防卫。",
          "我这个人就是不行，或者我已经完全懂了。",
        ],
      },
      {
        heading: "回到当下的转向句",
        items: [
          "“这个解释此刻在我身体里是什么感觉？”",
          "“当我这样说时，我真正正在经验什么？”",
          "“我注意到我在分析；现在胸口是紧的。”",
          "“我先不解释原因，只说现在发生了什么。”",
        ],
      },
    ],
  },
  {
    title: "常见偏差与修正",
    lead: "跑偏并不可怕。关键是尽早看见，并把练习带回结构、直接经验和可整合的深度。",
    blocks: [
      {
        heading: "偏差与修正",
        items: [
          "变成聊天：停止来回回应，回到同一个探问和固定轮次。",
          "变成心理咨询：倾听者停止分析和建议，只维护结构。",
          "变成自我分析：表达者回到身体和此刻感受。",
          "倾听者开始指导：带领者提醒“只给探问，不处理内容”。",
          "表达者开始演讲：用一句话回到“此刻我正在经验……”。",
          "两个人追求强烈体验：缩短轮次，换温和探问，增加整合。",
          "处理未准备好的关系冲突：暂停练习，不把二人禅当作逼问工具。",
        ],
      },
    ],
  },
  {
    title: "静默的使用",
    lead: "静默是二人禅里非常重要的空间。新手常把静默理解成失败，成熟练习者会学习让静默成为探问的一部分。",
    blocks: [
      {
        heading: "表达者如何使用静默",
        items: [
          "静默中继续感受探问，而不是急着制造答案。",
          "如果空白，可以说：“我注意到空白。”",
          "如果害怕静默，可以说：“我害怕我说不出来。”",
          "让身体先回答，再让语言慢慢跟上。",
        ],
      },
      {
        heading: "倾听者如何陪伴静默",
        items: [
          "不急着救场，不用表情催促，不把静默解释成抗拒。",
          "保持呼吸、坐姿和开放注意力。",
          "过长静默且表达者明显迷失时，可以温和重复探问。",
          "如果静默伴随失联、呆滞或惊恐，要优先稳定而不是继续探问。",
        ],
      },
    ],
  },
  {
    title: "结束与整合的层次",
    lead: "练习真正进入生活，靠的是整合。没有整合的深度体验，容易变成消耗、依赖或戏剧化记忆。",
    blocks: [
      {
        heading: "四层整合",
        items: [
          "立即整合：呼吸、喝水、看房间、感受脚底、确认当下安全。",
          "当天整合：书写、散步、减少社交刺激，避免马上做重大决定。",
          "关系整合：不要立刻解释对方，不把练习内容拿去争论或谈判。",
          "长期整合：观察同一个模式如何在日常关系里重复出现。",
        ],
      },
      {
        heading: "整合记录问题",
        items: [
          "这次最直接的经验是什么？",
          "我在哪一刻离开了直接经验？",
          "我需要什么现实支持，而不是更多练习？",
          "这个发现如何温和地带回日常生活？",
        ],
      },
    ],
  },
  {
    title: "探问设计原则",
    lead: "探问不是技巧堆叠。好探问通常简短、开放、指向直接经验，并能被反复使用。",
    blocks: [
      {
        heading: "好探问的特征",
        items: [
          "开放：不预设答案，不把练习者推向某种结论。",
          "简短：一句话即可，让注意力集中。",
          "指向经验：帮助练习者回到身体、当下、关系或存在感。",
          "可重复：同一探问多轮使用时仍能打开新的经验层次。",
        ],
      },
      {
        heading: "避免的探问",
        items: [
          "诱导性探问：你为什么不放下？",
          "建议伪装成探问：你是不是应该更勇敢？",
          "评判性探问：你为什么总是这么防卫？",
          "过深过快的探问：在没有稳定容器时直接进入创伤或死亡主题。",
        ],
      },
    ],
  },
  {
    title: "练习深度的判断",
    lead: "深度不等于强烈。成熟练习更看重稳定、真诚、具体和可整合，而不是哭、崩溃或戏剧化强度。",
    blocks: [
      {
        heading: "健康加深的迹象",
        items: [
          "表达越来越具体，较少停留在抽象评价。",
          "练习后更能回到生活，而不是更混乱。",
          "关系中出现更多觉察和选择，而不是更多指责。",
          "强烈经验之后，有足够空间休息、书写和整合。",
        ],
      },
      {
        heading: "需要减速的迹象",
        items: [
          "越练越失控，或越来越依赖强烈体验。",
          "练习后长时间无法回到日常功能。",
          "反复使用练习逼迫自己或别人突破。",
          "把二人禅当作替代治疗或危机干预。",
        ],
      },
    ],
  },
  {
    title: "搭档关系与伦理",
    lead: "二人禅会制造亲密和开放，因此更需要清楚伦理。练习越深，边界越重要。",
    blocks: [
      {
        heading: "搭档边界",
        items: [
          "不利用练习制造亲密压力。",
          "不用探问逼问对方，不要求对方暴露隐私。",
          "不把对方表达的内容作为关系谈判证据。",
          "练习后的联系、分享、邀约都需要尊重同意。",
        ],
      },
      {
        heading: "带领者边界",
        items: [
          "带领者不把参与者的开放理解为特殊依附或许可。",
          "避免权力混淆、情感操控和私人化依赖。",
          "涉及创伤、医疗、心理危机时，清楚转介而不是硬带。",
          "带领者也需要督导、同侪反馈和持续自我练习。",
        ],
      },
    ],
  },
  {
    title: "共同注意事项",
    lead: "过程建议不是为了制造紧张，而是为了让练习空间更清楚。规则越清楚，表达者越容易放下社交表演，倾听者也越不容易接管对方。",
    blocks: [
      {
        heading: "练习前确认",
        items: [
          "确认探问、每轮时长、轮次数量、结束方式和可暂停机制。",
          "确认保密原则：未经同意，不在练习外转述对方内容。",
          "确认双方都自愿参与；任何一方都可以跳过、暂停或退出。",
          "如果双方正处在强冲突中，不建议用二人禅直接处理冲突主题。",
        ],
      },
      {
        heading: "练习中保持纪律",
        items: [
          "倾听者不引导内容，表达者不回应伴侣内容。",
          "双方都不把练习变成说服、解释、辩论或关系谈判。",
          "强烈体验出现时先减速，不把强烈当成深度的证明。",
          "如果出现失联、解离、惊恐、自伤表达或无法回到当下，立即停止练习。",
        ],
      },
      {
        heading: "练习后落地",
        items: [
          "先喝水、感受脚底、看房间，让身体知道练习已经结束。",
          "不要马上分析对方，也不要立刻把练习内容拿去讨论关系问题。",
          "可以各自写下：我直接经验到了什么？我需要怎样照顾自己？",
          "如果体验很强，减少当天刺激，必要时寻求成熟带领者或专业支持。",
        ],
      },
    ],
  },
  {
    title: "进阶练习结构",
    lead: "以下结构只适合已有基础经验、边界清楚、整合能力稳定的练习者。这些结构不是新手入口。",
    blocks: [
      {
        heading: "可尝试的结构",
        items: [
          "单一探问连续多轮：用同一探问反复深入，观察每一轮的新鲜经验。",
          "身体导向探问：把注意力稳定带回感觉、姿势、呼吸和冲动。",
          "关系主题探问：在信任基础上探索被看见、接收、边界和亲密。",
          "小组轮换练习：在清楚保密协议下与不同搭档练习倾听和表达。",
          "密集练习前准备：确认身心状态、支持系统、休息安排和整合计划。",
        ],
      },
    ],
  },
];

const mechanismSections = [
  {
    title: "源流：把参问放进关系沟通",
    lead: "二人禅的现代形式诞生于 1968 年前后，它把东方自我探问传统与西方结构化双人沟通结合起来：一个人向内探寻并表达，另一个人完整接收。",
    blocks: [
      {
        heading: "两个源头",
        items: [
          "东方传统提供了核心探问：例如“我是谁”“什么是爱”“什么是另一个人”。这些探问不是讨论题，而是把注意力指向直接经验。",
          "双人沟通结构提供了关系容器：固定角色、固定时间、轮换表达、完整接收。",
          "二人禅因此不是普通聊天，也不是独自静坐，而是“被关系支持的内在探寻”。",
        ],
      },
      {
        heading: "为什么两个人练",
        items: [
          "独自静坐时，很多内容只在头脑里循环；面对一个稳定倾听者时，内在经验会被带到关系场中完成表达。",
          "倾听者不提供答案，却提供接收；表达者不需要证明自己，只需要如实沟通探寻所得。",
          "这种结构让修行从“我一个人处理自己”转向“在清楚边界中被见证”。",
        ],
      },
    ],
  },
  {
    title: "沟通循环：心智积压如何松动",
    lead: "二人禅的一个核心理解是：许多反复出现的念头，并不只是孤立杂念，而像是未完成、未被接收、未能落地的沟通冲动。",
    blocks: [
      {
        heading: "从探寻到表达",
        items: [
          "表达者先接收探问，向内接触当下浮现的身体感受、情绪、图像、记忆、念头或空白。",
          "随后把探寻的直接结果说出来，而不是加工成故事、理论或漂亮答案。",
          "当内容被真实说出，头脑里原本反复盘旋的材料会获得一个出口。",
        ],
      },
      {
        heading: "从接收到闭合",
        items: [
          "倾听者不评价、不回应内容，只稳定接收，并在轮次结束时用一句“谢谢”或“我听到了”闭合这一轮。",
          "这个闭合不是社交礼貌，而是在心理上确认：这份信息已经被接收，不必继续在内部反复发送。",
          "一次练习会不断重复“探寻、表达、接收、闭合”，于是心智积压逐层松动。",
        ],
      },
    ],
  },
  {
    title: "空间机理：不反应如何降低防御",
    lead: "日常交流里，人们很快会被表情、建议、安慰、反驳或沉默压力牵动。二人禅要求倾听者尽量减少反应，是为了让表达者不必迎合外界。",
    blocks: [
      {
        heading: "非评判不是冷漠",
        items: [
          "倾听者保持睁眼、柔和注视和身体稳定，让表达者知道这里有人在场。",
          "同时，倾听者不点头、不微笑鼓励、不皱眉、不分析，避免把表达者拉回“我要表现得对”的社交模式。",
          "这种不反应不是无情，而是把解释权还给表达者，让经验自己展开。",
        ],
      },
      {
        heading: "安全感来自边界",
        items: [
          "真正的安全不只来自温柔语气，也来自规则清楚：保密、可暂停、可退出、不追问隐私。",
          "当边界稳定时，表达者更容易接触羞耻、害怕、愤怒、悲伤或空白，而不急着防御。",
          "倾听者越能守住结构，越不需要用安慰和建议来证明自己有用。",
        ],
      },
    ],
  },
  {
    title: "表达机理：从体验中说",
    lead: "二人禅训练的不是口才，而是从直接经验中发声。关键差别是：我是在谈论经验，还是正在把经验本身带出来？",
    blocks: [
      {
        heading: "谈论体验",
        items: [
          "谈论体验通常表现为解释原因、讲完整故事、分析别人、总结自己、寻找正确答案。",
          "这些内容不一定错误，但很容易让人离开当下，回到熟悉的身份叙事。",
          "当表达者一直解释“为什么”，练习就会接近聊天、咨询或自我分析。",
        ],
      },
      {
        heading: "从体验中说",
        items: [
          "从体验中说，是报告此刻正在发生的身体感受、情绪、图像、冲动和真实语言。",
          "例如不只说“我很愤怒”，而是说“我说到这里时胸口发热，牙关紧，我想推开你”。",
          "越贴近当下，表达越不需要精彩；它会更直接、更具体，也更容易被整合。",
        ],
      },
    ],
  },
  {
    title: "注意力机理：固定探问与固定轮次",
    lead: "同一个探问被反复给出，不是机械重复，而是帮助意识穿过第一层答案，进入更深、更少加工的经验。",
    blocks: [
      {
        heading: "探问像一根线",
        items: [
          "固定探问让注意力持续朝同一个方向深入，而不是被话题带走。",
          "第一轮常出现概念答案；继续探寻后，身体、情绪、记忆和更深层的直觉才可能浮现。",
          "探问越简短，越能减少理解负担，让表达者直接与经验接触。",
        ],
      },
      {
        heading: "时间结构保护深度",
        items: [
          "固定时长让双方知道何时开始、何时结束，减少关系中的权力不平衡。",
          "轮换角色让每个人都体验表达与倾听，不让一方长期成为倾倒者或拯救者。",
          "结束后的静默和整合，则让被打开的经验回到身体和生活。",
        ],
      },
    ],
  },
  {
    title: "关系与神经系统：共同调节，而不是互相治疗",
    lead: "二人禅会影响神经系统，但它不是医学治疗。更稳妥的理解是：清楚结构、稳定目光和非评判接收，会支持两个人从应激回到更可觉察的状态。",
    blocks: [
      {
        heading: "共调节",
        items: [
          "一个稳定、安静、不过度反应的倾听者，会给表达者的神经系统提供安全线索。",
          "当表达者不再需要防御、解释或迎合，呼吸、肌肉紧张和注意力可能逐渐放松。",
          "这种共同调节不是倾听者替对方疗愈，而是双方在规则中共同保持清醒和在场。",
        ],
      },
      {
        heading: "关于脑波与共振",
        items: [
          "冥想、稳定呼吸和安全关系可能伴随更放松的身心状态，但不宜把每次练习都说成必然进入某种脑波。",
          "目光、姿态和情绪会在关系中互相影响；可以把它理解为身体层面的同步与社会连结。",
          "对练习者最有用的判断不是有没有神秘体验，而是练习后是否更清楚、更稳定、更能回到生活。",
        ],
      },
    ],
  },
  {
    title: "转化机理：从身份叙事到直接经验",
    lead: "二人禅的深层目标不是制造强烈情绪，而是让人穿过角色、解释和防御，直接接触“此刻真实是什么”。",
    blocks: [
      {
        heading: "参问如何工作",
        items: [
          "“告诉我你是谁”这类探问会触碰身份核心：名字、角色、经历、成就、创伤和自我判断都会先浮现。",
          "表达者一次次把这些浮现内容沟通出来，心智的表层答案会逐渐耗尽。",
          "当解释暂时松开，练习者可能接触到更直接的存在感、觉知、爱或生命力。",
        ],
      },
      {
        heading: "直接经验不是结论",
        items: [
          "直接经验不是一句哲学答案，也不是“我懂了”的概念感。",
          "它更像某一刻不再隔着故事看自己，而是直接知道、直接感受、直接在场。",
          "这种经验需要整合进日常关系，否则容易变成高峰体验记忆或新的身份标签。",
        ],
      },
    ],
  },
  {
    title: "常见误解与边界",
    lead: "理解机理是为了更精准地练习，不是为了神化方法。二人禅越有力量，越需要边界、节奏和现实感。",
    blocks: [
      {
        heading: "不要神化强度",
        items: [
          "哭泣、崩溃、发抖、空白都可能出现，但它们不是深度的唯一指标。",
          "健康的深度通常伴随更稳定的觉察、更真诚的表达和更好的整合能力。",
          "如果练习后长期失控、麻木或无法生活，说明需要减速，并寻求专业支持。",
        ],
      },
      {
        heading: "不要替代治疗",
        items: [
          "二人禅可以支持觉察、表达和关系练习，但不替代心理治疗、医疗照护或危机干预。",
          "带领者不诊断、不处理创伤细节、不承诺疗效。",
          "成熟练习者知道什么时候继续探问，也知道什么时候停止、休息和转介。",
        ],
      },
    ],
  },
];

const qaItems = [
  [
    "二人禅和普通聊天有什么不同？",
    "聊天通常会回应、建议、比较和延伸话题；二人禅使用固定探问、固定角色和固定时间。倾听者主要提供在场，不把对方的内容拿来讨论。",
  ],
  [
    "练习中静默可以吗？",
    "可以。静默常常是探问进入身体和经验的过程。表达者可以停顿，也可以说“我现在不知道”“我感到空白”。这些都属于真实发生的内容。",
  ],
  [
    "是否必须看着对方眼睛？",
    "不必须。可以自然眼神接触，也可以看向地面或闭眼。关键是保持清醒和连接，而不是制造压力。",
  ],
  [
    "可以和伴侣练吗？会不会吵架？",
    "可以，但第一次不要选择正在冲突中的议题。先用温和探问，并约定不反驳、不解释对方内容、不把练习变成关系谈判。",
  ],
  [
    "听到对方说很重的内容怎么办？",
    "先保持稳定，不分析、不急着安慰。可以在轮次结束后提醒暂停、喝水、回到身体。如果涉及安全风险，立即停止练习并寻求现实支持。",
  ],
  [
    "线上练习可以吗？",
    "可以。提前测试设备，约定断线后的处理方式，摄像头保持稳定。线上练习更适合短轮次和清晰收尾。",
  ],
  [
    "练完很累正常吗？",
    "正常。真实表达和深度倾听会消耗注意力。练完后不要马上进入高强度工作，给自己留一点安静、书写或散步时间。",
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
  const [minutes, setMinutes] = useState(3);
  const [roundIndex, setRoundIndex] = useState(0);
  const [remaining, setRemaining] = useState(3 * 60);
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
        <p>练习工具</p>
        <h2>新手模式：四轮二人禅计时器</h2>
        <p className="section-support">默认探问：告诉我，此刻你注意到了什么？每轮 3 分钟，完成后先安静整合。</p>
      </div>
      <div className="practice-grid">
        <div className="timer-panel">
          <div className="timer-mode">新手默认 · 温和探问 · 可随时暂停</div>
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
          <p className="next-cue">下一步：时间到后交换角色；四轮结束后，至少安静 3 分钟。</p>
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

function ProfessionalTrainingPage({ baseUrl }) {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(() => window.sessionStorage.getItem("professionalTrainingUnlocked") === "true");
  const [error, setError] = useState("");

  function submitPassword(event) {
    event.preventDefault();
    if (password === getAccessPassword("professional")) {
      setUnlocked(true);
      window.sessionStorage.setItem("professionalTrainingUnlocked", "true");
      setError("");
      return;
    }
    setError("密码不正确，请重新输入。");
  }

  return (
    <main className="professional-page" id="professional">
      <header className="professional-header">
        <a className="brand" href="#top">
          <img src={`${baseUrl}logo-dyad.png`} alt="" />
          <span>
            二人禅
            <small>Dyad Meditation</small>
          </span>
        </a>
        <a href="#top">返回首页</a>
      </header>

      <section className="professional-hero">
        <p className="eyebrow">专业训练</p>
        <h1>让练习更稳、更深、更直接</h1>
        <p>本篇内容面向已有经验者、带领者和召集者，重点训练练习质量、伦理边界与整合能力。</p>
      </section>

      {!unlocked ? (
        <form className="password-panel" onSubmit={submitPassword}>
          <LockKeyhole size={28} />
          <div>
            <h3>输入密码访问专业训练</h3>
            <p>该模块包含进阶练习判断与带领注意事项，建议在熟悉基础流程后阅读。</p>
            <label>
              访问密码
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="password-error">{error}</p> : null}
            <button type="submit">进入专业训练</button>
          </div>
        </form>
      ) : (
        <section className="professional-content">
          {professionalSections.map((section) => (
            <article key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.lead}</p>
              <div className="professional-blocks">
                {section.blocks.map((block) => (
                  <div key={block.heading}>
                    <h4>{block.heading}</h4>
                    <ul>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function FacilitatorPage({ baseUrl }) {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(() => window.sessionStorage.getItem("facilitatorUnlocked") === "true");
  const [error, setError] = useState("");

  function submitPassword(event) {
    event.preventDefault();
    if (password === getAccessPassword("facilitator")) {
      setUnlocked(true);
      window.sessionStorage.setItem("facilitatorUnlocked", "true");
      setError("");
      return;
    }
    setError("密码不正确，请重新输入。");
  }

  return (
    <main className="professional-page facilitator-page" id="facilitator">
      <header className="professional-header">
        <a className="brand" href="#top">
          <img src={`${baseUrl}logo-dyad.png`} alt="" />
          <span>
            二人禅
            <small>Dyad Meditation</small>
          </span>
        </a>
        <a href="#top">返回首页</a>
      </header>

      <section className="professional-hero">
        <p className="eyebrow">带领者</p>
        <h1>学习方法，也学习如何护持空间</h1>
        <p>带领二人禅不是把别人推向深度，而是让每个人在安全、开放、可退出的结构里探索。</p>
      </section>

      {!unlocked ? (
        <form className="password-panel" onSubmit={submitPassword}>
          <LockKeyhole size={28} />
          <div>
            <h3>输入密码访问带领者模块</h3>
            <p>该模块面向准备带领练习、小组或工作坊的人，包含学习路径、空间护持原则和带领检查清单。</p>
            <label>
              访问密码
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="password-error">{error}</p> : null}
            <button type="submit">进入带领者模块</button>
          </div>
        </form>
      ) : (
        <section className="facilitator-content">
          <div className="facilitator-copy">
            <p className="eyebrow">带领原则</p>
            <h2>带领者的成熟度，体现在边界、节奏和整合</h2>
            <p>
              带领者不负责制造强烈体验，也不负责解释练习者的内容。带领者负责让练习目的、流程和边界都保持清楚，并在必要时降速、暂停或转介。
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
            <h3>带领者检查清单</h3>
            <ul>
              {facilitatorChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}

function MechanismPage({ baseUrl }) {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(() => window.sessionStorage.getItem("mechanismUnlocked") === "true");
  const [error, setError] = useState("");

  function submitPassword(event) {
    event.preventDefault();
    if (password === getAccessPassword("mechanism")) {
      setUnlocked(true);
      window.sessionStorage.setItem("mechanismUnlocked", "true");
      setError("");
      return;
    }
    setError("密码不正确，请重新输入。");
  }

  return (
    <main className="professional-page mechanism-page" id="mechanism">
      <header className="professional-header">
        <a className="brand" href="#top">
          <img src={`${baseUrl}logo-dyad.png`} alt="" />
          <span>
            二人禅
            <small>Dyad Meditation</small>
          </span>
        </a>
        <a href="#top">返回首页</a>
      </header>

      <section className="professional-hero">
        <p className="eyebrow">机理</p>
        <h1>理解二人禅为什么有效</h1>
        <p>本篇内容从历史源流、沟通循环、场域、表达、神经系统与直接经验等角度，帮助练习者深入领会二人禅的运作方式。</p>
      </section>

      {!unlocked ? (
        <form className="password-panel" onSubmit={submitPassword}>
          <LockKeyhole size={28} />
          <div>
            <h3>输入密码访问机理模块</h3>
            <p>该模块适合已经熟悉基本流程、希望理解二人禅背后心理力学与修行逻辑的人阅读。</p>
            <label>
              访问密码
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="password-error">{error}</p> : null}
            <button type="submit">进入机理模块</button>
          </div>
        </form>
      ) : (
        <section className="professional-content mechanism-content">
          {mechanismSections.map((section) => (
            <article key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.lead}</p>
              <div className="professional-blocks">
                {section.blocks.map((block) => (
                  <div key={block.heading}>
                    <h4>{block.heading}</h4>
                    <ul>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function renderInlineMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function MarkdownContent({ text }) {
  const lines = text.split("\n");
  const nodes = [];
  let listItems = [];

  function flushList() {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={`list-${nodes.length}`}>
        {listItems.map((item) => (
          <li key={item}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      return;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(line.slice(2).trim());
      return;
    }
    flushList();
    if (line.startsWith("### ")) {
      nodes.push(<h4 key={line}>{renderInlineMarkdown(line.slice(4))}</h4>);
      return;
    }
    if (line.startsWith("## ")) {
      nodes.push(<h3 key={line}>{renderInlineMarkdown(line.slice(3))}</h3>);
      return;
    }
    if (line.startsWith("# ")) {
      nodes.push(<h2 key={line}>{renderInlineMarkdown(line.slice(2))}</h2>);
      return;
    }
    nodes.push(<p key={line}>{renderInlineMarkdown(line)}</p>);
  });
  flushList();

  return <div className="markdown-content">{nodes}</div>;
}

function BlogPage({ baseUrl, selectedPostId }) {
  const [posts, setPosts] = useState(() => getBlogPosts());
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unlockTick, setUnlockTick] = useState(0);

  useEffect(() => {
    const syncPosts = () => setPosts(getBlogPosts());
    window.addEventListener("storage", syncPosts);
    window.addEventListener("dyadBlogPostsUpdated", syncPosts);
    return () => {
      window.removeEventListener("storage", syncPosts);
      window.removeEventListener("dyadBlogPostsUpdated", syncPosts);
    };
  }, []);

  const selectedPost = selectedPostId ? posts.find((post) => post.id === selectedPostId) : null;
  const postPassword = selectedPost?.accessPassword || "";
  const unlocked = selectedPost ? window.sessionStorage.getItem(`blogPostUnlocked:${selectedPost.id}`) === "true" : false;
  const needsPassword = Boolean(postPassword) && !unlocked;

  function submitPassword(event) {
    event.preventDefault();
    if (selectedPost && password === postPassword) {
      window.sessionStorage.setItem(`blogPostUnlocked:${selectedPost.id}`, "true");
      setError("");
      setPassword("");
      setUnlockTick((value) => value + 1);
      return;
    }
    setError("密码不正确，请重新输入。");
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top">
          <img src={`${baseUrl}logo-dyad.png`} alt="" />
          <span>
            二人禅
            <small>Dyad Meditation</small>
          </span>
        </a>
        <nav aria-label="文章导航">
          <a href="#top">首页</a>
          <a href="#blog">文章列表</a>
          <a href="#admin">管理员</a>
        </nav>
      </header>

      <main className="blog-page">
        <section className="blog-hero">
          <p className="eyebrow">文章</p>
          <h1>{selectedPost ? selectedPost.title : "后续学习文章"}</h1>
          <p>{selectedPost ? selectedPost.summary : "这里收纳二人禅学习札记、活动记录、练习指南和深入理解材料。"}</p>
        </section>

        {!selectedPost ? (
          posts.length === 0 ? (
            <div className="empty-panel">
              <BookOpen />
              <h3>还没有发布文章</h3>
              <p>管理员可以在后台添加文章，用于持续丰富二人禅的学习内容。</p>
            </div>
          ) : (
            <section className="blog-list" aria-label="文章列表">
              {posts.map((post) => (
                <article key={post.id}>
                  <span>{post.date}</span>
                  <h3>
                    <a href={`#blog-${post.id}`}>{post.title}</a>
                  </h3>
                  <p>{post.summary}</p>
                  {post.accessPassword ? <small>需要访问密码</small> : null}
                </article>
              ))}
            </section>
          )
        ) : needsPassword ? (
          <form className="blog-password-panel" onSubmit={submitPassword}>
            <LockKeyhole size={26} />
            <div>
              <h3>输入密码阅读文章</h3>
              <p>这篇文章设置了访问密码。</p>
              <label>
                访问密码
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                />
              </label>
              {error ? <p className="password-error">{error}</p> : null}
              <button type="submit">阅读文章</button>
            </div>
          </form>
        ) : (
          <article className="blog-detail">
            <a href="#blog" className="back-link">返回文章列表</a>
            <span>{selectedPost.date}</span>
            <MarkdownContent text={selectedPost.body} />
          </article>
        )}
      </main>

      <footer>
        <span className="footer-brand">
          <img src={`${baseUrl}logo-dyad.png`} alt="" />
          二人禅 Dyad Meditation
        </span>
        <span>愿表达真实，愿倾听清明。</span>
        <a className="footer-admin" href="#admin">管理员</a>
      </footer>
    </>
  );
}

function AdminPage({ baseUrl }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(() => window.sessionStorage.getItem("adminUnlocked") === "true");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [passwords, setPasswords] = useState(() => getAccessPasswords());
  const [posts, setPosts] = useState(() => getBlogPosts());
  const [postDraft, setPostDraft] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    accessPassword: "",
    summary: "",
    body: "",
  });

  function submitLogin(event) {
    event.preventDefault();
    if (username === "admin" && password === getAccessPassword("admin")) {
      setUnlocked(true);
      window.sessionStorage.setItem("adminUnlocked", "true");
      setError("");
      return;
    }
    setError("账号或密码不正确，请重新输入。");
  }

  function savePasswords(event) {
    event.preventDefault();
    const normalized = Object.fromEntries(
      Object.entries(passwords).map(([key, value]) => [key, String(value).trim() || defaultPasswords[key]]),
    );
    window.localStorage.setItem("dyadAccessPasswords", JSON.stringify(normalized));
    setPasswords(normalized);
    setNotice("密码已保存。已解锁的会话不受影响，新访问会使用新密码。");
  }

  function addPost(event) {
    event.preventDefault();
    const title = postDraft.title.trim();
    const summary = postDraft.summary.trim();
    const body = postDraft.body.trim();
    if (!title || !summary || !body) {
      setNotice("请填写文章标题、摘要和正文。");
      return;
    }
    const nextPosts = [
      {
        id: `${Date.now()}`,
        title,
        date: postDraft.date || new Date().toISOString().slice(0, 10),
        accessPassword: postDraft.accessPassword.trim(),
        summary,
        body,
      },
      ...posts,
    ];
    window.localStorage.setItem("dyadBlogPosts", JSON.stringify(nextPosts));
    window.dispatchEvent(new Event("dyadBlogPostsUpdated"));
    setPosts(nextPosts);
    setPostDraft({ title: "", date: new Date().toISOString().slice(0, 10), accessPassword: "", summary: "", body: "" });
    setNotice("文章已添加。");
  }

  function deletePost(id) {
    const nextPosts = posts.filter((post) => post.id !== id);
    window.localStorage.setItem("dyadBlogPosts", JSON.stringify(nextPosts));
    window.dispatchEvent(new Event("dyadBlogPostsUpdated"));
    setPosts(nextPosts);
    setNotice("文章已删除。");
  }

  return (
    <main className="professional-page admin-page" id="admin">
      <header className="professional-header">
        <a className="brand" href="#top">
          <img src={`${baseUrl}logo-dyad.png`} alt="" />
          <span>
            二人禅
            <small>Dyad Meditation</small>
          </span>
        </a>
        <a href="#top">返回首页</a>
      </header>

      <section className="professional-hero">
        <p className="eyebrow">管理员</p>
        <h1>管理密码与文章</h1>
        <p>这里可以修改需要密码访问的模块密码，也可以添加后续学习文章。</p>
      </section>

      {!unlocked ? (
        <form className="password-panel" onSubmit={submitLogin}>
          <LockKeyhole size={28} />
          <div>
            <h3>管理员登录</h3>
            <p>请输入管理员账号和密码。</p>
            <label>
              账号
              <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="请输入账号" autoComplete="username" />
            </label>
            <label>
              密码
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="password-error">{error}</p> : null}
            <button type="submit">进入管理员模块</button>
          </div>
        </form>
      ) : (
        <section className="admin-content">
          {notice ? <p className="admin-notice">{notice}</p> : null}

          <form className="admin-card" onSubmit={savePasswords}>
            <div>
              <p className="eyebrow">访问密码</p>
              <h2>修改受保护模块密码</h2>
              <p>这里用于修改独立模块的访问密码。单篇文章的访问密码，请在添加文章时单独设置。</p>
            </div>
            <div className="admin-fields">
              {Object.keys(defaultPasswords).map((key) => (
                <label key={key}>
                  {passwordLabels[key]}
                  <input
                    type="text"
                    value={passwords[key] || ""}
                    onChange={(event) => setPasswords((current) => ({ ...current, [key]: event.target.value }))}
                  />
                </label>
              ))}
            </div>
            <button type="submit">保存密码</button>
          </form>

          <form className="admin-card" onSubmit={addPost}>
            <div>
              <p className="eyebrow">博客文章</p>
              <h2>添加文章</h2>
              <p>文章会显示在独立「文章」页的列表中。列表只显示标题、日期和摘要，点击后进入正文详情。</p>
            </div>
            <div className="admin-fields">
              <label>
                标题
                <input
                  value={postDraft.title}
                  onChange={(event) => setPostDraft((draft) => ({ ...draft, title: event.target.value }))}
                  placeholder="请输入文章标题"
                />
              </label>
              <label>
                日期
                <input
                  type="date"
                  value={postDraft.date}
                  onChange={(event) => setPostDraft((draft) => ({ ...draft, date: event.target.value }))}
                />
              </label>
              <label>
                访问密码
                <input
                  type="text"
                  value={postDraft.accessPassword}
                  onChange={(event) => setPostDraft((draft) => ({ ...draft, accessPassword: event.target.value }))}
                  placeholder="留空则公开阅读"
                />
              </label>
              <label>
                摘要
                <input
                  value={postDraft.summary}
                  onChange={(event) => setPostDraft((draft) => ({ ...draft, summary: event.target.value }))}
                  placeholder="用于文章列表的简短介绍"
                />
              </label>
              <label className="wide-field">
                正文
                <textarea
                  value={postDraft.body}
                  onChange={(event) => setPostDraft((draft) => ({ ...draft, body: event.target.value }))}
                  placeholder="支持 Markdown：# 标题、## 小标题、- 列表、**加粗**"
                  rows="8"
                />
              </label>
            </div>
            <button type="submit">发布文章</button>
          </form>

          <div className="admin-card">
            <div>
              <p className="eyebrow">已发布</p>
              <h2>文章列表</h2>
            </div>
            {posts.length === 0 ? (
              <p>当前还没有文章。</p>
            ) : (
              <div className="admin-posts">
                {posts.map((post) => (
                  <article key={post.id}>
                    <div>
                      <span>{post.date}</span>
                      <h3>{post.title}</h3>
                      <p>{post.summary}</p>
                      {post.accessPassword ? <small>已设置访问密码</small> : null}
                    </div>
                    <button type="button" onClick={() => deletePost(post.id)}>
                      删除
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function App() {
  const baseUrl = import.meta.env.BASE_URL;
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  if (hash === "#professional") {
    return <ProfessionalTrainingPage baseUrl={baseUrl} />;
  }

  if (hash === "#facilitator") {
    return <FacilitatorPage baseUrl={baseUrl} />;
  }

  if (hash === "#mechanism") {
    return <MechanismPage baseUrl={baseUrl} />;
  }

  if (hash === "#admin") {
    return <AdminPage baseUrl={baseUrl} />;
  }

  if (hash === "#blog" || hash.startsWith("#blog-")) {
    return <BlogPage baseUrl={baseUrl} selectedPostId={hash.startsWith("#blog-") ? hash.slice(6) : ""} />;
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top">
          <img src={`${baseUrl}logo-dyad.png`} alt="" />
          <span>
            二人禅
            <small>Dyad Meditation</small>
          </span>
        </a>
        <nav aria-label="主导航">
          <a href="#learn">认识</a>
          <a href="#first-practice">第一次</a>
          <a href="#practice">计时器</a>
          <a href="#inquiries">探问</a>
          <a href="#professional">专业训练</a>
          <a href="#facilitator">带领者</a>
          <a href="#mechanism">机理</a>
          <a href="#blog">文章</a>
          <a href="#qa">Q&A</a>
          <a href="#safety">边界</a>
          <a href="#history">起源</a>
          <a href="https://zcnv8lc63v15.feishu.cn/docx/ENSjdAKhOoDiIUxOQJycdzD8nSe?from=from_copylink" target="_blank" rel="noreferrer">
            联系人
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <img src={`${baseUrl}hero-dyad.png`} alt="两人面对面进行二人禅练习的插画" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>
              <span>二人禅</span>
              <small>Dyad Meditation</small>
            </h1>
            <p>
              一种把静心、真诚表达和深度倾听结合在一起的双人探问练习。它不追求正确答案，而是支持两个人在安全、清晰的结构中直接体验当下。
            </p>
            <div className="hero-actions">
              <a href="#first-practice">开始第一次练习</a>
              <a href="#learn" className="text-link">
                了解二人禅是什么
              </a>
            </div>
          </div>
        </section>

        <section className="route-strip" aria-label="按当前阶段选择入口">
          {audienceRoutes.map(([title, body, href]) => (
            <a href={href} key={title}>
              <strong>{title}</strong>
              <span>{body}</span>
            </a>
          ))}
        </section>

        <section className="intro" id="learn">
          <div className="section-heading">
            <p>先看这里</p>
            <h2>3 分钟了解二人禅</h2>
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
              <p>常见格式是每轮 5 分钟，A/B 交替四轮。固定结构能带来公平、专注和稳定感。</p>
            </article>
            <article>
              <HeartHandshake />
              <h3>真诚与接纳</h3>
              <p>表达者不需要表演或解释得漂亮；倾听者不分析、不建议、不打断，让对方被完整接收。</p>
            </article>
          </div>
          <div className="quick-grid">
            {quickFacts.map(([title, body]) => (
              <article key={title}>
                <strong>{title}</strong>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="first-practice" id="first-practice">
          <div className="method-copy">
            <p className="eyebrow">第一次练习</p>
            <h2>按这 5 步，就能开始</h2>
            <p>
              第一次练习不要追求深度。重点是让两个人都知道发生什么、什么时候开始、什么时候结束，以及任何时候都可以暂停。
            </p>
            <div className="safety-reminder">
              <ShieldCheck size={20} />
              <span>任何一方都可以随时暂停或结束练习，不需要解释理由。</span>
            </div>
          </div>
          <div className="method-steps">
            {firstPracticeSteps.map(([title, body], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <div className="starter-panels">
            <article className="agreement-panel">
              <h3>练习前协议</h3>
              <ul>
                {agreementItems.map((item) => (
                  <li key={item}>
                    <Check size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="dialogue-panel">
              <h3>一分钟示范</h3>
              <div>
                {sampleDialogue.map(([role, line]) => (
                  <p key={`${role}-${line}`}>
                    <strong>{role}</strong>
                    <span>{line}</span>
                  </p>
                ))}
              </div>
            </article>
          </div>
        </section>

        <PracticeTimer />

        <section className="inquiries" id="inquiries">
          <div className="section-heading">
            <p>探问题库</p>
            <h2>按经验程度选择探问</h2>
          </div>
          <div className="inquiry-groups">
            {inquiryGroups.map((group) => (
              <article key={group.title}>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <div className="inquiry-grid">
                  {group.items.map((item) => (
                    <button type="button" key={item}>
                      <Sparkles size={16} />
                      {item}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="integration-panel">
            <div>
              <p className="eyebrow">练习后整合</p>
              <h3>练习后可以记录的问题</h3>
            </div>
            <div className="integration-grid">
              {integrationPrompts.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="learning-path" id="path">
          <div className="section-heading">
            <p>学习路线</p>
            <h2>练过一次之后，再按阶段推进</h2>
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
              <p className="eyebrow">练习形式</p>
              <h3>从日常双人练习开始</h3>
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

        <section className="qa" id="qa">
          <div className="section-heading">
            <p>常见问题</p>
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
            <p className="eyebrow">安全边界</p>
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

        <section className="suitability">
          <div className="section-heading">
            <p>适合与边界</p>
            <h2>不是所有状态都适合做二人禅</h2>
          </div>
          <div className="suitability-grid">
            {suitabilityItems.map(([title, body]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="history" id="history">
          <div className="section-heading">
            <p>起源与发展</p>
            <h2>从密集自我探问，到当代二人练习</h2>
          </div>
          <div className="history-layout">
            <div className="history-intro">
              <Compass />
              <h3>历史脉络</h3>
              <p>
                二人禅保留自我探问、轮换表达和专注倾听，也加入更适合日常练习的安全、边界和整合设计。了解起源有帮助，但第一次练习更重要的是清楚、温和，并且随时可以停止。
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
      </main>

      <footer>
        <span className="footer-brand">
          <img src={`${baseUrl}logo-dyad.png`} alt="" />
          二人禅 Dyad Meditation
        </span>
        <span>愿表达真实，愿倾听清明。</span>
        <a
          className="footer-contact"
          href="https://zcnv8lc63v15.feishu.cn/docx/ENSjdAKhOoDiIUxOQJycdzD8nSe?from=from_copylink"
          target="_blank"
          rel="noreferrer"
        >
          联系人
        </a>
        <a className="footer-admin" href="#admin">管理员</a>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
