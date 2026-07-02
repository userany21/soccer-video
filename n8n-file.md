{
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {}
          ]
        }
      },
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.3,
      "position": [
        -304,
        0
      ],
      "id": "41c719bf-f4a1-4837-9974-394615c9a0e5",
      "name": "Schedule Trigger"
    },
    {
      "parameters": {
        "url": "={{ $json.gammaUrl }}",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        432,
        0
      ],
      "id": "792f8687-0e32-4c77-b278-31b41371d1af",
      "name": "HTTP Request"
    },
    {
      "parameters": {
        "jsCode": "for (const item of $input.all()) {\n  const text = item.json.data?.text ?? item.json.content ?? '';\n  const url = text.match(/https:\\/\\/polymarket\\.com\\/\\S+/)?.[0];\n  \n  if (url) {\n    const slug = url.split('/').pop();\n    item.json.gammaUrl = `https://gamma-api.polymarket.com/events?slug=${slug}`;\n  }\n}\nreturn $input.all();"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        160,
        0
      ],
      "id": "a866260b-6756-4981-a189-1ca4f66c178b",
      "name": "Code in JavaScript"
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "sendAndWait",
        "guildId": {
          "__rl": true,
          "value": "1433589641956823133",
          "mode": "list",
          "cachedResultName": "fwx's server",
          "cachedResultUrl": "https://discord.com/channels/1433589641956823133"
        },
        "channelId": {
          "__rl": true,
          "value": "1518445650025382108",
          "mode": "list",
          "cachedResultName": "short-form-auto",
          "cachedResultUrl": "https://discord.com/channels/1433589641956823133/1518445650025382108"
        },
        "message": "send a polymarket link",
        "responseType": "freeText",
        "options": {}
      },
      "type": "n8n-nodes-base.discord",
      "typeVersion": 2,
      "position": [
        -96,
        0
      ],
      "id": "382292ad-6b9b-497c-808f-1e1dd883fbaa",
      "name": "Send message and wait for response",
      "webhookId": "b219fe8a-4213-45af-841f-ddc95ba7218e",
      "credentials": {
        "discordBotApi": {
          "id": "4dzIqPp5YHXycOv6",
          "name": "kok"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const event = $input.first().json;\nconst markets = event.markets;\n\nconst home = event.teams.find(t => t.ordering === 'home');\nconst away = event.teams.find(t => t.ordering === 'away');\n\nconst homeMarket = markets.find(m => String(m.groupItemThreshold) === '0');\nconst drawMarket = markets.find(m => String(m.groupItemThreshold) === '1');\nconst awayMarket = markets.find(m => String(m.groupItemThreshold) === '2');\n\nconst homePrice = parseFloat(JSON.parse(homeMarket.outcomePrices)[0]);\nconst awayPrice = parseFloat(JSON.parse(awayMarket.outcomePrices)[0]);\nconst drawPrice = parseFloat(JSON.parse(drawMarket.outcomePrices)[0]);\n\nconst homeMultiplier = parseFloat((1 / homePrice).toFixed(2));\nconst awayMultiplier = parseFloat((1 / awayPrice).toFixed(2));\nconst drawMultiplier = parseFloat((1 / drawPrice).toFixed(2));\n\nreturn [{\n  json: {\n    title: event.title,\n    gameTime: event.startTime,\n    eventDate: event.eventDate,\n\n    homeTeam: home.name,\n    homeLogo: home.logo,\n    homeColor: home.color,\n    homeRecord: home.record,\n    homeAbbr: home.abbreviation,\n\n    awayTeam: away.name,\n    awayLogo: away.logo,\n    awayColor: away.color,\n    awayRecord: away.record,\n    awayAbbr: away.abbreviation,\n\n    homeWinPct: homePrice * 100,\n    awayWinPct: awayPrice * 100,\n    drawPct: drawPrice * 100,\n\n    homeMultiplier,\n    awayMultiplier,\n    drawMultiplier,\n\n    homeMomentum: homeMarket.oneDayPriceChange,\n    awayMomentum: awayMarket.oneDayPriceChange,\n\n    totalVolume: `$${(event.volume / 1e6).toFixed(1)}M`,\n    volume24hr: `$${(event.volume24hr / 1e6).toFixed(1)}M`,\n\n    context: event.eventMetadata.context_description,\n    competition: event.series[0].title,\n\n    starPlayerPrompt: `Given this soccer match: ${event.title} (${event.eventMetadata.context_description}). Who is the single most marketable/famous star player associated with this game that fans would recognize? Reply with ONLY the player's full name followed by their national team, nothing else. Example format: \"Lionel Messi Argentina\" or \"Kylian Mbappe France\".`,\n  }\n}];"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -320,
        352
      ],
      "id": "5948f353-19e0-492c-a308-211c5122ff16",
      "name": "Code in JavaScript1"
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "gpt-4.1-mini",
          "mode": "list",
          "cachedResultName": "GPT-4.1-MINI"
        },
        "responses": {
          "values": [
            {
              "role": "system",
              "content": "={{ $json.starPlayerPrompt }}"
            }
          ]
        },
        "builtInTools": {},
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 2.1,
      "position": [
        -112,
        352
      ],
      "id": "dbb077dd-3560-4cd6-b5fa-63594bf22f8c",
      "name": "Message a model",
      "credentials": {
        "openAiApi": {
          "id": "MlASNqHBvcc6l2vk",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const original = $('Code in JavaScript1').first().json;\nconst item = $input.first().json;\nconst starPlayer = item.output[0].content[0].text.trim();\n\nconst outcomes = [\n  { label: original.homeTeam, multiplier: original.homeMultiplier, pct: original.homeWinPct },\n  { label: original.awayTeam, multiplier: original.awayMultiplier, pct: original.awayWinPct },\n  { label: 'Draw', multiplier: original.drawMultiplier, pct: original.drawPct },\n];\n\n// Always feature the FAVORITE (highest win %)\nconst featured = outcomes.reduce((a, b) => a.pct > b.pct ? a : b);\n\nconst favoriteBets = [50, 50, 60, 60, 70, 70, 75, 75, 100, 150, 200, 300, 500];\nconst betAmount = favoriteBets[Math.floor(Math.random() * favoriteBets.length)];\nconst payout = parseFloat((betAmount * featured.multiplier).toFixed(2));\n\ndelete original.starPlayerPrompt;\n\nreturn [{\n  json: {\n    ...original,\n    starPlayer,\n    betAmount,\n    featuredOutcome: featured.label,\n    featuredMultiplier: featured.multiplier,\n    isFavorite: true,\n    featuredPayout: payout,\n    betHook: `$${betAmount} → $${payout}`,\n\n    gifQueries: [\n      starPlayer,\n      `${original.homeTeam} soccer`,\n      `${original.awayTeam} soccer`,\n      `goal celebration soccer`,\n      `money cash winning`,\n    ]\n  }\n}];"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        192,
        352
      ],
      "id": "9ece97dc-2c1e-4a3c-ba74-4add0c928a6c",
      "name": "Code in JavaScript2"
    },
    {
      "parameters": {
        "jsCode": "const data = $input.first().json;\nconst profit = parseFloat((data.featuredPayout - data.betAmount).toFixed(2));\n\nreturn [{\n  json: {\n    ...data,\n    profit,\n  }\n}];"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -384,
        704
      ],
      "id": "689775ee-e2b8-4b7d-9441-0917fe490cbe",
      "name": "Code in JavaScript4"
    },
    {
      "parameters": {
        "jsCode": "const data = $('Code in JavaScript2').first().json;\n\nfunction pickGif(httpResponse) {\n  const gifs = httpResponse.data;\n  const gif = gifs[Math.floor(Math.random() * gifs.length)];\n  const src = gif.images.original;\n  return src.mp4 || src.url;\n}\n\nreturn [{\n  json: {\n    ...data,\n    gifHook:   pickGif($('HTTP Request1').first().json),\n    gifMatch:  pickGif($('HTTP Request3').first().json),\n    gifBet:    pickGif($('HTTP Request4').first().json),\n    gifPayout: pickGif($('HTTP Request5').first().json),\n    gifCta:    pickGif($('HTTP Request6').first().json),\n  }\n}];"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1104,
        352
      ],
      "id": "ca31ae71-a9f1-4b58-bd39-19a1b09b9424",
      "name": "Code in JavaScript3"
    },
    {
      "parameters": {
        "url": "https://api.giphy.com/v1/gifs/search",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "api_key",
              "value": "3wrmrdutGUrmE3GgsI7mIcTYBg8iLMSO"
            },
            {
              "name": "q",
              "value": "={{ $('Code in JavaScript2').first().json.gifQueries[0] }}"
            },
            {
              "name": "limit",
              "value": "30"
            },
            {
              "name": "rating",
              "value": "pg-13"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        384,
        352
      ],
      "id": "c855ed89-10be-42a9-9ef2-ba09e906ec4d",
      "name": "HTTP Request1"
    },
    {
      "parameters": {
        "url": "https://api.giphy.com/v1/gifs/search",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "api_key",
              "value": "3wrmrdutGUrmE3GgsI7mIcTYBg8iLMSO"
            },
            {
              "name": "q",
              "value": "={{ $('Code in JavaScript2').first().json.gifQueries[1] }}"
            },
            {
              "name": "limit",
              "value": "30"
            },
            {
              "name": "rating",
              "value": "pg-13"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        560,
        352
      ],
      "id": "ddb61219-fee5-4701-8d54-8bed4b56be79",
      "name": "HTTP Request3"
    },
    {
      "parameters": {
        "url": "https://api.giphy.com/v1/gifs/search",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "api_key",
              "value": "3wrmrdutGUrmE3GgsI7mIcTYBg8iLMSO"
            },
            {
              "name": "q",
              "value": "={{ $('Code in JavaScript2').first().json.gifQueries[2] }}"
            },
            {
              "name": "limit",
              "value": "30"
            },
            {
              "name": "rating",
              "value": "pg-13"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        688,
        352
      ],
      "id": "3f3daee8-793c-4dff-b3c0-82f55592f74b",
      "name": "HTTP Request4"
    },
    {
      "parameters": {
        "url": "https://api.giphy.com/v1/gifs/search",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "api_key",
              "value": "3wrmrdutGUrmE3GgsI7mIcTYBg8iLMSO"
            },
            {
              "name": "q",
              "value": "={{ $('Code in JavaScript2').first().json.gifQueries[3] }}"
            },
            {
              "name": "limit",
              "value": "30"
            },
            {
              "name": "rating",
              "value": "pg-13"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        816,
        352
      ],
      "id": "ea829b8d-62a0-40a7-acb1-94b6aad1e552",
      "name": "HTTP Request5"
    },
    {
      "parameters": {
        "url": "https://api.giphy.com/v1/gifs/search",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "api_key",
              "value": "3wrmrdutGUrmE3GgsI7mIcTYBg8iLMSO"
            },
            {
              "name": "q",
              "value": "={{ $('Code in JavaScript2').first().json.gifQueries[4] }}"
            },
            {
              "name": "limit",
              "value": "30"
            },
            {
              "name": "rating",
              "value": "pg-13"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        960,
        352
      ],
      "id": "e15ce7c2-b2ad-426b-8ec9-3a523202d990",
      "name": "HTTP Request6"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "http://127.0.0.1:3001/render",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "Body",
              "value": "={{ JSON.stringify($json) }}"
            }
          ]
        },
        "options": {
          "response": {
            "response": {
              "responseFormat": "file"
            }
          }
        }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        -176,
        704
      ],
      "id": "2dced16a-a38c-46d1-97ae-b7a560a432bf",
      "name": "remotion"
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [
        [
          {
            "node": "Send message and wait for response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request": {
      "main": [
        [
          {
            "node": "Code in JavaScript1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code in JavaScript": {
      "main": [
        [
          {
            "node": "HTTP Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send message and wait for response": {
      "main": [
        [
          {
            "node": "Code in JavaScript",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code in JavaScript1": {
      "main": [
        [
          {
            "node": "Message a model",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Message a model": {
      "main": [
        [
          {
            "node": "Code in JavaScript2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code in JavaScript2": {
      "main": [
        [
          {
            "node": "HTTP Request1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code in JavaScript4": {
      "main": [
        [
          {
            "node": "remotion",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code in JavaScript3": {
      "main": [
        [
          {
            "node": "Code in JavaScript4",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request1": {
      "main": [
        [
          {
            "node": "HTTP Request3",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request3": {
      "main": [
        [
          {
            "node": "HTTP Request4",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request4": {
      "main": [
        [
          {
            "node": "HTTP Request5",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request5": {
      "main": [
        [
          {
            "node": "HTTP Request6",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request6": {
      "main": [
        [
          {
            "node": "Code in JavaScript3",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "029565f24d9a5736639e540318c8201334aa04eef82b1540511d9fa099b3e526"
  }
}