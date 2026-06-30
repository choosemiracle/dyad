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
  ["需要几人", "两个人即可。也可以在带领者组织下进行小组分组练习。"],
  ["会得到什么", "更清楚地看见当下经验、表达习惯、关系模式和需要整合的内容。"],
];

const audienceRoutes = [
  ["我是第一次来", "从 5 步练习和协议开始", "#first-practice"],
  ["我想直接练", "使用四轮计时器", "#practice"],
  ["我练过几次", "选择合适的探问", "#inquiries"],
  ["我要专业训练", "进入进阶练习质量指南", "#professional"],
  ["我要带小组", "查看带领者检查清单", "#facilitator"],
  ["我担心安全", "先看边界和不适合状态", "#safety"],
];

const firstPracticeSteps = [
  ["找搭档", "选择愿意遵守保密、不建议、不评判的人。第一次不建议和关系冲突很强的人练。"],
  ["选探问", "从温和入门探问开始，例如“告诉我：此刻你注意到了什么？”"],
  ["设时间", "每轮 3 到 5 分钟，A/B 交替四轮。时间短一点，更容易保持清醒和安全。"],
  ["按角色练", "倾听者只给出探问和在场，表达者说出当下真实经验，可以停顿和静默。"],
  ["结束整合", "完成后安静 3 分钟，再各自说一句收尾：我现在带走的是……"],
];

const agreementItems = [
  "我们同意保密，不把对方的内容转述给第三人。",
  "我们同意不建议、不分析、不诊断、不追问隐私。",
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
      "告诉我：你如何经验到另一个人？",
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
    description: "适合有成熟带领、充分整合时间和清楚安全边界时使用。",
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
    lead: "倾听者不是静默的旁观者，而是在维护一个清楚、稳定、非侵入的练习容器。二人禅质量很大程度取决于倾听者能否不接管内容。",
    blocks: [
      {
        heading: "如何给出探问",
        items: [
          "语速放慢，句子完整，不用戏剧化语气推动对方进入情绪。",
          "每次只给出一个探问，不临场解释探问，也不补充自己的理解。",
          "给完探问后停下来，让表达者有时间让问题进入身体和经验。",
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
    title: "进阶练习结构",
    lead: "以下结构只适合已有基础经验、边界清楚、整合能力稳定的练习者。它们不是新手入口。",
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
    if (password === "2renchan") {
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
          <img src={`${baseUrl}logo-dyad.svg`} alt="" />
          <span>
            二人禅
            <small>Dyad Meditation</small>
          </span>
        </a>
        <a href="#top">返回首页</a>
      </header>

      <section className="professional-hero">
        <p className="eyebrow">专业训练</p>
        <h1>让练习更稳、更深、更不跑偏</h1>
        <p>这里面向已有练习经验者、带领者和小组组织者，重点训练练习质量、伦理边界和整合能力。</p>
      </section>

      {!unlocked ? (
        <form className="password-panel" onSubmit={submitPassword}>
          <LockKeyhole size={28} />
          <div>
            <h3>输入密码访问专业训练</h3>
            <p>该模块包含进阶练习判断和带领注意事项，建议在熟悉基础流程后阅读。</p>
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
    if (password === "leadingnow") {
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
          <img src={`${baseUrl}logo-dyad.svg`} alt="" />
          <span>
            二人禅
            <small>Dyad Meditation</small>
          </span>
        </a>
        <a href="#top">返回首页</a>
      </header>

      <section className="professional-hero">
        <p className="eyebrow">带领者</p>
        <h1>学习方法，也学习如何守住容器</h1>
        <p>带领二人禅不是把别人推向深度，而是让每个人在清楚、安全、可退出的结构里探索。</p>
      </section>

      {!unlocked ? (
        <form className="password-panel" onSubmit={submitPassword}>
          <LockKeyhole size={28} />
          <div>
            <h3>输入密码访问带领者模块</h3>
            <p>该模块面向准备带领练习、小组或工作坊的人，包含学习路径、容器原则和带领检查清单。</p>
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
              带领者不负责制造强烈体验，也不负责解释练习者的内容。带领者负责让练习目的清楚、流程清楚、边界清楚，并在必要时降速、暂停或转介。
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
          <a href="#learn">认识</a>
          <a href="#first-practice">第一次</a>
          <a href="#practice">计时器</a>
          <a href="#inquiries">探问</a>
          <a href="#professional">专业训练</a>
          <a href="#facilitator">带领者</a>
          <a href="#qa">Q&A</a>
          <a href="#safety">边界</a>
          <a href="#history">起源</a>
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
              一种把静心、真诚表达和深度倾听结合在一起的双人探问练习。它不追求正确答案，而是支持两个人在安全、清晰的结构中直接经验当下。
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
              <p>常见格式是每轮 5 分钟，A/B 交替四轮。结构提供公平、专注和稳定的容器。</p>
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
                二人禅保留自我探问、轮换表达和专注倾听，也加入更适合日常练习的安全、边界和整合设计。了解起源有帮助，但第一次练习更重要的是清楚、温和、可停止。
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
          <img src={`${baseUrl}logo-dyad.svg`} alt="" />
          二人禅 Dyad Meditation
        </span>
        <span>愿表达真实，愿倾听清明。</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
