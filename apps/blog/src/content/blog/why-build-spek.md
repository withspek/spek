---
title: Why build spek?
excerpt: In recent years, the way we work has undergone a significant transformation, largely due to advancements in technology and changing attitudes toward work-life balance. One of the most notable changes has been the rise of remote work, allowing employees to work from the comfort of their own homes.
publishDate: 'May 19 2024'
isFeatured: true
tags:
  - Thoughts
  - Development
seo:
  image:
    src: '/post-1.jpg'
    alt: A person standing at the window
---

I’ve been in large communities on platforms like Discord and Slack for years, and it was not the best experience whenever the communities start growing for example discussions with hundreds and thousands of people who contribute from all around the world.
Even when everything is as carefully organized as can be things start to break down as these groups grow:

- With five conversations going on at the same time you’re not quite sure anymore who’s talking with whom—it’s impossible to keep track of.
- You want to talk about this one topic somebody mentioned five hours ago but the message is now 15 pages up and nobody knows what you’re talking about anymore. Don’t even get me started on topics from days or even, gasp, weeks ago!
- This is amplified by the fact that searching and linking to old messages is often a pain. Many times valuable and interesting conversations are lost forever, or the knowledge is trapped in the tool itself, never to be discovered from the outside.

Based on my own experience, and all those groups I have approached, I am approaching the problem hands-on and building [Spek](https://spek.vercel.app) diffently, made for the purpose:

- All conversations in communities which are public are search engine indexable which makes it so all the valuable information is not lost behind the walls of the platform but accessible to the whole internet to use.

- Every conversation on Spek starts as a thread, its own place to provide rich context for the conversation ahead. Once a thread is published others can join the conversation.

- Conversations in threads are modeled after real-time chat applications. It feels more present than a static list of comments, and when multiple people are online talking at the same time it feels like any other chat app you know.

- With spek you are able to join all of your favorite communities with one profile, one login, one set of notifications and direct messages.

- By having all of your communities in one place, you get a single feed of all the things that you’re interested in, sorted by where the most active conversations are taking place right now.

### Contributing

I've have been working on this project since mid-march but I don't work on the project full-time yet and I been
mainly implementing the core functionality for the whole platform and the next step for the project is now to start **doing a redesign because currently the UI does not tell you immediately that this is a billion dollar idea.** so if you are a designer or a developer the
project is - <a target="_blank" href="https://github.com/irere123/spek">Open source</a>. Let's take developers communities to the stars ✨✨

- The backend is written in **Elixir** and **PostgresQL** for the database and
  for the frontend it's obviously **Nextjs** because you know Nextjs is the king
  and React is the kingdom 😁
