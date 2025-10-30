---
title: "Spinning Up in Deep RL: Getting Started"
date: 2020-11-29
aliases:
  - posts/2020/11/getting-started-spinning-up
tags:
  - ai
  - reinforcement-learning
  - ai-safety
  - career
---

I'll be spending the next month getting some hands-on experience with deep reinforcement learning via OpenAI's [Spinning Up in Deep RL](https://spinningup.openai.com/en/latest/index.html), which includes both an overview of key concepts in deep reinforcement learning and a [well-documented repository](https://github.com/openai/spinningup) of implementations of key algorithms that are designed to be 1) "as simple as possible while still being reasonably good," and 2) "highly-consistent with each other to expose fundamental similarities between algorithms." I'll be posting here about this endeavor in order to document the process and share the lessons I learn along the way for those who are also looking to "spin up" in deep RL.

## Motivation

There are several reasons I am pursuing this project. Most importantly, I am pursuing careers where I hope to contribute to reducing potential existential risks from AI as well as ensuring that humanity deploys systems that are robustly beneficial for everyone. Reinforcement learning is a topic that comes up _very_ frequently in discussions within this context, especially in the research paradigms of places like OpenAI, DeepMind, and CHAI, since it seems possible that deep RL could scale to yield [prosaic AGI](https://ai-alignment.com/prosaic-ai-control-b959644d79c2) and thus studying alignment in the context of current RL systems is one way to make tractable progress on these problems now. So it seems desirable to have a solid grounding in RL in order to not only better understand ongoing work in the field but also be able to begin empirical research into potential alignment schemes within current ML paradigms. While I have a background in machine learning and have touched upon the concept of reinforcement learning at various points in my education, I have not worked with modern RL algorithms in a practical context, and I believe that doing so will help me master the content better than merely studying the concepts and reading papers, for example.

Additionally, this project will be my first extended ML coding project in some time, and I hope it will help me get back into the swing of things, as it were, with the ML development process. My past projects in NLP affirmed the stereotypical difficulty of debugging machine learning programs, so it will be good to exercise that mental "frustration tolerance" muscle again in anticipation of doing similar work at a job or for a PhD.

## (Rough) Plan

I spent good chunks of the last two days or so getting set up for this project (more details below), as well as going through their ["Introduction to RL"](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html) material, which was a helpful review of the important underlying concepts. Now that I have, I intend to spend some time studying how these concepts translate into code, probably starting with their implementation of the [Vanilla Policy Gradient algorithm](https://spinningup.openai.com/en/latest/algorithms/vpg.html#other-public-implementations). Then, I want to re-implement one or two other algorithms from scratch, since being able to do so would be a good confidence check in my understanding of the concepts. Depending on how that goes, I might try and re-implement an inverse reinforcement learning algorithm, but, as always with machine learning, I am anticipating that everything will probably take substantially longer than I first expect. I also expect to get a better sense of what I more specifically want to accomplish with this project as I delve into it.

## Getting Set Up

One of the things I definitely did _not_ miss about ML development was the difficulty and frustration that often accompanies simply setting up environments and installing packages for a project. There were several challenges I encountered in getting set up with Spinning Up, which I document here in case others encounter similar stumbling blocks.

### General Set Up

I set up a VM on GCP (through their Notebooks platform, in case I wanted to easily be able to use JupyterLab at some point). Here are the details for my instance:

![GCP Instance Details](/images/spinning-up/gcloud_instance.png)

### Installing Spinning Up

I was mostly able to follow the documented [installation guide](https://spinningup.openai.com/en/latest/user/installation.html) to create a conda environment and install OpenMPI and the Spinning Up repo. I was able to run PPO in the LunarLander-v2 environment successfully, but ran into problems watching a video of the trained policy and plotting the results of the run.

#### Graphics

I was able to get the plot of results via X11 forwarding by adding `--ssh-flag="-Y"` to my `gcloud compute ssh` command, but was still running into errors trying to view the video of the agent in the environment. I explored various solutions to remotely rendering video output from a virtual instance and played around with Xvfb and vncviewer but could not get them to work. Eventually, I stumbled across instructions for [setting up Chrome Remote Desktop for Linux on Compute Engine VM instances](https://cloud.google.com/solutions/chrome-desktop-remote-on-compute-engine), which did the trick. I'll continue to use ssh for my normal development workflow for this project, but whenever I need to view video samples from trained policies, I can simply run the relevant command through a remote desktop interface:

![Chrome Remote Desktop](/images/spinning-up/chrome_remote_desktop.png)

#### MuJoCo

I decided to go ahead and get a free 30-day license for MuJoCo to have full access to the set of possible environments, since my timeline for this project is about a month, anyway. However, it turns out that Spinning Up does not support the latest version (2.0), so I had to install version 1.5 (which can be found on their [website](https://www.roboti.us)). After sorting out a few more installation errors regarding dependencies I didn't already have installed, I was able to successfully able to run the test command for PPO in the Walker2d-v2 environment.

## Conclusion

I hope this post might be helpful to those running into any of the same issues getting set up with the Spinning Up in Deep RL package. I will continue to document my progress on this project over the next several weeks here on my blog.
