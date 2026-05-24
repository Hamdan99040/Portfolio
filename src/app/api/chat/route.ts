import { NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages || [];
    
    if (messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }
    
    const userMessage = messages[messages.length - 1].content.toLowerCase();
    
    let reply = "";
    
    // Semantic Rule Matching Engine representing Zain's Personal AI Agent
    if (userMessage.includes('hello') || userMessage.includes('hi ') || userMessage.includes('hey') || userMessage.includes('greetings')) {
      reply = "Hello! 👋 I am **Zain's Personal AI Assistant**. I can tell you all about his projects (like *Discover Zone*), his experience in full-stack MERN development, his background in SQA testing, or his goals for an international career in Germany or Australia! How can I help you today?";
    } else if (userMessage.includes('discover zone')) {
      reply = "📁 **Discover Zone** is one of Zain's flagship MERN stack applications!\n\n- **What it is:** A secure localized discovery platform with dynamic authentication.\n- **Zain's Role:** Lead Full-Stack Developer & SQA Engineer.\n- **Tech Stack:** React, Node.js, Express.js, MongoDB, Tailwind CSS, and JWT.\n- **Key Solution:** He successfully implemented decentralized secure sessions and low-latency search filters.\n\nWould you like me to guide you on how to check out his other projects or access his secure credentials?";
    } else if (userMessage.includes('project') || userMessage.includes('portfolio') || userMessage.includes('showcase')) {
      reply = "Zain has worked on several premium projects highlighting his dual expertise in **Development** and **QA Automation**:\n\n1. **Discover Zone:** A comprehensive MERN stack platform featuring high-security authentication and localized interactive services.\n2. **SecureConnect React Native:** A biometric-enabled mobile app utilizing offline-first encrypted storage and OTP verification.\n3. **QA Automation Framework:** A robust automated regression suite using Cypress and Postman, which reduced test cycles by 75%.\n\nWhich of these would you like to explore in detail?";
    } else if (userMessage.includes('qa') || userMessage.includes('test') || userMessage.includes('sqa') || userMessage.includes('cypress') || userMessage.includes('postman')) {
      reply = "Zain is highly proficient in **Software Quality Assurance & Testing**! 🧪\n\nHis QA capabilities include:\n- **Automation Testing:** Designing modern framework pipelines using **Cypress**.\n- **API Testing:** Executing robust REST API validations with **Postman**.\n- **Manual Testing:** Formulating comprehensive test suites, creating detailed test cases, and tracing regressions.\n- **Bug Reporting:** Documenting precise issues and integrating automated reporting flows via Jira APIs.\n- **Performance/Security:** Auditing loading benchmarks and security credentials.";
    } else if (userMessage.includes('mern') || userMessage.includes('react') || userMessage.includes('node') || userMessage.includes('mongo') || userMessage.includes('express') || userMessage.includes('next')) {
      reply = "As a **MERN Stack Developer**, Zain builds beautiful, robust web applications using:\n\n- **Frontend:** React.js, Next.js (App Router), Tailwind CSS, and Framer Motion for high-fidelity animations.\n- **Backend:** Node.js and Express.js for scalable API design and background services.\n- **Database:** MongoDB and Mongoose for relational modeling and high-throughput queries.\n- **Security:** JWT authentication, HttpOnly secure cookies, and OTP flows.\n\nHe specializes in building clean interfaces backed by bulletproof, highly optimized servers.";
    } else if (userMessage.includes('germany') || userMessage.includes('australia') || userMessage.includes('career') || userMessage.includes('abroad') || userMessage.includes('work')) {
      reply = "Zain is actively targeting **international career opportunities** in Germany and Australia! 🌐✈️\n\n**Why he is a strong candidate:**\n- **Dual Capabilities:** He can develop features (MERN) and write their tests (Cypress/Postman), bringing massive value to agile engineering teams.\n- **Academic Foundation:** He holds a BS in Computer Science from the **University of Okara**, with outstanding marks and achievements.\n- **English Proficiency:** He has successfully cleared IELTS with a **Band 7.5**, proving professional communication skills.\n- **Secure Vault:** He has set up a highly protected Documents Vault in this portfolio to share watermarked passport, degree, and recommendation documents instantly with verified embassies and HR departments.";
    } else if (userMessage.includes('education') || userMessage.includes('university') || userMessage.includes('okara') || userMessage.includes('degree')) {
      reply = "🎓 Zain holds a **Bachelor of Science in Computer Science (BS CS)** from the **University of Okara**.\n\n- **Key Focus Areas:** Software Engineering, Advanced Database Systems, Quality Assurance, and Web Technologies.\n- **Achievements:** Developed multiple core MERN applications, designed automated testing frameworks for his university thesis projects, and graduated with honors.\n- **Verification:** You can view a watermarked scan of his BS degree and transcripts inside the **Private Secure Vault** on this website once authorized!";
    } else if (userMessage.includes('experience') || userMessage.includes('intern') || userMessage.includes('freelance') || userMessage.includes('job')) {
      reply = "Zain's professional journey spans development and QA environments:\n\n- **SQA Engineer Intern** at *TechGlobal Solutions* (Sep 2025 - Mar 2026):\n  He designed automation testing pipelines with Cypress, verified backend REST APIs with Postman, and managed bugs in agile Jira teams.\n- **Full-Stack & QA Specialist (Freelance)** (May 2024 - Present):\n  He delivers custom React/Next.js dynamic web applications and automates testing pipelines for international clients.\n\nHis diverse background makes him highly adaptable to both startup and enterprise engineering cycles!";
    } else if (userMessage.includes('contact') || userMessage.includes('email') || userMessage.includes('linkedin') || userMessage.includes('hire') || userMessage.includes('message')) {
      reply = "You can easily get in touch with Zain! ✉️\n\n- **Email:** `zain@portfolio.com` (or use the **Contact Form** at the bottom of the home page)\n- **LinkedIn:** [Zain Ul Abadin on LinkedIn](https://linkedin.com)\n- **GitHub:** [Zain's GitHub Profile](https://github.com)\n- **Upwork:** [Zain on Upwork](https://upwork.com)\n\nAlternatively, you can drop him a message directly through the contact form, and he will receive it instantly on his secure admin panel. Shall I explain how to access the secure vault next?";
    } else if (userMessage.includes('vault') || userMessage.includes('secure') || userMessage.includes('private') || userMessage.includes('document') || userMessage.includes('passport') || userMessage.includes('2fa')) {
      reply = "🔒 **The Private Secure Vault** is a custom dashboard designed by Zain to store sensitive documentation securely (e.g. Passport, CNIC, Degree scans, Transcripts, and Recommendation Letters).\n\n- **Security Stack:** It requires admin email, password, and a mock **2FA OTP** code (`123456`).\n- **Anti-Tampering:** Document previews feature a non-removable, custom watermark overlay.\n- **Temporary Links:** The admin can generate 24-hour expiring access links to share specific watermarked files directly with embassies or HR personnel.\n\nWould you like me to explain how to log in to test this secure vault?";
    } else {
      reply = "I'm Zain's Personal AI Assistant! 🤖\n\nI can provide you with detailed insights about:\n- 🚀 **Zain's MERN Stack development** skills (Next.js, Node, MongoDB)\n- 🧪 **His SQA expertise** (automated Cypress UI pipelines, Postman API testing)\n- 📁 **Detailed projects** like the *Discover Zone* platform\n- 🎓 **Education & IELTS Band 7.5** achievements\n- 🔒 **How the Private Secure Vault works** and protects sensitive documents\n\nFeel free to ask something specific about these topics, or use the menu items above to explore!";
    }
    
    // Simulate minor network latency for premium realism, then return JSON
    return NextResponse.json({
      role: 'assistant',
      content: reply
    });
  } catch (err) {
    console.error('Chatbot API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
