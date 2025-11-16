# 🏋️ Liftium Live

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/hamzatekin/lifitum-live?utm_source=oss&utm_medium=github&utm_campaign=hamzatekin%2Flifitum-live&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

**Liftium Live** is an evidence-based workout tracking app that analyzes your training in real-time using the Stimulus-to-Fatigue Ratio (SFR). Built for the [TanStack Start Hackathon](https://luma.com/tanstackstarthackathonv1), it combines cutting-edge full-stack web technologies with sports science research to help you train smarter, not harder.

## 🚀 Live Demo

Try Liftium Live now:

- **[https://liftium-live.hmztkn.workers.dev/](https://liftium-live.hmztkn.workers.dev/)**
- **[https://liftiumlive.hamzatekin.dev/](https://liftiumlive.hamzatekin.dev/)**

Built entirely with the TanStack Start Hackathon co-hosts and sponsors:

- **[TanStack Start](https://tanstack.com/start)** - SSR app shell and routing.
- **[Convex](https://www.convex.dev/)** - DB + optimistic updates for workouts and sessions.
- **[Cloudflare](https://www.cloudflare.com/)** - Primary runtime & deployment, using `cloudflare:workers` env bindings.
- **[Netlify](https://www.netlify.com/)** - Configured via the Netlify TanStack Start SDK and Vite plugin, with a dedicated `deploy:netlify` script so the app can also be built/deployed on Netlify.
- **[Autumn](https://useautumn.com/)** - Models Free/Pro-style memberships and session limits.
- **[CodeRabbit](https://www.coderabbit.ai/)** - Used for AI-assisted PR review during development.
- **[Firecrawl](https://www.firecrawl.dev/)** - Scrapes PubMed hypertrophy studies for embeddings.
- **[Sentry](https://sentry.io/)** - Error monitoring and performance tracking

## 🎯 The Problem

Most workout trackers just log numbers. They don't tell you if your sets are actually effective for muscle growth, or if you're accumulating unnecessary fatigue. Liftium Live solves this by:

- **Analyzing every set** using research-backed algorithms
- **Providing instant feedback** on training efficiency
- **Citing actual studies** so you can verify the science yourself
- **Helping you optimize** stimulus while managing fatigue

## ✨ Features

### 🔬 Evidence-Based Analysis

- **Stimulus-to-Fatigue Ratio (SFR)** calculations for every set
- Real-time feedback categorized as: Excellent, Good, Moderate, or Suboptimal
- Automatic warm-up set detection (sets that don't contribute to hypertrophy)

### 📚 Research-Backed Recommendations

- **RAG-powered insights** using vector search over PubMed research
- Direct links to meta-analyses and studies supporting each recommendation
- Transparent attribution showing where advice comes from

### 💪 Smart Workout Tracking

- Live workout sessions with set-by-set logging
- Track: Exercise, Load (kg), Reps, and RIR (Reps in Reserve)
- Session history with workout duration and performance metrics

## 🛠️ Tech Stack

## 🧮 How SFR Works

The Stimulus-to-Fatigue Ratio is calculated using evidence-based algorithms:

```typescript
SFR = Stimulus / Fatigue;
```

**Stimulus** is calculated based on:

- Effective reps (reps within ~5 from failure)
- Load effectiveness (relative intensity)
- Proximity to failure (RIR)

**Fatigue** is calculated based on:

- Total reps performed
- Relative intensity (% of estimated 1RM)
- Set cost with load exponential scaling

### Example Verdicts:

- **🔥 Excellent (SFR ≥ 0.8)**: Great balance of stimulus and fatigue
- **✅ Good (SFR ≥ 0.5)**: Effective training
- **⚠️ Moderate (SFR ≥ 0.3)**: Could be optimized
- **💪 Suboptimal (SFR < 0.3)**: High fatigue relative to stimulus
- **🔄 Warm-up**: Set below effective threshold

Each verdict comes with citations to relevant research from PubMed, sports science journals, and meta-analyses.

## 🎓 Key Concepts

### Stimulus

The muscle-building signal your training creates. Higher stimulus means more potential for growth. Sets closer to failure typically provide greater stimulus for hypertrophy.

### Fatigue

The recovery cost of your training. All training creates fatigue, but some sets create more than others. Managing fatigue is key to sustainable progress.

### RIR (Reps in Reserve)

How many more reps you could have done before reaching failure:

- **RIR 0** = Failure
- **RIR 1** = One rep left
- **RIR 2** = Two reps left
- **RIR 3-6** = Multiple reps left

### SFR (Stimulus-to-Fatigue Ratio)

The efficiency of your sets. Higher SFR means you're getting more muscle-building stimulus for less fatigue. Sets with moderate RIR (1-3) often have the best SFR.

## 📝 License

This project is open source and available under the MIT License.

## 📧 Contact

Built by [@hamzatekin](https://github.com/hamzatekin)

---

**Made with 💪 for the TanStack Start Hackathon**
