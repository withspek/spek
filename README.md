<a href="https://withspek.netlify.app"><p align="center">
<img height=100 src="https://raw.githubusercontent.com/withspek/spek/staging/.assets/logo.svg"/>

</p></a>
<p align="center">
  <strong>Real-time developer communities open to the public internet.</strong>
</p>

<h3 align="center">
  <a href="https://github.com/withspek/spek/blob/stating/CONTRIBUTING.md">Contribute</a>
  <span> · </span>
  <a href="https://withspek.netlify.app/c/spek">Community</a>
  <span> · </span>
  <a href="https://github.com/withspek/spek/README.md">Documentation</a>
</h3>

---

## Why did you make this?

I’ve been in large communities on platforms like Discord and Slack for years, and have personally felt the pain of managing discussions with hundreds and thousands of people who contribute from all around the world. Even when everything is as carefully organized as can be things start to break down as these groups grow:

- With five conversations going on at the same time you’re not quite sure anymore who’s talking with whom—it’s impossible to keep track of.
- You want to talk about this one topic somebody mentioned five hours ago but the message is now 15 pages up and nobody knows what you’re talking about anymore. Don’t even get me started on topics from days or even, gasp, weeks ago!
- This is amplified by the fact that searching and linking to old messages is often a pain. Many times valuable and interesting conversations are lost forever, or the knowledge is trapped in the tool itself, never to be discovered from the outside.

Based on my own experience, and all those groups I have approached the problem hands-on and built [Spek](https://withspek.netlify.app) diffently, tailor made for the purpose:

- All conversations in communities which are public are search engine indexable which makes it so all the valuable information is not lost behind the walls of the platform but accessible to the whole internet to use.

- Every conversation on Spek starts as a thread, its own place to provide rich context for the conversation ahead. Once a thread is published others can join the conversation.

- Conversations in threads are modeled after real-time chat applications. It feels more present than a static list of threaded comments, and when multiple people are online talking at the same time it feels like any other chat app you know.

- Because Spek is a platform, you are able to join all of your favorite communities with one profile, one login, one set of notifications and direct messages.

- By having all of your communities in one place, you get a single feed of all the things that you’re interested in, sorted by where the most active conversations are taking place right now.

## Structure

| Codebase                  |        Description         |
| :------------------------ | :------------------------: |
| [api](api)                |         Elixir API         |
| [web](apps/web)           |      Next.js frontend      |
| [horizon](horizon)        | Mediasoup Voice SFU Server |
| [client](packages/client) |    Internal API Client     |

## Branches

- prod -> 🌐 solid foundation on AWS of spek.
- staging -> 🦺 make pull requests on this branch.

## Contributions

Spek is open to contributions, but I recommend creating an issue or replying in a comment to let me know what you are working on first that way we don't overwrite each other.

Please read [CONTRIBUTING.md](https://github.com/withspek/spek/blob/staging/CONTRIBUTING.md) for details on this project.

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](https://github.com/withspek/spek/blob/staging/CODE_OF_CONDUCT.md) for details on our code of conduct.

## How to run locally

Check <a href="https://github.com/withspek/spek/blob/staging/CONTRIBUTING.md#quickstart-local-frontend-development">here</a> on how to run locally</a>
