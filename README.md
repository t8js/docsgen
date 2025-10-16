# @t8/docsgen

*Generates docs from READMEs*

```sh
# with specified docs entries (e.g. in docsgen.config.json)
npx @t8/docsgen [...<entry id or dir>]

# without entries
npx @t8/docsgen <dir path> <repo URL>
```

<details>
<summary>Example of <i>docsgen.config.json</i></summary>

```
{
  "$schema": "https://unpkg.com/@t8/docsgen/schema.json",
  "baseColor": "purple",
  "favicon": "/assets/favicon.png",
  "append": {
    "body": "<script src=\"/assets/stats.js\"></script>"
  },
  "linkMap": {
    "https://github.com/org/package1": "/package1"
    "https://github.com/org/package2": "/package2"
  },
  "entries": [
    {
      "dir": "package1",
      "htmlTitle": "<a href=\"/\">Org</a> / Package 1",
      "repo": "https://github.com/org/package1",
      "nav": "/assets/nav_links.html"
    },
    {
      "dir": "package2",
      "htmlTitle": "<a href=\"/\">Org</a> / Package 2",
      "repo": "https://github.com/org/package2",
      "nav": "/assets/nav_links.html",
      "singlePage": true
    }
  ]
}
```

</details>
