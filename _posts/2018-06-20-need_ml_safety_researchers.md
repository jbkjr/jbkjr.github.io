---
title: 'The Need for ML Safety Researchers'
date: 2018-06-20
permalink: /posts/2018/06/need_ml_safety_researchers/
tags:
  - agi
  - safety
  - alignment
---

I recently came across [this article](https://www.nytimes.com/2018/06/09/technology/elon-musk-mark-zuckerberg-artificial-intelligence.html?emc=edit_th_180610&nl=todaysheadlines&nlid=609109170610) in the *New York Times*, entitled "Mark Zuckerberg, Elon Musk and the Feud Over Killer Robots." I found it quite thought provoking, even though the mainstream media's accounts of these topics and debates always leave much to be desired (note: if you mention *The Terminator, The Matrix,* and *2001: A Space Odyssey* in a discussion about AGI and superintelligence, you've already lost me).

I won't waste time recapping the article; it's worth a read. I want to write about something I've been thinking about that for me was highligted by the following quote from the article:

> ...Mr. Etzioni, the head of the Allen Institute, took the microphone. “I am not going to grandstand,” he said. But urged on by Mr. Brooks, he walked onto the stage and laid into Mr. Harris for three minutes, saying that today’s A.I. systems are so limited, spending so much time worrying about superintelligence just doesn’t make sense.

(here's the important bit)

> *The people who take Mr. Musk’s side are philosophers, social scientists, writers — not the researchers who are working on A.I., he said. Among A.I. scientists, the notion that we should start worrying about superintelligence is “very much a fringe argument.”*

## The Need for ML Safety Researchers

As highlighted by the above quote, there is clearly a communication gap between the two sides. Philosophers like Nick Bostrom and Sam Harris are thinking about possible long term existential risk, and most "AI scientists" (read: machine learning researchers, as the modern AI revolution has really only been made by statistical, mathematical, and computational advances) are more or less only worried about designing the best new architecture for some benchmark task, whether it be in computational vision, voice/audio, natural language processing, etc.

Humans have a knack for splitting into two groups: us and them. Said another way, self and other — it's the foundation of how we perceive our world. We also have proven time and time again that we ignore logic, reason, and evidence when it goes against our preexisting beliefs.

So, who is poised to bridge this gap, to bring together such fiercely entrenched sides on such an important problem? ML Safety Researchers.

### Bringing You the Problems of the Future, Today

The gap in communication seems to stem largely from the fact that two wildly different fields have been lumped together under the label of "AI": philosophical, abstract reasoning about the nature of intelligence and possible existential risk supported by hand-wavey mathematical notions (see: the work being done by groups like FHI and MIRI), and machine learning, which trains machines to learn from data and evaluates them with hard-coded reward functions/training signals. Importantly, machine learning is more focused on *the here and now*, seemingly more aimed at improving our day-to-day lives with practical applications of machine intelligence. Even more importantly, machine learning researchers typically strongly self-identify as scientists and are very likely to scoff at philosophers telling them that the "science" they are practicing is dangerous, let alone existentially risky, as seen clearly in the events covered in the article.

Let's leave aside for now any arguments as to the viability of AGI or superintelligence and consequentially any possible existential risks thus entailed. Machine learning is becoming increasingly a part of our everyday lives, and ML algorithms will continue to make more decisions for us that impact the daily lives of almost everyone on the planet. ML researchers themselves would be the first to admit that we lack deep understanding and theoretical guarantees about many of the most successful recent approaches; the advent of deep learning has been driven almost entirely by empirical results.

My point is that we need not get into the philosophical and existential weeds, so to speak, in order to realize the potential negative risks that AI poses to our society *now and/or in the immediate future*. That is, I believe there is a great need to ground work in AI safety in *concrete problems and methods that can be developed and tested now.* And in the last couple years, the very first of such work has begun, some of which was mentioned or alluded to towards the end of the article. I'll list some of this work below.

### Beginning to Bridge the Gap

Here is some work that I've come across that I believe to be excellent examples of this kind of research.

* Concrete Problems in AI Safety ([PAPER](https://arxiv.org/abs/1606.06565)) ([BLOG](https://blog.openai.com/concrete-ai-safety-problems/))
* Deep Reinforcement Learning from Human Preferences ([PAPER](https://arxiv.org/abs/1706.03741)) ([BLOG](https://blog.openai.com/deep-reinforcement-learning-from-human-preferences/))
* Trial without Error: Towards Safe Reinforcement Learning via Human Intervention ([PAPER](https://arxiv.org/abs/1707.05173))
* AI Safety via Debate ([PAPER](https://arxiv.org/abs/1805.00899)) ([BLOG](https://blog.openai.com/debate/))
* The Malicious Use of Artificial Intelligence: Forecasting, Prevention, and Mitigation ([ARTICLE](https://arxiv.org/abs/1706.03741)) ([BLOG](https://blog.openai.com/preparing-for-malicious-uses-of-ai/))
